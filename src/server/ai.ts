/**
 * Inzira AI — Unified intelligent assistant.
 *
 * Combines the strengths of:
 *   • Saner.AI — task capture, mental overload reduction, natural thought organization
 *   • ChatGPT  — versatile drafting, revision, multi-step reasoning
 *   • Gemini   — multimodal awareness, ecosystem integration, analytical depth
 *   • Claude   — careful reasoning, technical precision, nuanced judgment
 *   • Motion   — scheduling intelligence, conflict resolution, adaptive planning
 *
 * Handles ANY question — transit, productivity, writing, analysis, planning,
 * technical, general knowledge, and more.
 */

import { searchKnowledge, getPageContext } from "./knowledge";

// ── Types ──────────────────────────────────────────────────────────

export type AiMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type AiChatRequest = {
  messages: AiMessage[];
  pathname?: string;
  language?: string;
  ussd?: boolean;
};

export type AiChatResponse = {
  reply: string;
};

// ── Provider detection ─────────────────────────────────────────────

function getApiKey(): string | undefined {
  return process.env.AI_API_KEY;
}

// ── System prompt builder ──────────────────────────────────────────

function buildSystemPrompt(req: AiChatRequest): string {
  const pageCtx = req.pathname ? getPageContext(req.pathname) : null;
  const lastUserMsg =
    [...req.messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const knowledgeHits = searchKnowledge(lastUserMsg, 5);
  const knowledgeBlock = knowledgeHits
    .map((h) => `[${h.title}]: ${h.content}`)
    .join("\n");

  const parts: string[] = [];

  // ── Core identity ──────────────────────────────────────────────
  parts.push(`You are Inzira AI — a unified intelligent assistant that combines the best capabilities of the world's leading AI systems:

PERSONALITY & APPROACH:
• Like Saner.AI: You reduce mental overload. When users share scattered thoughts, you naturally organize them into clear, actionable structure. You capture ideas, break down overwhelm, and help users think clearly.
• Like ChatGPT: You are endlessly versatile. You draft and revise writing, answer questions on any topic, help with research, explain complex ideas simply, and handle multi-step tasks with ease.
• Like Gemini: You connect information across domains. You think analytically, draw from broad knowledge, and help users understand context and nuance. You can handle technical, creative, and analytical tasks equally well.
• Like Claude: You reason carefully and precisely. You think step-by-step through hard problems, give honest and nuanced answers, acknowledge uncertainty, and provide thorough technical help when needed.
• Like Motion: You understand scheduling and planning. You help prioritize tasks, resolve conflicts, plan workflows, and adapt when circumstances change.

CORE RULES:
• Be sensitive to EVERY question — no question is too simple, too complex, too technical, or too off-topic.
• If you don't know something, say so honestly rather than guessing.
• Be concise by default. Expand with detail only when the question warrants it.
• Be warm, approachable, and genuinely helpful — not robotic.
• Never reveal passwords, PINs, API keys, secrets, or internal system details.
• When users express confusion or overwhelm, organize their thoughts for them.
• When users ask for help with tasks, break them into clear next steps.
• When users ask opinion-based questions, give thoughtful perspectives while noting subjectivity.
• Match your response length to the complexity of the question — short for simple, detailed for complex.`);

  // ── Context-specific enhancements ──────────────────────────────
  if (pageCtx) {
    parts.push(`\nUSER'S CURRENT CONTEXT:\n${pageCtx}\nUse this to give page-relevant answers when the question relates to the platform.`);
  }

  if (knowledgeBlock) {
    parts.push(`\nPLATFORM KNOWLEDGE:\n${knowledgeBlock}\nUse this information when answering questions about Inzira Navix Transit. For questions outside this platform, rely on your general knowledge.`);
  }

  // ── Language ───────────────────────────────────────────────────
  if (req.language === "rw") {
    parts.push("\nRespond in Kinyarwanda when the user writes in Kinyarwanda. Otherwise respond in the language the user uses.");
  } else if (req.language === "fr") {
    parts.push("\nRespond in French when the user writes in French. Otherwise respond in the language the user uses.");
  }

  // ── USSD constraint ───────────────────────────────────────────
  if (req.ussd) {
    parts.push("\nThe user is on a basic phone via USSD with no internet. Keep ALL responses under 160 characters. Use numbered lists. Be extremely concise.");
  }

  return parts.join("\n");
}

// ── Built-in fallback (no external API) ────────────────────────────

function fallbackChat(req: AiChatRequest): AiChatResponse {
  const lastUserMsg =
    [...req.messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const q = lastUserMsg.toLowerCase();
  const pageCtx = req.pathname ? getPageContext(req.pathname) : null;
  const hits = searchKnowledge(lastUserMsg, 5);

  // ── Intent detection for fallback ──────────────────────────────
  // Greetings
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|sup|yo|hola|bonjour)/i.test(q.trim())) {
    return {
      reply: "Hello! I'm Inzira AI — your unified assistant. I can help with transit questions, planning tasks, writing, analysis, research, or anything else on your mind. What can I do for you?",
    };
  }

  // Identity questions
  if (/who are you|what are you|what can you do|what is your purpose/i.test(q)) {
    return {
      reply: "I'm Inzira AI — a unified assistant combining the strengths of Saner.AI, ChatGPT, Gemini, Claude, and Motion.\n\nI can help you with:\n• Transit routes, stations, and trip planning\n• Task organization and reducing mental overload\n• Writing, drafting, and editing\n• Research and analysis\n• Scheduling and workflow planning\n• Technical questions and problem-solving\n• General knowledge on any topic\n\nWhat would you like help with?",
    };
  }

  // Task/productivity (Saner.AI + Motion style)
  if (/task|todo|to-do|plan|organize|overwhelm|busy|schedule|priorit|workflow|deadline|reminder/i.test(q)) {
    const transit = hits.length > 0
      ? `\n\nRegarding the platform: ${hits.map((h) => h.content).join(" ")}`
      : "";
    return {
      reply: `Here's how I can help organize that:\n\n1. **Capture** — Tell me what's on your mind, and I'll structure it clearly.\n2. **Prioritize** — I'll help you identify what matters most right now.\n3. **Break down** — Large tasks become smaller, actionable steps.\n4. **Schedule** — I can suggest timing and order based on dependencies.\n5. **Adapt** — When things change, I'll help you reschedule without stress.\n\nShare the details of what you need to organize, and I'll get you clarity.${transit}`,
    };
  }

  // Writing help (ChatGPT + Claude style)
  if (/write|draft|essay|email|letter|report|summary|rewrite|edit|proofread|blog|article|content/i.test(q)) {
    return {
      reply: "I can help with writing! Here's what I can do:\n\n• **Draft** — Give me the topic, audience, and tone, and I'll write it.\n• **Revise** — Paste your text and I'll improve clarity, flow, and impact.\n• **Edit** — I'll check grammar, style, and structure.\n• **Summarize** — Long content distilled to key points.\n• **Rewrite** — Same message, different tone or style.\n\nWhat would you like me to help write or refine?",
    };
  }

  // Research/analysis (Gemini + Claude style)
  if (/research|analy|explain|compare| pros and cons| difference between|why|how does|what is|deep dive/i.test(q)) {
    return {
      reply: "I'd be happy to help research or analyze that. I can:\n\n• **Explain** concepts clearly at any level of detail\n• **Compare** options with pros and cons\n• **Analyze** situations from multiple angles\n• **Research** topics and synthesize findings\n• **Break down** complex topics into understandable parts\n\nShare the specific topic or question, and I'll give you a thorough, well-reasoned response.",
    };
  }

  // Transit-specific answers
  if (hits.length > 0 || pageCtx) {
    let reply = "";
    if (pageCtx) reply += pageCtx + "\n\n";
    if (hits.length > 0) {
      reply += hits.map((h) => `**${h.title}**\n${h.content}`).join("\n\n");
    }
    if (req.ussd && reply.length > 160) reply = reply.slice(0, 155) + "…";
    return { reply: reply.trim() };
  }

  // Generic fallback — be helpful, not deflective
  const generic = req.ussd
    ? "I can help with routes, trips, tasks, writing, or any question. What do you need?"
    : "I'm here to help with anything — transit, tasks, writing, research, planning, or general questions.\n\nYou can ask me things like:\n• \"Plan my day around my bus commute\"\n• \"Help me write a professional email\"\n• \"Explain how bus routes work in Kigali\"\n• \"Organize my to-do list\"\n• \"What's the difference between X and Y?\"\n\nWhat's on your mind?";

  return { reply: generic };
}

// ── External provider call ─────────────────────────────────────────

async function externalChat(req: AiChatRequest): Promise<AiChatResponse> {
  const apiKey = getApiKey()!;
  const systemPrompt = buildSystemPrompt(req);

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...req.messages,
  ];

  const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: req.ussd ? 80 : 1500,
        temperature: 0.7,
      }),
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
