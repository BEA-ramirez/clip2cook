import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Colors, Spacing, Typography, Radius } from "@/constants/theme";
import ExtractInput from "@/components/extract/extract-input";
import PantryChef from "@/components/extract/pantry-chef";
import { Clipboard, Cpu, CookingPot } from "lucide-react-native";

const steps = [
  {
    icon: <Clipboard color={Colors.on_secondary_fixed} />,
    color: Colors.secondary_fixed,
    action: "Paste",
    desc: "Drop in a link from any messy food video.",
  },
  {
    icon: <Cpu color={Colors.on_tertiary_fixed} />,
    color: Colors.tertiary_fixed,
    action: "Analyze",
    desc: "Our AI strips away the fluff instantly.",
  },
  {
    icon: <CookingPot color={Colors.on_primary_fixed} />,
    color: Colors.primary_fixed_dim,
    action: "Cook",
    desc: "Get a clean, step-by-step cooking view.",
  },
];

export default function CreateRecipeScreen() {
  return (
    <ScrollView style={[styles.container]}>
      <Text style={styles.title}>Clip a Recipe</Text>
      <Text style={styles.desc}>
        Paste any URL to magically extract a clean, cookable recipe.
      </Text>
      <ExtractInput />
      <PantryChef />
      <Text style={styles.steps}>How it works</Text>
      <View style={styles.stepContainer}>
        {steps.map((step, ind) => (
          <View key={ind} style={styles.stepCard}>
            <View
              style={{
                backgroundColor: step.color,
                padding: 5,
                borderRadius: "100%",
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {step.icon}
            </View>
            <Text
              style={styles.actionText}
            >{`${ind + 1}. ${step.action}`}</Text>
            <Text style={styles.descText}>{step.desc}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    ...Typography.headlineLg,
    marginBottom: Spacing.sm,
  },
  desc: {
    ...Typography.bodySm,
    color: Colors.on_primary_fixed,
    marginBottom: Spacing.lg,
  },
  steps: {
    ...Typography.labelCaps,
    color: Colors.on_primary_fixed,
    textAlign: "center",
    marginTop: Spacing.xl + 16,
    marginBottom: Spacing.sm,
  },
  stepContainer: {
    gap: 20,
    paddingBottom: 50,
  },
  stepCard: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: Radius.lg,
    padding: 26,
  },
  actionText: {
    ...Typography.bodyMdSb,
    color: Colors.on_background,
  },
  descText: {
    ...Typography.bodySm,
    color: Colors.on_primary_fixed,
  },
});
