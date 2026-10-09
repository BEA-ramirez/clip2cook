import { apiClient } from "@/utils/api";
import { RecipeFormValues } from "@/schemas/recipe-schema";

export const extractRecipeFromUrl = async (
  url: string,
): Promise<RecipeFormValues> => {
  const response = await apiClient.post("/parse/extract", { url });
  return response.data;
};
