import { apiRequest } from "./api";
import { AuthSession, LoginPayload, SignupPayload } from "../types/auth";

export function login(payload: LoginPayload) {
  return apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function signup(payload: SignupPayload) {
  return apiRequest<{
    id: string;
    nome: string;
    username: string;
    role: string;
  }>("/auth/cadastro", {
    method: "POST",
    body: payload,
  });
}

export function requestPasswordReset(username: string) {
  return apiRequest<{ message: string; codigo: string }>("/auth/lembrar-senha", {
    method: "POST",
    body: { username },
  });
}

export function resetPassword(payload: {
  username: string;
  codigo: string;
  novaSenha: string;
}) {
  return apiRequest<{ reset: boolean }>("/auth/redefinir-senha", {
    method: "POST",
    body: payload,
  });
}
