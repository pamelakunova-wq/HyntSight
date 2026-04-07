"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handleAnchorClick = useCallback(
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      scrollToSection(id);
      setMobileOpen(false);
    },
    []
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[border-color,background-color] duration-300 ease-out ${
        scrolled
          ? "border-b border-white/[0.08] bg-zinc-950/75 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/65"
          : "border-b border-transparent bg-zinc-950/40 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/30"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <Link
          href="/"
          className="group relative shrink-0 text-lg font-semibold tracking-tight sm:text-xl"
        >
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent transition-[filter] duration-300 group-hover:brightness-110">
            HyntSight
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <a
            href="#features"
            onClick={handleAnchorClick("features")}
            className="relative text-sm font-medium text-zinc-300 transition-colors duration-200 hover:text-white after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-indigo-400 after:via-violet-400 after:to-purple-400 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={handleAnchorClick("pricing")}
            className="relative text-sm font-medium text-zinc-300 transition-colors duration-200 hover:text-white after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-indigo-400 after:via-violet-400 after:to-purple-400 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
          >
            Pricing
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="default" asChild>
            <Link
              href="/sign-in"
              className="text-zinc-200 hover:text-white"
            >
              Sign In
            </Link>
          </Button>
          <Button
            asChild
            className="h-9 border-0 bg-gradient-to-r from-indigo-500 to-violet-600 px-4 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-[box-shadow,filter] duration-200 hover:brightness-110 hover:shadow-indigo-500/35 focus-visible:ring-violet-400/40"
          >
            <Link href="/sign-up">Get Started Free</Link>
          </Button>
        </div>

        <motion.button
          type="button"
          className="relative z-[60] flex size-10 items-center justify-center rounded-lg text-zinc-200 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-400/50 md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          whileTap={{ scale: 0.94 }}
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          <div className="flex size-5 flex-col justify-center gap-1.5">
            <motion.span
              className="block h-0.5 w-full origin-center rounded-full bg-current"
              animate={
                mobileOpen
                  ? { rotate: 45, y: 8 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            />
            <motion.span
              className="block h-0.5 w-full rounded-full bg-current"
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 w-full origin-center rounded-full bg-current"
              animate={
                mobileOpen
                  ? { rotate: -45, y: -8 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            />
          </div>
        </motion.button>
      </nav>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-panel"
            key="mobile-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { type: "spring", stiffness: 420, damping: 38 },
              opacity: { duration: 0.2 },
            }}
            className="overflow-hidden border-b border-white/[0.08] bg-zinc-950/95 backdrop-blur-xl md:hidden"
          >
            <motion.div
              initial={{ y: -12 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="flex flex-col gap-1 px-4 pb-6 pt-2 sm:px-6"
            >
              <a
                href="#features"
                onClick={handleAnchorClick("features")}
                className="rounded-lg px-3 py-3 text-base font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={handleAnchorClick("pricing")}
                className="rounded-lg px-3 py-3 text-base font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
              >
                Pricing
              </a>
              <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.06] pt-4">
                <Button variant="ghost" size="lg" asChild className="w-full justify-center">
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="w-full justify-center border-0 bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:brightness-110"
                >
                  <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
