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
import { Pencil, Icon } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { refrigeratorFreezer } from "@lucide/lab";
import { useRouter } from "expo-router";

export default function PantryChef() {
  const router = useRouter();
  return (
    <LinearGradient colors={["#fbfcfe", "#f4f4f9", "#f1f2fa"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon iconNode={refrigeratorFreezer} color={Colors.primary} />
          <Text style={styles.headerText}>Pantry Chef</Text>
          <Text style={styles.pill}>AI Beta</Text>
        </View>
        <Text style={styles.desc}>
          Tell us what ingredients you have, and we&apos;ll generate a custom
          recipe instantly.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/create/generate-recipe")}
        >
          <Pencil color={Colors.primary} size={22} />
          <Text style={styles.buttonText}>Start Typing</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surface_container_high,
  },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  headerText: {
    ...Typography.bodyMdSb,
    color: Colors.on_background,
  },
  pill: {
    ...Typography.labelCaps,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: Colors.tertiary_fixed,
    borderRadius: Radius.pill,
  },
  desc: {
    ...Typography.bodySm,
    color: Colors.on_primary_fixed,
    marginBottom: Spacing.md,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 26,
    borderRadius: Radius.lg,
    borderColor: Colors.surface_container_highest,
    backgroundColor: Colors.on_primary,
  },
  buttonText: {
    ...Typography.bodyMdSb,
    color: Colors.primary,
  },
});
