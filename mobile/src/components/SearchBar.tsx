import { Feather } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../theme/tokens";

type SearchBarProps = {
  placeholder?: string;
};

export function SearchBar({
  placeholder = "Buscar notícias...",
}: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <Feather
        name="search"
        size={20}
        color={colors.textMuted}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  icon: {
    position: "absolute",
    left: spacing.md,
    zIndex: 1,
  },
  input: {
    height: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    paddingLeft: 44,
    paddingRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.text,
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
  },
});
