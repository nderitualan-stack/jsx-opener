
-- Create deals table
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  flag TEXT,
  country TEXT NOT NULL,
  sector TEXT NOT NULL,
  year INTEGER NOT NULL,
  quarter TEXT,
  amount NUMERIC NOT NULL,
  round TEXT,
  type TEXT NOT NULL CHECK (type IN ('equity', 'debt', 'hybrid')),
  investors TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT,
  date TEXT,
  url TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create active_deals table
CREATE TABLE public.active_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  flag TEXT,
  city TEXT,
  sector TEXT NOT NULL,
  stage TEXT,
  range TEXT,
  status TEXT CHECK (status IN ('Closing', 'Announced', 'In-process')),
  description TEXT,
  investors TEXT,
  confidence INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_deals ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Deals are publicly readable" ON public.deals FOR SELECT USING (true);
CREATE POLICY "News is publicly readable" ON public.news FOR SELECT USING (true);
CREATE POLICY "Active deals are publicly readable" ON public.active_deals FOR SELECT USING (true);

-- Create indexes for common queries
CREATE INDEX idx_deals_year ON public.deals (year);
CREATE INDEX idx_deals_sector ON public.deals (sector);
CREATE INDEX idx_deals_country ON public.deals (country);
CREATE INDEX idx_deals_type ON public.deals (type);
CREATE INDEX idx_active_deals_status ON public.active_deals (status);
