import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Ranes AI — the investment intelligence assistant for Ranes Analytics, Africa's data-driven investment research platform based in Nairobi, Kenya.

Your role: Help investors, founders, and analysts understand the African startup and investment ecosystem using verified data.

IMPORTANT RULES:
- Use **bold** for key figures and company names
- Use bullet points for lists
- Always cite sources when available
- Be concise but thorough
- If you don't know something, say so — don't fabricate data
- When presenting data, format it cleanly with clear structure
- When the user asks about trends, compare across years
- Focus on actionable insights, not generic commentary

VERIFIED HISTORICAL DATA (2019–Q1 2026):
ANNUAL: 2019 $2.1B (427 deals) | 2020 $0.9B (359, COVID) | 2021 $4.3B (818, boom, 5 unicorns) | 2022 $5.0B (1034, ALL-TIME PEAK, only region with positive YoY) | 2023 $2.9B (668, -42% funding winter) | 2024 $2.2B (490, -25%) | 2025 $3.2B (~700, +40% rebound) | Q1 2026 $711M (debt 57% — historic first)

KEY FACTS:
- 2022 was Africa's peak: $5.0B, 1034 deals — only region globally with positive YoY growth
- 2023 funding winter: equity fell 60%, US VCs retreated
- 2025 rebound: +40% YoY, Q4 $997M strongest quarter, 8 deals >$100M
- Q1 2026: Debt overtakes equity for first time (57%), Series A down 69%, Series B equity ZERO
- Egypt surged 130% in 2025; IFC led Q1 2026 with 4 deals

LIVE DATABASE CONTEXT (provided below) contains the latest deals, news, and active fundraises.
Use this data to ground your responses. When referencing specific deals, include the source URL if available.`;

async function buildContext(
  supabase: ReturnType<typeof createClient>,
  query: string
) {
  const q = query.toLowerCase();
  const sections: string[] = [];

  // Always include recent deals summary
  const { data: recentDeals } = await supabase
    .from("deals")
    .select("*")
    .order("year", { ascending: false })
    .order("amount", { ascending: false })
    .limit(30);

  if (recentDeals?.length) {
    sections.push(
      "RECENT DEALS:\n" +
        recentDeals
          .map(
            (d: any) =>
              `${d.flag} ${d.company} | ${d.country} | ${d.sector} | ${d.year} ${d.quarter || ""} | $${d.amount}M | ${d.round} | ${d.type} | Investors: ${d.investors || "N/A"} | Source: ${d.url || "N/A"}`
          )
          .join("\n")
    );
  }

  // Sector-specific queries
  if (
    /sector|fintech|energy|logistics|health|agri|ecommerce|saas|edtech|defen/i.test(
      q
    )
  ) {
    const { data: sectorData } = await supabase
      .from("deals")
      .select("sector, type, amount, year")
      .order("year", { ascending: false });

    if (sectorData?.length) {
      const bySector: Record<string, { total: number; count: number }> = {};
      for (const d of sectorData as any[]) {
        if (!bySector[d.sector])
          bySector[d.sector] = { total: 0, count: 0 };
        bySector[d.sector].total += Number(d.amount);
        bySector[d.sector].count++;
      }
      sections.push(
        "SECTOR AGGREGATION (from deal database):\n" +
          Object.entries(bySector)
            .sort((a, b) => b[1].total - a[1].total)
            .map(
              ([s, v]) =>
                `${s}: $${v.total.toFixed(0)}M across ${v.count} deals`
            )
            .join("\n")
      );
    }
  }

  // Country-specific queries
  if (
    /country|nigeria|kenya|egypt|south africa|ghana|morocco|senegal|tanzania/i.test(
      q
    )
  ) {
    const { data: countryData } = await supabase
      .from("deals")
      .select("country, amount, year, sector")
      .order("year", { ascending: false });

    if (countryData?.length) {
      const byCountry: Record<string, { total: number; count: number }> = {};
      for (const d of countryData as any[]) {
        if (!byCountry[d.country])
          byCountry[d.country] = { total: 0, count: 0 };
        byCountry[d.country].total += Number(d.amount);
        byCountry[d.country].count++;
      }
      sections.push(
        "COUNTRY AGGREGATION (from deal database):\n" +
          Object.entries(byCountry)
            .sort((a, b) => b[1].total - a[1].total)
            .map(
              ([c, v]) =>
                `${c}: $${v.total.toFixed(0)}M across ${v.count} deals`
            )
            .join("\n")
      );
    }
  }

  // Active fundraises
  if (/active|fundrais|raising|live|pipeline|opportunity/i.test(q)) {
    const { data: activeDeals } = await supabase
      .from("active_deals")
      .select("*");
    if (activeDeals?.length) {
      sections.push(
        "ACTIVE FUNDRAISES (Q1/Q2 2026):\n" +
          (activeDeals as any[])
            .map(
              (d) =>
                `${d.flag} ${d.company} | ${d.city} | ${d.sector} | ${d.stage} | ${d.range} | Status: ${d.status} | Confidence: ${d.confidence}% | ${d.description}`
            )
            .join("\n")
      );
    }
  }

  // News
  if (/news|latest|headline|update|trend/i.test(q)) {
    const { data: news } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(9);
    if (news?.length) {
      sections.push(
        "LATEST NEWS:\n" +
          (news as any[])
            .map(
              (n) =>
                `[${n.sentiment?.toUpperCase() || "NEUTRAL"}] ${n.title} — ${n.source} (${n.date}) ${n.url || ""}`
            )
            .join("\n")
      );
    }
  }

  return sections.length
    ? "\n\n--- DATABASE CONTEXT ---\n" + sections.join("\n\n")
    : "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build data context from DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const lastUserMsg =
      [...messages].reverse().find((m: any) => m.role === "user")?.content ||
      "";
    const context = await buildContext(supabase, lastUserMsg);

    const systemWithContext = SYSTEM_PROMPT + context;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemWithContext },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit reached. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error:
              "AI usage limit reached. Please add credits to your workspace.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
