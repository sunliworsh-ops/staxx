import Link from "next/link";
import {
  LayoutDashboard,
  Upload,
  FileDown,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/import", label: "Import", icon: Upload },
  { href: "/writeoffs", label: "Write-Offs", icon: Tag },
  { href: "/export", label: "Export", icon: FileDown },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-staxx-warm-bg">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-staxx-purple text-white text-sm font-bold font-display">
            S
          </span>
          <span className="text-lg font-bold tracking-tight text-staxx-indigo font-display">
            Staxx
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-staxx-purple/5 hover:text-staxx-purple"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t">
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-red-50 hover:text-staxx-coral"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t z-50">
        <div className="flex items-center justify-around h-16 px-2 safe-bottom">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground transition-all hover:text-staxx-purple px-2 py-1"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
