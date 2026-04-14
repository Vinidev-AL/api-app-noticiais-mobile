import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFonts as useExpoFonts } from "expo-font";
import {
  CrimsonPro_600SemiBold,
  useFonts as useCrimsonFonts,
} from "@expo-google-fonts/crimson-pro";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  useFonts as useDMSansFonts,
} from "@expo-google-fonts/dm-sans";
import { HomeScreen } from "./src/screens/HomeScreen";
import { colors } from "./src/theme/tokens";

export default function App() {
  const [iconsLoaded] = useExpoFonts(Feather.font);

  const [dmSansLoaded] = useDMSansFonts({
    DMSans_400Regular,
    DMSans_500Medium,
  });

  const [crimsonLoaded] = useCrimsonFonts({
    CrimsonPro_600SemiBold,
  });

  if (!iconsLoaded || !dmSansLoaded || !crimsonLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color={colors.text} />
      </View>
    );
  }

  return (
    <>
      <HomeScreen />
      <StatusBar style="dark" />
    </>
  );
}
