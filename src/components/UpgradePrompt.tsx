"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Plan } from "@/types";

const NEXT_PLAN: Record<Plan, Plan | null> = {
  spark: "pro",
  pro: "studio",
  studio: null,
};

const PLAN_FEATURES: Record<Plan, string[]> = {
  spark: [
    "3 designs",
    "2 iterations per design",
    "PNG export (watermarked)",
    "500 MB storage",
  ],
  pro: [
    "30 designs per month",
    "Unlimited iterations",
    "SVG + PDF + DXF export",
    "5 GB storage",
    "Version history",
  ],
  studio: [
    "Unlimited designs",
    "Priority AI generation",
    "AAMA/ASTM DXF export",
    "25 GB storage",
    "Team (5 members)",
    "API access",
  ],
};

export function BillingCheckoutSuccessToast({ success }: { success: boolean }) {
  useEffect(() => {
    if (success) {
      toast.success("Your subscription was updated successfully.");
    }
  }, [success]);
  return null;
}

export function CheckoutUpgradeButton({
  priceId,
  label = "Upgrade",
  className,
  variant = "default",
}: {
  priceId: string | undefined;
  label?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!priceId) {
      toast.error("Stripe price ID is not configured.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={loading || !priceId}
      onClick={handleCheckout}
    >
      {loading ? "Redirecting…" : label}
    </Button>
  );
}

export type UpgradePromptProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: Plan;
  /** Stripe price ID for the plan the user should upgrade to */
  upgradePriceId: string | undefined;
};

export default function UpgradePrompt({
  open,
  onOpenChange,
  currentPlan,
  upgradePriceId,
}: UpgradePromptProps) {
  const nextPlan = NEXT_PLAN[currentPlan];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Plan limit reached</DialogTitle>
          <DialogDescription>
            {nextPlan
              ? `You’ve hit a limit on your current plan. Upgrade to ${capitalize(nextPlan)} to unlock more.`
              : "You’re already on our highest plan. Contact support if you need more capacity."}
          </DialogDescription>
        </DialogHeader>

        {nextPlan ? (
          <>
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-3">
              <p className="text-sm font-medium capitalize">{nextPlan}</p>
              <ul className="mt-2 flex flex-col gap-2">
                {PLAN_FEATURES[nextPlan].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-indigo-400" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <CheckoutUpgradeButton
                priceId={upgradePriceId}
                label={`Upgrade to ${capitalize(nextPlan)}`}
                className="w-full"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Maybe later
              </Button>
            </DialogFooter>
          </>
        ) : (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function capitalize(s: Plan): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function planRank(plan: Plan): number {
  const order: Plan[] = ["spark", "pro", "studio"];
  return order.indexOf(plan);
}
