import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
};

const indianStates = new Set([
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]);

const userColumns = "id, dial_code, phone, name, state, batch_year, profile_completed";
const encoder = new TextEncoder();

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function authenticate(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const secret = Deno.env.get("JWT_SECRET");

  if (!secret || encoder.encode(secret).length < 32) {
    return { error: "Authentication service is not configured.", status: 503 } as const;
  }

  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => !part)) {
    return { error: "Authentication required.", status: 401 } as const;
  }

  try {
    const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0])));
    const claims = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1])));
    if (
      header.alg !== "HS256" ||
      claims.purpose !== "session" ||
      typeof claims.userId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(claims.userId) ||
      !Number.isInteger(claims.exp) ||
      claims.exp <= Math.floor(Date.now() / 1000)
    ) {
      return { error: "Invalid or expired session.", status: 401 } as const;
    }

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(parts[2]),
      encoder.encode(`${parts[0]}.${parts[1]}`),
    );
    if (!valid) {
      return { error: "Invalid or expired session.", status: 401 } as const;
    }
    return { userId: claims.userId } as const;
  } catch {
    return { error: "Invalid or expired session.", status: 401 } as const;
  }
}

function getSupabaseClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase Edge Function is not configured.");
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

function toUser(row: Record<string, unknown>) {
  return {
    id: row.id,
    dialCode: row.dial_code,
    phone: row.phone,
    name: row.name,
    state: row.state,
    batchYear: row.batch_year,
    profile_completed: Boolean(row.profile_completed),
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "GET" && request.method !== "PATCH") {
    return json({ message: "Method not allowed." }, 405);
  }
  if (Number(request.headers.get("content-length") || 0) > 16 * 1024) {
    return json({ message: "Request body is too large." }, 413);
  }

  const auth = await authenticate(request);
  if ("error" in auth) {
    return json({ message: auth.error }, auth.status);
  }

  try {
    const supabase = getSupabaseClient();
    if (request.method === "GET") {
      const { data, error } = await supabase
        .from("users")
        .select(userColumns)
        .eq("id", auth.userId)
        .maybeSingle();
      if (error) {
        console.error("Profile lookup failed:", error.code);
        return json({ message: "Could not load your profile." }, 500);
      }
      if (!data) {
        return json({ message: "Account not found." }, 404);
      }
      return json({ user: toUser(data) });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ message: "Request body must be valid JSON." }, 400);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return json({ message: "Enter a valid name, state, and batch year." }, 400);
    }
    const { name, state, batchYear } = body as Record<string, unknown>;
    const parsedBatchYear =
      typeof batchYear === "number"
        ? batchYear
        : typeof batchYear === "string" && /^\d{4}$/.test(batchYear)
          ? Number(batchYear)
          : Number.NaN;
    const currentYear = new Date().getFullYear();
    if (
      typeof name !== "string" ||
      name.trim().length < 1 ||
      name.trim().length > 100 ||
      typeof state !== "string" ||
      !indianStates.has(state.trim()) ||
      !Number.isInteger(parsedBatchYear) ||
      parsedBatchYear < 2016 ||
      parsedBatchYear > currentYear
    ) {
      return json({ message: "Enter a valid name, state, and batch year." }, 400);
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        name: name.trim(),
        state: state.trim(),
        batch_year: parsedBatchYear,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", auth.userId)
      .select(userColumns)
      .single();
    if (error) {
      console.error("Profile update failed:", error.code);
      return json({ message: "Could not save your profile." }, 500);
    }

    return json({ user: toUser(data) });
  } catch (error) {
    console.error(
      "User profile function failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return json({ message: "Could not process your profile request." }, 500);
  }
});
