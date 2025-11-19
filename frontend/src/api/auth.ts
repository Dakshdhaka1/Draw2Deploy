import { apiGet, apiPost, getApiErrorMessage } from './client';
import type { ApiResponse } from './client';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ResendPayload = {
  email: string;
};

const RESEND_PATH =
  import.meta.env.VITE_RESEND_ENDPOINT ?? '/api/resend-verification';

// =========================
// LOGIN
// =========================

export const loginUser = async (
  payload: LoginPayload
): Promise<ApiResponse<string>> => {
  try {
    const response = await apiPost<string>('/public/auth/login', payload);

    // 🔥 ALWAYS REPLACE OLD TOKEN
    localStorage.removeItem('d2d_token');
    if (response.data) {
      localStorage.setItem('d2d_token', response.data);
    }

    return response;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// =========================
// REGISTER
// =========================

export const registerUser = async (
  payload: RegisterPayload
): Promise<ApiResponse<Record<string, unknown>>> => {
  try {
    return await apiPost<Record<string, unknown>>(
      '/public/auth/register',
      payload
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// =========================
// RESEND VERIFICATION
// =========================

export const resendVerificationEmail = async (
  payload: ResendPayload
): Promise<ApiResponse<Record<string, unknown>>> => {
  try {
    return await apiPost<Record<string, unknown>>(RESEND_PATH, payload);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// =========================
// VERIFY EMAIL
// =========================

export const verifyUser = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  try {
    const token = localStorage.getItem('d2d_token');
    if (!token) {
      throw new Error('Please log in first to verify your email.');
    }

    return await apiGet<Record<string, unknown>>('/public/auth/verify');
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// =========================
// LOGOUT
// =========================

export const logout = () => {
  localStorage.removeItem('d2d_token');
  window.location.href = '/';
};

// =========================
// GET CURRENT USER INFO (from JWT)
// =========================

export const getCurrentUserEmail = (): string | null => {
  const token = localStorage.getItem('d2d_token');
  if (!token) return null;

  try {
    // Decode JWT to get email (simple base64 decode of payload)
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload.email || payload.sub || null;
  } catch {
    return null;
  }
};
