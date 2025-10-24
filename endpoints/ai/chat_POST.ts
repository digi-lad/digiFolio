import { schema } from "./chat_POST.schema";
import superjson from 'superjson';

// Type definition for the Groq API stream chunk
type GroqStreamChunk = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: 'system' | 'user' | 'assistant';
      content?: string;
    };
    finish_reason: string | null;
  }[];
};

export async function handle(request: Request) {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.error("GROQ_API_KEY environment variable is not set.");
    return new Response(superjson.stringify({ error: "Server configuration error: Missing API key." }), { status: 500 });
  }

  try {
    const json = superjson.parse(await request.text());
    const { messages } = schema.parse(json);

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
                model: "openai/gpt-oss-120b",
        stream: true,
      }),
    });

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.text();
      console.error(`Groq API error: ${groqResponse.status} ${groqResponse.statusText}`, errorBody);
      return new Response(superjson.stringify({ error: "Failed to fetch response from AI service.", details: errorBody }), { status: groqResponse.status });
    }

    if (!groqResponse.body) {
        return new Response(superjson.stringify({ error: "AI service returned an empty response body." }), { status: 500 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            // Groq's streaming API sends data in Server-Sent Events (SSE) format.
            // Each event is prefixed with "data: " and ends with "\n\n".
            const lines = chunk.split('\n\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.substring(6); // Remove "data: " prefix
                if (data.trim() === '[DONE]') {
                  break;
                }
                try {
                  const parsed: GroqStreamChunk = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch (e) {
                  console.error("Failed to parse Groq stream chunk:", data, e);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error while reading from Groq stream:", error);
          controller.error(error);
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });

  } catch (error) {
    console.error("Error in /ai/chat endpoint:", error);
    if (error instanceof Error) {
        return new Response(superjson.stringify({ error: error.message }), { status: 400 });
    }
    return new Response(superjson.stringify({ error: "An unknown error occurred." }), { status: 500 });
  }
}