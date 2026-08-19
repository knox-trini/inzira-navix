"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
    BrainCircuit,
    Send,
    X,
    Sparkles,
    HelpCircle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────

type Msg = { role: "user" | "assistant"; content: string };

// ── Suggested questions based on current page ──────────────────────

function getSuggestions(pathname: string): string[] {
    const base = [
        "What can you help me with?",
        "I'm new — guide me through the platform",
    ];

    if (pathname.startsWith("/routes"))
        return ["How do I find a specific route?", "What routes go to Kicukiro?", ...base];
    if (pathname.startsWith("/planner"))
        return ["How do I plan a trip?", "Show me the cheapest route", ...base];
    if (pathname.startsWith("/tracking"))
        return ["How does live tracking work?", ...base];
    if (pathname.startsWith("/tickets"))
        return ["How do I buy a ticket?", ...base];
    if (pathname.startsWith("/analytics"))
        return ["What analytics are available?", ...base];
    if (pathname.startsWith("/predictions"))
        return ["How are predictions calculated?", ...base];
    if (pathname.startsWith("/fleet"))
        return ["What fleet information is shown?", ...base];
    if (pathname.startsWith("/notifications"))
        return ["How do notifications work?", ...base];
    if (pathname.startsWith("/stations"))
        return ["How do I find the nearest station?", ...base];
    if (pathname === "/auth")
        return ["How do I create an account?", "What social logins are supported?", ...base];
    return base;
}

// ── Component ──────────────────────────────────────────────────────

export function AiAssistant() {
    const { t, i18n } = useTranslation();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const suggestions = getSuggestions(pathname);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, open]);

    // Focus input when opened
    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() || loading) return;

            const userMsg: Msg = { role: "user", content: text.trim() };
            const next = [...messages, userMsg];
            setMessages(next);
            setInput("");
            setLoading(true);

            try {
                const res = await fetch("/api/ai/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: next,
                        pathname,
                        language: i18n.language,
                    }),
                });

                const data = await res.json();
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.reply || "Sorry, I couldn't process that." },
                ]);
            } catch {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: "Connection issue. Please try again." },
                ]);
            } finally {
                setLoading(false);
            }
        },
        [messages, loading, pathname, i18n.language],
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    // ── FAB (floating action button) ─────────────────────────────────

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                aria-label="Open AI Assistant"
                className="fixed bottom-6 right-6 z-[9999] grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
                style={{ boxShadow: "0 4px 24px rgba(12,138,122,.35)" }}
            >
                <BrainCircuit className="h-6 w-6" />
            </button>
        );
    }

    // ── Chat panel ───────────────────────────────────────────────────

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex h-[min(580px,85vh)] w-[min(400px,92vw)] flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border/60 bg-primary/5 px-4 py-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <BrainCircuit className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">Inzira AI Assistant</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                        Helping you navigate Kigali transit
                    </p>
                </div>
                <button
                    onClick={() => setOpen(false)}
                    aria-label="Close assistant"
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                    <div className="space-y-4">
                        <div className="text-center pt-4 pb-2">
                            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary mb-3">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-semibold">How can I help you?</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                I know about this page and the whole platform
                            </p>
                        </div>
                        <div className="space-y-2">
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    className="flex w-full items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-left text-xs font-medium transition hover:border-primary/40 hover:bg-muted"
                                >
                                    <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span>{s}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                                }`}
                        >
                            {msg.content.split("\n").map((line, j) => (
                                <p key={j} className={j > 0 ? "mt-1" : ""}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm text-muted-foreground">
                            <span className="ai-dots flex gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border/60 px-3 py-3">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 transition-shadow focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything…"
                        disabled={loading}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
                    >
                        <Send className="h-3.5 w-3.5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
