import { Platform } from "react-native";

function getDefaultBaseUrl() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const host = window.location.hostname || "localhost";
    return `http://${host}:3000/api`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000/api";
  }

  return "http://localhost:3000/api";
}

const DEFAULT_BASE_URL = getDefaultBaseUrl();

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_BASE_URL;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.token
          ? { Authorization: `Bearer ${options.token}` }
          : null),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error(
      `Falha de conexao com a API (${API_BASE_URL}). Verifique se a API esta rodando em /api na porta 3000 ou configure EXPO_PUBLIC_API_URL.`,
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof data?.message === "string" && data.message) ||
      (Array.isArray(data?.message) && data.message.join("; ")) ||
      "Falha na requisicao";
    throw new Error(message);
  }

  return data as T;
}

type UploadOptions = {
  method?: "POST" | "PATCH" | "PUT";
  token?: string;
  body: FormData;
};

export async function uploadRequest<T>(
  path: string,
  options: UploadOptions,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "POST",
      headers: {
        ...(options.token
          ? { Authorization: `Bearer ${options.token}` }
          : null),
      },
      body: options.body,
    });
  } catch {
    throw new Error(
      `Falha de conexao com a API (${API_BASE_URL}). Verifique se a API esta rodando em /api na porta 3000 ou configure EXPO_PUBLIC_API_URL.`,
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof data?.message === "string" && data.message) ||
      (Array.isArray(data?.message) && data.message.join("; ")) ||
      "Falha na requisicao";
    throw new Error(message);
  }

  return data as T;
}
