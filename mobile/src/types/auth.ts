export type AuthUser = {
  id: string;
  nome: string;
  username: string;
  role: string;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type SignupPayload = {
  nome: string;
  username: string;
  password: string;
};
