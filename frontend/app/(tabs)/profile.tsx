import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import {
  Pencil,
  Settings,
  Utensils,
  Download,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { router, useRouter } from "expo-router";
import { Colors } from "@/constants/theme";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* USER INFO SECTION */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAremjzchM6HMU-FDlqX2n_i7eXjURBsDpB9qZKTVcFphMEVC7rwtzuV36BGktniy5uHQhyAuTOZwe9xv4czvYhJmfNbXUlUUxsISYncd3y9Ok4jf6EBrJgtPKDhaLvsNq6wVeXJQlZlHyGsG93cjXKg-D3OLnpSgYeuJkoOgMMpxU4ARHR2C5yRrh0nEvZl4-yNGUI_Xk-7FGy7Fz5pssrzeZm2UyQIKOL0nj1oEEtIHlVPdX4O9uGTA",
              }}
              style={styles.avatarImage}
            />
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => router.push("/auth")}
            >
              <Pencil size={18} color={Colors.on_primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Alex Culinary</Text>
          <Text style={styles.userHandle}>@alexcooks</Text>
        </View>

        {/* STATS SECTION */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>342</Text>
            <Text style={styles.statLabel}>RECIPES{"\n"}CLIPPED</Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>87</Text>
            <Text style={styles.statLabel}>RECIPES{"\n"}COOKED</Text>
          </View>
        </View>

        {/* SETTINGS LIST */}
        <View style={styles.settingsCard}>
          <SettingRow
            icon={<Settings size={20} color={Colors.secondary} />}
            title="Account Settings"
          />
          <SettingRow
            icon={<Utensils size={20} color={Colors.secondary} />}
            title="Dietary Preferences"
          />
          <SettingRow
            icon={<Download size={20} color={Colors.secondary} />}
            title="Export Data"
          />
          <SettingRow
            icon={<LogOut size={20} color={Colors.error} />}
            title="Log Out"
            isDestructive
            isLast
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- REUSABLE ROW COMPONENT ---
function SettingRow({
  icon,
  title,
  isDestructive = false,
  isLast = false,
}: any) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, !isLast && styles.settingRowBorder]}
      activeOpacity={0.7}
    >
      <View style={styles.settingRowLeft}>
        {icon}
        <Text
          style={[
            styles.settingRowTitle,
            isDestructive && { color: Colors.error },
          ]}
        >
          {title}
        </Text>
      </View>
      <ChevronRight size={20} color={Colors.surface_variant} />
    </TouchableOpacity>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: "rgba(247, 249, 251, 0.9)",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.primary,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  iconButton: {
    padding: 8,
    marginHorizontal: -8, // Increases touch target without messing up layout
  },

  // Main Scroll Area
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 24, // Consistent spacing between sections
  },

  // Profile Info
  profileSection: {
    alignItems: "center",
    marginTop: 16,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: Colors.surface_container_lowest,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary_container,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    color: Colors.on_surface,
    marginBottom: 4,
  },
  userHandle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.secondary,
  },

  // Stats Card
  statsCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: 12,
    padding: 24,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 24,
    color: Colors.primary_container,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: Colors.secondary,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  verticalDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.surface_variant,
  },

  // Settings Card
  settingsCard: {
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: Colors.surface_container_lowest,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface_variant,
  },
  settingRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingRowTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.on_surface,
  },
});
