import { extractRecipeFromUrl } from "@/services/extract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { createRecipe } from "@/services/recipe-api";

export function detectPlatform(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be"))
    return "YouTube";
  if (lower.includes("tiktok.com")) return "TikTok";
  if (lower.includes("instagram.com")) return "Instagram";
  if (lower.includes("facebook.com") || lower.includes("fb.watch"))
    return "Facebook";
  return "Web Recipe";
}

export function useExtractRecipe() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ["extractRecipe"],
    mutationFn: extractRecipeFromUrl,
    onSuccess: async (extractedData) => {
      try {
        await createRecipe(extractedData);
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        showSnackbar("Recipe Extracted & Saved");
      } catch (error) {
        showSnackbar("Failed to save extracted recipe.");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        "Please try again later.";
      showSnackbar(message);
    },
  });
}
