import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "@/services/recipe-api";
import Toast from "react-native-toast-message";
import { useSnackbar } from "@/contexts/SnackbarContext";

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

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRecipe,
    onSuccess: (_, variables) => {
      Toast.show({ type: "success", text1: "Recipe Updated!" });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", variables.id] });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Error updating recipe",
        text2: error.message,
      });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: (_, variables) => {
      Toast.show({ type: "success", text1: "Recipe Deleted!" });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Error deleting recipe",
        text2: error.message,
      });
    },
  });
}
