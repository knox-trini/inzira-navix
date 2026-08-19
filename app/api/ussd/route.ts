import { NextRequest, NextResponse } from "next/server";
import { handleUssdRequest } from "@/server/ussd";

export const dynamic = "force-dynamic";

/**
 * POST /api/ussd
 *
 * Generic USSD gateway endpoint.
 * Accepts form-encoded or JSON body with:
 *   sessionId, phoneNumber, text
 *
 * The exact field names can vary per provider (Africa's Talking, Flares,
 * Hdev, etc.). This handler normalises the input so the core USSD
 * service stays provider-agnostic.
 */
export async function POST(req: NextRequest) {
    try {
        let sessionId = "";
        let phoneNumber = "";
        let text = "";

        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("application/x-www-form-urlencoded")) {
            const form = await req.formData();
            sessionId = (form.get("sessionId") as string) ?? "";
            phoneNumber = (form.get("phoneNumber") as string) ?? "";
            text = (form.get("text") as string) ?? "";
        } else {
            const body = await req.json().catch(() => ({}));
            sessionId = body.sessionId ?? body.session_id ?? "";
            phoneNumber = body.phoneNumber ?? body.phone_number ?? body.msisdn ?? "";
            text = body.text ?? body.input ?? "";
        }

        if (!sessionId || !phoneNumber) {
            return new NextResponse("Missing sessionId or phoneNumber", { status: 400 });
        }

        const response = await handleUssdRequest(sessionId, phoneNumber, text);

        // Return plain text — standard for most USSD gateways
        return new NextResponse(response, {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    } catch (err: any) {
        console.error("[USSD] Error:", err?.message || err);
        return new NextResponse("END An error occurred. Please try again.", {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    }
}
