// Staxx Reddit Bot — posts via Reddit API using just username + password
// Uses the installed app OAuth flow (no app creation needed)
const REDDIT_USER = process.env.REDDIT_USER;
const REDDIT_PASS = process.env.REDDIT_PASS;

const ANSWERS = {
  tax: `You're self-employed → file Schedule C. Budget 25-30% of net for taxes (income tax + 15.3% SE tax). Track everything: equipment, software, internet, platform fees — all deductible.

I built Staxx (staxx.site) for exactly this — upload an OF dashboard screenshot, AI auto-categorizes everything and estimates your quarterly tax. 7-day free trial.`,
  deduction: `Write-offs most creators miss: 📸 Camera gear | 💻 Editing software | 📱 Internet & phone | 🏠 Home studio | 👗 Props | 💸 OF 20% fees | 🏥 Health insurance | 💰 SEP IRA. IRS rule: ordinary & necessary for your business.

Staxx (staxx.site) has a 12-point write-off checklist specifically for OF/Patreon creators. Shows what you're missing.`,
  quarterly: `Quarterly estimated tax deadlines: Apr 15 / Jun 15 / Sep 15 / Jan 15. Pay ~30% of net profit. Penalty for missing = ~8% APR. I built Staxx (staxx.site) to auto-calculate this from actual OF/Patreon income. Free.`
};

async function getToken() {
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from("ohXpoqrZYub1kg:").toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "StaxxBot/1.0"
    },
    body: `grant_type=password&username=${encodeURIComponent(REDDIT_USER)}&password=${encodeURIComponent(REDDIT_PASS)}`
  });
  const data = await res.json();
  return data.access_token;
}

async function searchPosts(token, subreddit, query) {
  const res = await fetch(`https://oauth.reddit.com/r/${subreddit}/search?q=${encodeURIComponent(query)}&sort=new&restrict_sr=on&t=week&limit=3`, {
    headers: { "Authorization": "Bearer " + token, "User-Agent": "StaxxBot/1.0" }
  });
  const data = await res.json();
  return (data.data?.children || []).map(c => ({
    id: c.data.name,
    title: c.data.title,
    permalink: c.data.permalink
  }));
}

async function postComment(token, thingId, text) {
  const res = await fetch("https://oauth.reddit.com/api/comment", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "StaxxBot/1.0"
    },
    body: `thing_id=${thingId}&text=${encodeURIComponent(text)}`
  });
  return res.ok;
}

async function main() {
  if (!REDDIT_USER || !REDDIT_PASS) {
    console.log("❌ Set REDDIT_USER and REDDIT_PASS env vars");
    console.log("   export REDDIT_USER=your_username");
    console.log("   export REDDIT_PASS=your_password");
    process.exit(1);
  }

  console.log("🔑 Getting auth token...");
  const token = await getToken();
  if (!token) { console.log("❌ Auth failed. Check username/password."); process.exit(1); }
  console.log("✅ Authenticated!");

  const searches = [
    { sub: "onlyfansadvice", q: "tax" },
    { sub: "creatorsadvice", q: "tax" },
    { sub: "tax", q: "onlyfans" },
  ];

  for (const s of searches) {
    console.log(`\n🔍 r/${s.sub} — "${s.q}"`);
    const posts = await searchPosts(token, s.sub, s.q);
    for (const p of posts) {
      const title = p.title.toLowerCase();
      let answer = ANSWERS.tax;
      if (title.includes("deduction") || title.includes("write")) answer = ANSWERS.deduction;
      else if (title.includes("quarterly") || title.includes("estimated")) answer = ANSWERS.quarterly;

      const ok = await postComment(token, p.id, answer);
      console.log(`  ${ok ? "✅" : "❌"} ${p.title.slice(0, 60)}...`);
      if (ok) await new Promise(r => setTimeout(r, 2000)); // Rate limit: 2s between posts
    }
  }
  console.log("\nDone!");
}

main().catch(e => console.error("FATAL:", e.message));
