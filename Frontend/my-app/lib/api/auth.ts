import { apiClient } from "./axios";
import { LoginInput, RegisterInput } from "../validations/authSchema";

export type LoginResponse = {
  message: string;
  data: {
    token: string;
    refreshToken: string;
  };
};

export type RegisterResponse = {
  message:string;
  user:{
    email: string;
    name:string
  }
}

export const login = async (credentials: LoginInput): Promise<LoginResponse> => {
  const res = await apiClient.post<LoginResponse>('/api/users/login', credentials);
  return res.data;
};

export const register = async(credentials: RegisterInput): Promise<RegisterResponse> => {
  const res = await apiClient.post<RegisterResponse>('/api/users/register', {name:credentials.name,email:credentials.email,password:credentials.password});
  return res.data;
}

export const logout = async () => {
  await apiClient.post('/api/users/logout');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// add register, refreshToken, etc. similarly
