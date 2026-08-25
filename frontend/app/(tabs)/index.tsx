import { Colors, Typography, Spacing } from "@/constants/theme";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import SearchBar from "@/components/explore/search-bar";
import CategoryPills from "@/components/explore/category-pills";
import RecipeList from "@/components/explore/recipe-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { MoveRight } from "lucide-react-native";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingBottom: insets.bottom + 40,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: Spacing.xl,
        }}
      >
        <View>
          <Text style={styles.headerLabel}>Ready to Cook?</Text>
          <Text style={styles.headerText}>Good evening</Text>
        </View>
        <View style={styles.user}></View>
      </View>
      <SearchBar />
      <CategoryPills />
      <View style={styles.subHeaderContainer}>
        <Text style={styles.subHeader}>Recently Added</Text>
        <Link href={"/(tabs)/saved"} asChild>
          <TouchableOpacity style={styles.viewLink}>
            <Text style={styles.viewLinkText}>View all</Text>
            <MoveRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </Link>
      </View>
      <RecipeList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    padding: 20,
  },
  headerLabel: {
    ...Typography.bodyMd,
    color: Colors.on_primary_fixed,
  },
  headerText: {
    ...Typography.display,
    color: Colors.on_surface,
  },
  user: {
    width: 50,
    height: 50,
    backgroundColor: Colors.surface_dim,
    borderRadius: "100%",
  },
  text: {
    fontSize: 18,
    fontFamily: "RobotoMono_700Bold",
    textAlign: "center",
  },
  subHeaderContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: Spacing.md,
  },
  subHeader: {
    marginTop: Spacing.md,
    ...Typography.headlineLg,
  },
  viewLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 6,
    paddingTop: 6,
    gap: 4,
  },
  viewLinkText: {
    ...Typography.dataMono,
    color: Colors.primary,
  },
});
