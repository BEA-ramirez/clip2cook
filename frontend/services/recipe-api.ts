import { apiClient } from "@/utils/api";
import { RecipeFormValues } from "@/schemas/recipe-schema";

export const createRecipe = async (recipeData: RecipeFormValues) => {
  const response = await apiClient.post("/recipes/", recipeData);
  return response.data;
};

export const getRecipes = async () => {
  const response = await apiClient.get("/recipes/");
  return response.data;
};

export const getRecipeById = async (id: string) => {
  const response = await apiClient.get(`/recipes/${id}/`);
  return response.data;
};
