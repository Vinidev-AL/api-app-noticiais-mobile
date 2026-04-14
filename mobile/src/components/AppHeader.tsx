import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme/tokens";

type AppHeaderProps = {
  title?: string;
};

export function AppHeader({ title = "Notícias" }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontFamily: "CrimsonPro_600SemiBold",
    color: colors.text,
  },
});
