import { Feather } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../theme/tokens";

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
};

export function SearchBar({
  placeholder = "Buscar notícias...",
  value,
  onChangeText,
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
        value={value}
        onChangeText={onChangeText}
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
