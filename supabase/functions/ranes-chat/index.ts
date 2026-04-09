import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_SYS = `You are Ranes AI — investment intelligence assistant for Ranes Analytics (Nairobi, Kenya).

VERIFIED HISTORICAL DATA (Sources: Africa:The Big Deal, Partech, Disrupt Africa, TechCabal Insights, Condia, LaunchBase Africa):

ANNUAL TOTALS:
2019: $2.1B, 427 deals | 2020: $0.9B, 359 deals (COVID) | 2021: $4.3B, 818 deals (boom; OPay $400M; 5 unicorns) | 2022: $5.0B, 1034 deals (ALL-TIME PEAK; only region with positive YoY) | 2023: $2.9B, 668 deals (-42% funding winter; equity -60%) | 2024: $2.2B, 490 deals (-25% continued decline) | 2025: $3.2B, ~700 deals (+40% rebound, strongest since 2022; Q4 $997M) | Q1 2026: $711M, 59-80 deals (debt 57% of capital — historic first)

KEY COUNTRY DATA:
Nigeria: 2021 $1.57B → 2022 $1.68B → 2023 $0.4B → 2024 $0.38B → 2025 $0.52B | Kenya: 2021 $0.76B → 2022 $1.05B → 2023 $0.67B → 2024 $0.42B → 2025 $0.61B | Egypt: 2021 $0.49B → 2022 $0.73B → 2023 $0.59B → 2024 $0.31B → 2025 $0.82B (130% surge) | South Africa: 2022 $0.86B → 2025 $0.56B

NOTABLE DEALS (multi-year):
2021: OPay $400M (NG, SoftBank), Chipper Cash $250M, Flutterwave $170M | 2022: OPay $400M+, Flutterwave $250M (unicorn), TymeBank $180M, TradeDepot $110M | 2023: Yoco $83M, mPharma $30M | 2024: MNT-Halan $157M (EG), Moove $100M, Moniepoint $110M | 2025: Wasoko $125M, Moniepoint $110M, Helios Towers $120M, Bboxx $100M, Wave $90M | 2026 Q1: SolarAfrica $94M, ValU $63.6M, Spiro $57M

Q1 2026 SPECIFICS:
Debt=57% of capital. Equity fell $333M→$209M (-37% YoY). Series A: 13→4 (-69%). Series B equity: ZERO. Most active: IFC 4 deals, Novastar 3, Azur 3. US VCs: 30+→14 (-53%).

ACTIVE FUNDRAISES 2026: Arc Ride (Kenya Series A $8-15M closing), NowPay (Egypt Series B), GoSwap (Tunisia Seed+ closing), Axmed (Kenya Series A closing), OmniRetail (Nigeria Series B)

Format with **bold** for figures. Be concise. Represent Ranes Analytics professionally.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: AI_SYS },
          ...messages,
        ],
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ranes-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
