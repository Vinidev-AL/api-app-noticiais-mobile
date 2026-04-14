import { Feather } from "@expo/vector-icons";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppTab, BottomTabBar, TabConfig } from "../components/BottomTabBar";
import { colors, radius, spacing } from "../theme/tokens";

const myNews = [
  {
    id: "1",
    title: "Tecnologia revoluciona o mercado de trabalho brasileiro",
    summary:
      "Inteligência artificial e automação transformam profissões tradicionais.",
    status: "PUBLICADO",
    tags: ["Tecnologia", "Mercado"],
    time: "Há 2 dias",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "O futuro da energia renovável no Brasil",
    summary: "País investe em fontes limpas para alcançar metas climáticas.",
    status: "RASCUNHO",
    tags: ["Sustentabilidade", "Energia"],
    time: "Há 1 hora",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
  },
];

type MyNewsScreenProps = {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  tabs: TabConfig[];
};

export function MyNewsScreen({
  activeTab,
  onTabPress,
  tabs,
}: MyNewsScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Feather name="chevron-left" size={20} color={colors.text} />
        <Text style={styles.headerTitle}>Minhas Notícias</Text>
      </View>

      <View style={styles.scrollArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.newButton}>
            <Feather name="plus" size={16} color={colors.surface} />
            <Text style={styles.newButtonText}>Nova Notícia</Text>
          </View>

          <View style={styles.filters}>
            <View style={[styles.filterPill, styles.filterPillActive]}>
              <Text style={[styles.filterText, styles.filterTextActive]}>
                Todas (2)
              </Text>
            </View>
            <View style={styles.filterPill}>
              <Text style={styles.filterText}>Publicadas (1)</Text>
            </View>
            <View style={styles.filterPill}>
              <Text style={styles.filterText}>Rascunhos (1)</Text>
            </View>
          </View>

          <View style={styles.list}>
            {myNews.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.imageWrap}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View
                    style={[
                      styles.badge,
                      item.status === "PUBLICADO"
                        ? styles.published
                        : styles.draft,
                    ]}
                  >
                    <Text style={styles.badgeText}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.tagRow}>
                    {item.tags.map((tag) => (
                      <View key={tag} style={styles.tagPill}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.summary}>{item.summary}</Text>

                  <View style={styles.metaRow}>
                    <Text style={styles.author}>Por Você</Text>
                    <View style={styles.timeWrap}>
                      <Feather name="clock" size={12} color={colors.navTint} />
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
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
    paddingVertical: spacing.lg,
    paddingBottom: 130,
    gap: spacing.md,
  },
  newButton: {
    height: 46,
    borderRadius: radius.lg,
    backgroundColor: "#0A3A52",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  newButtonText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    color: colors.surface,
  },
  filters: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  filterPill: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterPillActive: {
    backgroundColor: colors.text,
  },
  filterText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: colors.chipText,
  },
  filterTextActive: {
    color: colors.surface,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  imageWrap: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
  },
  badge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  published: {
    backgroundColor: "#15603A",
  },
  draft: {
    backgroundColor: "#8A8A86",
  },
  badgeText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 10,
    color: colors.surface,
  },
  cardBody: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  tagRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  tagPill: {
    borderRadius: radius.pill,
    backgroundColor: colors.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    color: colors.chipText,
  },
  title: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 20,
    color: colors.text,
  },
  summary: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: colors.text,
  },
  timeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  time: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: colors.navTint,
  },
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
