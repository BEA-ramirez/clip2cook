import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Text } from "./custom-text";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// conversts empty string to undefined and everything else to a number
const optionalNumber = z.preprocess(
  (val) => (val === "" || val == null ? undefined : Number(val)),
  z.number().optional(),
);

const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  grams_amount: optionalNumber,
});

const recipeSchema = z.object({
  title: z.string().min(3, "Must be at least 3 characters"),
  recipe_by: z.string().min(3, "Must be at least 3 characters"),
  description: z.string().optional(),
  prep_time_minutes: optionalNumber,
  bake_time_minutes: optionalNumber,
  servings: optionalNumber,
  yield_description: z.string().optional(),
  temp_or_heat: z.string().optional(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

export default function RecipeForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema) as any,
    defaultValues: {
      title: "",
      recipe_by: "",
      description: "",
      prep_time_minutes: undefined,
      bake_time_minutes: undefined,
      servings: undefined,
      yield_description: "",
      temp_or_heat: "",
    },
  });
  // equipment: z.array(z.string()).optional(),
  // ingredients: z.array(ingredientSchema),
  // instructions: z.array(z.string()).optional(),
  // notes: z.array(z.string()).optional(),
  // image_url: z.array(z.string()).optional(),
  // source_url: z.array(z.string()).optional(),

  // equipment: [],
  // ingredients: [],
  // instructions: [],
  // notes: [],
  // image_url: [],

  const onSubmit = (data: RecipeFormData) => {
    console.log("Valid recipe data ready for api", data);
  };

  return (
    <View>
      {/* Title Field */}
      <Text>Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="e.g., Classic Tiramisu"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.title && (
        <Text style={styles.errorText}>{errors.title.message}</Text>
      )}

      {/* Recipe By Field */}
      <Text>Recipe By</Text>
      <Controller
        control={control}
        name="recipe_by"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.recipe_by && styles.inputError]}
            placeholder="e.g., Chef K"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.recipe_by && (
        <Text style={styles.errorText}>{errors.recipe_by.message}</Text>
      )}

      {/* Description Field */}
      <Text>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.description && styles.inputError]}
            placeholder="About the recipe"
            multiline={true}
            numberOfLines={4}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.description && (
        <Text style={styles.errorText}>{errors.description.message}</Text>
      )}

      {/* Prep Time Minutes Field */}
      <Text>Prep Time Minutes</Text>
      <Controller
        control={control}
        name="prep_time_minutes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              errors.prep_time_minutes && styles.inputError,
            ]}
            placeholder="e.g. 60"
            keyboardType="numeric"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ? String(value) : ""}
          />
        )}
      />
      {errors.prep_time_minutes && (
        <Text style={styles.errorText}>{errors.prep_time_minutes.message}</Text>
      )}

      {/* Servings Field */}
      <Text>Servings</Text>
      <Controller
        control={control}
        name="servings"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.servings && styles.inputError]}
            placeholder="e.g. 12"
            keyboardType="numeric"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ? String(value) : ""}
          />
        )}
      />
      {errors.servings && (
        <Text style={styles.errorText}>{errors.servings.message}</Text>
      )}

      {/* Bake Time Minutes Field */}
      <Text>Bake Time Minutes</Text>
      <Controller
        control={control}
        name="bake_time_minutes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              errors.bake_time_minutes && styles.inputError,
            ]}
            placeholder="e.g. 10"
            keyboardType="numeric"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ? String(value) : ""}
          />
        )}
      />
      {errors.bake_time_minutes && (
        <Text style={styles.errorText}>{errors.bake_time_minutes.message}</Text>
      )}

      {/* Temperature or Heat Field */}
      <Text>Temperature or Heat</Text>
      <Controller
        control={control}
        name="temp_or_heat"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.temp_or_heat && styles.inputError]}
            placeholder="e.g. 350 F"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.temp_or_heat && (
        <Text style={styles.errorText}>{errors.temp_or_heat.message}</Text>
      )}

      {/* Yield Description Field */}
      <Text>Yield Description</Text>
      <Controller
        control={control}
        name="yield_description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              errors.yield_description && styles.inputError,
            ]}
            placeholder="e.g. 1 large batch of cookies"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.yield_description && (
        <Text style={styles.errorText}>{errors.yield_description.message}</Text>
      )}

      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Save Recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0f172a",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  inputError: { borderColor: "#ef4444" },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },
});
