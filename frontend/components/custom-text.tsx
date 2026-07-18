import { Text as RNText, TextProps, StyleSheet } from "react-native";

export function Text(props: TextProps) {
  return (
    <RNText
      {...props}
      // This merges your global font with any specific styles you pass in later
      style={[styles.defaultText, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: "RobotoMono", // Matches the name you gave it in _layout.tsx
    color: "#0f172a", // Optional: Set a global default text color!
  },
});
