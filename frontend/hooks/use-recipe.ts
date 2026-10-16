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
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: createRecipe,
    onSuccess: (data) => {
      showSnackbar("Recipe Saved!");
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error: any) => {
      showSnackbar("Error saving recipe");
      console.error("Failed to save recipe:", error);
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: updateRecipe,
    onSuccess: (_, variables) => {
      showSnackbar("Recipe Updated!");
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", variables.id] });
    },
    onError: (error: any) => {
      showSnackbar("Error updating recipe");
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: (_, variables) => {
      showSnackbar("Recipe Deleted!");
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error: any) => {
      showSnackbar("Error deleting recipe");
    },
  });
}
