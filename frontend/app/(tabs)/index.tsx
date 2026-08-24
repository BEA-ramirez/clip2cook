import { Colors, Typography, Spacing } from "@/constants/theme";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import SearchBar from "@/components/explore/search-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
          marginBottom: Spacing.lg,
        }}
      >
        <View>
          <Text style={styles.headerLabel}>Ready to Cook?</Text>
          <Text style={styles.headerText}>Good evening</Text>
        </View>
        <View style={styles.user}></View>
      </View>
      <SearchBar />
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
});
