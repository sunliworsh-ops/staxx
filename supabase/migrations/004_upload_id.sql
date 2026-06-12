ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS upload_id UUID REFERENCES public.uploads(id) ON DELETE CASCADE;
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS file_url TEXT;
CREATE INDEX IF NOT EXISTS idx_transactions_upload ON public.transactions(upload_id);
