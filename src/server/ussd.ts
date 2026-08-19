import { chat } from "./ai";
import { routes } from "@/data/kigali";

export type UssdSession = {
    id: string;
    phone: string;
    state: string;
    data: Record<string, any>;
    language: "en" | "rw";
};

// In-memory session store. In production this would be Redis / DB.
const USSD_SESSIONS = new Map<string, UssdSession>();

// Session timeout (5 minutes)
const SESSION_TTL_MS = 5 * 60 * 1000;
const sessionTimers = new Map<string, ReturnType<typeof setTimeout>>();

function touchSession(id: string) {
    if (sessionTimers.has(id)) clearTimeout(sessionTimers.get(id)!);
    sessionTimers.set(
        id,
        setTimeout(() => {
            USSD_SESSIONS.delete(id);
            sessionTimers.delete(id);
        }, SESSION_TTL_MS),
    );
}

function destroySession(id: string) {
    USSD_SESSIONS.delete(id);
    if (sessionTimers.has(id)) {
        clearTimeout(sessionTimers.get(id)!);
        sessionTimers.delete(id);
    }
}

// ── Menu text by language ──────────────────────────────────────────

const MENU = {
    en: {
        welcome:
            "Welcome to Inzira Navix\n1. Register\n2. Login\n3. Find Route\n4. Plan Trip\n5. My Account\n6. Help\n7. Language",
        enterName: "Enter your full name:",
        enterPin: "Create a 4-digit PIN:",
        accountCreated: (phone: string) => `Account created for ${phone}! Welcome.`,
        loginPin: "Enter your PIN:",
        loginOk: "Login successful!",
        routeStart: "Enter starting location:",
        routeDest: "Enter destination:",
        noRoutes: "No matching routes found.\n0. Back",
        help: "Ask a question, or 0 for main menu:",
        langSelect: "Select language:\n1. English\n2. Kinyarwanda",
        invalid: "Invalid choice. Try again.",
    },
    rw: {
        welcome:
            "Murakaza neza kuri Inzira Navix\n1. Kwiyandikisha\n2. Kwinjira\n3. Gushaka inzira\n4. Gutegura urugendo\n5. Konti yanjye\n6. Ubufasha\n7. Ururimi",
        enterName: "Andika izina ryawe ryose:",
        enterPin: "Kora PIN y'imibare 4:",
        accountCreated: (phone: string) => `Konti yakozwe kuri ${phone}! Murakaza neza.`,
        loginPin: "Andika PIN yawe:",
        loginOk: "Winjiye neza!",
        routeStart: "Andika aho uri:",
        routeDest: "Andika aho ugiye:",
        noRoutes: "Nta nzira zibonetse.\n0. Gusubira inyuma",
        help: "Andika ikibazo cyawe, cyangwa 0 gusubira:",
        langSelect: "Hitamo ururimi:\n1. English\n2. Ikinyarwanda",
        invalid: "Ihitamo ritemewe. Ongera ugerageze.",
    },
};

// ── Main handler ───────────────────────────────────────────────────

export async function handleUssdRequest(
    sessionId: string,
    phoneNumber: string,
    text: string,
) {
    let session = USSD_SESSIONS.get(sessionId);

    if (!session) {
        session = {
            id: sessionId,
            phone: phoneNumber,
            state: "MAIN_MENU",
            data: {},
            language: "en",
        };
        USSD_SESSIONS.set(sessionId, session);
    }

    touchSession(sessionId);

    const inputs = text
        .split("*")
        .map((t) => t.trim())
        .filter(Boolean);
    const lastInput = inputs.length > 0 ? inputs[inputs.length - 1] : "";
    const lang = MENU[session.language];

    let response = "";
    let isTerminal = false;

    const proceed = (t: string) => {
        response = t;
        isTerminal = false;
    };
    const terminate = (t: string) => {
        response = t;
        isTerminal = true;
    };

    switch (session.state) {
        // ── Main menu ────────────────────────────────────────────────
        case "MAIN_MENU":
            if (!lastInput) {
                proceed(lang.welcome);
            } else if (lastInput === "1") {
                session.state = "REGISTER_NAME";
                proceed(lang.enterName);
            } else if (lastInput === "2") {
                session.state = "LOGIN_PIN";
                proceed(lang.loginPin);
            } else if (lastInput === "3") {
                session.state = "ROUTE_START";
                proceed(lang.routeStart);
            } else if (lastInput === "4") {
                session.state = "ROUTE_START";
                proceed(lang.routeStart);
            } else if (lastInput === "5") {
                terminate("Account info: " + phoneNumber);
            } else if (lastInput === "6") {
                session.state = "HELP";
                proceed(lang.help);
            } else if (lastInput === "7") {
                session.state = "LANGUAGE";
                proceed(lang.langSelect);
            } else {
                proceed(lang.invalid + "\n" + lang.welcome);
            }
            break;

        // ── Registration ─────────────────────────────────────────────
        case "REGISTER_NAME":
            session.data.name = lastInput;
            session.state = "REGISTER_PIN";
            proceed(lang.enterPin);
            break;

        case "REGISTER_PIN":
            session.data.pin = lastInput; // In production: hash before storing
            terminate(lang.accountCreated(phoneNumber));
            break;

        // ── Login ────────────────────────────────────────────────────
        case "LOGIN_PIN":
            terminate(lang.loginOk);
            break;

        // ── Route search (uses same data as web) ─────────────────────
        case "ROUTE_START":
            session.data.start = lastInput;
            session.state = "ROUTE_END";
            proceed(lang.routeDest);
            break;

        case "ROUTE_END": {
            session.data.end = lastInput;
            const q1 = session.data.start.toLowerCase();
            const q2 = lastInput.toLowerCase();
            const matches = routes.filter(
                (r) =>
                    r.name.toLowerCase().includes(q1) ||
                    r.name.toLowerCase().includes(q2) ||
                    r.from.toLowerCase().includes(q1) ||
                    r.to.toLowerCase().includes(q2),
            );

            if (matches.length > 0) {
                const list = matches
                    .slice(0, 3)
                    .map((r, i) => `${i + 1}. ${r.number} ${r.name} (${r.fareRwf} RWF)`)
                    .join("\n");
                terminate(`Routes:\n${list}`);
            } else {
                terminate(lang.noRoutes);
            }
            break;
        }

        // ── Help (AI-powered) ────────────────────────────────────────
        case "HELP":
            if (lastInput === "0") {
                session.state = "MAIN_MENU";
                proceed(lang.welcome);
            } else {
                try {
                    const aiRes = await chat({
                        messages: [{ role: "user", content: lastInput }],
                        ussd: true,
                        language: session.language,
                    });
                    terminate(aiRes.reply);
                } catch {
                    terminate("Help is temporarily unavailable. Try again later.");
                }
            }
            break;

        // ── Language selection ────────────────────────────────────────
        case "LANGUAGE":
            if (lastInput === "1") {
                session.language = "en";
            } else if (lastInput === "2") {
                session.language = "rw";
            }
            session.state = "MAIN_MENU";
            proceed(MENU[session.language].welcome);
            break;

        default:
            terminate("Session error. Please try again.");
            break;
    }

    if (isTerminal) {
        destroySession(sessionId);
        return `END ${response}`;
    }
    return `CON ${response}`;
}
