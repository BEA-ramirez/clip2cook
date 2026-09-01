import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { Colors, Typography } from "@/constants/theme";
import {
  House,
  Sparkles,
  BookOpenText,
  User,
  UtensilsCrossed,
  CircleUser,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary_container,
        tabBarInactiveTintColor: Colors.secondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.surface_variant,
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 11,
          marginTop: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <House size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Extract",
          tabBarIcon: ({ color }) => <Sparkles size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Cookbook",
          tabBarIcon: ({ color }) => <BookOpenText size={20} color={color} />,
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
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={20} color={color} />,
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
      <Tabs.Screen
        name="loading"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="extra"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
