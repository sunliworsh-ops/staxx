import Link from "next/link";

const ARTICLES = [
  {
    slug: "onlyfans-taxes-guide-2026",
    title: "How to File Taxes as an OnlyFans Creator (2026 Guide)",
    excerpt: "Everything you need to know about self-employment tax, quarterly estimates, deductions, and staying audit-proof as a content creator.",
    date: "2026-06-15",
    readTime: "8 min read",
    tags: ["taxes", "beginners"],
  },
  {
    slug: "onlyfans-tax-deductions-write-offs",
    title: "12 OnlyFans Tax Deductions You're Probably Missing",
    excerpt: "From ring lights to rent — these write-offs can save creators thousands. Most OnlyFans creators only claim half of what they could.",
    date: "2026-06-15",
    readTime: "6 min read",
    tags: ["deductions", "saving money"],
  },
  {
    slug: "quarterly-estimated-tax-creators",
    title: "Quarterly Estimated Tax for Content Creators: When & How Much to Pay",
    excerpt: "The IRS wants its cut every 3 months — not just in April. Here's how to calculate, when to pay, and what happens if you don't.",
    date: "2026-06-15",
    readTime: "5 min read",
    tags: ["taxes", "planning"],
  },
];

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-staxx-warm-bg py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-staxx-indigo font-display">Staxx Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">Tax tips, write-off guides, and financial advice for content creators.</p>
        </div>
        <div className="space-y-4">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="block rounded-2xl border bg-white p-6 hover:shadow-md transition-shadow no-underline">
              <div className="flex items-center gap-2 mb-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs rounded-full bg-staxx-purple/10 text-staxx-purple px-2 py-0.5">{tag}</span>
                ))}
                <span className="text-xs text-muted-foreground">{article.date} · {article.readTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-staxx-indigo">{article.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
