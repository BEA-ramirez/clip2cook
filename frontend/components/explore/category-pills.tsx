"use client";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors, Radius, Typography } from "@/constants/theme";
import { useState } from "react";

const categories = [
  "All Recipes",
  "Breakfast",
  "Healthy",
  "Dessert",
  "Lunch",
  "Soup",
];

export default function CategoryPills() {
  const [selectedCategory, setSelectedCategory] = useState("All Recipes");
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category, ind) => (
        <TouchableOpacity
          key={ind}
          style={[
            styles.pillBase,
            selectedCategory === category && styles.pillSelect,
          ]}
        >
          <Text
            style={[
              styles.pillText,
              selectedCategory === category && styles.pillTextSelect,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingRight: 20,
  },
  pillBase: {
    backgroundColor: Colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.outline_variant,
  },
  pillSelect: {
    backgroundColor: Colors.primary_container,
    borderWidth: 0,
  },
  pillText: {
    ...Typography.dataMono,
    color: Colors.on_surface_variant,
  },
  pillTextSelect: {
    color: Colors.on_primary,
  },
});
