import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { AppTab, BottomTabBar, TabConfig } from "../components/BottomTabBar";
import { AuthSession } from "../types/auth";
import { loadAdminStats } from "../services/superadmin";
import { colors, radius, spacing } from "../theme/tokens";

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
  session: AuthSession | null;
};

export function AdminScreen({
  activeTab,
  onTabPress,
  tabs,
  session,
}: AdminScreenProps) {
  const [stats, setStats] = useState<{
    totalUsuarios: number;
    totalNoticias: number;
    totalPublicadas: number;
    totalRascunhos: number;
    totalTags: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!session?.accessToken) {
        setError("Sessão inválida. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await loadAdminStats(session.accessToken);
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Falha ao carregar métricas do painel.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [session?.accessToken]);

  const statCards = useMemo(() => {
    if (!stats) {
      return [];
    }

    return [
      {
        label: "Total de Usuários",
        value: String(stats.totalUsuarios),
        icon: "users" as const,
      },
      {
        label: "Total de Notícias",
        value: String(stats.totalNoticias),
        icon: "file-text" as const,
      },
      {
        label: "Publicadas",
        value: String(stats.totalPublicadas),
        icon: "check-circle" as const,
      },
      {
        label: "Rascunhos",
        value: String(stats.totalRascunhos),
        icon: "edit-3" as const,
      },
      { label: "Tags", value: String(stats.totalTags), icon: "tag" as const },
    ];
  }, [stats]);

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

          {isLoading ? (
            <View style={styles.feedbackBox}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.feedbackText}>Carregando métricas...</Text>
            </View>
          ) : error ? (
            <View style={styles.feedbackBox}>
              <Feather name="alert-circle" size={16} color="#A33C39" />
              <Text style={styles.feedbackText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.statsGrid}>
              {statCards.map((stat) => (
                <View key={stat.label} style={styles.statCard}>
                  <Feather name={stat.icon} size={16} color={colors.navTint} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          )}

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
  feedbackBox: {
    minHeight: 64,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  feedbackText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
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
