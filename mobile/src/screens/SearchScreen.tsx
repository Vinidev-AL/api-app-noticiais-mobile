import { Feather } from "@expo/vector-icons";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { AppTab, BottomTabBar, TabConfig } from "../components/BottomTabBar";
import { SearchBar } from "../components/SearchBar";
import { colors, radius, spacing } from "../theme/tokens";

const searchCategories = [
  "Tecnologia",
  "Política",
  "Economia",
  "Sustentabilidade",
  "Brasil",
  "Internacional",
  "Cultura",
  "Esportes",
  "Saúde",
  "Educação",
];

type SearchScreenProps = {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  tabs: TabConfig[];
};

export function SearchScreen({
  activeTab,
  onTabPress,
  tabs,
}: SearchScreenProps) {
  return (
    <View style={styles.screen}>
      <AppHeader title="Buscar" />

      <View style={styles.scrollArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <SearchBar placeholder="Buscar por título, tag ou autor..." />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Buscar por categoria</Text>
            <View style={styles.chipsWrap}>
              {searchCategories.map((label) => (
                <View key={label} style={styles.chip}>
                  <Text style={styles.chipText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Feather name="search" size={24} color={colors.navTint} />
            </View>
            <Text style={styles.emptyTitle}>Explore as notícias</Text>
            <Text style={styles.emptyText}>
              Use a busca ou selecione uma categoria para começar
            </Text>
          </View>
        </ScrollView>
      </View>

      <View style={styles.tabBarWrapper}>
        <BottomTabBar
          activeTab={activeTab}
          onTabPress={onTabPress}
          tabs={tabs}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    width: "100%",
    maxWidth: 375,
    alignSelf: "center",
    ...(Platform.OS === "web" ? { height: "100%" as const } : null),
  },
  scrollArea: {
    flex: 1,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
    ...(Platform.OS === "web" ? { overflow: "scroll" as const } : null),
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 44,
  },
  sectionTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.md,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chipText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: colors.chipText,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.lg,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.chip,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 250,
    lineHeight: 20,
  },
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
