import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppTab, BottomTabBar, TabConfig } from "../components/BottomTabBar";
import {
  createNoticia,
  deleteNoticia,
  listAllNoticias,
  publishNoticia,
  SuperadminNoticia,
  unpublishNoticia,
  updateNoticia,
} from "../services/superadmin";
import { AuthSession } from "../types/auth";
import { colors, radius, spacing } from "../theme/tokens";

type FilterType = "all" | "publicadas" | "rascunhos";
type PendingActionType = "publish" | "delete" | null;

type FormState = {
  titulo: string;
  resumo: string;
  texto: string;
  imagem: string;
};

const emptyForm: FormState = {
  titulo: "",
  resumo: "",
  texto: "",
  imagem: "",
};

type MyNewsScreenProps = {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  tabs: TabConfig[];
  session: AuthSession | null;
};

function formatDate(dateLike: string | null) {
  if (!dateLike) {
    return "Sem data";
  }

  const parsed = new Date(dateLike);
  if (Number.isNaN(parsed.getTime())) {
    return "Sem data";
  }

  return parsed.toLocaleDateString("pt-BR");
}

export function MyNewsScreen({
  activeTab,
  onTabPress,
  tabs,
  session,
}: MyNewsScreenProps) {
  const [news, setNews] = useState<SuperadminNoticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [pendingActionType, setPendingActionType] =
    useState<PendingActionType>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<{
    id: string;
    titulo: string;
  } | null>(null);

  const token = session?.accessToken ?? "";
  const isAnyApiActionPending = isSaving || pendingActionId !== null;

  const filteredNews = useMemo(() => {
    if (activeFilter === "publicadas") {
      return news.filter((item) => item.status === "PUBLICADO");
    }

    if (activeFilter === "rascunhos") {
      return news.filter((item) => item.status === "RASCUNHO");
    }

    return news;
  }, [activeFilter, news]);

  const totals = useMemo(() => {
    const publicadas = news.filter(
      (item) => item.status === "PUBLICADO",
    ).length;
    return {
      all: news.length,
      publicadas,
      rascunhos: news.length - publicadas,
    };
  }, [news]);

  const loadNews = async () => {
    if (!token) {
      setIsLoading(false);
      setError("Sessão inválida. Faça login novamente.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await listAllNoticias(token);
      setNews(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao carregar notícias.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadNews();
  }, [token]);

  const upsertNewsItem = (next: SuperadminNoticia) => {
    setNews((prev) => {
      const exists = prev.some((item) => item.id === next.id);
      if (!exists) {
        return [next, ...prev];
      }

      return prev.map((item) => (item.id === next.id ? next : item));
    });
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: SuperadminNoticia) => {
    setEditingId(item.id);
    setForm({
      titulo: item.titulo,
      resumo: item.resumo,
      texto: item.texto,
      imagem: item.imagem ?? "",
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo.trim() || !form.resumo.trim() || !form.texto.trim()) {
      Alert.alert("Validação", "Preencha título, resumo e texto.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        titulo: form.titulo.trim(),
        resumo: form.resumo.trim(),
        texto: form.texto.trim(),
        imagem: form.imagem.trim() || undefined,
      };

      if (editingId) {
        const updated = await updateNoticia(token, editingId, payload);
        upsertNewsItem(updated);
      } else {
        const created = await createNoticia(token, payload);
        upsertNewsItem(created);
      }

      setIsFormOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      Alert.alert(
        "Erro",
        err instanceof Error ? err.message : "Falha ao salvar notícia.",
      );
      await loadNews();
    } finally {
      setIsSaving(false);
    }
  };

  const performDelete = async (id: string) => {
    setPendingActionId(id);
    setPendingActionType("delete");
    try {
      await deleteNoticia(token, id);
      setNews((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      Alert.alert(
        "Erro",
        err instanceof Error ? err.message : "Falha ao excluir notícia.",
      );
      await loadNews();
    } finally {
      setPendingActionId(null);
      setPendingActionType(null);
    }
  };

  const handleDelete = (item: SuperadminNoticia) => {
    setDeleteCandidate({ id: item.id, titulo: item.titulo });
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) {
      return;
    }

    await performDelete(deleteCandidate.id);
    setDeleteCandidate(null);
  };

  const handleTogglePublish = async (item: SuperadminNoticia) => {
    setPendingActionId(item.id);
    setPendingActionType("publish");
    try {
      if (item.status === "PUBLICADO") {
        const updated = await unpublishNoticia(token, item.id);
        upsertNewsItem(updated);
      } else {
        const updated = await publishNoticia(token, item.id);
        upsertNewsItem(updated);
      }
    } catch (err) {
      Alert.alert(
        "Erro",
        err instanceof Error ? err.message : "Falha ao atualizar status.",
      );
      await loadNews();
    } finally {
      setPendingActionId(null);
      setPendingActionType(null);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Feather name="chevron-left" size={20} color={colors.text} />
        <Text style={styles.headerTitle}>Minhas Notícias</Text>
      </View>

      <View style={styles.scrollArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={[
              styles.newButton,
              isAnyApiActionPending && styles.disabledButton,
            ]}
            onPress={handleOpenCreate}
            disabled={isAnyApiActionPending}
          >
            <Feather name="plus" size={16} color={colors.surface} />
            <Text style={styles.newButtonText}>Nova Notícia</Text>
          </Pressable>

          {isFormOpen ? (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {editingId ? "Editar notícia" : "Criar notícia"}
              </Text>
              <TextInput
                style={styles.input}
                value={form.titulo}
                onChangeText={(value) =>
                  setForm((prev) => ({ ...prev, titulo: value }))
                }
                placeholder="Título"
                placeholderTextColor={colors.textMuted}
              />
              <TextInput
                style={styles.input}
                value={form.resumo}
                onChangeText={(value) =>
                  setForm((prev) => ({ ...prev, resumo: value }))
                }
                placeholder="Resumo"
                placeholderTextColor={colors.textMuted}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.texto}
                onChangeText={(value) =>
                  setForm((prev) => ({ ...prev, texto: value }))
                }
                placeholder="Texto completo"
                placeholderTextColor={colors.textMuted}
                multiline
              />
              <TextInput
                style={styles.input}
                value={form.imagem}
                onChangeText={(value) =>
                  setForm((prev) => ({ ...prev, imagem: value }))
                }
                placeholder="URL da imagem (opcional)"
                placeholderTextColor={colors.textMuted}
              />

              <View style={styles.formActions}>
                <Pressable
                  style={[
                    styles.saveButton,
                    isAnyApiActionPending && styles.disabledButton,
                  ]}
                  onPress={handleSave}
                  disabled={isAnyApiActionPending}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  )}
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          <View style={styles.filters}>
            <Pressable
              style={[
                styles.filterPill,
                activeFilter === "all" && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter("all")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "all" && styles.filterTextActive,
                ]}
              >
                Todas ({totals.all})
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterPill,
                activeFilter === "publicadas" && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter("publicadas")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "publicadas" && styles.filterTextActive,
                ]}
              >
                Publicadas ({totals.publicadas})
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterPill,
                activeFilter === "rascunhos" && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter("rascunhos")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "rascunhos" && styles.filterTextActive,
                ]}
              >
                Rascunhos ({totals.rascunhos})
              </Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.feedbackBox}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.feedbackText}>Carregando notícias...</Text>
            </View>
          ) : error ? (
            <View style={styles.feedbackBox}>
              <Feather name="alert-circle" size={16} color="#A33C39" />
              <Text style={styles.feedbackText}>{error}</Text>
            </View>
          ) : filteredNews.length === 0 ? (
            <View style={styles.feedbackBox}>
              <Feather name="inbox" size={16} color={colors.navTint} />
              <Text style={styles.feedbackText}>
                Nenhuma notícia encontrada.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filteredNews.map((item) => {
                const isItemPending = pendingActionId === item.id;
                const isDeletePending =
                  isItemPending && pendingActionType === "delete";
                const isPublishPending =
                  isItemPending && pendingActionType === "publish";

                return (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.cardHead}>
                      <Text style={styles.title}>{item.titulo}</Text>
                      <View
                        style={[
                          styles.badge,
                          item.status === "PUBLICADO"
                            ? styles.published
                            : styles.draft,
                        ]}
                      >
                        <Text style={styles.badgeText}>{item.status}</Text>
                      </View>
                    </View>

                    <Text style={styles.summary}>{item.resumo}</Text>

                    <Text style={styles.metaText}>
                      Criada em {formatDate(item.dataCriacao)}
                    </Text>

                    <View style={styles.cardActions}>
                      <Pressable
                        style={[
                          styles.actionButton,
                          isItemPending && styles.disabledButton,
                        ]}
                        onPress={() => handleOpenEdit(item)}
                        disabled={isItemPending || isSaving}
                      >
                        <Feather name="edit-2" size={14} color={colors.text} />
                        <Text style={styles.actionText}>Editar</Text>
                      </Pressable>

                      <Pressable
                        style={[
                          styles.actionButton,
                          (isItemPending || isAnyApiActionPending) &&
                            styles.disabledButton,
                        ]}
                        onPress={() => handleTogglePublish(item)}
                        disabled={isItemPending || isAnyApiActionPending}
                      >
                        {isPublishPending ? (
                          <ActivityIndicator size="small" color={colors.text} />
                        ) : (
                          <>
                            <Feather
                              name={
                                item.status === "PUBLICADO"
                                  ? "x-circle"
                                  : "check-circle"
                              }
                              size={14}
                              color={colors.text}
                            />
                            <Text style={styles.actionText}>
                              {item.status === "PUBLICADO"
                                ? "Despublicar"
                                : "Publicar"}
                            </Text>
                          </>
                        )}
                      </Pressable>

                      <Pressable
                        style={[
                          styles.deleteButton,
                          (isItemPending || isAnyApiActionPending) &&
                            styles.disabledButton,
                        ]}
                        onPress={() => handleDelete(item)}
                        disabled={isItemPending || isAnyApiActionPending}
                      >
                        {isDeletePending ? (
                          <ActivityIndicator size="small" color="#A33C39" />
                        ) : (
                          <>
                            <Feather name="trash-2" size={14} color="#A33C39" />
                            <Text style={styles.deleteText}>Excluir</Text>
                          </>
                        )}
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
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

      <Modal
        visible={Boolean(deleteCandidate)}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isAnyApiActionPending) {
            setDeleteCandidate(null);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Feather name="alert-triangle" size={18} color="#A33C39" />
            </View>

            <Text style={styles.modalTitle}>Confirmar exclusão</Text>
            <Text style={styles.modalMessage}>
              Esta ação remove a notícia
              {deleteCandidate ? ` \"${deleteCandidate.titulo}\"` : ""} de forma
              permanente.
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={[
                  styles.modalCancelButton,
                  isAnyApiActionPending && styles.disabledButton,
                ]}
                onPress={() => setDeleteCandidate(null)}
                disabled={isAnyApiActionPending}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalConfirmButton,
                  isAnyApiActionPending && styles.disabledButton,
                ]}
                onPress={() => {
                  void handleConfirmDelete();
                }}
                disabled={isAnyApiActionPending}
              >
                {deleteCandidate &&
                pendingActionId === deleteCandidate.id &&
                pendingActionType === "delete" ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Text style={styles.modalConfirmText}>Excluir notícia</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    width: "100%",
    maxWidth: 375,
    alignSelf: "center",
    ...(Platform.OS === "web" ? { height: "100%" as const } : null),
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
    paddingVertical: spacing.lg,
    paddingBottom: 130,
    gap: spacing.md,
  },
  newButton: {
    height: 46,
    borderRadius: radius.lg,
    backgroundColor: "#0A3A52",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  newButtonText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    color: colors.surface,
  },
  formCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.sm,
  },
  formTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 17,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  formActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  saveButton: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: "#0A3A52",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  saveButtonText: {
    color: colors.surface,
    fontFamily: "DMSans_500Medium",
  },
  cancelButton: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  cancelButtonText: {
    color: colors.text,
    fontFamily: "DMSans_500Medium",
  },
  disabledButton: {
    opacity: 0.7,
  },
  filters: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  filterPill: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterPillActive: {
    backgroundColor: colors.text,
  },
  filterText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: colors.chipText,
  },
  filterTextActive: {
    color: colors.surface,
  },
  feedbackBox: {
    minHeight: 72,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  feedbackText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
  list: {
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 19,
    color: colors.text,
  },
  summary: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  metaText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: colors.navTint,
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  published: {
    backgroundColor: "#15603A",
  },
  draft: {
    backgroundColor: "#8A8A86",
  },
  badgeText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 10,
    color: colors.surface,
  },
  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  actionButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: colors.text,
  },
  deleteButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#E0B7B7",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deleteText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "#A33C39",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20, 21, 25, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    width: "100%",
    maxWidth: 330,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  modalIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F6E9E9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 20,
    color: colors.text,
  },
  modalMessage: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  modalCancelButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: {
    fontFamily: "DMSans_500Medium",
    color: colors.text,
  },
  modalConfirmButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.md,
    backgroundColor: "#A33C39",
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmText: {
    fontFamily: "DMSans_500Medium",
    color: colors.surface,
  },
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
