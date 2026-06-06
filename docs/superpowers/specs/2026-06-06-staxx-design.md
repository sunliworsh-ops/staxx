# Staxx — Product Design Spec

**Date:** 2026-06-06
**Status:** Draft — Awaiting Review
**Author:** Solo AI-assisted developer

---

## 1. Executive Summary

Staxx is a personal finance SaaS tool for US-based OnlyFans creators (with cross-platform support for Patreon, Fansly, ManyVids, CashApp, Venmo). Creators upload screenshots or CSV exports → Claude AI auto-classifies income/expenses across platforms → real-time profit dashboard + quarterly tax estimation + AI-driven tax optimization insights → one-click Schedule C export.

**Core value prop:** "Drop your data in, AI handles everything. You create, Staxx does the math."

---

## 2. Target User

| Attribute | Detail |
|-----------|--------|
| Primary | US OnlyFans creators, age 18–40 |
| Monthly income | $2K–50K |
| Financial literacy | Low — currently use Excel, bank app, or nothing |
| Privacy requirement | Extremely high — must support anonymous registration |
| Secondary | Creators on Patreon, Fansly, ManyVids, CashApp, Venmo |

---

## 3. Core Pain Points (7 total)

| # | Pain Point | Severity | Current Behavior | Solution |
|---|-----------|----------|-----------------|----------|
| 1 | Don't know real profit — platform fees, tips, PPV all mixed | 🔴 Critical | Check bank balance | AI auto-classify all income sources by platform, show net profit clearly |
| 2 | Tax panic in April — scattered screenshots, no organized records | 🔴 Critical | Dump screenshots to CPA | One-click Schedule C export (PDF/CSV/TurboTax) |
| 3 | Don't know how much to save for quarterly taxes | 🔴 Critical | Don't save / ask peers | Real-time quarterly tax estimate + deadline reminders |
| 4 | Don't know what expenses to deduct — fear of audit | 🟡 High | Don't deduct / deduct everything | AI Tax Write-offs checklist with OnlyFans-specific guidance |
| 5 | Income volatility anxiety — $15K this month, $2K next | 🟡 High | Mental estimation | Income trend chart + AI spending recommendations |
| 6 | Privacy fear — don't want any platform to know they do OF | 🟡 High | Use pseudonyms | Email-only signup, no real name required, data encrypted at rest |
| 7 | Cross-platform income fragmentation | 🟡 High | Track each platform separately | Unified import — screenshots and CSV from any platform, AI classifies by source |

---

## 4. Feature List (MVP)

### 4.1 Data Import
- Screenshot upload (Claude Vision OCR)
- CSV file upload (OnlyFans export format + generic)
- Mobile camera upload (PWA `capture` attribute)
- Batch upload with AI auto-dedup
- Progress stepper: Upload → Review → Done

### 4.2 AI Auto-Classification
- Income: Subscriptions, PPV, Tips, Referrals, Other
- Expenses: Equipment, Software, Promotion, Internet/Phone, Rent/Home Office, Travel, Props/Wardrobe, Other
- Platform fee: auto-detected per platform (OF 20%, Patreon 5-12%, Fansly 20%, ManyVids 40%)
- Source tagging: OnlyFans / Patreon / Fansly / ManyVids / CashApp / Venmo / Other
- Confidence score displayed per transaction
- User correction UI for low-confidence items

### 4.3 Dashboard (core workbench)
- 4 stat cards: Total Income, Net Profit, Est. Quarterly Tax, Tax Amount Saved
- Color coding: green (good), amber (watch), red (action needed)
- Income trend line chart (12 months)
- Platform breakdown pie chart
- AI Insight card (top of feed, auto-generated)
- Recent transactions list (collapsible)

### 4.4 AI Insights Engine
- Tax savings opportunities (missing deductions)
- Spending anomaly detection
- Platform fee optimization ("Would switching from ManyVids (40%) to Fansly (20%) save you money?")
- Quarterly tax reminders (amount + deadline)
- Income benchmarking (optional, anonymized)

### 4.5 Tax Write-offs Tab
- Structured checklist of OnlyFans-specific deductible expenses
- AI auto-populates based on detected spending categories
- Each item shows: what's deductible, documentation needed, IRS citation
- Progress bar: "You've captured X of Y common write-offs"

### 4.6 Tax Estimation
- Quarterly estimated tax calculation: Federal + SE tax + State
- Safe harbor calculation (100%/110% of prior year)
- "How much to save this month" recommendation
- Deadline calendar: Apr 15, Jun 15, Sep 15, Jan 15

### 4.7 Tax Export
- Schedule C data preview (Gross receipts, deductions by category, net profit)
- Export formats: PDF (for CPA), CSV (for spreadsheets), TurboTax-compatible format
- Legal disclaimer prominently displayed

### 4.8 Authentication & Privacy
- Email + password signup (no real name, no phone, no SSN)
- 14-day free Pro trial, no credit card required
- Data encrypted at rest (Supabase Vault / pgcrypto)
- Account deletion: all data permanently wiped within 7 days

### 4.9 Landing & Pricing
- Landing page: Hero → How It Works (3 steps) → Social proof → Pricing → CTA
- Pricing: Free (3 imports/mo, basic dashboard) → Pro $19/mo or $190/yr (unlimited, AI insights, tax export, write-offs checklist)
- Annual toggle shows "2 months free" ($190 vs $228)

---

## 5. User Journey

```
Signup (email only) → Import Data → AI Review → Add Expenses → Dashboard → Tax Export
  2 min                  1 min        30 sec       2 min        ongoing        tax season
```

| Step | Page | User Action | System Action |
|------|------|-------------|---------------|
| 1 | `/signup` | Enter email + password + state + income bracket | Create account, start 14-day trial |
| 2 | `/import` | Upload screenshots or CSV | Store raw files, call Claude Vision/Parse |
| 3 | `/import/review` | Review AI classifications, correct errors | Display categorized transactions with confidence |
| 4 | `/expenses` | Add expense categories, upload receipts | AI suggests common write-offs |
| 5 | `/dashboard` | View profit, trends, insights | Real-time dashboard + AI insight generation |
| 6 | `/export` | Choose format, download | Generate Schedule C data in selected format |

---

## 6. Page Architecture

| Page | URL | Primary Task | States |
|------|-----|-------------|--------|
| Landing | `/` | Convince + convert to signup | Default |
| Signup | `/signup` | Create anonymous account | Default, error, loading |
| Login | `/login` | Authenticate | Default, error |
| Import | `/import` | Upload data files | Empty (no imports yet), uploading, error |
| AI Review | `/import/review` | Confirm AI classifications | Processing, ready, has-uncategorized |
| Expenses | `/expenses` | Input deductible expenses | Empty, has-data |
| Dashboard | `/dashboard` | Understand financial health | Empty (just onboarded), has-data, has-alerts |
| Tax Write-offs | `/writeoffs` | Discover deductible expenses | Empty, populated |
| Tax Export | `/export` | Download tax-ready data | Calculating, ready |
| Pricing | `/pricing` | Choose plan | Default |
| Settings | `/settings` | Manage account | Default |

---

## 7. Design Tokens

### Brand
- **Tone:** Young, trendy, approachable — "Not your dad's finance tool"
- **Reference:** Notion warmth + Canva energy + Mercury clarity
- **Name:** Staxx ("stack smarter")

### Colors
```
Primary:    #7C3AED (Purple)  — Brand, CTAs, active states
Accent:     #F472B6 (Pink)    — Warmth, creator vibe
Highlight:  #FBBF24 (Amber)   — Income, CTA emphasis
Success:    #34D399 (Mint)    — Profit positive, tax saved
Danger:     #F87171 (Coral)   — Tax shortfall, deadline approaching
Dark:       #1E1B4B (Indigo)  — Headings, primary text
Light:      #FAFAFA (Warm gray) — Background
```

### Typography
```
Display:  Cal Sans (rounded, friendly)
Body:     Inter (clean, readable)
Numbers:  JetBrains Mono (tabular, financial feel)
```

### Shape Language
```
Cards:      rounded-2xl (16px)
Buttons:    rounded-xl (12px)
Inputs:     rounded-lg (8px)
Shadows:    Colored soft glow (purple/pink tint), not gray drop shadows
```

### PWA
- `manifest.json` with Staxx icon
- Service worker for offline dashboard view
- "Add to Home Screen" prompt on mobile

---

## 8. Technical Architecture

### Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 App Router + React + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Auth | Supabase Auth (email/password only) |
| Database | Supabase PostgreSQL + pgvector |
| Storage | Supabase Storage (screenshots, CSVs, receipts) |
| AI | Anthropic Claude API (Vision for images, Messages for classification + insights) |
| Payments | Stripe Billing (subscription management) |
| Deployment | Vercel (serverless) |
| Monitoring | Sentry |

### Key API Routes
```
POST  /api/import/screenshot   → Supabase Storage → Claude Vision → transactions table
POST  /api/import/csv          → Claude Parse → transactions table
GET   /api/dashboard/stats     → Aggregated stats query
POST  /api/ai/classify         → Trigger re-classification
GET   /api/ai/insights         → Generated insights list
GET   /api/tax/estimate        → Quarterly tax calculation
GET   /api/export/schedule-c   → Schedule C data
GET   /api/export/pdf          → PDF report generation
POST  /api/stripe/webhook      → Stripe event handling
```

### Database Schema
Core tables: `users`, `transactions` (platform, category, amount, period, source_type, ai_confidence, user_corrected), `tax_estimates` (quarterly), `insights` (AI-generated, dismissable).

### Claude API Integration
- **Screenshot processing:** Claude Vision extracts monetary values → JSON output with platform, category, amount, confidence
- **CSV processing:** Claude parses CSV rows → same JSON schema
- **Cross-platform classification:** Prompt includes platform fee structures (OF 20%, Patreon 5-12%, Fansly 20%, ManyVids 40%)
- **Insight generation:** Aggregated transaction data + tax estimates → 2-3 actionable insights per run
- Cost estimate: ~$0.05-0.15 per import session, ~$0.02-0.05 per insight generation

### Not in MVP
- Plaid bank connection (V2)
- Stripe Connect for income side (V2)
- Real-time WebSocket (not needed)
- Redis cache (not needed at MVP scale)
- React Native mobile app (PWA covers mobile MVP)
- Multi-user / team accounts

---

## 9. Development Phases

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| 1: Foundation | Week 1 | Next.js scaffold, Supabase schema, Auth flow |
| 2: Import Pipeline | Weeks 2-3 | Screenshot upload + Claude Vision + CSV parser + Storage |
| 3: AI Review | Week 4 | Classification confirmation UI, user correction flow |
| 4: Dashboard | Weeks 5-6 | Stat cards, charts, AI insight cards, transaction list |
| 5: Tax Engine | Week 7 | Quarterly tax estimation, Write-offs checklist, deadline calendar |
| 6: Export + Billing | Week 8 | Schedule C export (PDF/CSV/TurboTax), Stripe subscriptions |
| 7: Marketing Pages | Week 9 | Landing page, pricing page, PWA manifest |
| 8: Polish + Launch | Week 10 | Testing, Sentry setup, Vercel deploy, pre-launch checklist |
| **Total** | **~10 weeks** | |

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Claude Vision OCR errors on screenshots | Medium | Confidence scores + user correction UI; CSV as fallback |
| OnlyFans changes dashboard layout, breaking OCR | Medium | Prompt-based approach adapts; monitor and update prompts |
| Privacy breach / data leak | High | Encryption at rest, no real names, clear privacy policy, SOC 2 in V2 |
| IRS compliance — providing tax info without being a tax preparer | Medium | Legal disclaimer on every tax page; "information only, not tax advice"; CPA review before launch |
| Stripe adult-content policy conflict | High | **Must verify** Stripe's acceptable use policy for adult-industry-adjacent tools before integration |
| Low conversion from free trial | Medium | Strong onboarding that shows value in first session; email reminders before trial ends |

---

## 11. Post-MVP Roadmap

| Version | Features |
|---------|----------|
| V1.1 | Plaid bank connection, receipt OCR auto-categorization |
| V1.2 | Multi-currency support, S-Corp tax comparison tool |
| V1.3 | Anonymized income benchmarking ("Creators at your level earn X") |
| V2.0 | React Native iOS/Android app, accountant sharing portal |
| V2.1 | Expense receipt auto-scan via phone camera, mileage tracking |

---

## 12. Success Metrics (First 6 Months)

| Metric | Target |
|--------|--------|
| Signups | 2,000 |
| Free → Paid conversion | 8-12% |
| Paid users (Month 6) | 160-240 |
| MRR (Month 6) | $3,040-4,560 |
| Monthly churn | <5% |
| Net Promoter Score | >40 |

---

*This spec was generated through the brainstorming skill workflow: project context → clarifying questions → approach comparison → section-by-section design → spec write-up. Next step: writing-plans skill for implementation plan.*
