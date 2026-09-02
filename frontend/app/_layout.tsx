import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Typography } from "@/constants/theme";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

// 4. Create the custom Paper Theme using your design tokens
const customPaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    surface: Colors.surface,
    onSurface: Colors.on_surface,
    error: Colors.error,
  },
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [session, setSession] = useState<Session | null>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // routing guard
  useEffect(() => {
    if (!isAuthInitialized || !fontsLoaded) return;

    const inAuthGroup = segments[0] === "auth";

    if (!session && !inAuthGroup) {
      // Not logged in -> Kick to auth screen
      router.replace("/auth");
    } else if (session && inAuthGroup) {
      // Logged in -> Send to the main app
      router.replace("/(tabs)");
    }
  }, [session, isAuthInitialized, fontsLoaded, segments, router]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && isAuthInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isAuthInitialized]);

  // Do not render anything until fonts and auth are completely ready
  if ((!fontsLoaded && !fontError) || !isAuthInitialized) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <PaperProvider theme={customPaperTheme}>
            <Stack>
              <Stack.Screen name="auth" options={{ headerShown: false }} />
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
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="view-recipe"
                options={{
                  headerShown: false,
                  title: "View Recipe",
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="recipe/[slug]"
                options={{
                  headerShown: false,
                  presentation: "modal", // Slides up from bottom!
                }}
              />
            </Stack>
            <StatusBar style="auto" />
          </PaperProvider>
        </ThemeProvider>
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
