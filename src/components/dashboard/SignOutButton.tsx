"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  if (iconOnly) {
    return (
      <Button variant="ghost" size="icon" onClick={handleSignOut}>
        <LogOut className="size-4" />
      </Button>
    );
  }

  return (
    <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
      <LogOut className="size-4" />
      Sign Out
    </Button>
  );
}
