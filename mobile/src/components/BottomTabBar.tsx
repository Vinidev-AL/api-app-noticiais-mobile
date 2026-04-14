import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme/tokens";

type TabItemProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  active?: boolean;
};

function TabItem({ icon, label, active = false }: TabItemProps) {
  return (
    <View style={styles.tabItem}>
      <Feather
        name={icon}
        size={18}
        color={active ? colors.navActive : colors.navTint}
      />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export function BottomTabBar() {
  return (
    <View style={styles.container}>
      <TabItem icon="home" label="Início" active />
      <TabItem icon="search" label="Buscar" />
      <TabItem icon="user" label="Perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  tabItem: {
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: colors.navTint,
  },
  tabLabelActive: {
    color: colors.navActive,
  },
});
