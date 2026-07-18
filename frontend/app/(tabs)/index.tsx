import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/custom-text";
import { supabase } from "@/utils/supabase";

export default function HomeScreen() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      try {
        // We ping the auth system. It requires no tables to be set up!
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Supabase Error:", error.message);
          setStatus(`❌ Connection Failed: ${error.message}`);
        } else {
          console.log("Supabase connected successfully!", data);
          setStatus("✅ Connected to Supabase Successfully!");
        }
      } catch (err) {
        setStatus("❌ Network error. Check your .env.local file.");
      }
    }

    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontFamily: "RobotoMono_700Bold",
    textAlign: "center",
  },
});
