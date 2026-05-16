"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Bot, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

/** Default model from Puter docs (streaming-friendly). Set `NEXT_PUBLIC_PUTER_CHAT_MODEL` to override. */
const PUTER_CHAT_MODEL: string =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_PUTER_CHAT_MODEL) ||
  "gemini-2.5-flash-lite";

const SYSTEM_PROMPT = `You are a friendly assistant for BookIt, a badminton court booking web app for Tampines, Singapore. Help with how to book courts, profiles, and general questions about using the app. Be concise. You do not have live access to court schedules or user accounts; if asked for real-time availability or personal booking data, explain they should use the app and outline the usual booking steps.`;

type UiMessage = { role: "user" | "assistant"; content: string };

type PuterChatSdk = {
  ai: {
    chat: (
      messages: Array<{ role: string; content: string }>,
      testMode?: boolean,
      options?: { model?: string; stream?: boolean },
    ) => Promise<
      | { message?: { content?: string | Array<{ text?: string }> } }
      | AsyncIterable<{ text?: string }>
    >;
  };
  auth: {
    signIn: (opts?: {
      attempt_temp_user_creation?: boolean;
    }) => Promise<unknown>;
  };
};

function extractReply(
  response: { message?: { content?: string | Array<{ text?: string }> } },
): string {
  const content = response.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const first = content[0];
    if (first && typeof first === "object" && "text" in first && first.text) {
      return String(first.text);
    }
  }
  return "";
}

async function loadPuter(): Promise<PuterChatSdk> {
  const mod = await import("@heyputer/puter.js");
  const puter =
    mod && typeof mod === "object" && "puter" in mod
      ? (mod as { puter: PuterChatSdk }).puter
      : (mod as { default: PuterChatSdk }).default;
  return puter;
}

function isAsyncIterable(v: unknown): v is AsyncIterable<{ text?: string }> {
  return (
    v != null && typeof v === "object" && Symbol.asyncIterator in (v as object)
  );
}

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<PuterChatSdk | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadPuter()
      .then((p) => {
        if (!cancelled) setSdk(p);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load Puter.js. Run npm install.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  const handleSignIn = useCallback(async () => {
    if (!sdk) return;
    setError(null);
    try {
      await sdk.auth.signIn({ attempt_temp_user_creation: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in did not complete.");
    }
  }, [sdk]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || !sdk || busy) return;

    setInput("");
    setError(null);
    setBusy(true);

    const nextTurn: UiMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextTurn);

    const apiMessages: Array<{ role: string; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
      ...nextTurn.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const appendAssistant = (content: string) => {
      setMessages((prev: UiMessage[]) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.role === "assistant") {
          copy[copy.length - 1] = { role: "assistant", content };
        } else {
          copy.push({ role: "assistant", content });
        }
        return copy;
      });
    };

    try {
      const response = await sdk.ai.chat(apiMessages, false, {
        model: PUTER_CHAT_MODEL,
        stream: true,
      });

      if (isAsyncIterable(response)) {
        let accumulated = "";
        for await (const part of response) {
          const piece = part?.text ?? "";
          accumulated += piece;
          appendAssistant(accumulated);
        }
        if (!accumulated) {
          setError("No reply from the model. Try signing in to Puter.");
        }
      } else if (
        response &&
        typeof response === "object" &&
        "message" in response
      ) {
        const reply = extractReply(
          response as { message?: { content?: string } },
        );
        if (reply) {
          setMessages((prev: UiMessage[]) => [
            ...prev,
            { role: "assistant", content: reply },
          ]);
        } else {
          setError("Unexpected response from Puter. Try again.");
        }
      } else {
        setError("Unexpected response from Puter. Try again.");
      }
    } catch (e) {
      setMessages((prev: UiMessage[]) => {
        const next = [...prev];
        if (next[next.length - 1]?.role === "assistant") next.pop();
        const last = next[next.length - 1];
        if (last?.role === "user" && last.content === text) next.pop();
        return next;
      });
      setInput(text);
      const msg = e instanceof Error ? e.message : "Request failed.";
      setError(
        /sign|auth|login|401|403/i.test(msg)
          ? `${msg} Use “Sign in to Puter” below if you have not connected an account yet.`
          : msg,
      );
    } finally {
      setBusy(false);
    }
  }, [sdk, busy, input, messages]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const canSend = Boolean(sdk && input.trim() && !busy);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <Card
          id="ai-chat-widget-panel"
          className="pointer-events-auto flex max-h-[min(70vh,28rem)] w-[min(calc(100vw-2rem),20rem)] flex-col gap-0 overflow-hidden py-0 shadow-lg border-border/80"
        >
          <CardHeader className="shrink-0 gap-1 border-b py-4 pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Assistant</CardTitle>
                <CardDescription>
                  Powered by{" "}
                  <a
                    href="https://developer.puter.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    Puter.js
                  </a>
                  . AI usage is billed to the signed-in Puter user.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 -mt-1 -mr-1 text-muted-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close assistant panel"
                type="button"
              >
                <X className="size-4" />
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              disabled={!sdk}
              onClick={() => void handleSignIn()}
            >
              Sign in to Puter
            </Button>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-2 px-4 py-3">
            <ScrollArea className="h-56 pr-3">
              <div className="space-y-2 text-sm">
                {messages.length === 0 && (
                  <p className="text-muted-foreground leading-relaxed">
                    Ask how booking works or anything else about using BookIt.
                  </p>
                )}
                {messages.map((m: UiMessage, i: number) => (
                  <div
                    key={`${m.role}-${i}-${m.content.slice(0, 12)}`}
                    className={
                      m.role === "user"
                        ? "ml-4 rounded-lg bg-primary/10 px-3 py-2 text-foreground"
                        : "mr-4 rounded-lg border bg-muted/40 px-3 py-2 text-foreground"
                    }
                  >
                    <span className="sr-only">
                      {m.role === "user" ? "You" : "Assistant"}:{" "}
                    </span>
                    <p className="whitespace-pre-wrap break-words">
                      {m.content || (busy && m.role === "assistant" ? "…" : "")}
                    </p>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </ScrollArea>
            {error && (
              <p className="text-destructive text-xs leading-snug" role="alert">
                {error}
              </p>
            )}
            <form
              className="flex shrink-0 gap-2"
              onSubmit={onSubmit}
              aria-label="Send a message"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={
                  sdk ? "Type a message…" : "Loading Puter…"
                }
                disabled={!sdk || busy}
                className="flex-1 bg-background/80"
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={!canSend}
                className="shrink-0"
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      <Button
        type="button"
        size="icon-lg"
        className="pointer-events-auto size-14 rounded-full shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? "ai-chat-widget-panel" : undefined}
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        {open ? <X className="size-6" /> : <Bot className="size-6" />}
      </Button>
    </div>
  );
}
