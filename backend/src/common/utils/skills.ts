import { ValidationError } from "../errors/app-error";

export const assertSkillSelection = (
  predefinedSkillIds: string[],
  customSkills: string[],
): void => {
  if (predefinedSkillIds.length + customSkills.length > 0) {
    return;
  }

  throw new ValidationError([
    {
      field: "skills",
      message: "At least one predefined or custom skill is required",
    },
  ]);
};
