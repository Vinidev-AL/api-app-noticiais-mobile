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
