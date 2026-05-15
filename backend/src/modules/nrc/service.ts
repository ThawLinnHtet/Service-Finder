import { AppError } from "../../common/errors/app-error";
import {
  NRC_TYPES,
  NRC_TYPE_LABELS_MM,
  type NrcTypeValue,
} from "../../common/constants/nrc";
import { convertToMyanmar } from "mm-nric";
import {
  findNrcStateByCode,
  findNrcStates,
  findNrcTownshipByStateAndCode,
  findNrcTownshipsByStateCode,
} from "./repository";
import type { TranslateNrcInput } from "./validation";

const normalizeNrcCode = (value: string): string => value.trim().toUpperCase();

export const getNrcTypes = () => {
  return NRC_TYPES.map((value) => ({
    value,
    labelEn: value,
    labelMm: NRC_TYPE_LABELS_MM[value],
  }));
};

export const getNrcStates = async () => {
  const states = await findNrcStates();

  return states.sort((a, b) => Number(a.code) - Number(b.code));
};

export const getNrcTownshipsByStateCode = async (stateCode: string) => {
  const normalizedStateCode = normalizeNrcCode(stateCode);

  const state = await findNrcStateByCode(normalizedStateCode);

  if (!state) {
    throw new AppError("NRC state not found", 404);
  }

  return findNrcTownshipsByStateCode(normalizedStateCode);
};

export const translateNrc = async (input: TranslateNrcInput) => {
  const stateCode = normalizeNrcCode(input.stateCode);
  const townshipCode = normalizeNrcCode(input.townshipCode);
  const nrcType = normalizeNrcCode(input.nrcType) as NrcTypeValue;
  const nrcNumber = input.nrcNumber.trim();

  const state = await findNrcStateByCode(stateCode);

  if (!state) {
    throw new AppError("NRC state not found", 404);
  }

  const township = await findNrcTownshipByStateAndCode(stateCode, townshipCode);

  if (!township) {
    throw new AppError("NRC township not found", 404);
  }

  const english = `${stateCode}/${townshipCode}(${nrcType})${nrcNumber}`;

  try {
    return {
      english,
      myanmar: convertToMyanmar(english),
    };
  } catch {
    throw new AppError("Unable to translate NRC to Myanmar format", 422);
  }
};
