import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

export default function ExtractLoadingPage() {
  return (
    <View style={styles.container}>
      <Text>Extract Loading Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});
