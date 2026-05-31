import bcrypt from "bcrypt";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
  type ValidationIssue,
} from "../../common/errors/app-error";
import {
  countSkillsByCategory,
  hasCategory,
  hasNrcState,
  hasNrcTownshipInState,
} from "../../common/repositories/reference";
import { validateAndNormalizeServiceAreas } from "../../common/utils/service-areas";
import { createOpaqueToken, hashToken } from "../../common/utils/crypto";
import { normalizeStringList } from "../../common/utils/lists";
import {
  assertProviderVerificationFilesAreSupported,
  assertProviderVerificationFilesExist,
  extractProviderVerificationFiles,
  uploadProviderVerificationImages,
} from "../../common/utils/provider-verification";
import { assertSkillSelection } from "../../common/utils/skills";
import { deleteImageByPublicId } from "../../common/utils/cloudinary";
import { env } from "../../config/env";
import { reverseGeocodeCoordinates } from "../locations/service";
import {
  createCustomer,
  createRefreshToken,
  deleteRefreshTokenByHash,
  findUserByEmail,
  findProviderProfileAuthByUserId,
  findRefreshTokenByHash,
  findUserAuthById,
  findUsersByEmailOrPhone,
  rotateRefreshToken,
  registerProviderWithFirstService,
} from "./repository";
import type {
  AuthResponse,
  AuthTokens,
  SafeUser,
} from "./types";
import type {
  AdminLoginInput,
  LoginInput,
  RegisterCustomerInput,
  RegisterProviderInput,
} from "./validation";

const PASSWORD_SALT_ROUNDS = 12;

type UserRecord = Awaited<ReturnType<typeof findUserByEmail>>;
type CreatedCustomerRecord = Awaited<ReturnType<typeof createCustomer>>;
type CreatedProviderRecord = Awaited<ReturnType<typeof registerProviderWithFirstService>>;

type RefreshTokenPayload = {
  sub: string;
  role: string;
  jti: string;
  type: "refresh";
};

export const registerCustomer = async (
  input: RegisterCustomerInput,
): Promise<AuthResponse> => {
  await assertUniqueEmailAndPhone(input.email, input.phone);

  const resolvedLocation = await reverseGeocodeCoordinates(
    input.location.latitude,
    input.location.longitude,
  );

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  let user: CreatedCustomerRecord;

  try {
    user = await createCustomer(input, passwordHash, {
      city: resolvedLocation.city,
      township: resolvedLocation.township,
      address: input.location.address ?? resolvedLocation.address,
    });
  } catch (error) {
    throw mapUniqueConstraintToValidationError(error);
  }

  const tokens = await issueTokens(user.id, user.role);

  return {
    user: toSafeUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const registerProvider = async (
  input: RegisterProviderInput,
  files: unknown,
): Promise<AuthResponse> => {
  await assertUniqueEmailAndPhone(input.email, input.phone);

  const uploadedFiles = assertProviderVerificationFilesExist(
    extractProviderVerificationFiles(files),
  );

  await assertProviderVerificationFilesAreSupported(uploadedFiles);

  const categoryExists = await hasCategory(input.categoryId);
  if (!categoryExists) {
    throw new BadRequestError("Selected category does not exist");
  }

  const normalizedNrcStateCode = normalizeNrcCode(input.nrcStateCode);
  const normalizedNrcTownshipCode = normalizeNrcCode(input.nrcTownshipCode);

  const stateExists = await hasNrcState(normalizedNrcStateCode);
  if (!stateExists) {
    throw new ValidationError([
      {
        field: "nrcStateCode",
        message: "Invalid NRC state code",
      },
    ]);
  }

  const townshipMatchesState = await hasNrcTownshipInState(
    normalizedNrcTownshipCode,
    normalizedNrcStateCode,
  );

  if (!townshipMatchesState) {
    throw new ValidationError([
      {
        field: "nrcTownshipCode",
        message: "NRC township code is invalid for the selected NRC state code",
      },
    ]);
  }

  const normalizedPredefinedSkillIds = normalizeStringList(input.predefinedSkillIds);
  const normalizedCustomSkills = normalizeStringList(input.customSkills);
  const normalizedServiceAreas = normalizeStringList(input.serviceAreas);

  assertSkillSelection(normalizedPredefinedSkillIds, normalizedCustomSkills);

  const matchedSkillCount = await countSkillsByCategory(
    normalizedPredefinedSkillIds,
    input.categoryId,
  );

  if (matchedSkillCount !== normalizedPredefinedSkillIds.length) {
    throw new BadRequestError(
      "Some predefined skills are invalid for the selected category",
    );
  }

  const resolvedLocation = await reverseGeocodeCoordinates(
    input.location.latitude,
    input.location.longitude,
  );

  const normalizedProviderServiceAreas = validateAndNormalizeServiceAreas(
    normalizedServiceAreas,
    resolvedLocation.city,
  );

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);

  const uploadedImages = await uploadProviderVerificationImages(uploadedFiles);

  let provider: CreatedProviderRecord;

  try {
    provider = await registerProviderWithFirstService(
      {
        ...input,
        nrcStateCode: normalizedNrcStateCode,
        nrcTownshipCode: normalizedNrcTownshipCode,
        predefinedSkillIds: normalizedPredefinedSkillIds,
        customSkills: normalizedCustomSkills,
        serviceAreas: normalizedProviderServiceAreas,
      },
      passwordHash,
      {
        city: resolvedLocation.city,
        township: resolvedLocation.township,
        address: input.location.address ?? resolvedLocation.address,
      },
      {
        nrcFront: uploadedImages.nrcFront,
        nrcBack: uploadedImages.nrcBack,
        selfie: uploadedImages.selfie,
      },
    );
  } catch (error) {
    await Promise.allSettled([
      deleteImageByPublicId(uploadedImages.nrcFront.publicId),
      deleteImageByPublicId(uploadedImages.nrcBack.publicId),
      deleteImageByPublicId(uploadedImages.selfie.publicId),
    ]);

    throw mapUniqueConstraintToValidationError(error);
  }

  const tokens = await issueTokens(provider.id, provider.role);
  const safeProvider = await withProviderAuthState(toSafeUser(provider));

  return {
    user: safeProvider,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new UnauthorizedError("Invalid login credentials");
  }

  if (user.role === "ADMIN") {
    throw new UnauthorizedError("Use admin login endpoint");
  }

  if (user.role === "PROVIDER") {
    const providerProfile = await findProviderProfileAuthByUserId(user.id);

    if (!providerProfile) {
      throw new UnauthorizedError("Provider profile not found");
    }

    if (providerProfile.status === "PENDING") {
      throw new UnauthorizedError("Provider account is waiting for admin approval");
    }
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid login credentials");
  }

  const tokens = await issueTokens(user.id, user.role);
  const safeUser = await withProviderAuthState(toSafeUser(user));

  return {
    user: safeUser,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const loginAdmin = async (input: AdminLoginInput): Promise<AuthResponse> => {
  const user = await findUserByEmail(input.email);

  if (!user || user.role !== "ADMIN") {
    throw new UnauthorizedError("Invalid admin login credentials");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid admin login credentials");
  }

  const tokens = await issueTokens(user.id, user.role);

  return {
    user: toSafeUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const refreshAuthSession = async (
  refreshToken: string | undefined,
): Promise<AuthTokens> => {
  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token is required");
  }

  const payload = verifyRefreshToken(refreshToken);
  const currentTokenHash = hashToken(refreshToken);
  const storedToken = await findRefreshTokenByHash(currentTokenHash);

  if (!storedToken || storedToken.userId !== payload.sub) {
    throw new UnauthorizedError("Refresh token is invalid");
  }

  if (storedToken.expiresAt.getTime() <= Date.now()) {
    await deleteRefreshTokenByHash(currentTokenHash);
    throw new UnauthorizedError("Refresh token has expired");
  }

  const user = await findUserAuthById(payload.sub);

  if (!user) {
    await deleteRefreshTokenByHash(currentTokenHash);
    throw new UnauthorizedError("User not found");
  }

  const newRefreshId = createOpaqueToken();
  const newRefreshToken = jwt.sign(
    { sub: user.id, role: user.role, jti: newRefreshId, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: `${env.REFRESH_TOKEN_EXPIRES_IN_DAYS}d` as SignOptions["expiresIn"],
    },
  );

  const newAccessToken = jwt.sign(
    { sub: user.id, role: user.role, type: "access" },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    },
  );

  const newRefreshTokenHash = hashToken(newRefreshToken);
  const newExpiresAt = new Date(
    Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  );

  await rotateRefreshToken(currentTokenHash, user.id, newRefreshTokenHash, newExpiresAt);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (refreshToken: string | undefined): Promise<void> => {
  if (!refreshToken) {
    return;
  }

  const refreshTokenHash = hashToken(refreshToken);
  await deleteRefreshTokenByHash(refreshTokenHash);
};

const issueTokens = async (userId: string, role: string): Promise<AuthTokens> => {
  const refreshId = createOpaqueToken();
  const refreshToken = jwt.sign(
    { sub: userId, role, jti: refreshId, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: `${env.REFRESH_TOKEN_EXPIRES_IN_DAYS}d` as SignOptions["expiresIn"],
    },
  );

  const accessToken = jwt.sign(
    { sub: userId, role, type: "access" },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    },
  );

  const expiresAt = new Date(
    Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  );

  await createRefreshToken(userId, hashToken(refreshToken), expiresAt);

  return { accessToken, refreshToken };
};

const withProviderAuthState = async (user: SafeUser): Promise<SafeUser> => {
  if (user.role !== "PROVIDER") {
    return user;
  }

  const providerProfile = await findProviderProfileAuthByUserId(user.id);

  if (!providerProfile) {
    return user;
  }

  return {
    ...user,
    providerStatus: providerProfile.status,
    rejectionReason: providerProfile.rejectionReason,
  };
};

const verifyRefreshToken = (refreshToken: string): RefreshTokenPayload => {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;

    if (payload.type !== "refresh" || typeof payload.sub !== "string") {
      throw new UnauthorizedError("Refresh token is invalid");
    }

    return {
      sub: payload.sub,
      role: typeof payload.role === "string" ? payload.role : "",
      jti: typeof payload.jti === "string" ? payload.jti : "",
      type: "refresh",
    };
  } catch {
    throw new UnauthorizedError("Refresh token is invalid");
  }
};

const toSafeUser = (
  user: NonNullable<UserRecord> | CreatedCustomerRecord | CreatedProviderRecord,
): SafeUser => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
    location: {
      city: user.city,
      township: user.township,
      address: user.address,
      latitude: user.latitude.toString(),
      longitude: user.longitude.toString(),
    },
    createdAt: user.createdAt,
  };
};

const assertUniqueEmailAndPhone = async (
  email: string,
  phone: string,
): Promise<void> => {
  const existingUsers = await findUsersByEmailOrPhone(email, phone);

  if (existingUsers.length === 0) {
    return;
  }

  const normalizedEmail = email.toLowerCase();
  const hasEmailConflict = existingUsers.some(
    (user) => user.email.toLowerCase() === normalizedEmail,
  );
  const hasPhoneConflict = existingUsers.some((user) => user.phone === phone);

  const errors: ValidationIssue[] = [];

  if (hasEmailConflict) {
    errors.push({
      field: "email",
      message: "Email is already registered",
    });
  }

  if (hasPhoneConflict) {
    errors.push({
      field: "phone",
      message: "Phone is already registered",
    });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
};

const mapUniqueConstraintToValidationError = (error: unknown): Error => {
  const uniqueFields = extractUniqueConstraintFields(error);

  if (uniqueFields.length === 0) {
    return error instanceof Error
      ? error
      : new BadRequestError("Failed to process the request");
  }

  const validationIssues: ValidationIssue[] = [];

  if (uniqueFields.some((field) => field.includes("email"))) {
    validationIssues.push({
      field: "email",
      message: "Email is already registered",
    });
  }

  if (uniqueFields.some((field) => field.includes("phone"))) {
    validationIssues.push({
      field: "phone",
      message: "Phone is already registered",
    });
  }

  if (validationIssues.length > 0) {
    return new ValidationError(validationIssues);
  }

  return new BadRequestError("A unique value conflict occurred");
};

const extractUniqueConstraintFields = (error: unknown): string[] => {
  if (!error || typeof error !== "object") {
    return [];
  }

  const payload = error as {
    code?: unknown;
    meta?: {
      target?: unknown;
    };
  };

  if (payload.code !== "P2002") {
    return [];
  }

  const target = payload.meta?.target;

  if (Array.isArray(target)) {
    return target
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.toLowerCase());
  }

  if (typeof target === "string") {
    return [target.toLowerCase()];
  }

  return [];
};

const normalizeNrcCode = (value: string): string => {
  return value.trim().toUpperCase();
};
