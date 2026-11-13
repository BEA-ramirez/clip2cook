import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "@/services/recipe-api";
import { mergeAnonymousRecipes } from "@/services/auth-api";
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

export function useMergeAnonymous() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: mergeAnonymousRecipes,
    onSuccess: (data) => {
      const moved = data?.moved_recipes ?? 0;
      showSnackbar(
        moved > 0
          ? `Merged ${moved} recipe${moved === 1 ? "" : "s"} into your account.`
          : "Signed in successfully.",
      );
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error: any) => {
      showSnackbar("Signed in, but merge failed");
    },
  });
}
