"use client";

import { Suspense, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex">
        <Suspense fallback={<div className="h-full w-64 border-r bg-card" />}>
          <Sidebar />
        </Suspense>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Suspense fallback={<div className="h-full w-64 bg-card" />}>
            <Sidebar closeMobile={() => setMobileOpen(false)} />
          </Suspense>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col bg-background">
        <header className="flex items-center gap-4 border-b border-white/5 px-4 py-3 md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
            HyntSight
          </span>
        </header>
        <main className="flex-1 bg-background p-6">{children}</main>
        <Toaster />
      </div>
    </div>
  );
}
