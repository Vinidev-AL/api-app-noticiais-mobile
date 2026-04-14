import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { categories, latestNews } from "../data/homeFeed";
import { AppHeader } from "../components/AppHeader";
import { AppTab, BottomTabBar, TabConfig } from "../components/BottomTabBar";
import { CategorySection } from "../components/CategorySection";
import { LatestNewsSection } from "../components/LatestNewsSection";
import { SearchBar } from "../components/SearchBar";
import { colors, spacing } from "../theme/tokens";

type HomeScreenProps = {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  tabs: TabConfig[];
};

export function HomeScreen({ activeTab, onTabPress, tabs }: HomeScreenProps) {
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
          <LatestNewsSection title="Últimas notícias" items={latestNews} />
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
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
