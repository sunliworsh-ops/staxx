ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS analyze_count INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
