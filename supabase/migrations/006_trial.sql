-- Set 7-day trial for new signups via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, state, income_bracket, trial_ends_at, subscription_tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'state', 'CA'),
    COALESCE(NEW.raw_user_meta_data->>'income_bracket', '3k_10k'),
    NOW() + INTERVAL '7 days',
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Give existing free users 7 days from now
UPDATE public.profiles SET trial_ends_at = NOW() + INTERVAL '7 days' WHERE trial_ends_at IS NULL AND subscription_tier = 'free';
