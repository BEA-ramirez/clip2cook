import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createRecipe, getRecipes, getRecipeById } from "@/services/recipe-api";
import Toast from "react-native-toast-message";

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: getRecipes,
  });
}

export function useRecipeById(id: string) {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipeById(id),
    enabled: !!id, // Only fetch if id is provided
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecipe,
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Recipe Saved!",
        text2: "Successfully added to your notebook.",
      });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Error saving recipe",
        text2: error.message || "Please try again later.",
      });
      console.error("Failed to save recipe:", error);
    },
  });
}
