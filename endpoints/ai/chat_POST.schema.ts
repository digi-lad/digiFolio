import { z } from "zod";
import superjson from 'superjson';

export const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

export const schema = z.object({
  messages: z.array(messageSchema),
});

export type InputType = z.infer<typeof schema>;

// Note: There is no specific OutputType because this endpoint streams a plain text response.
// The client-side helper will return the raw Response object to be processed by the caller.

/**
 * Sends a chat request to the AI endpoint and returns the raw, streamable Response.
 * The caller is responsible for reading the stream from the response body.
 * @param body The chat messages to send.
 * @param init Optional request initializers.
 * @returns A Promise that resolves to the raw Response object.
 */
export const postAiChat = async (body: InputType, init?: RequestInit): Promise<Response> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/_api';
  const validatedInput = schema.parse(body);
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    // Even for a stream, we might get an immediate error (e.g., 400, 500)
    // which will likely have a JSON body. We try to parse it for better error handling.
    try {
        const errorObject = superjson.parse<{ error: string }>(await response.text());
        throw new Error(errorObject.error || "An unknown error occurred during the AI chat request.");
    } catch (e) {
        throw new Error(`AI chat request failed with status ${response.status}.`);
    }
  }

  return response;
};