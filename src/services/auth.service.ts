import { apiClient } from './apiClient';
import {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  UserProfile,
} from '@/types/auth';

export async function login(data: LoginPayload): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/users/login', data);
  return response.data;
}

export async function register(data: SignupPayload): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/users/register', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/users/logout');
}

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>('/users/profile');
  return response.data;
}
