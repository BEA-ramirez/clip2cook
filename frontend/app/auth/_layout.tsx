import { Stack } from "expo-router";

export default function LoadingStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          presentation: "modal",
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
