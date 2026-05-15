import { BadRequestError, ValidationError } from "../errors/app-error";
import {
  getAllowedServiceAreasForCity,
  MAX_SERVICE_AREAS_PER_SERVICE,
  normalizeAreaName,
} from "../constants/service-areas";

const toTitleCase = (value: string): string => {
  return value
    .split(" ")
    .map((part) => {
      if (!part) {
        return part;
      }

      return `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`;
    })
    .join(" ");
};

export const validateAndNormalizeServiceAreas = (
  serviceAreas: string[],
  city: string,
): string[] => {
  const normalizedAreas: string[] = [];
  const seenAreas = new Set<string>();

  for (const area of serviceAreas) {
    const normalizedArea = normalizeAreaName(area);

    if (!normalizedArea || seenAreas.has(normalizedArea)) {
      continue;
    }

    seenAreas.add(normalizedArea);
    normalizedAreas.push(normalizedArea);
  }

  if (normalizedAreas.length === 0) {
    throw new ValidationError([
      {
        field: "serviceAreas",
        message: "At least one service area is required",
      },
    ]);
  }

  if (normalizedAreas.length > MAX_SERVICE_AREAS_PER_SERVICE) {
    throw new ValidationError([
      {
        field: "serviceAreas",
        message: `You can select up to ${MAX_SERVICE_AREAS_PER_SERVICE} service areas`,
      },
    ]);
  }

  const allowedAreas = getAllowedServiceAreasForCity(city);

  if (!allowedAreas) {
    throw new BadRequestError(
      "Service area validation is not configured for the detected city",
      { city },
    );
  }

  const allowedAreaSet = new Set(allowedAreas);
  const invalidAreas = normalizedAreas.filter((area) => !allowedAreaSet.has(area));

  if (invalidAreas.length > 0) {
    throw new ValidationError([
      {
        field: "serviceAreas",
        message: `Some service areas are invalid for ${city}: ${invalidAreas.join(", ")}`,
      },
    ]);
  }

  return normalizedAreas.map((area) => toTitleCase(area));
};
