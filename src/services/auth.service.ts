import { apiClient } from './apiClient';
import {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  UserProfile,
  UpdatePreferencesPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
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

export async function getCurrentUserAvatar(): Promise<string> {
  const response = await apiClient.get('/users/profile/avatar', {
    responseType: 'blob',
  });
  // Cria uma URL temporária para a imagem
  const blob = response.data as Blob;
  return URL.createObjectURL(blob);
}

export async function updateUserPreferences(
  data: UpdatePreferencesPayload
): Promise<UserProfile> {
  const response = await apiClient.patch<UserProfile>(
    '/users/preferences',
    data
  );
  return response.data;
}

export async function updateUserProfile(
  data: UpdateProfilePayload
): Promise<UserProfile> {
  const response = await apiClient.patch<UserProfile>('/users/profile', data);
  return response.data;
}

export async function changePassword(
  data: ChangePasswordPayload
): Promise<void> {
  await apiClient.patch<void>('/users/password', data);
}

export async function updateUserAvatar(file: File): Promise<UserProfile> {
  const form = new FormData();
  form.append('file', file);
  const response = await apiClient.patchForm<UserProfile>(
    '/users/profile/avatar',
    form
  );
  return response.data;
}
