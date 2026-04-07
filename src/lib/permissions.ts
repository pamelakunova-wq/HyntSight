import { createClient } from "@/lib/supabase/server";
import type { Plan, ExportFormat } from "@/types";
import { PLAN_LIMITS } from "@/types";

export async function getUserPlan(userId: string): Promise<Plan> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();
  return (data?.plan as Plan) ?? "spark";
}

export function canExportFormat(plan: Plan, format: ExportFormat): boolean {
  return PLAN_LIMITS[plan].exports.includes(format);
}

export function canCreateDesign(plan: Plan, designsUsed: number): boolean {
  return designsUsed < PLAN_LIMITS[plan].designs;
}

export function canIterate(plan: Plan, iterationsUsed: number): boolean {
  return iterationsUsed < PLAN_LIMITS[plan].iterationsPerDesign;
}

export function getDesignLimit(plan: Plan): number {
  return PLAN_LIMITS[plan].designs;
}

export function getStorageLimit(plan: Plan): number {
  return PLAN_LIMITS[plan].storageMb * 1024 * 1024;
}
