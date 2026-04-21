import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Modal,
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
import { login, requestPasswordReset, resetPassword, signup } from "../services/auth";
import { uploadAvatar } from "../services/users";
import { API_BASE_URL } from "../services/api";
import { AuthSession, AuthUser } from "../types/auth";
import { colors, radius, spacing } from "../theme/tokens";
import * as ImagePicker from "expo-image-picker";

type ProfileScreenProps = {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  onLoginSuccess: (session: AuthSession) => void;
  onSessionUpdate: (session: AuthSession) => void;
  session: AuthSession | null;
  onLogout: () => void;
  tabs: TabConfig[];
};

export function ProfileScreen({
  activeTab,
  onTabPress,
  onLoginSuccess,
  onSessionUpdate,
  session,
  onLogout,
  tabs,
}: ProfileScreenProps) {
  const resolveAvatarUrl = (avatarUrl?: string | null) => {
    if (!avatarUrl) {
      return null;
    }
    return avatarUrl.startsWith("http") ? avatarUrl : `${API_BASE_URL}${avatarUrl}`;
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [resetHint, setResetHint] = useState<string | null>(null);
  const [isResetLoading, setIsResetLoading] = useState(false);
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

  const handleRequestReset = async () => {
    if (!resetUsername.trim()) {
      showToast("Informe o username para recuperar a senha.", "error");
      return;
    }

    setIsResetLoading(true);
    try {
      const data = await requestPasswordReset(resetUsername.trim());
      setResetHint(`Codigo fixo: ${data.codigo}`);
      showToast("Codigo de recuperacao gerado.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Nao foi possivel gerar o codigo.",
        "error",
      );
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetUsername.trim() || !resetCode.trim() || !resetPasswordValue) {
      showToast("Preencha username, codigo e nova senha.", "error");
      return;
    }

    if (resetPasswordValue.trim().length < 6) {
      showToast("A nova senha precisa ter no minimo 6 caracteres.", "error");
      return;
    }

    setIsResetLoading(true);
    try {
      await resetPassword({
        username: resetUsername.trim(),
        codigo: resetCode.trim(),
        novaSenha: resetPasswordValue,
      });
      showToast("Senha redefinida com sucesso.", "success");
      setIsResetOpen(false);
      setResetHint(null);
      setResetUsername("");
      setResetCode("");
      setResetPasswordValue("");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Nao foi possivel redefinir a senha.",
        "error",
      );
    } finally {
      setIsResetLoading(false);
    }
  };

  const handlePickAvatar = async () => {
    if (!session?.accessToken) {
      showToast("Sessao invalida. Faça login novamente.", "error");
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast("Permissao de galeria negada.", "error");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]?.uri) {
      return;
    }

    setIsAvatarLoading(true);
    try {
      const updated = await uploadAvatar(
        session.accessToken,
        session.user.id,
        result.assets[0].uri,
      );
      onSessionUpdate({
        ...session,
        user: { ...session.user, avatarUrl: updated.avatarUrl ?? null },
      });
      showToast("Foto de perfil atualizada.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Nao foi possivel enviar a foto.",
        "error",
      );
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const renderLoggedState = (user: AuthUser) => (
    <View style={styles.loggedContainer}>
      <View style={styles.userBadge}>
        {resolveAvatarUrl(user.avatarUrl) ? (
          <Image
            source={{ uri: resolveAvatarUrl(user.avatarUrl) ?? "" }}
            style={styles.avatarImage}
          />
        ) : (
          <Feather name="user" size={24} color={colors.surface} />
        )}
      </View>
      <Text style={styles.loggedTitle}>Sessão ativa</Text>
      <Text style={styles.loggedName}>{user.nome}</Text>
      <Text style={styles.loggedMeta}>@{user.username}</Text>
      <Text style={styles.loggedMeta}>Perfil: {user.role}</Text>

      <Pressable
        style={[styles.secondaryAction, isAvatarLoading && styles.disabledButton]}
        onPress={handlePickAvatar}
        disabled={isAvatarLoading}
      >
        <Text style={styles.secondaryActionText}>
          {isAvatarLoading ? "Enviando foto..." : "Atualizar foto de perfil"}
        </Text>
      </Pressable>

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

                <Pressable
                  style={styles.resetButton}
                  onPress={() => setIsResetOpen(true)}
                >
                  <Text style={styles.resetButtonText}>Esqueci minha senha</Text>
                </Pressable>
              </View>

              <View style={styles.demoBox}>
                <Text style={styles.demoTitle}>
                  Demo - use um destes usuários:
                </Text>
                <Text style={styles.demoItem}>• admin / 123456 (SuperAdmin)</Text>
                <Text style={styles.demoItem}>• editor / 123456 (Editor)</Text>
                <Text style={styles.demoItem}>• autor / 123456 (Autor)</Text>
                <Text style={styles.demoItem}>• leitor / 123456 (Leitor)</Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={isResetOpen}
        onRequestClose={() => setIsResetOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Recuperar senha</Text>
            <Text style={styles.modalSubtitle}>
              O codigo e fixo e sera exibido aqui para simulacao.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="username"
              placeholderTextColor={colors.textMuted}
              value={resetUsername}
              onChangeText={setResetUsername}
              autoCapitalize="none"
            />

            <Pressable
              style={[styles.loginButton, isResetLoading && styles.disabledButton]}
              onPress={handleRequestReset}
              disabled={isResetLoading}
            >
              {isResetLoading ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.loginButtonText}>Gerar codigo</Text>
              )}
            </Pressable>

            {resetHint ? (
              <Text style={styles.resetHint}>{resetHint}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="codigo"
              placeholderTextColor={colors.textMuted}
              value={resetCode}
              onChangeText={setResetCode}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="nova senha"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={resetPasswordValue}
              onChangeText={setResetPasswordValue}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.primaryAction, isResetLoading && styles.disabledButton]}
                onPress={handleResetPassword}
                disabled={isResetLoading}
              >
                <Text style={styles.primaryActionText}>Redefinir</Text>
              </Pressable>
              <Pressable
                style={styles.secondaryAction}
                onPress={() => setIsResetOpen(false)}
              >
                <Text style={styles.secondaryActionText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
  resetButton: {
    marginTop: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: colors.textMuted,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 20,
    color: colors.text,
  },
  modalSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: colors.textMuted,
  },
  resetHint: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: colors.text,
  },
  modalActions: {
    gap: spacing.sm,
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
