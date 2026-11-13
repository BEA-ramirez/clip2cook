import { apiClient } from "@/utils/api";

export const mergeAnonymousRecipes = async (anonymousUserId: string) => {
  const response = await apiClient.post("/auth/merge-anonymous", {
    anonymous_user_id: anonymousUserId,
  });
  return response.data;
};
