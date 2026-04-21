import { apiRequest } from "./api";

type NoticiaStatus = "RASCUNHO" | "PUBLICADO";

export type SuperadminNoticia = {
  id: string;
  titulo: string;
  imagem: string | null;
  resumo: string;
  texto: string;
  autorId: string;
  status: NoticiaStatus;
  dataCriacao: string;
  dataPublicacao: string | null;
};

export type NoticiaPayload = {
  titulo: string;
  imagem?: string;
  resumo: string;
  texto: string;
};

export type AdminStats = {
  totalUsuarios: number;
  totalNoticias: number;
  totalPublicadas: number;
  totalRascunhos: number;
  totalTags: number;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  totalPublicadas?: number;
  totalRascunhos?: number;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export async function listAllNoticias(
  token: string,
  params?: { page?: number; limit?: number },
) {
  const query = new URLSearchParams();
  if (params?.page) {
    query.set("page", String(params.page));
  }
  if (params?.limit) {
    query.set("limit", String(params.limit));
  }

  const path = query.toString()
    ? `/noticias/todas?${query.toString()}`
    : "/noticias/todas";

  return apiRequest<PaginatedResponse<SuperadminNoticia>>(path, { token });
}

export async function createNoticia(token: string, payload: NoticiaPayload) {
  return apiRequest<SuperadminNoticia>("/noticias", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function updateNoticia(
  token: string,
  id: string,
  payload: Partial<NoticiaPayload>,
) {
  return apiRequest<SuperadminNoticia>(`/noticias/${id}`, {
    method: "PUT",
    token,
    body: payload,
  });
}

export async function deleteNoticia(token: string, id: string) {
  return apiRequest<{ deleted: boolean }>(`/noticias/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function publishNoticia(token: string, id: string) {
  return apiRequest<SuperadminNoticia>(`/noticias/${id}/publicar`, {
    method: "PATCH",
    token,
  });
}

export async function unpublishNoticia(token: string, id: string) {
  return apiRequest<SuperadminNoticia>(`/noticias/${id}/despublicar`, {
    method: "PATCH",
    token,
  });
}

export async function loadAdminStats(token: string): Promise<AdminStats> {
  const [users, noticiasPage, tags] = await Promise.all([
    apiRequest<Array<{ id: string }>>("/users", { token }),
    listAllNoticias(token, { page: 1, limit: 1 }),
    apiRequest<Array<{ id: string }>>("/tags", { token }),
  ]);

  return {
    totalUsuarios: users.length,
    totalNoticias: noticiasPage.meta.total,
    totalPublicadas: noticiasPage.meta.totalPublicadas ?? 0,
    totalRascunhos: noticiasPage.meta.totalRascunhos ?? 0,
    totalTags: tags.length,
  };
}
