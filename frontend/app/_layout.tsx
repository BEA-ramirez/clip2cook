import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
  useTheme,
} from "expo-router/react-navigation";
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
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SnackbarProvider } from "@/contexts/SnackbarContext";

// Create the bridge between TanStack and the phone's hard drive
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

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

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <SnackbarProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: asyncStoragePersister,
            maxAge: 1000 * 60 * 60 * 24, // Match maxAge to gcTime (24 hours)
          }}
        >
          <SafeAreaProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <PaperProvider theme={customPaperTheme}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#FFF" },
                  }}
                >
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(recipes)"
                    options={{ headerShown: false }}
                  />
                </Stack>
                <StatusBar style="auto" />
              </PaperProvider>
            </ThemeProvider>
            <Toast />
          </SafeAreaProvider>
        </PersistQueryClientProvider>
      </SnackbarProvider>
    </ActionSheetProvider>
  );
}
