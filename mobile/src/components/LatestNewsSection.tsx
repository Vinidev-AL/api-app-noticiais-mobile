import { StyleSheet, Text, View } from "react-native";
import { NewsItem } from "../types/news";
import { NewsCard } from "./NewsCard";
import { colors, spacing } from "../theme/tokens";

type LatestNewsSectionProps = {
  title: string;
  items: NewsItem[];
};

export function LatestNewsSection({ title, items }: LatestNewsSectionProps) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View>
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.md,
  },
});
