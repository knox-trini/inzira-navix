/**
 * Platform knowledge base for the AI assistant.
 *
 * Keeps one structured source of truth about pages, features, USSD commands,
 * and FAQs so the AI can answer questions without giant prompts embedded
 * inside React components.
 *
 * Easy to extend — just add entries to the arrays.
 */

export type KnowledgeEntry = {
    id: string;
    title: string;
    content: string;
    tags: string[];
};

// ── Page descriptions ──────────────────────────────────────────────
export const pages: KnowledgeEntry[] = [
    {
        id: "page-home",
        title: "Home page",
        content:
            "The landing page of Inzira Navix Transit. Shows the hero section, feature highlights, roadmap, and a call to action to sign up or explore routes.",
        tags: ["home", "/", "landing"],
    },
    {
        id: "page-routes",
        title: "Routes page",
        content:
            "Lists all bus routes in Kigali. Users can search by route number, name, or area. Each route shows operator, fare, duration, first/last bus, and stops.",
        tags: ["routes", "/routes", "bus", "search"],
    },
    {
        id: "page-stations",
        title: "Stations page",
        content:
            "Displays all stations and bus stops with their facilities, connected routes, and location on the map.",
        tags: ["stations", "/stations", "stops", "bus stop"],
    },
    {
        id: "page-planner",
        title: "Trip Planner page",
        content:
            "Allows users to plan a trip by selecting origin and destination. The planner suggests routes, estimated time, and fares.",
        tags: ["planner", "/planner", "trip", "plan"],
    },
    {
        id: "page-tracking",
        title: "Live Tracking page",
        content:
            "Shows real-time positions of buses on a map. Users can see ETA and route status.",
        tags: ["tracking", "/tracking", "live", "gps", "map"],
    },
    {
        id: "page-tickets",
        title: "Tickets page",
        content:
            "Users can view their purchased tickets and trip history.",
        tags: ["tickets", "/tickets", "fare", "payment"],
    },
    {
        id: "page-notifications",
        title: "Notifications page",
        content:
            "Shows delays, incidents, and service updates for routes the user follows.",
        tags: ["notifications", "/notifications", "alerts", "updates"],
    },
    {
        id: "page-analytics",
        title: "Analytics page",
        content:
            "Displays transport network analytics — ridership, delays, and performance charts.",
        tags: ["analytics", "/analytics", "charts", "data"],
    },
    {
        id: "page-predictions",
        title: "Predictions page",
        content:
            "AI-powered predictions for ETAs, congestion, and passenger demand.",
        tags: ["predictions", "/predictions", "ai", "eta"],
    },
    {
        id: "page-fleet",
        title: "Fleet page",
        content:
            "Overview of the bus fleet — vehicles, capacity, and status.",
        tags: ["fleet", "/fleet", "bus", "vehicles"],
    },
    {
        id: "page-auth",
        title: "Auth / Account page",
        content:
            "Sign up, sign in, or manage your account. Supports Google, Instagram, LinkedIn, Slack, and WhatsApp social logins.",
        tags: ["auth", "/auth", "login", "signup", "account"],
    },
];

// ── General FAQs ───────────────────────────────────────────────────
export const faqs: KnowledgeEntry[] = [
    {
        id: "faq-find-route",
        title: "How to find a route",
        content:
            "Go to the Routes page or use the Trip Planner. Enter your starting location and destination. The system will suggest matching routes with fare and duration.",
        tags: ["route", "find", "search", "how"],
    },
    {
        id: "faq-ussd",
        title: "What is USSD access",
        content:
            "USSD lets you use Inzira Navix from a basic phone without internet. Dial the USSD code, then follow the text menu to register, find routes, or get help.",
        tags: ["ussd", "basic phone", "no internet"],
    },
    {
        id: "faq-account",
        title: "How to create an account",
        content:
            "Visit the Auth page and choose Sign Up. Enter your full name and a password. You can also sign in with Google, Instagram, LinkedIn, Slack, or WhatsApp.",
        tags: ["account", "signup", "register"],
    },
    {
        id: "faq-fare",
        title: "How much does a bus cost",
        content:
            "Fares vary by route — typically between 200 and 500 RWF. Check the Routes page for exact fares.",
        tags: ["fare", "cost", "price", "rwf"],
    },
    {
        id: "faq-language",
        title: "How to change language",
        content:
            "Use the language selector in the navigation bar. The platform supports English and Kinyarwanda.",
        tags: ["language", "kinyarwanda", "english"],
    },
];

// ── USSD commands reference ────────────────────────────────────────
export const ussdCommands: KnowledgeEntry[] = [
    {
        id: "ussd-menu",
        title: "USSD Main Menu",
        content:
            "1. Register — create a new account\n2. Login — sign in with your PIN\n3. Find Route — search for bus routes\n4. Help — ask the AI assistant",
        tags: ["ussd", "menu"],
    },
];

// ── Utility: search knowledge ──────────────────────────────────────
const allEntries = [...pages, ...faqs, ...ussdCommands];

export function searchKnowledge(query: string, limit = 5): KnowledgeEntry[] {
    const q = query.toLowerCase();
    const scored = allEntries.map((e) => {
        let score = 0;
        if (e.title.toLowerCase().includes(q)) score += 3;
        if (e.content.toLowerCase().includes(q)) score += 2;
        for (const tag of e.tags) {
            if (q.includes(tag) || tag.includes(q)) score += 1;
        }
        return { entry: e, score };
    });

    return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => s.entry);
}

/** Build a context string the AI can use about a given pathname */
export function getPageContext(pathname: string): string | null {
    const page = pages.find((p) => p.tags.includes(pathname));
    if (!page) return null;
    return `The user is currently on the ${page.title} (${pathname}). ${page.content}`;
}
