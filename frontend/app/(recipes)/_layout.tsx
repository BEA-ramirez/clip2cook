import { Stack } from "expo-router";

export default function RecipesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="extract" />
      <Stack.Screen name="form" options={{ presentation: "modal" }} />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
