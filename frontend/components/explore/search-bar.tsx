import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Search, Sparkles } from "lucide-react-native";

export default function SearchBar() {
  return (
    <View
      style={{ flexDirection: "row", gap: 2, justifyContent: "space-evenly" }}
    >
      <TouchableOpacity>
        <Search />
      </TouchableOpacity>
      <TextInput placeholder="Search recipes, ingredients, or paste url" />
      <TouchableOpacity>
        <Sparkles />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
