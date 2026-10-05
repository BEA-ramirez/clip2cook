import { z } from "zod";

export const IngredientSchema = z.object({
  qty: z.string().optional().or(z.literal("")),
  unit: z.string().optional().or(z.literal("")),
  name: z.string().min(1, "Ingredient name is required"),
});

export const InstructionSchema = z.object({
  step_number: z.number().int().min(1),
  description: z.string().min(1, "Instruction cannot be empty"),
  timer_seconds: z.string().optional().or(z.literal("")),
});

export const EquipmentSchema = z.object({
  name: z.string().min(1, "Equipment name is required"),
});

export const RecipeFormSchema = z.object({
  title: z.string().min(1, "Recipe title is required"),
  description: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  recipe_by: z.string().optional().or(z.literal("")),
  platform: z.string().optional().or(z.literal("")),
  // .url() validates standard links, but we allow an empty string if they skip it
  source_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),

  prep_time: z.string().optional().or(z.literal("")),
  yield_amount: z.string().optional().or(z.literal("")),

  ingredients: z.array(IngredientSchema),
  instructions: z.array(InstructionSchema),
  equipment: z.array(EquipmentSchema),
  tags: z.array(z.string()),
});

export type RecipeFormValues = z.infer<typeof RecipeFormSchema>;
export type IngredientFormValues = z.infer<typeof IngredientSchema>;
export type InstructionFormValues = z.infer<typeof InstructionSchema>;
export type EquipmentFormValues = z.infer<typeof EquipmentSchema>;
