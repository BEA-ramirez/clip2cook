import { View, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { List } from "react-native-paper";
import { Text } from "./custom-text";

const recipe = {
  title: "Quick and Easy Sugar Cookies",
  recipe_by: "John Kanell",
  description:
    "A classic, tender sugar cookie recipe that is perfect for cutting out, decorating, or stamping.",
  prep_time_minutes: 135,
  servings: 24,
  yield_description: "1 large batch of cookies",
  equipment: [
    "large bowl",
    "scale or measuring cups",
    "whisk",
    "stand mixer",
    "spatula",
    "pastry mat",
    "wooden roller",
    "rimmed baking sheets",
    "parchment paper or Silpats",
    "cookie cutters",
    "pastry brush",
  ],
  bake_time_minutes: 10,
  temp_or_heat: "375°F",
  ingredients: [
    {
      name: "all-purpose flour",
      quantity: "4",
      unit: "cups",
      grams_amount: 480,
    },
    {
      name: "baking powder",
      quantity: "3/4",
      unit: "teaspoon",
      grams_amount: null,
    },
    {
      name: "salt (sea salt preferred)",
      quantity: "3/4",
      unit: "teaspoon",
      grams_amount: null,
    },
    {
      name: "unsalted butter, room temperature",
      quantity: "1",
      unit: "cup",
      grams_amount: 226,
    },
    {
      name: "granulated sugar",
      quantity: "1",
      unit: "cup",
      grams_amount: 200,
    },
    {
      name: "large eggs, room temperature",
      quantity: "2",
      unit: "",
      grams_amount: null,
    },
    {
      name: "vanilla extract",
      quantity: "2",
      unit: "teaspoons",
      grams_amount: null,
    },
    {
      name: "sprinkles (optional for confetti cookies)",
      quantity: "1/2",
      unit: "cup",
      grams_amount: null,
    },
    {
      name: "melted butter (optional, for decorating)",
      quantity: "1",
      unit: "teaspoon",
      grams_amount: null,
    },
    {
      name: "sanding sugar (optional, for decorating)",
      quantity: "to taste",
      unit: "",
      grams_amount: null,
    },
  ],
  instructions: [
    "In a large bowl, combine the dry ingredients: flour, baking powder, and salt. Whisk to combine and set aside.",
    "In the bowl of a stand mixer, add the softened unsalted butter and granulated sugar. Beat on medium speed for about 2 minutes until light and fluffy.",
    "Add the room temperature eggs one at a time, mixing well and scraping down the bowl after each addition to ensure a homogenous mixture.",
    "Add the vanilla extract and mix to combine.",
    "Set the mixer to low/stir and gradually add the flour mixture, mixing just until combined. Do not overmix. (If making confetti cookies, fold in the sprinkles now).",
    "Finish mixing the last streaks of flour by hand with a spatula to avoid overworking the dough.",
    "Dump the dough onto a counter, divide into two batches, and shape each into a disc. Wrap in beeswax cloth, parchment paper, or plastic wrap.",
    "Chill in the fridge for at least 2 hours (or up to 2 days). If chilled longer than 2 hours, let the dough sit out at room temperature for about 10 minutes so it does not crack when rolled.",
    "Preheat your oven to 375°F.",
    "Sprinkle flour onto a pastry mat or work surface. Roll the dough out to about a quarter of an inch thickness.",
    "Cut out shapes using cookie cutters dipped in flour. Place the cutouts onto rimmed baking sheets lined with parchment paper or Silpats.",
    "Optional decorating step: Brush the top of the cookies with a teaspoon of melted butter, then press gently into sanding sugar.",
    "Bake at 375°F for 10 to 12 minutes (or 7 minutes for smaller cookies), until they are just getting some color at the bottom. Keep a close eye on them as bake times vary by cookie size.",
    "Remove from the oven and let cool completely.",
  ],
};

export default function RecipeView() {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 50,
        }}
      >
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 15,
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <Feather name="external-link" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="eye" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="heart" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subtitle}>Recipe By: {recipe.recipe_by}</Text>
      <View>
        <Text style={styles.sectionHeader}>Description</Text>
        <Text style={styles.desc}>{recipe.description}</Text>
      </View>

      <View style={styles.section_2}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <AntDesign name="clock-circle" size={14} color="black" />
          <Text>{recipe.prep_time_minutes} mins.</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <MaterialCommunityIcons name="toaster-oven" size={18} color="black" />{" "}
          <Text>{recipe.bake_time_minutes} mins.</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <FontAwesome6 name="temperature-full" size={14} color="black" />
          <Text>{recipe.temp_or_heat} </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 3,
          justifyContent: "center",
          marginBottom: 10,
          backgroundColor: "#ccc",
          padding: 5,
          borderRadius: 8,
        }}
      >
        <MaterialCommunityIcons
          name="pot-steam-outline"
          size={24}
          color="black"
        />
        <Text style={{ fontFamily: "RobotoMono-Medium" }}>
          {recipe.yield_description}
        </Text>
      </View>

      {/* Equipments */}
      <View style={styles.section_3}>
        <Text style={styles.sectionHeader}>Equipments</Text>
        {recipe.equipment.map((equipment, index) => (
          <Text key={index} style={styles.section_3_text}>
            • {equipment}
          </Text>
        ))}
      </View>
      <View style={styles.section_3}>
        <List.Accordion
          title="Equipments"
          id="equipments"
          left={(props) => (
            <List.Icon
              {...props}
              icon="silverware-fork-knife"
              color="#0f172a"
            />
          )}
          style={styles.accordion_header}
          titleStyle={styles.sectionHeader}
          right={(props) => (
            <List.Icon
              {...props}
              // Flip the icon based on whether the accordion is open or closed
              icon={props.isExpanded ? "chevron-up" : "chevron-down"}
              color="#0f172a" // Force your exact color here!
            />
          )}
        >
          {recipe.equipment.map((equipment, index) => (
            <Text key={index} style={styles.section_3_text}>
              • {equipment}
            </Text>
          ))}
        </List.Accordion>
      </View>
      {/* Ingredients */}
      <View style={styles.section_3}>
        <Text style={styles.sectionHeader}>Ingredients</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.section_3_text}>
            {`• ${ingredient.quantity} ${ingredient.unit} ${ingredient.name}  ${ingredient.grams_amount ? `(${ingredient.grams_amount} g)` : ""}`}
          </Text>
        ))}
      </View>
      {/* Instructions */}
      <View style={styles.section_3}>
        <Text style={styles.sectionHeader}>Instructions</Text>
        {recipe.instructions.map((instruction, index) => (
          <Text key={index} style={styles.section_3_text}>
            {index + 1}. {instruction}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "RobotoMono-Bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 16,
    color: "#0f172a",
    fontFamily: "RobotoMono-Bold",
  },
  section: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  section_2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    padding: 10,
  },
  section_3: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "white",
  },
  section_3_text: {
    marginBottom: 5,
  },
  accordion_header: {
    backgroundColor: "white",
    borderWidth: 0,
  },
});
