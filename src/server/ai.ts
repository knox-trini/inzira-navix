/**
 * AI service abstraction.
 *
 * All AI functionality is routed through this module so the provider
 * (OpenAI, Google, Anthropic, local model, etc.) can be swapped without
 * touching the rest of the codebase.
 *
 * Right now we ship a **built-in fallback** that uses the knowledge base
 * to answer questions when no external AI provider is configured.
 * Once you add an AI_API_KEY to .env the service will call the real
 * provider instead.
 */

import { searchKnowledge, getPageContext } from "./knowledge";

// ── Types ──────────────────────────────────────────────────────────

export type AiMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

export type AiChatRequest = {
    messages: AiMessage[];
    /** Current page pathname so the AI can be page-aware */
    pathname?: string;
    /** Language preference */
    language?: string;
    /** Whether the request comes from USSD (shorter answers) */
    ussd?: boolean;
};

export type AiChatResponse = {
    reply: string;
};

// ── Provider detection ─────────────────────────────────────────────

function getApiKey(): string | undefined {
    return process.env.AI_API_KEY;
}

// ── Built-in fallback (no external API needed) ─────────────────────

function fallbackChat(req: AiChatRequest): AiChatResponse {
    const lastUserMsg =
        [...req.messages].reverse().find((m) => m.role === "user")?.content ?? "";

    // Page-aware context
    const pageCtx = req.pathname ? getPageContext(req.pathname) : null;

    // Search knowledge base
    const hits = searchKnowledge(lastUserMsg, 3);

    if (hits.length === 0 && !pageCtx) {
        const generic = req.ussd
            ? "I can help you with routes, trips, and account questions. Try asking about a specific topic."
            : "I'm the Inzira Navix assistant. I can help you with:\n\n• Finding routes and stations\n• Planning trips\n• Understanding fares\n• Navigating the platform\n• USSD access from basic phones\n\nWhat would you like to know?";
        return { reply: generic };
    }

    let reply = "";

    if (pageCtx) {
        reply += pageCtx + "\n\n";
    }

    if (hits.length > 0) {
        reply += hits.map((h) => `**${h.title}**\n${h.content}`).join("\n\n");
    }

    // If USSD, trim to shorter answer
    if (req.ussd && reply.length > 160) {
        reply = reply.slice(0, 155) + "…";
    }

    return { reply: reply.trim() };
}

// ── External provider call (placeholder) ───────────────────────────

async function externalChat(req: AiChatRequest): Promise<AiChatResponse> {
    const apiKey = getApiKey()!;

    // Build system prompt with knowledge context
    const pageCtx = req.pathname ? getPageContext(req.pathname) : "";
    const lastUserMsg =
        [...req.messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const knowledgeHits = searchKnowledge(lastUserMsg, 5);
    const knowledgeBlock = knowledgeHits
        .map((h) => `[${h.title}]: ${h.content}`)
        .join("\n");

    const systemPrompt = [
        "You are the Inzira Navix Transit AI assistant for Kigali's public transport.",
        "Be helpful, concise, and friendly.",
        req.ussd
            ? "The user is on a basic phone via USSD. Keep responses under 160 characters. Use numbered lists."
            : "",
        req.language === "rw" ? "Respond in Kinyarwanda." : "",
        pageCtx ? `Current page context: ${pageCtx}` : "",
        knowledgeBlock ? `Platform knowledge:\n${knowledgeBlock}` : "",
        "Never reveal passwords, PINs, API keys, or secrets.",
        "Follow the same authorization rules as the application.",
    ]
        .filter(Boolean)
        .join("\n");

    const messages = [
        { role: "system" as const, content: systemPrompt },
        ...req.messages,
    ];

    // ── Generic OpenAI-compatible call ──
    const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.AI_MODEL || "gpt-4o-mini";

    try {
        const res = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ model, messages, max_tokens: req.ussd ? 80 : 1024 }),
        });

        if (!res.ok) {
            console.error("[AI] Provider error:", res.status, await res.text());
            return fallbackChat(req);
        }

        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content ?? "";
        return { reply: reply || fallbackChat(req).reply };
    } catch (err: any) {
        console.error("[AI] Fetch error:", err?.message || err);
        return fallbackChat(req);
    }
}

// ── Public API ─────────────────────────────────────────────────────

export async function chat(req: AiChatRequest): Promise<AiChatResponse> {
    if (getApiKey()) {
        return externalChat(req);
    }
    return fallbackChat(req);
}
