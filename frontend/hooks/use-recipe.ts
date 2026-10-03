import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createRecipe } from "@/services/recipe-api";
import Toast from "react-native-toast-message";
import { apiClient } from "@/utils/api";

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await apiClient.get("/recipes/");
      return response.data;
    },
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
