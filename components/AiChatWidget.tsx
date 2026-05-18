"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { Bot, Loader2, X } from "lucide-react";

import { useUser } from "@/context/UserContext";
import {
  getAssistantReply,
  WELCOME_MESSAGE,
  type AssistantMessage,
} from "@/lib/chatAssistant";
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

const SUGGESTED_PROMPT = "I need help booking";

export function AiChatWidget() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const welcomed = useRef(false);

  useEffect(() => {
    if (open && !welcomed.current) {
      welcomed.current = true;
      setMessages([WELCOME_MESSAGE]);
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    setInput("");
    setBusy(true);

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    window.setTimeout(() => {
      const reply = getAssistantReply(
        trimmed,
        user?.bookingPreferences ?? null,
      );
      setMessages((prev) => [...prev, reply]);
      setBusy(false);
    }, 450);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <Card
          id="ai-chat-widget-panel"
          className="pointer-events-auto flex max-h-[min(70vh,28rem)] w-[min(calc(100vw-2rem),22rem)] flex-col gap-0 overflow-hidden py-0 shadow-lg border-border/80"
        >
          <CardHeader className="shrink-0 gap-1 border-b py-4 pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Booking assistant</CardTitle>
                <CardDescription>
                  Court picks by your schedule and budget
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
            {!user && (
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Sign in with Singpass for personalised recommendations.
              </p>
            )}
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-2 px-4 py-3">
            <ScrollArea className="h-56 pr-3">
              <div className="space-y-2 text-sm">
                {messages.map((m, i) => (
                  <MessageBubble key={`${m.role}-${i}`} message={m} />
                ))}
                {busy && (
                  <div className="mr-4 flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Thinking…</span>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </ScrollArea>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 text-xs"
              disabled={busy}
              onClick={() => sendMessage(SUGGESTED_PROMPT)}
            >
              Try: “{SUGGESTED_PROMPT}”
            </Button>
            <form
              className="flex shrink-0 gap-2"
              onSubmit={onSubmit}
              aria-label="Send a message"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message…"
                disabled={busy}
                className="flex-1 bg-background/80"
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={busy || !input.trim()}
                className="shrink-0"
              >
                Send
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

function MessageBubble({ message }: { message: AssistantMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={
        isUser
          ? "ml-4 rounded-lg bg-primary/10 px-3 py-2 text-foreground"
          : "mr-4 rounded-lg border bg-muted/40 px-3 py-2 text-foreground"
      }
    >
      <p className="whitespace-pre-wrap break-words">{message.content}</p>
      {message.links && message.links.length > 0 && (
        <ul className="mt-2 space-y-2">
          {message.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-md border border-primary/20 bg-background px-3 py-2 text-sm transition-colors hover:bg-primary/5"
              >
                <span className="font-medium text-primary">{link.label}</span>
                {link.description && (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {link.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
