import { z } from "zod";

export const listCategorySkillsSchema = z.object({
  params: z
    .object({
      categoryId: z
        .string({ error: "Category ID is required" })
        .uuid("Invalid category ID"),
    })
    .strict(),
});
