"use client";

import type { MouseEvent } from "react";
import Link from "next/link";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function placeholderLinkProps() {
  return {
    href: "#" as const,
    title: "Coming soon",
    onClick: (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault(),
    className:
      "cursor-default text-sm text-zinc-500/55 transition-colors hover:text-zinc-500/55",
  };
}

const linkActive =
  "text-sm text-zinc-400 transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-sm";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-3">
            <p className="text-lg font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                HyntSight
              </span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
              Clarity for your design workflow—spot issues early and ship with
              confidence.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 transition-colors hover:text-zinc-200"
                aria-label="HyntSight on X"
              >
                <XIcon className="size-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 transition-colors hover:text-zinc-200"
                aria-label="HyntSight on GitHub"
              >
                <GithubIcon className="size-5" />
              </a>
            </div>
          </div>

          {/* Link columns: 2 cols mobile → 4 cols sm+ (brand sits above on mobile) */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-3 lg:col-span-9">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Product
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a href="#features" className={linkActive}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className={linkActive}>
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/sign-up" className={linkActive}>
                    Studio
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Resources
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a {...placeholderLinkProps()}>Documentation</a>
                </li>
                <li>
                  <a {...placeholderLinkProps()}>Blog</a>
                </li>
                <li>
                  <a {...placeholderLinkProps()}>API Reference</a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Company
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a {...placeholderLinkProps()}>About</a>
                </li>
                <li>
                  <Link href="/privacy" className={linkActive}>
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className={linkActive}>
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/5 pt-8">
          <p className="text-center text-sm text-zinc-600 sm:text-left">
            © 2026 HyntSight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
