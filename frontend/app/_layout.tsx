import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "@/hooks/use-color-scheme";

import {
  useFonts,
  RobotoMono_400Regular,
  RobotoMono_500Medium,
  RobotoMono_600SemiBold,
  RobotoMono_700Bold,
} from "@expo-google-fonts/roboto-mono";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    RobotoMono: RobotoMono_400Regular,
    "RobotoMono-Medium": RobotoMono_500Medium,
    "RobotoMono-SemiBold": RobotoMono_600SemiBold,
    "RobotoMono-Bold": RobotoMono_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            <Stack.Screen
              name="add-recipe"
              options={{
                headerShown: false,
                title: "New Recipe",
                presentation: "modal", // Slides up from bottom!
              }}
            />
            <Stack.Screen
              name="view-recipe"
              options={{
                headerShown: false,
                title: "View Recipe",
                presentation: "modal", // Slides up from bottom!
              }}
            />
            <StatusBar style="auto" />
          </Stack>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
