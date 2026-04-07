"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, PlusCircle, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/dashboard/SignOutButton";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard?new=true", label: "New Design", icon: PlusCircle },
];

const utilityNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

function isNavItemActive(
  pathname: string,
  searchParams: URLSearchParams,
  href: string
) {
  const [path, queryString] = href.split("?");
  const basePath = path ?? href;

  const pathMatches =
    pathname === basePath || pathname.startsWith(`${basePath}/`);
  if (!pathMatches) return false;

  if (queryString) {
    const expected = new URLSearchParams(queryString);
    for (const [key, value] of expected.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  }

  if (basePath === "/dashboard" && searchParams.get("new") === "true") {
    return false;
  }

  return true;
}

function NavList({
  items,
  closeMobile,
  pathname,
  searchParams,
}: {
  items: typeof mainNavItems;
  closeMobile?: () => void;
  pathname: string;
  searchParams: URLSearchParams;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive = isNavItemActive(pathname, searchParams, item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={closeMobile}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-white/5",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Sidebar({ closeMobile }: { closeMobile?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <Link
          href="/dashboard"
          className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent"
          onClick={closeMobile}
        >
          HyntSight
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-4 px-3 pb-2">
        <NavList
          items={mainNavItems}
          closeMobile={closeMobile}
          pathname={pathname}
          searchParams={searchParams}
        />

        <div className="border-t border-white/5" aria-hidden />

        <NavList
          items={utilityNavItems}
          closeMobile={closeMobile}
          pathname={pathname}
          searchParams={searchParams}
        />
      </nav>

      <div className="mt-auto border-t border-white/5 bg-card/50 p-3">
        <SignOutButton />
      </div>
    </div>
  );
}
