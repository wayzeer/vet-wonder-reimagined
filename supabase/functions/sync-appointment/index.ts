// Supabase Edge Function: sync-appointment
// Syncs appointment bookings from VetWonder (Supabase) to VetShelter Pro

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const VETSHELTER_API_URL = Deno.env.get("VETSHELTER_API_URL") || "https://vetsheltervetwonder.vercel.app";
const VETSHELTER_API_KEY = Deno.env.get("VETSHELTER_API_KEY");

const ALLOWED_ORIGINS = ['https://vetwonder.es', 'https://www.vetwonder.es'];

function getCorsHeaders(req: Request) {
    const origin = req.headers.get('origin') || '';
    return {
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

interface AppointmentPayload {
    name: string;
    email: string;
    phone?: string;
    preferredDate?: string;
    animalName?: string;
    animalSpecies?: "perro" | "gato" | "otro";
    serviceType?: string;
    message?: string;
    clinicId?: string;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: getCorsHeaders(req),
        });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        if (!VETSHELTER_API_KEY) {
            console.error("VETSHELTER_API_KEY not configured");
            return new Response(
                JSON.stringify({ error: "Server configuration error" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const payload: AppointmentPayload = await req.json();

        // Validate required fields
        if (!payload.name || !payload.email) {
            return new Response(
                JSON.stringify({ error: "Name and email are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Forward to VetShelter Pro API
        const response = await fetch(`${VETSHELTER_API_URL}/api/public/appointment-requests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": VETSHELTER_API_KEY,
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("VetShelter API error:", result);
            return new Response(
                JSON.stringify({
                    error: "Failed to sync appointment",
                    details: result.error
                }),
                {
                    status: response.status,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Appointment synced to VetShelter",
                vetshelterRequestId: result.id,
            }),
            {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                    ...getCorsHeaders(req),
                }
            }
        );

    } catch (error) {
        console.error("Sync appointment error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
});
