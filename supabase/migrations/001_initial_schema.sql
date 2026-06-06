-- Staxx: Initial database schema
-- Run this in Supabase SQL Editor or via supabase migration

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  state TEXT NOT NULL DEFAULT 'CA',
  income_bracket TEXT,
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  subscription_status TEXT DEFAULT 'trial',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, state, income_bracket)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'state', 'CA'),
    COALESCE(NEW.raw_user_meta_data->>'income_bracket', '3k_10k')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL DEFAULT 'onlyfans',
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  period DATE NOT NULL,
  source_type TEXT DEFAULT 'manual',
  source_file_url TEXT,
  ai_confidence DECIMAL(3,2),
  user_corrected BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_period ON public.transactions(user_id, period DESC);
CREATE INDEX idx_transactions_platform ON public.transactions(platform);

-- ============================================
-- TAX ESTIMATES
-- ============================================
CREATE TABLE IF NOT EXISTS public.tax_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quarter TEXT NOT NULL,
  estimated_income DECIMAL(10,2) DEFAULT 0,
  estimated_deductions DECIMAL(10,2) DEFAULT 0,
  federal_tax_est DECIMAL(10,2) DEFAULT 0,
  self_employment_tax_est DECIMAL(10,2) DEFAULT 0,
  state_tax_est DECIMAL(10,2) DEFAULT 0,
  total_tax_est DECIMAL(10,2) DEFAULT 0,
  amount_saved DECIMAL(10,2) DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tax_estimates_user ON public.tax_estimates(user_id, quarter);

-- ============================================
-- AI INSIGHTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insights_user ON public.insights(user_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users own profiles" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own tax_estimates" ON public.tax_estimates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own insights" ON public.insights
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these via Supabase Dashboard > Storage or SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);
