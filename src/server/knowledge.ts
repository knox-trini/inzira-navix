/**
 * Platform knowledge base for the Inzira AI assistant.
 *
 * Comprehensive knowledge covering the transit platform AND general
 * productivity/planning topics so the AI can handle any question.
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
    tags: ["home", "/", "landing", "main"],
  },
  {
    id: "page-routes",
    title: "Routes page",
    content:
      "Lists all bus routes in Kigali. Users can search by route number, name, or area. Each route shows operator, fare, duration, first/last bus, and stops. Available routes include routes to Nyabugogo, Kimironko, Kanombe, Kicukiro, Remera, Gikondo, and more.",
    tags: ["routes", "/routes", "bus", "search", "line", "path"],
  },
  {
    id: "page-stations",
    title: "Stations page",
    content:
      "Displays all stations and bus stops with their facilities, connected routes, and location on the map. Shows real-time arrivals and ETAs for each station.",
    tags: ["stations", "/stations", "stops", "bus stop", "terminal"],
  },
  {
    id: "page-planner",
    title: "Trip Planner page",
    content:
      "Allows users to plan a trip by selecting origin and destination. The planner suggests routes, estimated time, and fares. Shows multiple route options with transfer points if needed.",
    tags: ["planner", "/planner", "trip", "plan", "journey", "travel"],
  },
  {
    id: "page-tracking",
    title: "Live Tracking page",
    content:
      "Shows real-time positions of buses on a map. Users can see ETA, route status, and bus proximity. Uses GPS data for live updates.",
    tags: ["tracking", "/tracking", "live", "gps", "map", "real-time", "location"],
  },
  {
    id: "page-tickets",
    title: "Tickets page",
    content:
      "Users can view their purchased tickets and trip history. Shows ticket status, route details, and purchase date.",
    tags: ["tickets", "/tickets", "fare", "payment", "purchase", "receipt"],
  },
  {
    id: "page-notifications",
    title: "Notifications page",
    content:
      "Shows delays, incidents, and service updates for routes the user follows. Includes real-time alerts about traffic, detours, and schedule changes.",
    tags: ["notifications", "/notifications", "alerts", "updates", "delays"],
  },
  {
    id: "page-analytics",
    title: "Analytics page",
    content:
      "Displays transport network analytics — ridership trends, delay patterns, and performance charts. Shows historical data and comparisons.",
    tags: ["analytics", "/analytics", "charts", "data", "statistics", "trends"],
  },
  {
    id: "page-predictions",
    title: "Predictions page",
    content:
      "AI-powered predictions for ETAs, congestion levels, and passenger demand. Uses machine learning on historical transit data.",
    tags: ["predictions", "/predictions", "ai", "eta", "forecast", "prediction"],
  },
  {
    id: "page-fleet",
    title: "Fleet page",
    content:
      "Overview of the bus fleet — vehicles, capacity, status (active/idle/maintenance), and operator information.",
    tags: ["fleet", "/fleet", "bus", "vehicles", "capacity"],
  },
  {
    id: "page-auth",
    title: "Auth / Account page",
    content:
      "Sign up, sign in, or manage your account. Supports Google, LinkedIn, Slack social logins plus email/password. Users can view tickets, notifications, and quick tools from their dashboard.",
    tags: ["auth", "/auth", "login", "signup", "account", "register"],
  },
];

// ── General FAQs ───────────────────────────────────────────────────
export const faqs: KnowledgeEntry[] = [
  {
    id: "faq-find-route",
    title: "How to find a route",
    content:
      "Go to the Routes page or use the Trip Planner. Enter your starting location and destination. The system will suggest matching routes with fare and duration. You can also search by route number or area name.",
    tags: ["route", "find", "search", "how", "direction"],
  },
  {
    id: "faq-ussd",
    title: "What is USSD access",
    content:
      "USSD lets you use Inzira Navix from a basic phone without internet. Dial the USSD code, then follow the text menu to register, find routes, or get help. Works on any phone with a SIM card.",
    tags: ["ussd", "basic phone", "no internet", "sms", "code"],
  },
  {
    id: "faq-account",
    title: "How to create an account",
    content:
      "Visit the Auth page and choose Sign Up. Enter your full name, email, and a password (minimum 6 characters). You can also sign in with Google, LinkedIn, or Slack for instant access.",
    tags: ["account", "signup", "register", "create", "new"],
  },
  {
    id: "faq-fare",
    title: "How much does a bus cost",
    content:
      "Fares vary by route — typically between 200 and 500 RWF for standard routes. Express routes may cost more. Check the Routes page for exact fares on your specific route.",
    tags: ["fare", "cost", "price", "rwf", "money", "pay"],
  },
  {
    id: "faq-language",
    title: "How to change language",
    content:
      "Use the language selector in the navigation bar. The platform supports English, Kinyarwanda, and French. Your preference is saved automatically.",
    tags: ["language", "kinyarwanda", "english", "french", "translate"],
  },
  {
    id: "faq-tracking",
    title: "How does live tracking work",
    content:
      "Live tracking uses GPS data from buses to show their real-time position on a map. ETAs are calculated based on current location, traffic conditions, and historical data. Updates refresh every few seconds.",
    tags: ["tracking", "live", "gps", "real-time", "map", "eta"],
  },
  {
    id: "faq-predictions",
    title: "How are predictions calculated",
    content:
      "Predictions use AI/ML models trained on historical transit data. They consider time of day, weather, traffic patterns, and events to forecast ETAs, congestion, and passenger demand.",
    tags: ["predictions", "ai", "machine learning", "forecast", "calculate"],
  },
  {
    id: "faq-planner",
    title: "How to plan a trip",
    content:
      "Go to the Trip Planner page. Enter your origin and destination. The system will suggest the best routes with estimated travel time, fare, and any transfers needed. You can compare multiple options.",
    tags: ["planner", "trip", "plan", "journey", "route", "travel"],
  },
  {
    id: "faq-tickets",
    title: "How to buy a ticket",
    content:
      "Tickets can be purchased through the Tickets page or at station kiosks. Select your route, pay via mobile money or cash, and receive a digital or physical ticket.",
    tags: ["ticket", "buy", "purchase", "pay", "fare"],
  },
  {
    id: "faq-fleet",
    title: "What fleet information is shown",
    content:
      "The Fleet page shows all buses in the network — their operator, capacity, current status (active, idle, or maintenance), and route assignments.",
    tags: ["fleet", "bus", "vehicle", "capacity", "operator"],
  },
];

// ── USSD commands reference ────────────────────────────────────────
export const ussdCommands: KnowledgeEntry[] = [
  {
    id: "ussd-menu",
    title: "USSD Main Menu",
    content:
      "1. Register — create a new account\n2. Login — sign in with your PIN\n3. Find Route — search for bus routes\n4. Plan Trip — get route suggestions\n5. Help — ask the AI assistant",
    tags: ["ussd", "menu", "code", "phone"],
  },
  {
    id: "ussd-register",
    title: "USSD Registration",
    content:
      "Dial the USSD code and select option 1. Enter your name, phone number, and create a 4-digit PIN. You'll receive a confirmation message.",
    tags: ["ussd", "register", "signup", "pin"],
  },
];

// ── General productivity knowledge ─────────────────────────────────
export const productivity: KnowledgeEntry[] = [
  {
    id: "prod-task-organize",
    title: "How to organize tasks",
    content:
      "Break large tasks into smaller actionable steps. Use the Eisenhower matrix: urgent+important first, then important-not-urgent, delegate urgent-not-important, eliminate the rest. Start each day by identifying your top 3 priorities.",
    tags: ["task", "organize", "productivity", "priority", "method"],
  },
  {
    id: "prod-morning-routine",
    title: "Effective morning routine",
    content:
      "A productive morning: 1) Wake at a consistent time, 2) Hydrate and move your body, 3) Review your top 3 priorities for the day, 4) Tackle the hardest task first when energy is highest, 5) Batch similar tasks together.",
    tags: ["morning", "routine", "productivity", "habit", "daily"],
  },
  {
    id: "prod-overwhelm",
    title: "Dealing with overwhelm",
    content:
      "When feeling overwhelmed: 1) Write down everything on your mind (brain dump), 2) Group related items, 3) Identify what's actually urgent vs what feels urgent, 4) Pick just ONE thing to start with, 5) Remember — you don't have to do everything today.",
    tags: ["overwhelm", "stress", "anxiety", "mental", "clarity"],
  },
];

// ── Utility: search knowledge ──────────────────────────────────────
const allEntries = [...pages, ...faqs, ...ussdCommands, ...productivity];

export function searchKnowledge(query: string, limit = 5): KnowledgeEntry[] {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  const scored = allEntries.map((e) => {
    let score = 0;
    const titleLower = e.title.toLowerCase();
    const contentLower = e.content.toLowerCase();

    // Exact title match
    if (titleLower.includes(q)) score += 5;

    // Word-level matching
    for (const word of words) {
      if (titleLower.includes(word)) score += 3;
      if (contentLower.includes(word)) score += 1;
      for (const tag of e.tags) {
        if (tag.includes(word) || word.includes(tag)) score += 2;
      }
    }

    // Full content match bonus
    if (contentLower.includes(q)) score += 2;

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
