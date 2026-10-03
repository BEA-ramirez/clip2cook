import { apiClient } from "@/utils/api";

// --- Nested Response Types ---
export interface Ingredient {
  id: string;
  recipe_id: string;
  name: string;
  qty?: string | null;
  unit?: string | null;
  weight_grams?: number | null;
}

export interface Instruction {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
}

export interface Equipment {
  id: string;
  recipe_id: string;
  name: string;
}

export interface Tag {
  id: string;
  recipe_id: string;
  tag_name: string;
}

// --- Recipe Payload for POST /recipes ---
export interface RecipeCreatePayload {
  title: string;
  description?: string | null;
  recipe_by?: string | null;
  source_url?: string | null;
  prep_time?: string | null;
  bake_time?: string | null;
  temp?: string | null;
  yield_amount?: string | null;
  image_url?: string | null;
  is_ai_generated?: boolean;
  is_saved?: boolean;
  ingredients?: Array<{
    name: string;
    qty?: string | null;
    unit?: string | null;
    weight_grams?: number | null;
  }>;
  instructions?: Array<{
    step_number: number;
    instruction: string;
  }>;
  equipment?: Array<{
    name: string;
  }>;
  tags?: string[];
}

// --- Summary View (from GET /) ---
export interface RecipeSummary {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  recipe_by?: string | null;
  source_url?: string | null;
  prep_time?: string | null;
  bake_time?: string | null;
  temp?: string | null;
  yield_amount?: string | null;
  image_url?: string | null;
  is_ai_generated: boolean;
  is_saved: boolean;
  created_at: string;
  updated_at: string;
}

// --- Detail View (from GET /{recipe_id}) ---
export interface RecipeDetail extends RecipeSummary {
  ingredients: Ingredient[];
  instructions: Instruction[];
  equipment: Equipment[];
  tags: Tag[];
}

// --- API Service ---
export const recipeApi = {
  getAll: async (): Promise<RecipeSummary[]> => {
    const { data } = await apiClient.get("/recipes/");
    return data;
  },

  getById: async (recipeId: string): Promise<RecipeDetail> => {
    const { data } = await apiClient.get(`/recipes/${recipeId}`);
    return data;
  },

  create: async (
    recipePayload: RecipeCreatePayload,
  ): Promise<{ status: string; recipe_id: string }> => {
    const { data } = await apiClient.post("/recipes/", recipePayload);
    return data;
  },

  delete: async (
    recipeId: string,
  ): Promise<{ status: string; message: string }> => {
    const { data } = await apiClient.delete(`/recipes/${recipeId}`);
    return data;
  },
  extractFromUrl: async (url: string): Promise<any> => {
    const { data } = await apiClient.post("/parse/extract", { url });
    return data;
  },
};
