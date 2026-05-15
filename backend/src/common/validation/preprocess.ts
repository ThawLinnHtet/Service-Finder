export const parseStringArrayInput = (input: unknown): string[] => {
  if (Array.isArray(input)) {
    return input.filter((value): value is string => typeof value === "string");
  }

  if (typeof input !== "string") {
    return [];
  }

  const value = input.trim();

  if (!value) {
    return [];
  }

  if (value.startsWith("[")) {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item): item is string => typeof item === "string");
    } catch {
      return [];
    }
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const parseJsonObjectInput = (input: unknown): unknown => {
  if (typeof input !== "string") {
    return input;
  }

  const value = input.trim();

  if (!value) {
    return input;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return input;
  }
};

export const parseRequiredNumberInput = (input: unknown): unknown => {
  if (typeof input !== "string") {
    return input;
  }

  const value = input.trim();

  if (!value) {
    return undefined;
  }

  return value;
};
