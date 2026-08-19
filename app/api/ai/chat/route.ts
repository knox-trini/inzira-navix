import { NextRequest, NextResponse } from "next/server";
import { chat, type AiMessage } from "@/server/ai";

export const dynamic = "force-dynamic";

/**
 * POST /api/ai/chat
 *
 * Body (JSON):
 *   messages  — array of { role, content }
 *   pathname  — current page (optional, for page-aware AI)
 *   language  — "en" | "rw" etc.
 *   ussd      — boolean (shorter replies)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));

        const messages: AiMessage[] = Array.isArray(body.messages)
            ? body.messages.map((m: any) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: String(m.content ?? ""),
            }))
            : [];

        if (messages.length === 0) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        const result = await chat({
            messages,
            pathname: body.pathname,
            language: body.language,
            ussd: !!body.ussd,
        });

        return NextResponse.json({ reply: result.reply });
    } catch (err: any) {
        console.error("[AI Chat API]", err?.message || err);
        return NextResponse.json(
            { error: "AI service unavailable", reply: "Sorry, I could not process your request right now." },
            { status: 500 },
        );
    }
}
