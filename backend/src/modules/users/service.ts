import bcrypt from "bcrypt";
import {
  AppError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
  type ValidationIssue,
} from "../../common/errors/app-error";
import { reverseGeocodeCoordinates } from "../locations/service";
import {
  findEmailPhoneConflicts,
  findUserPasswordById,
  findUserProfileById,
  updateUserPasswordAndRevokeSessions,
  updateUserProfile,
} from "./repository";
import type { ChangePasswordInput, UpdateCurrentUserProfileInput } from "./validation";

const PASSWORD_SALT_ROUNDS = 12;

type UserProfileRecord = NonNullable<Awaited<ReturnType<typeof findUserProfileById>>>;

const toUserProfileResponse = (user: UserProfileRecord) => {
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
    provider: user.providerProfile
      ? {
          status: user.providerProfile.status,
          rejectionReason: user.providerProfile.rejectionReason,
          about: user.providerProfile.about,
          ratingAverage: user.providerProfile.ratingAverage.toString(),
          ratingCount: user.providerProfile.ratingCount,
          primaryCategory: user.providerProfile.primaryCategory,
        }
      : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const getCurrentUserProfile = async (userId: string) => {
  const user = await findUserProfileById(userId);

  if (!user) {
    throw new AppError("User profile not found", 404);
  }

  return toUserProfileResponse(user);
};

export const updateCurrentUserProfile = async (
  userId: string,
  input: UpdateCurrentUserProfileInput,
) => {
  const currentUser = await findUserProfileById(userId);

  if (!currentUser) {
    throw new AppError("User profile not found", 404);
  }

  if (currentUser.role === "PROVIDER") {
    throw new ForbiddenError("Use provider profile endpoint to update provider profile");
  }

  await assertEmailPhoneAvailable(userId, input.email, input.phone);

  const resolvedLocation = input.location
    ? await reverseGeocodeCoordinates(input.location.latitude, input.location.longitude)
    : null;

  const user = await updateUserProfile(userId, input, resolvedLocation);
  return toUserProfileResponse(user);
};

export const changeCurrentUserPassword = async (
  userId: string,
  input: ChangePasswordInput,
) => {
  const user = await findUserPasswordById(userId);

  if (!user) {
    throw new AppError("User profile not found", 404);
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    input.currentPassword,
    user.passwordHash,
  );

  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError("Current password is incorrect");
  }

  const passwordHash = await bcrypt.hash(input.newPassword, PASSWORD_SALT_ROUNDS);
  await updateUserPasswordAndRevokeSessions(userId, passwordHash);
};

export const assertEmailPhoneAvailable = async (
  userId: string,
  email: string | undefined,
  phone: string | undefined,
) => {
  const conflicts = await findEmailPhoneConflicts(userId, email, phone);

  if (conflicts.length === 0) {
    return;
  }

  const normalizedEmail = email?.toLowerCase();
  const errors: ValidationIssue[] = [];

  if (normalizedEmail && conflicts.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    errors.push({
      field: "email",
      message: "Email is already registered",
    });
  }

  if (phone && conflicts.some((user) => user.phone === phone)) {
    errors.push({
      field: "phone",
      message: "Phone is already registered",
    });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
};
