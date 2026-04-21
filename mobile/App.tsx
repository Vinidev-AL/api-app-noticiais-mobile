import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts as useExpoFonts } from "expo-font";
import {
  CrimsonPro_600SemiBold,
  CrimsonPro_700Bold,
  useFonts as useCrimsonFonts,
} from "@expo-google-fonts/crimson-pro";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  useFonts as useDMSansFonts,
} from "@expo-google-fonts/dm-sans";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import {
  AppTab,
  DEFAULT_TABS,
  SUPERADMIN_TABS,
} from "./src/components/BottomTabBar";
import { AuthSession } from "./src/types/auth";
import {
  clearStoredSession,
  getStoredSession,
  storeSession,
} from "./src/services/session";
import { colors } from "./src/theme/tokens";
import { AdminScreen } from "./src/screens/AdminScreen";
import { MyNewsScreen } from "./src/screens/MyNewsScreen";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [appToast, setAppToast] = useState<string | null>(null);
  const appToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [iconsLoaded] = useExpoFonts(Feather.font);

  const [dmSansLoaded] = useDMSansFonts({
    DMSans_400Regular,
    DMSans_500Medium,
  });

  const [crimsonLoaded] = useCrimsonFonts({
    CrimsonPro_600SemiBold,
    CrimsonPro_700Bold,
  });

  useEffect(() => {
    const loadSession = async () => {
      const stored = await getStoredSession();
      setSession(stored);
      setIsSessionReady(true);
    };

    void loadSession();
  }, []);

  useEffect(() => {
    return () => {
      if (appToastTimeoutRef.current) {
        clearTimeout(appToastTimeoutRef.current);
      }
    };
  }, []);

  const showAppToast = (message: string) => {
    if (appToastTimeoutRef.current) {
      clearTimeout(appToastTimeoutRef.current);
    }

    setAppToast(message);
    appToastTimeoutRef.current = setTimeout(() => {
      setAppToast(null);
    }, 2200);
  };

  const isSuperAdmin = session?.user.role === "SUPERADMIN";
  const visibleTabs = isSuperAdmin ? SUPERADMIN_TABS : DEFAULT_TABS;

  const handleLoginSuccess = async (nextSession: AuthSession) => {
    setSession(nextSession);
    await storeSession(nextSession);
  };

  const handleSessionUpdate = async (nextSession: AuthSession) => {
    setSession(nextSession);
    await storeSession(nextSession);
  };

  const handleLogout = async () => {
    setSession(null);
    await clearStoredSession();
    setActiveTab("home");
    showAppToast("Sessão encerrada com sucesso.");
  };

  const handleTabPress = (tab: AppTab) => {
    if ((tab === "search" || tab === "create" || tab === "admin") && !session) {
      setActiveTab("profile");
      return;
    }

    if ((tab === "create" || tab === "admin") && !isSuperAdmin) {
      setActiveTab("home");
      return;
    }

    setActiveTab(tab);
  };

  useEffect(() => {
    if ((activeTab === "create" || activeTab === "admin") && !isSuperAdmin) {
      setActiveTab("home");
    }
  }, [activeTab, isSuperAdmin]);

  if (!iconsLoaded || !dmSansLoaded || !crimsonLoaded || !isSessionReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color={colors.text} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.appRoot} edges={["top", "left", "right"]}>
        {appToast ? (
          <View style={styles.appToast}>
            <Feather name="check-circle" size={16} color={colors.surface} />
            <Text style={styles.appToastText}>{appToast}</Text>
          </View>
        ) : null}

        {activeTab === "search" ? (
          <SearchScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            tabs={visibleTabs}
          />
        ) : activeTab === "create" ? (
          <MyNewsScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            tabs={visibleTabs}
            session={session}
          />
        ) : activeTab === "admin" ? (
          <AdminScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            tabs={visibleTabs}
            session={session}
          />
        ) : activeTab === "profile" ? (
          <ProfileScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            onLoginSuccess={handleLoginSuccess}
            onSessionUpdate={handleSessionUpdate}
            session={session}
            onLogout={handleLogout}
            tabs={visibleTabs}
          />
        ) : (
          <HomeScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            tabs={visibleTabs}
          />
        )}
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appToast: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    zIndex: 30,
    borderRadius: 12,
    backgroundColor: "#15603A",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appToastText: {
    flex: 1,
    color: colors.surface,
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
  },
});
