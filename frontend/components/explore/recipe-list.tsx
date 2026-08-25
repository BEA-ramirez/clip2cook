import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors, Radius, Typography } from "@/constants/theme";
import RecipeCard from "../recipe-card";

const recipes = [
  {
    title: "Creamy Vodka Pasta",
    time: 25,
    extractedBy: "AI",
    image:
      "https://images.unsplash.com/photo-1676300184847-4ee4030409c0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Poached Egg Avo Toast",
    time: 10,
    extractedBy: "AI",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Classic Chicken Adobo",
    time: 45,
    extractedBy: "",
    image:
      "https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Fluffy Pancakes",
    time: 20,
    extractedBy: "",
    image:
      "https://images.unsplash.com/photo-1575853121743-60c24f0a7502?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Tiramisu Cheesecake",
    time: 90,
    extractedBy: "",
    image:
      "https://images.unsplash.com/photo-1639744211487-b27e3551b07c?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function RecipeList() {
  return (
    <View style={styles.container}>
      {recipes.map((recipe, ind) => (
        <RecipeCard recipe={recipe} key={ind} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 20,
  },
});
