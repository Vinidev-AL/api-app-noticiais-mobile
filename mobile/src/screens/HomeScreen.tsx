import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { categories } from "../data/homeFeed";
import { AppHeader } from "../components/AppHeader";
import { AppTab, BottomTabBar, TabConfig } from "../components/BottomTabBar";
import { CategorySection } from "../components/CategorySection";
import { LatestNewsSection } from "../components/LatestNewsSection";
import { SearchBar } from "../components/SearchBar";
import { colors, spacing } from "../theme/tokens";
import { apiRequest } from "../services/api";
import { NewsItem } from "../types/news";

type HomeScreenProps = {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  tabs: TabConfig[];
};

type PublishedNoticia = {
  id: string;
  titulo: string;
  resumo: string;
  texto: string;
  imagem: string | null;
  autorId: string;
  autorNome: string | null;
  autorUsername: string | null;
  dataPublicacao: string | null;
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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80";

export function HomeScreen({ activeTab, onTabPress, tabs }: HomeScreenProps) {
  const [latestItems, setLatestItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLatest = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiRequest<PaginatedResponse<PublishedNoticia>>(
          "/noticias?page=1&limit=6",
        );

        const mapped = response.data.map((item) => {
          const publishedAt = item.dataPublicacao
            ? new Date(item.dataPublicacao).toLocaleDateString("pt-BR")
            : "Sem data";
          const author = item.autorNome ?? item.autorUsername ?? "Autor";

          return {
            id: item.id,
            title: item.titulo,
            summary: item.resumo,
            author,
            publishedAt,
            tags: [],
            imageUrl: item.imagem ?? FALLBACK_IMAGE,
          } as NewsItem;
        });

        setLatestItems(mapped);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Falha ao carregar noticias publicadas.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadLatest();
  }, []);

  return (
    <View style={styles.screen}>
      <AppHeader />

      <View style={styles.scrollArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <SearchBar />
          <CategorySection title="Por categoria" categories={categories} />
          {isLoading ? (
            <View style={styles.feedbackBox}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.feedbackText}>Carregando notícias...</Text>
            </View>
          ) : error ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackText}>{error}</Text>
            </View>
          ) : latestItems.length === 0 ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackText}>Nenhuma notícia publicada.</Text>
            </View>
          ) : (
            <LatestNewsSection title="Últimas notícias" items={latestItems} />
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
  feedbackBox: {
    marginTop: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  feedbackText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
