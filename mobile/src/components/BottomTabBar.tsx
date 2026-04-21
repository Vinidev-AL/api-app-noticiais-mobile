import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../theme/tokens";

export type AppTab = "home" | "search" | "create" | "admin" | "profile";

export type TabConfig = {
  tab: AppTab;
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

export const DEFAULT_TABS: TabConfig[] = [
  { tab: "home", label: "Início", icon: "home" },
  { tab: "search", label: "Buscar", icon: "search" },
  { tab: "profile", label: "Perfil", icon: "user" },
];

export const SUPERADMIN_TABS: TabConfig[] = [
  { tab: "home", label: "Início", icon: "home" },
  { tab: "search", label: "Buscar", icon: "search" },
  { tab: "create", label: "Criar", icon: "edit-3" },
  { tab: "admin", label: "Admin", icon: "shield" },
  { tab: "profile", label: "Perfil", icon: "user" },
];

export const EDITOR_TABS: TabConfig[] = [
  { tab: "home", label: "Início", icon: "home" },
  { tab: "search", label: "Buscar", icon: "search" },
  { tab: "create", label: "Criar", icon: "edit-3" },
  { tab: "profile", label: "Perfil", icon: "user" },
];

export const AUTOR_TABS: TabConfig[] = [
  { tab: "home", label: "Início", icon: "home" },
  { tab: "search", label: "Buscar", icon: "search" },
  { tab: "create", label: "Criar", icon: "edit-3" },
  { tab: "profile", label: "Perfil", icon: "user" },
];

type TabItemProps = {
  config: TabConfig;
  active: boolean;
  onPress: (tab: AppTab) => void;
};

function TabItem({ config, active, onPress }: TabItemProps) {
  return (
    <Pressable style={styles.tabItem} onPress={() => onPress(config.tab)}>
      <Feather
        name={config.icon}
        size={18}
        color={active ? colors.navActive : colors.navTint}
      />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {config.label}
      </Text>
    </Pressable>
  );
}

type BottomTabBarProps = {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  tabs?: TabConfig[];
};

export function BottomTabBar({
  activeTab,
  onTabPress,
  tabs = DEFAULT_TABS,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: spacing.lg + insets.bottom }]}>
      {tabs.map((config) => (
        <TabItem
          key={config.tab}
          config={config}
          active={activeTab === config.tab}
          onPress={onTabPress}
        />
      ))}
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
