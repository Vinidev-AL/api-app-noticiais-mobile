import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme/tokens";

export function AppHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notícias</Text>
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
