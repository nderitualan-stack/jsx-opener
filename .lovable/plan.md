
## Ranes AI — System Architecture & Implementation Plan

### Current State
- Ranes Analytics app with **hardcoded datasets** (2019–Q1 2026)
- AI chat calls Anthropic API **directly from browser** (CORS issues, exposed API key)
- No database, no backend, no persistent storage

### Target Architecture

```
User Query → React Chat UI → Edge Function (chat) → Lovable AI Gateway
                                    ↓
                              Supabase DB (structured data)
                              + Vector embeddings (RAG)
                                    ↓
                            Grounded AI Response
                            + Charts + Sources
```

### Phase 1: Foundation (this session)
1. **Enable Lovable Cloud** — PostgreSQL + Edge Functions
2. **Create database tables** — `deals`, `sectors`, `countries`, `investors`, `news` (migrate hardcoded data)
3. **Build `chat` edge function** — Uses Lovable AI Gateway with system prompt + data context
4. **Streaming chat UI** — Replace current client-side Anthropic call with proper SSE streaming
5. **Query-aware data retrieval** — Edge function queries DB based on user intent, injects into AI prompt

### Phase 2: RAG & Analytics (follow-up)
6. **Vector embeddings** — Enable `pgvector`, embed deal descriptions for semantic search
7. **Analytics functions** — Server-side aggregation (funding by sector/country/stage, YoY trends)
8. **Structured responses** — AI returns charts data + summaries + source citations
9. **Data visualization in chat** — Render inline Recharts from AI-structured output

### Phase 3: Data Pipeline (follow-up)
10. **News ingestion** — Edge function to fetch from public APIs periodically
11. **CSV export** — Download filtered deal data
12. **Weekly trend summaries** — Scheduled edge function

### Key Decisions
- **Lovable AI Gateway** (not direct OpenAI/Anthropic) — pre-configured, no API key management
- **Supabase PostgreSQL** — structured data + pgvector for RAG in one DB
- **Edge Functions** — server-side AI calls, no exposed keys
- **Streaming SSE** — real-time token-by-token responses

### What won't be built (limitations)
- No web scraping pipeline (requires persistent workers, not edge functions)
- No Crunchbase/external API integration without API keys
- No email report generation without email service connector
- Investor-founder matching deferred to Phase 3

### Phase 1 deliverables
- ✅ Database with all current hardcoded data
- ✅ Streaming AI chat via edge function
- ✅ Context-aware responses grounded in real data
- ✅ Clean chat UI with suggested prompts
- ✅ Source citations in responses
