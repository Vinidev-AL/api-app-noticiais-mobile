import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { AppTab, BottomTabBar, TabConfig } from "../components/BottomTabBar";
import { login, signup } from "../services/auth";
import { AuthSession, AuthUser } from "../types/auth";
import { colors, radius, spacing } from "../theme/tokens";

type ProfileScreenProps = {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  onLoginSuccess: (session: AuthSession) => void;
  session: AuthSession | null;
  onLogout: () => void;
  tabs: TabConfig[];
};

export function ProfileScreen({
  activeTab,
  onTabPress,
  onLoginSuccess,
  session,
  onLogout,
  tabs,
}: ProfileScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (message: string, type: "error" | "success") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2600);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showToast("Informe username e senha.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const session = await login({
        username: username.trim(),
        password,
      });
      showToast(`Bem-vindo, ${session.user.nome}.`, "success");
      onLoginSuccess(session);
      redirectTimeoutRef.current = setTimeout(() => {
        onTabPress("home");
      }, 700);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Nao foi possivel fazer login.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!username.trim() || !password.trim()) {
      showToast("Preencha username e senha para cadastrar.", "error");
      return;
    }

    if (password.trim().length < 6) {
      showToast("A senha precisa ter no minimo 6 caracteres.", "error");
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        nome: username.trim(),
        username: username.trim(),
        password,
      });

      const session = await login({
        username: username.trim(),
        password,
      });

      showToast("Conta criada com sucesso.", "success");
      onLoginSuccess(session);
      redirectTimeoutRef.current = setTimeout(() => {
        onTabPress("home");
      }, 700);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Nao foi possivel cadastrar.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoggedState = (user: AuthUser) => (
    <View style={styles.loggedContainer}>
      <View style={styles.userBadge}>
        <Feather name="user" size={24} color={colors.surface} />
      </View>
      <Text style={styles.loggedTitle}>Sessão ativa</Text>
      <Text style={styles.loggedName}>{user.nome}</Text>
      <Text style={styles.loggedMeta}>@{user.username}</Text>
      <Text style={styles.loggedMeta}>Perfil: {user.role}</Text>

      <Pressable
        style={styles.primaryAction}
        onPress={() => onTabPress("home")}
      >
        <Text style={styles.primaryActionText}>Ir para Início</Text>
      </Pressable>
      <Pressable style={styles.secondaryAction} onPress={onLogout}>
        <Text style={styles.secondaryActionText}>Sair</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.screen}>
      {toast ? (
        <View
          style={[
            styles.toast,
            toast.type === "success" ? styles.toastSuccess : styles.toastError,
          ]}
        >
          <Feather
            name={toast.type === "success" ? "check-circle" : "alert-circle"}
            size={16}
            color={colors.surface}
          />
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      ) : null}

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => onTabPress("home")}>
          <Feather name="chevron-left" size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Entrar</Text>
      </View>

      <View style={styles.scrollArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {session ? (
            renderLoggedState(session.user)
          ) : (
            <>
              <View style={styles.hero}>
                <View style={styles.logoWrap}>
                  <Feather
                    name="message-circle"
                    size={28}
                    color={colors.surface}
                  />
                </View>
                <Text style={styles.title}>Notícias Colaborativas</Text>
                <Text style={styles.subtitle}>
                  Entre para continuar lendo e participando
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="seu_usuario"
                    placeholderTextColor={colors.textMuted}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Senha</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
                <Pressable
                  style={[
                    styles.loginButton,
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <Text style={styles.loginButtonText}>Entrar</Text>
                  )}
                </Pressable>
                <Pressable
                  style={[
                    styles.signupButton,
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={handleSignup}
                  disabled={isLoading}
                >
                  <Text style={styles.signupButtonText}>
                    Não tem conta? Cadastre-se
                  </Text>
                </Pressable>
              </View>

              <View style={styles.demoBox}>
                <Text style={styles.demoTitle}>
                  Demo - use um destes usuários:
                </Text>
                <Text style={styles.demoItem}>• admin - SuperAdmin</Text>
                <Text style={styles.demoItem}>• editor - Editor</Text>
                <Text style={styles.demoItem}>• autor - Autor</Text>
                <Text style={styles.demoItem}>• leitor - Leitor</Text>
              </View>
            </>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 20,
    color: colors.text,
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
  hero: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0A3A52",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: "CrimsonPro_700Bold",
    fontSize: 30,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
    color: "#6B6B6B",
    textAlign: "center",
  },
  form: {
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    height: 50,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
  },
  loginButton: {
    marginTop: spacing.sm,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: "#0A3A52",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 16,
    color: colors.surface,
  },
  signupButton: {
    marginTop: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#0A3A52",
  },
  disabledButton: {
    opacity: 0.7,
  },
  toast: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 20,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  toastSuccess: {
    backgroundColor: "#15603A",
  },
  toastError: {
    backgroundColor: "#A33232",
  },
  toastText: {
    flex: 1,
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: colors.surface,
  },
  demoBox: {
    backgroundColor: colors.chip,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  demoTitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#6B6B6B",
  },
  demoItem: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: colors.text,
  },
  loggedContainer: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  userBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0A3A52",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  loggedTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 24,
    color: colors.text,
  },
  loggedName: {
    fontFamily: "DMSans_500Medium",
    fontSize: 18,
    color: colors.text,
  },
  loggedMeta: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
  },
  primaryAction: {
    marginTop: spacing.md,
    width: "100%",
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: "#0A3A52",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 16,
    color: colors.surface,
  },
  secondaryAction: {
    width: "100%",
    height: 44,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: colors.text,
  },
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
