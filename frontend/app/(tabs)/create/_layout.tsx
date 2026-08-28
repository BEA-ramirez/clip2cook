import { Stack } from "expo-router";
import { Colors, Typography } from "@/constants/theme";
import { UtensilsCrossed, CircleUser } from "lucide-react-native";
import { View } from "react-native";

export default function LoadingStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Clip2Cook",
          headerTitleAlign: "center",
          headerShown: true,
          headerTitleStyle: {
            ...Typography.headlineLg,
            color: Colors.primary,
          },
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <View style={{ paddingLeft: 20 }}>
              <UtensilsCrossed size={22} color={Colors.primary} />
            </View>
          ),
          headerRight: () => (
            <View
              style={{
                padding: 20,
              }}
            >
              <CircleUser size={24} color={Colors.primary} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="generate-recipe"
        options={{
          headerTitle: "Clip2Cook",
          headerTitleAlign: "center",
          headerShown: true,
          headerTitleStyle: {
            ...Typography.headlineLg,
            color: Colors.primary,
          },
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <View style={{ paddingLeft: 20 }}>
              <UtensilsCrossed size={22} color={Colors.primary} />
            </View>
          ),
          headerRight: () => (
            <View
              style={{
                padding: 20,
              }}
            >
              <CircleUser size={24} color={Colors.primary} />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
