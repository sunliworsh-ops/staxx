# Staxx Make.com Automation Blueprints

Three pre-built automation scenarios for Make.com to promote Staxx without manual effort.

## Setup

1. Go to [make.com](https://make.com) → Create account (free tier: 1000 operations/month)
2. Go to each blueprint folder and import the JSON file
3. Connect your accounts (Reddit doesn't need auth for RSS monitoring, Twitter does)

## Blueprints

### 1. Reddit Tax Question Monitor (`staxx-reddit-monitor.json`)
**What it does:** Every 15 minutes, checks r/OnlyFansAdvice and r/CreatorsAdvice for new posts about taxes, write-offs, 1099s, quarterly payments. When a fresh question is found (under 10 comments), emails you the post link + a pre-written reply template.

**Accounts needed:** RSS (built-in), Email

**Time saved:** 30 min/day → 0 min/day. You just open the email, customize the reply, post it.

### 2. Twitter Weekly Scheduler (`staxx-twitter-scheduler.json`)
**What it does:** Reads tweets from a Google Sheet, posts one per day at scheduled time. You batch-write 7 tweets once a week.

**Accounts needed:** Google Sheets, Twitter

**Setup:**
1. Create a Google Sheet with columns: `date`, `tweet_text`, `status`
2. Write 7 tweets, set `status` to `ready`
3. Connect the sheet in Make
4. Set scenario to run daily at 10:00 AM EST

### 3. Blog → Twitter Auto-Post (`staxx-blog-autopost.json`)
**What it does:** When a new blog article is published on staxx.site/blog, auto-tweets it.

**Prerequisite:** Add an RSS feed to staxx.site/blog (needs a one-line server route)

## Recommended Priority

1. **Reddit Monitor** — immediate ROI, free, biggest traffic source
2. **Twitter Scheduler** — brand building, low effort after setup
