import { createClient } from "@/lib/supabase/server";
import type { Design } from "@/types";
import { DesignCard } from "@/components/dashboard/DesignCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { CreateDesignDialog } from "@/components/dashboard/CreateDesignDialog";

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Designs</h1>
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
    </div>
  );
}
