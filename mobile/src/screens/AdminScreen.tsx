import { Feather } from "@expo/vector-icons";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppTab, BottomTabBar, TabConfig } from "../components/BottomTabBar";
import { colors, radius, spacing } from "../theme/tokens";

const stats = [
  { label: "Total de Usuários", value: "1,234", icon: "users" as const },
  { label: "Total de Notícias", value: "567", icon: "file-text" as const },
  { label: "Comentários", value: "3,456", icon: "message-circle" as const },
  { label: "Visualizações", value: "45.2k", icon: "bar-chart-2" as const },
];

const management = [
  { label: "Usuários", icon: "users" as const },
  { label: "Notícias", icon: "file-text" as const },
  { label: "Tags", icon: "tag" as const },
  { label: "Perfis", icon: "shield" as const },
  { label: "Estados (UF)", icon: "map" as const },
  { label: "Cidades", icon: "map-pin" as const },
  { label: "Comentários", icon: "message-square" as const },
];

type AdminScreenProps = {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  tabs: TabConfig[];
};

export function AdminScreen({ activeTab, onTabPress, tabs }: AdminScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Feather name="chevron-left" size={20} color={colors.text} />
        <Text style={styles.headerTitle}>Dashboard Admin</Text>
      </View>

      <View style={styles.scrollArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.heroIconWrap}>
              <Feather name="shield" size={22} color={colors.surface} />
            </View>
            <View>
              <Text style={styles.heroTitle}>Painel Administrativo</Text>
              <Text style={styles.heroSubtitle}>
                Controle total da plataforma
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Feather name={stat.icon} size={16} color={colors.navTint} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gerenciamento</Text>
            <View style={styles.sectionList}>
              {management.map((item) => (
                <View key={item.label} style={styles.sectionRow}>
                  <View style={styles.sectionLeft}>
                    <Feather name={item.icon} size={17} color={colors.text} />
                    <Text style={styles.sectionLabel}>{item.label}</Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={16}
                    color={colors.navTint}
                  />
                </View>
              ))}
            </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 20,
    color: colors.text,
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
    paddingBottom: 130,
    gap: spacing.lg,
  },
  hero: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  heroIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0A3A52",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 18,
    color: colors.text,
  },
  heroSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: 2,
  },
  statValue: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 24,
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 18,
    color: colors.text,
  },
  sectionList: {
    gap: spacing.sm,
  },
  sectionRow: {
    minHeight: 50,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sectionLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    color: colors.text,
  },
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
