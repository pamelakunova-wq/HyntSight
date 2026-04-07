import { createClient } from "@/lib/supabase/server";
import type { Design } from "@/types";
import { DesignCard } from "@/components/dashboard/DesignCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { CreateDesignDialog } from "@/components/dashboard/CreateDesignDialog";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let designs: Design[] = [];

  if (user) {
    const { data } = await supabase
      .from("designs")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    designs = (data as Design[]) ?? [];
  }

  const designCount = designs.length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to HyntSight
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Create AI-powered clothing designs and turn ideas into professional
          schematics in minutes.
        </p>
      </section>

      <section className="flex flex-wrap items-center gap-4 rounded-xl border border-white/5 bg-card/40 px-4 py-4 sm:gap-8 sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Designs
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {designCount}
          </p>
        </div>
        <div className="hidden h-10 w-px bg-white/10 sm:block" aria-hidden />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Plan
          </p>
          <div className="mt-2">
            <Badge
              variant="secondary"
              className="border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
            >
              Spark
            </Badge>
          </div>
        </div>
        <div className="hidden h-10 w-px bg-white/10 sm:block" aria-hidden />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Used this period
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-muted-foreground">
            —
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Your designs
          </h2>
          <CreateDesignDialog />
        </div>

        {designs.length === 0 ? (
          <EmptyState>
            <CreateDesignDialog />
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {designs.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
