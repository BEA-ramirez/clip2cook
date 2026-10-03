import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  unit: z.string().nullish(),
  qty: z.string().nullish(),
  weight_grams: z.string().nullish(),
});

export const instructionSchema = z.object({
  step_number: z.string().nullish(),
  instruction: z.string().min(1, "Instruction is required"),
});

export const recipeFormSchema = z.object({
  title: z.string().min(1, "Recipe title is required"),
  description: z.string().nullish(),
  recipe_by: z.string().nullish(),
  source_url: z.string().nullish(),
  prep_time: z.string().nullish(),
  bake_time: z.string().nullish(),
  temp: z.string().nullish(),
  yield_amount: z.string().nullish(),
  image_url: z.string().nullish(),
  is_ai_generated: z.boolean().nullish(),
  is_saved: z.boolean().nullish(),

  ingredients: z
    .array(ingredientSchema)
    .min(1, "Include at least one ingredient"),
  instructions: z
    .array(instructionSchema)
    .min(1, "Add at least one instruction"),

  equipment: z.array(z.string()).optional(),
  tags: z.array(z.string()).nullish(),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
