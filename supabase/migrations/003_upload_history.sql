-- Upload history table
CREATE TABLE IF NOT EXISTS public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  content_hash TEXT,
  source_type TEXT DEFAULT 'screenshot',
  transaction_count INT DEFAULT 0,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_uploads_user ON public.uploads(user_id, created_at DESC);
CREATE INDEX idx_uploads_hash ON public.uploads(content_hash);

ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own uploads" ON public.uploads FOR ALL USING (auth.uid() = user_id);
