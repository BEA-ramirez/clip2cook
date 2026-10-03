import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { recipeApi, RecipeSummary, RecipeDetail } from "@/services/recipe-api";
import { useRouter } from "expo-router";

export const recipeKeys = {
  all: ["recipes"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};

// fetch all recipes
export function useRecipes() {
  return useQuery<RecipeSummary[], Error>({
    queryKey: recipeKeys.lists(),
    queryFn: recipeApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// fetch single recipe
export function useRecipeDetail(recipeId: string) {
  return useQuery<RecipeDetail, Error>({
    queryKey: recipeKeys.detail(recipeId),
    queryFn: () => recipeApi.getById(recipeId),
    enabled: Boolean(recipeId), // only run if recipeId is truthy
  });
}

// create recipe mutation
export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recipeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() }); // invalidate the recipe list

      Toast.show({
        type: "success",
        text1: "Recipe Saved",
        text2: "Added to your personal cookbook.",
        position: "bottom",
      });
    },
    onError: (error: any) => {
      // 1. Force the exact error to print in your Expo terminal!
      console.log("🚨 BACKEND REJECTED SAVE 🚨");
      console.log("Status:", error?.response?.status);
      console.log("Data:", JSON.stringify(error?.response?.data, null, 2));

      // 2. Grab the correct 'detail' property from FastAPI
      const backendError = error?.response?.data?.detail;

      // FastAPI sometimes sends 'detail' as an array of validation errors,
      // so we convert it to a string if necessary.
      const errorMessage =
        typeof backendError === "string"
          ? backendError
          : JSON.stringify(backendError) || "Could not save recipe.";
      const message =
        error?.response?.data?.message || "Could not save recipe.";
      console.log(errorMessage);
      Toast.show({
        type: "error",
        text1: "Save failed.",
        text2: errorMessage,
        position: "bottom",
      });
    },
  });
}

// delete recipe mutation
export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recipeApi.delete,
    onSuccess: (_, recipeId: string) => {
      // Remove detail from cache and refresh list
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.removeQueries({ queryKey: recipeKeys.detail(recipeId) });

      Toast.show({
        type: "success",
        text1: "Recipe Deleted",
        text2: "The recipe has been removed from your cookbook.",
        position: "bottom",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail || "Failed to delete recipe.";
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: message,
        position: "bottom",
      });
    },
  });
}

export function useExtractRecipe() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (url: string) => {
      const data = await recipeApi.extractFromUrl(url);
      return data;
    },
    onSuccess: (data) => {
      console.log("\n=== EXTRACTION SUCCESS ===");
      console.log(JSON.stringify(data, null, 2));
      console.log("======================================\n");

      Toast.show({
        type: "success",
        text1: "Magic Complete!",
        text2: "Review your extracted recipe below.",
        position: "bottom",
      });

      setTimeout(() => {
        router.push({
          pathname: "/",
          params: { recipeData: JSON.stringify(data) },
        });
      }, 500);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        "Make sure the link is valid and public.";
      Toast.show({
        type: "error",
        text1: "Extraction Failed",
        text2: message,
        position: "bottom",
      });
    },
  });
}
