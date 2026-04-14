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

export async function listAllNoticias(token: string) {
  return apiRequest<SuperadminNoticia[]>("/noticias/todas", { token });
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
  const [users, noticias, tags] = await Promise.all([
    apiRequest<Array<{ id: string }>>("/users", { token }),
    listAllNoticias(token),
    apiRequest<Array<{ id: string }>>("/tags", { token }),
  ]);

  const totalPublicadas = noticias.filter(
    (item) => item.status === "PUBLICADO",
  ).length;

  return {
    totalUsuarios: users.length,
    totalNoticias: noticias.length,
    totalPublicadas,
    totalRascunhos: noticias.length - totalPublicadas,
    totalTags: tags.length,
  };
}
