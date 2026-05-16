"use client";

import { useState } from "react";
import { Bot, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * Floating assistant shell — wire `puter.ai.chat` (or other APIs) here later.
 * Puter.js: https://developer.puter.com/
 */
export function AiChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <Card
          id="ai-chat-widget-panel"
          className="pointer-events-auto w-[min(calc(100vw-2rem),20rem)] gap-0 py-0 shadow-lg border-border/80"
        >
          <CardHeader className="gap-1 border-b py-4 pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Assistant</CardTitle>
                <CardDescription>
                  Booking help via AI — hook up Puter.js when you are ready.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 -mt-1 -mr-1 text-muted-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close assistant panel"
              >
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-4 py-4">
            <div
              className="bg-muted/60 text-muted-foreground min-h-[7.5rem] rounded-lg border border-dashed p-3 text-sm leading-relaxed"
              role="region"
              aria-label="Chat messages"
            >
              Messages will appear here once you connect the chat backend
              (for example Puter.js <code className="text-foreground/80 text-xs">puter.ai.chat</code>
              ).
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Message form (not wired yet)"
            >
              <Input
                placeholder="Type a message…"
                disabled
                className="flex-1 bg-background/80"
                aria-disabled="true"
              />
              <Button type="submit" disabled className="shrink-0">
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
