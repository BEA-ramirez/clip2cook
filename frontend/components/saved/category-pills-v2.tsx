"use client";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors, Radius, Typography } from "@/constants/theme";
import { useState } from "react";

const categories = ["All", "Filipino", "Dessert", "Quick", "Vegan", "Soup"];

export default function CategoryPillsV2() {
  const [selectedCategory, setSelectedCategory] = useState("All");
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
    backgroundColor: Colors.on_primary,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.surface_container_high,
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
