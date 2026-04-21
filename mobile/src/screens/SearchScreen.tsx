import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppHeader } from "../components/AppHeader";
import { AppTab, BottomTabBar, TabConfig } from "../components/BottomTabBar";
import { SearchBar } from "../components/SearchBar";
import { apiRequest } from "../services/api";
import { colors, radius, spacing } from "../theme/tokens";

const searchCategories = [
  "Todas",
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

const PAGE_SIZE = 10;

type PublishedNoticia = {
  id: string;
  titulo: string;
  resumo: string;
  texto: string;
  imagem: string | null;
  autorId: string;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

const categoryKeywords: Record<string, string[]> = {
  Tecnologia: ["tecnologia", "digital", "ia", "inovação", "startup"],
  Política: ["política", "governo", "eleição", "congresso"],
  Economia: ["economia", "mercado", "pib", "inflação", "financeiro"],
  Sustentabilidade: ["sustentabilidade", "clima", "emissões", "ambiental"],
  Brasil: ["brasil", "nacional", "brasileiro"],
  Internacional: ["internacional", "mundo", "global", "externo"],
  Cultura: ["cultura", "arte", "cinema", "música", "literatura"],
  Esportes: ["esporte", "futebol", "atleta", "campeonato"],
  Saúde: ["saúde", "hospital", "medicina", "vacina"],
  Educação: ["educação", "escola", "universidade", "ensino"],
};

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
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [news, setNews] = useState<PublishedNoticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPublishedNews = async (
    nextPage = 1,
    mode: "replace" | "append" = "replace",
  ) => {
    if (mode === "replace") {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(nextPage),
        limit: String(PAGE_SIZE),
      });
      const response = await apiRequest<PaginatedResponse<PublishedNoticia>>(
        `/noticias?${query.toString()}`,
      );
      setPage(response.meta.page);
      setHasMore(response.meta.page < response.meta.totalPages);
      setNews((prev) =>
        mode === "append" ? [...prev, ...response.data] : response.data,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Falha ao carregar notícias publicadas.",
      );
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    void loadPublishedNews(1, "replace");
  }, []);

  const filteredNews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return news.filter((item) => {
      const searchable =
        `${item.titulo} ${item.resumo} ${item.texto}`.toLowerCase();

      const matchesQuery =
        !normalizedQuery ||
        searchable.includes(normalizedQuery) ||
        item.autorId.toLowerCase().includes(normalizedQuery);

      if (!matchesQuery) {
        return false;
      }

      if (selectedCategory === "Todas") {
        return true;
      }

      const keywords = categoryKeywords[selectedCategory] ?? [];
      return keywords.some((keyword) => searchable.includes(keyword));
    });
  }, [news, query, selectedCategory]);

  const handleLoadMore = () => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    void loadPublishedNews(page + 1, "append");
  };

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
          <SearchBar
            placeholder="Buscar por título, tag ou autor..."
            value={query}
            onChangeText={setQuery}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Buscar por categoria</Text>
            <View style={styles.chipsWrap}>
              {searchCategories.map((label) => (
                <Pressable
                  key={label}
                  style={[
                    styles.chip,
                    selectedCategory === label && styles.chipActive,
                  ]}
                  onPress={() => setSelectedCategory(label)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategory === label && styles.chipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {isLoading ? (
            <View style={styles.feedbackState}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.feedbackText}>Carregando notícias...</Text>
            </View>
          ) : error ? (
            <View style={styles.feedbackState}>
              <Feather name="alert-circle" size={20} color="#A33C39" />
              <Text style={styles.feedbackText}>{error}</Text>
            </View>
          ) : filteredNews.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Feather name="search" size={24} color={colors.navTint} />
              </View>
              <Text style={styles.emptyTitle}>Explore as notícias</Text>
              <Text style={styles.emptyText}>
                Use a busca ou selecione uma categoria para começar
              </Text>
            </View>
          ) : (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>
                Resultados ({filteredNews.length})
              </Text>
              <View style={styles.resultsList}>
                {filteredNews.map((item) => (
                  <View key={item.id} style={styles.resultCard}>
                    <Text style={styles.resultTitle}>{item.titulo}</Text>
                    <Text style={styles.resultSummary}>{item.resumo}</Text>
                    <Text style={styles.resultMeta}>Autor: {item.autorId}</Text>
                  </View>
                ))}
              </View>

              {hasMore ? (
                <Pressable
                  style={[
                    styles.loadMoreButton,
                    isLoadingMore && styles.disabledButton,
                  ]}
                  onPress={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <ActivityIndicator size="small" color={colors.text} />
                  ) : (
                    <Text style={styles.loadMoreText}>Carregar mais</Text>
                  )}
                </Pressable>
              ) : null}
            </View>
          )}
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
    ...(Platform.OS === "web"
      ? {
        maxWidth: 375,
        alignSelf: "center" as const,
        height: "100%" as const,
      }
      : null),
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
  chipActive: {
    backgroundColor: colors.text,
  },
  chipText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: colors.chipText,
  },
  chipTextActive: {
    color: colors.surface,
  },
  feedbackState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  feedbackText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 300,
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
  resultsSection: {
    marginTop: spacing.sm,
  },
  resultsTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.md,
  },
  resultsList: {
    gap: spacing.sm,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  resultTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 18,
    color: colors.text,
  },
  resultSummary: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  resultMeta: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: colors.navTint,
  },
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadMoreButton: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  loadMoreText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: colors.text,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
