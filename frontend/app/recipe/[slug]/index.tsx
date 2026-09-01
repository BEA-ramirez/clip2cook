import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Bookmark,
  Timer,
  Flame,
  Thermometer,
  PieChart,
  Minus,
  Plus,
  ChefHat,
  Scale,
  Scissors,
  Play,
} from "lucide-react-native";
import { Colors, Radius, Typography, Shadows } from "@/constants/theme"; // Assuming your theme file
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";

export default function RecipeViewScreen() {
  const router = useRouter();
  // Make the servings scaler interactive
  const [servings, setServings] = useState(1);
  const { slug } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false} // Keeps the top image from pulling down awkwardly
      >
        {/* --- HERO IMAGE & TOP ACTIONS --- */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8uMc81t3m7xsYmNmgX4T7zP7-jLoj8A4Tz_4aAdXl1Y0Am2g8Z0MKnL74OxaJVtbC52ovPqAUO1ndL7YeiQKwyFaGnRxV-rXi-X0tM4w5dR6odI6YNgpM7KOCOa8qj0cIGbRP4w8Yt16PTEPamYwoVTA8n8nXYmRddAbH-3ILRfSwf0hRFjCIHBGh9gK7qTdcJukNnmz36g-BoPLSs-t_Gh-JOdtBk4aA59dqm83LSom4-zV74o_KRw",
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Gradient Overlay for text readability */}
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.2)"]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Floating Header Buttons */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color="#ffffff" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bookmark color="#ffffff" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- MAIN CONTENT CANVAS --- */}
        <View style={styles.contentCanvas}>
          {/* Header Info */}
          <View style={styles.section}>
            <Text style={styles.title}>Artisan Rustic Sourdough</Text>
            <Text style={styles.author}>By Chef Elena Rossi</Text>
            <Text style={styles.description}>
              A classic, crackly-crust sourdough loaf with a beautifully open
              crumb. Perfect for toast or dipping into soups.
            </Text>
          </View>

          {/* Metadata Grid */}
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Timer
                color={Colors.primary_container}
                size={24}
                style={styles.metaIcon}
              />
              <Text style={styles.metaLabel}>PREP</Text>
              <Text style={styles.metaValue}>30m</Text>
            </View>
            <View style={styles.metaItem}>
              <Flame
                color={Colors.primary_container}
                size={24}
                style={styles.metaIcon}
              />
              <Text style={styles.metaLabel}>BAKE</Text>
              <Text style={styles.metaValue}>45m</Text>
            </View>
            <View style={styles.metaItem}>
              <Thermometer
                color={Colors.primary_container}
                size={24}
                style={styles.metaIcon}
              />
              <Text style={styles.metaLabel}>TEMP</Text>
              <Text style={styles.metaValue}>450F</Text>
            </View>
            <View style={styles.metaItem}>
              <PieChart
                color={Colors.primary_container}
                size={24}
                style={styles.metaIcon}
              />
              <Text style={styles.metaLabel}>YIELD</Text>
              <Text style={styles.metaValue}>1 Loaf</Text>
            </View>
          </View>

          {/* Servings Scaler */}
          <View style={styles.scalerContainer}>
            <TouchableOpacity
              style={styles.scalerButton}
              onPress={() => setServings(Math.max(1, servings - 1))}
            >
              <Minus color={Colors.on_surface} size={20} />
            </TouchableOpacity>

            <View style={styles.scalerCenter}>
              <Text style={styles.scalerNumber}>{servings}</Text>
              <Text style={styles.scalerLabel}>
                SERVING{servings > 1 ? "S" : ""}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.scalerButton}
              onPress={() => setServings(servings + 1)}
            >
              <Plus color={Colors.on_surface} size={20} />
            </TouchableOpacity>
          </View>

          {/* Equipment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipment</Text>
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <ChefHat size={16} color={Colors.on_surface} />
                <Text style={styles.tagText}>Dutch Oven</Text>
              </View>
              <View style={styles.tag}>
                <Scale size={16} color={Colors.on_surface} />
                <Text style={styles.tagText}>Kitchen Scale</Text>
              </View>
              <View style={styles.tag}>
                <Scissors size={16} color={Colors.on_surface} />
                <Text style={styles.tagText}>Lame or Razor</Text>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <TouchableOpacity>
                <Text style={styles.metricToggle}>METRICS</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
              {[
                { name: "Bread Flour", vol: "4 cups", weight: "500g" },
                { name: "Water (Warm)", vol: "1.5 cups", weight: "350g" },
                { name: "Sourdough Starter", vol: "1/2 cup", weight: "100g" },
                { name: "Fine Sea Salt", vol: "2 tsp", weight: "10g" },
              ].map((item, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <View style={styles.ingredientLeft}>
                    <View style={styles.bullet} />
                    <Text style={styles.ingredientName}>{item.name}</Text>
                  </View>
                  <View style={styles.ingredientRight}>
                    <Text style={styles.ingredientVol}>{item.vol}</Text>
                    <Text style={styles.ingredientWeight}>{item.weight}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>

            <View style={styles.instructionStep}>
              <View style={[styles.stepNumber, styles.stepNumberActive]}>
                <Text style={styles.stepNumberTextActive}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Mix the Dough</Text>
                <Text style={styles.stepDescription}>
                  In a large bowl, whisk the starter and water until milky. Add
                  the flour and salt. Mix by hand until a shaggy dough forms.
                  Cover and let rest for 30 minutes (autolyse).
                </Text>
              </View>
            </View>

            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Stretch and Fold</Text>
                <Text style={styles.stepDescription}>
                  Perform 4 sets of stretch and folds, spaced 30 minutes apart.
                  This builds strength in the dough. The dough should become
                  noticeably smoother and more elastic.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* --- STICKY ACTION BUTTON --- */}
      <LinearGradient
        colors={["transparent", Colors.background, Colors.background]}
        locations={[0, 0.4, 1]}
        style={styles.stickyFooter}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            router.push({
              pathname: "/recipe/[slug]/cooking-mode",
              params: { slug: "recipe-example" },
            });
          }}
        >
          <Play fill="#ffffff" color="#ffffff" size={20} />
          <Text style={styles.primaryButtonText}>Start Cooking</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 120, // Leave room for the sticky footer
  },

  // --- HERO SECTION ---
  heroContainer: {
    width: "100%",
    height: 350,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  headerActions: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30, // Rough safe area, better to use react-native-safe-area-context
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  // --- CONTENT CANVAS ---
  contentCanvas: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32, // Pulls the white canvas up over the image
    padding: 24,
    paddingTop: 32,
  },
  section: {
    marginBottom: 32,
  },
  title: {
    ...Typography.display,
    color: Colors.on_surface,
    marginBottom: 8,
  },
  author: {
    ...Typography.bodySm,
    color: Colors.on_surface_variant,
    marginBottom: 16,
  },
  description: {
    ...Typography.bodyMd,
    color: Colors.on_surface,
  },
  sectionTitle: {
    ...Typography.headlineLg,
    fontSize: 20,
    color: Colors.on_surface,
    marginBottom: 12,
  },

  // --- META GRID ---
  metaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.surface_container_low || "#f2f4f6",
    padding: 16,
    borderRadius: Radius.xl,
    marginBottom: 32,
  },
  metaItem: {
    alignItems: "center",
  },
  metaIcon: {
    marginBottom: 4,
  },
  metaLabel: {
    ...Typography.dataMono,
    fontSize: 10,
    color: Colors.on_surface_variant,
  },
  metaValue: {
    ...Typography.dataMono,
    color: Colors.on_surface,
  },

  // --- SCALER ---
  scalerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface_container || "#eceef0",
    padding: 4,
    borderRadius: 100,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.surface_variant || "#e0e3e5",
  },
  scalerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scalerCenter: {
    alignItems: "center",
  },
  scalerNumber: {
    ...Typography.dataMono,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  scalerLabel: {
    ...Typography.dataMono,
    fontSize: 10,
    color: Colors.on_surface_variant,
  },

  // --- EQUIPMENT TAGS ---
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.surface_variant,
  },
  tagText: {
    ...Typography.bodySm,
    color: Colors.on_surface,
  },

  // --- INGREDIENTS ---
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  metricToggle: {
    ...Typography.dataMono,
    fontSize: 12,
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  listContainer: {
    gap: 12,
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surface_container_highest,
    ...Shadows.level1,
  },
  ingredientLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary_container,
  },
  ingredientName: {
    ...Typography.bodyMd,
    color: Colors.on_surface,
  },
  ingredientRight: {
    alignItems: "flex-end",
  },
  ingredientVol: {
    ...Typography.dataMono,
    color: Colors.on_surface,
  },
  ingredientWeight: {
    ...Typography.dataMono,
    fontSize: 12,
    color: Colors.on_surface_variant,
  },

  // --- INSTRUCTIONS ---
  instructionStep: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface_container,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberActive: {
    backgroundColor: Colors.primary_container,
  },
  stepNumberText: {
    ...Typography.dataMono,
    color: Colors.on_surface_variant,
  },
  stepNumberTextActive: {
    ...Typography.dataMono,
    color: "#ffffff",
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...Typography.headlineLg,
    fontSize: 16,
    color: Colors.on_surface,
    marginBottom: 4,
  },
  stepDescription: {
    ...Typography.bodyMd,
    color: Colors.on_surface_variant,
  },

  // --- STICKY FOOTER ---
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 40, // Extra padding to make the gradient fade look smooth
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  primaryButton: {
    backgroundColor: Colors.primary_container,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: Radius.xl,
    ...Shadows.level2,
  },
  primaryButtonText: {
    ...Typography.headlineLg,
    fontSize: 18,
    color: "#ffffff",
  },
});
