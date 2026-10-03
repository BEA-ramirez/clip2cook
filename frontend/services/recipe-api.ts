import { apiClient } from "@/utils/api";
import { RecipeFormValues } from "@/schemas/recipe-schema";

export const createRecipe = async (recipeData: RecipeFormValues) => {
  const response = await apiClient.post("/recipes/", recipeData);
  return response.data;
};
