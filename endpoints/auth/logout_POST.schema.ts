import { z } from "zod";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/_api';

// No input required for logout
export const schema = z.object({});

export type OutputType =
  | {
      success: boolean;
      message: string;
    }
  | {
      error: string;
      message?: string;
    };

export const postLogout = async (
  body: z.infer<typeof schema> = {},
  init?: RequestInit
): Promise<OutputType> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/_api';
  const result = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    body: JSON.stringify(body),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  return result.json();
};
