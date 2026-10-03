import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  Typography,
  Radius,
  Borders,
} from "@/constants/theme";
import { useRouter } from "expo-router";

const mockRecipes = [
  {
    id: "1",
    title: "Chicken Adobo",
    time: "30 min",
    servings: "4 servings",
    source: "Extracted from YouTube",
  },
  {
    id: "2",
    title: "Creamy Garlic Pasta",
    time: "25 min",
    servings: "2 servings",
    source: "Extracted from Recipe Blog",
  },
  {
    id: "3",
    title: "Fluffy Buttermilk Pancakes",
    time: "15 min",
    servings: "3 servings",
    source: "Extracted from TikTok",
  },
  {
    id: "4",
    title: "Quick 15-Minute Miso Ramen",
    time: "15 min",
    servings: "1 serving",
    source: "Extracted from Instagram",
  },
  {
    id: "5",
    title: "Classic Sourdough Toast & Eggs",
    time: "10 min",
    servings: "1 serving",
    source: "Extracted from Web",
  },
  // {
  //   id: "6",
  //   title: "Classic Sourdough Toast & Eggs",
  //   time: "10 min",
  //   servings: "1 serving",
  //   source: "Extracted from Web",
  // },
  // {
  //   id: "7",
  //   title: "Classic Sourdough Toast & Eggs",
  //   time: "10 min",
  //   servings: "1 serving",
  //   source: "Extracted from Web",
  // },
  // {
  //   id: "8",
  //   title: "Classic Sourdough Toast & Eggs",
  //   time: "10 min",
  //   servings: "1 serving",
  //   source: "Extracted from Web",
  // },
  // {
  //   id: "9",
  //   title: "Classic Sourdough Toast & Eggs",
  //   time: "10 min",
  //   servings: "1 serving",
  //   source: "Extracted from Web",
  // },
  // {
  //   id: "10",
  //   title: "Classic Sourdough Toast & Eggs",
  //   time: "10 min",
  //   servings: "1 serving",
  //   source: "Extracted from Web",
  // },
];

export default function Clip2Cook() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmptyState, setShowEmptyState] = useState(false);

  const filteredRecipes = mockRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida/AEtjO1XpeR65Nxgcw6kDBHZ_FkWrsGPI997WoCn5DipJ6xG9EdWA4DNcv9xGUFaXIM47nuxsGX92RMwNklR_GGJd1JKCpJoxopP-r_PeM0jzB5tAoh4zACx-bWUkUHvhqPz7WfbJNdDT35siiYXu5sF-W1VP4c0w1-EFAQudnl7Px3vUUCHeWLXNEHSYuAY4rN0AUTv7XxT_7HisxsyQzTcDHPPWzsCBhW_ReArYgjE2PtsawStZ615bwHC4vzA",
            }}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>Clip2Cook</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/(recipes)/extract")}
          >
            <MaterialIcons name="add" size={24} color={Colors.on_surface} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <MaterialIcons
              name="person"
              size={20}
              color={Colors.surface_container_lowest}
            />
          </View>
        </View>
      </View>

      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color={Colors.text_muted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes, tags, or sources..."
            placeholderTextColor={Colors.text_muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.shortcutBadge}>
            <Text style={styles.shortcutText}>⌘K</Text>
          </View>
        </View>

        {/* Filter Strip */}
        <View style={styles.filterStrip}>
          <View style={styles.filterLeft}>
            <Text style={styles.libraryText}>LIBRARY</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{mockRecipes.length}</Text>
            </View>
          </View>
          <View style={styles.filterRight}>
            <TouchableOpacity style={styles.filterButton}>
              <MaterialIcons
                name="swap-vert"
                size={16}
                color={Colors.on_surface_variant}
              />
              <Text style={styles.filterButtonText}>Recent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowEmptyState(!showEmptyState)}
            >
              <MaterialIcons
                name="visibility"
                size={16}
                color={Colors.primary}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  { color: Colors.primary, fontWeight: "600" },
                ]}
              >
                {showEmptyState ? "Show List" : "Empty Preview"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Content Area */}
        {showEmptyState ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons
                name="content-paste"
                size={24}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>GETTING STARTED</Text>
            <Text style={styles.emptyDesc}>
              No recipes yet? Paste a recipe link to save your first recipe.
            </Text>

            <View style={styles.pasteInputContainer}>
              <TextInput
                style={styles.pasteInput}
                placeholder="https://youtube.com/watch?v=..."
                placeholderTextColor={Colors.text_muted}
                editable={false}
              />
              <TouchableOpacity style={styles.pasteButton}>
                <Text style={styles.pasteButtonText}>Paste</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addRecipeButton}>
              <MaterialIcons name="add" size={20} color={Colors.on_primary} />
              <Text style={styles.addRecipeButtonText}>Add Recipe</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.listSection}
            contentContainerStyle={styles.contentContainer}
          >
            {filteredRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/(recipes)/${recipe.id}`)}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    {recipe.id === "1" && <View style={styles.activeDot} />}
                    <Text style={styles.recipeTitle} numberOfLines={1}>
                      {recipe.title}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <MaterialIcons
                      name="schedule"
                      size={14}
                      color={Colors.text_muted}
                    />
                    <Text style={styles.metaText}>{recipe.time}</Text>
                    <Text style={styles.metaDot}>·</Text>
                    <MaterialIcons
                      name="group"
                      size={14}
                      color={Colors.text_muted}
                    />
                    <Text style={styles.metaText}>{recipe.servings}</Text>
                    <Text style={styles.metaDot}>·</Text>
                  </View>
                  <Text
                    style={[
                      styles.metaText,
                      { color: Colors.on_surface_variant, fontWeight: "500" },
                    ]}
                  >
                    {recipe.source}
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={Colors.text_muted}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <View style={styles.bottomRibbon}>
          <Text style={styles.ribbonCount}>
            {mockRecipes.length} saved recipes
          </Text>
          <TouchableOpacity style={styles.ribbonAddAction}>
            <MaterialIcons name="add" size={16} color={Colors.primary} />
            <Text style={styles.ribbonAddText}>Add Recipe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.margin,
    backgroundColor: Colors.surface_container_lowest,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_default,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: Radius.lg,
  },
  headerTitle: {
    ...Typography.headlineMd,
    color: Colors.on_surface,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Radius.lg,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.margin,
    paddingBottom: Spacing.xl,
  },
  contentContainer: {
    flex: 1,
    gap: Spacing.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface_container_lowest,
    ...Borders.card,
    borderRadius: Radius.lg,
    height: 44,
    paddingHorizontal: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.on_surface,
    height: "100%",
  },
  shortcutBadge: {
    backgroundColor: Colors.surface_container,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginLeft: Spacing.sm,
  },
  shortcutText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
  },
  filterStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  filterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  libraryText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
  },
  countBadge: {
    backgroundColor: Colors.surface_container_high,
    paddingHorizontal: 6,
    height: 16,
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    ...Typography.labelSm,
    color: Colors.on_surface,
    textTransform: "none",
  },
  filterRight: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: Radius.sm,
  },
  filterButtonText: {
    ...Typography.labelSm,
    color: Colors.on_surface_variant,
    textTransform: "none",
  },
  listSection: {
    gap: Spacing.sm,
  },
  recipeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: Colors.surface_container_lowest,
    ...Borders.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  cardContent: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: Spacing.sm,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  recipeTitle: {
    ...Typography.bodyMd,
    color: Colors.on_surface,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  metaText: {
    ...Typography.labelSm,
    textTransform: "none",
    color: Colors.text_muted,
    marginTop: Spacing.xs,
  },
  metaDot: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    marginHorizontal: 2,
  },
  bottomRibbon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  ribbonCount: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  ribbonAddAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ribbonAddText: {
    ...Typography.labelSm,
    color: Colors.primary,
    textTransform: "none",
    fontWeight: "600",
  },
  emptyState: {
    marginTop: Spacing.md, // Adapted spacing for react-native layout flow
    padding: Spacing.lg,
    backgroundColor: Colors.surface_container_lowest,
    ...Borders.card,
    borderRadius: Radius.xl,
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface_container_lowest,
    ...Borders.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    marginBottom: 4,
  },
  emptyDesc: {
    ...Typography.bodyMd,
    color: Colors.on_surface,
    textAlign: "center",
    maxWidth: 240,
    marginBottom: Spacing.md,
  },
  pasteInputContainer: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    backgroundColor: Colors.surface_container_lowest,
    ...Borders.card,
    borderColor: "#D1D5DB", // slightly darker border as requested for forms
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.md,
  },
  pasteInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...Typography.bodySm,
    color: Colors.on_surface,
  },
  pasteButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.DEFAULT,
  },
  pasteButtonText: {
    ...Typography.labelMd,
    color: Colors.on_primary,
  },
  addRecipeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.DEFAULT,
  },
  addRecipeButtonText: {
    ...Typography.labelMd,
    color: Colors.on_primary,
  },
});
