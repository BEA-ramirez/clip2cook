import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  Colors,
  Radius,
  Typography,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { Sparkles, Link2 } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ExtractInput() {
  const router = useRouter();
  return (
    <View style={styles.extractContainer}>
      <View style={styles.extractInputCont}>
        <Link2 size={22} color={Colors.on_primary_fixed} />
        <TextInput placeholder="https://..." style={styles.extractInput} />
      </View>
      <TouchableOpacity
        style={styles.extractButton}
        onPress={() => router.push("/loading")}
      >
        <Sparkles size={20} color={Colors.on_primary} />
        <Text style={styles.extractButtonText}>Extract Recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  extractContainer: {
    padding: 20,
    backgroundColor: Colors.on_primary,
    borderRadius: Radius.lg,
    ...Shadows.level1,
    marginBottom: Spacing.lg,
  },
  extractInputCont: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.surface_container_high,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  extractInput: {
    ...Typography.bodyMd,
    flex: 1,
  },
  extractButton: {
    backgroundColor: Colors.primary_container,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  extractButtonText: {
    ...Typography.bodyMdSb,
    color: Colors.on_primary,
  },
});
