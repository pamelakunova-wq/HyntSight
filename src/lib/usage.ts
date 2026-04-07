import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";
import { PLAN_LIMITS } from "@/types";

export async function checkUsageLimit(userId: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, designs_used_this_period")
    .eq("id", userId)
    .single();

  if (!profile) throw new Error("Profile not found");

  const plan = profile.plan as Plan;
  const limit = PLAN_LIMITS[plan].designs;
  const used = profile.designs_used_this_period;

  return {
    allowed: used < limit,
    remaining: Math.max(0, limit - used),
    plan,
    used,
    limit,
  };
}

export async function incrementUsage(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("designs_used_this_period")
    .eq("id", userId)
    .single();

  await supabase
    .from("profiles")
    .update({
      designs_used_this_period: (data?.designs_used_this_period ?? 0) + 1,
    })
    .eq("id", userId);
}

export async function resetUsage(userId: string) {
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({
      designs_used_this_period: 0,
      billing_period_start: new Date().toISOString(),
    })
    .eq("id", userId);
}
