import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Plan, Profile } from "@/types";
import { PLAN_LIMITS } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import {
  BillingCheckoutSuccessToast,
  CheckoutUpgradeButton,
  planRank,
} from "@/components/UpgradePrompt";

type BillingSearchParams = Promise<{ success?: string; canceled?: string }>;

type DisplayPlan = {
  id: Plan;
  name: string;
  price: string;
  period?: string;
  tagline: string;
  badge?: string;
  highlighted?: boolean;
  features: string[];
  stripePriceId: string | undefined;
};

const displayPlans: DisplayPlan[] = [
  {
    id: "spark",
    name: "Spark",
    price: "$0",
    tagline: "Try the magic",
    features: [
      "3 designs",
      "2 iterations per design",
      "PNG export (watermarked)",
      "500 MB storage",
    ],
    stripePriceId: undefined,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$39",
    period: "/mo",
    tagline: "For independent designers",
    badge: "Most Popular",
    highlighted: true,
    features: [
      "30 designs per month",
      "Unlimited iterations",
      "SVG + PDF + DXF export",
      "5 GB storage",
      "Version history",
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  {
    id: "studio",
    name: "Studio",
    price: "$99",
    period: "/mo",
    tagline: "For design teams",
    features: [
      "Unlimited designs",
      "Priority AI generation",
      "AAMA/ASTM DXF export",
      "25 GB storage",
      "Team (5 members)",
      "API access",
    ],
    stripePriceId: process.env.STRIPE_STUDIO_PRICE_ID,
  },
];

function designLimitLabel(plan: Plan): string {
  const n = PLAN_LIMITS[plan].designs;
  return n === Infinity ? "Unlimited" : String(n);
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: BillingSearchParams;
}) {
  const sp = await searchParams;
  const showSuccess = sp.success === "true";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileRow as Profile | null;
  const plan = (profile?.plan ?? "spark") as Plan;
  const used = profile?.designs_used_this_period ?? 0;
  const limit = PLAN_LIMITS[plan].designs;
  const limitNum = limit === Infinity ? null : limit;
  const progressPct =
    limitNum === null ? 100 : Math.min(100, Math.round((used / limitNum) * 100));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <BillingCheckoutSuccessToast success={showSuccess} />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your plan and monitor usage for this billing period.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Current plan</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-semibold capitalize">{plan}</span>
                <Badge variant="secondary" className="capitalize">
                  Active
                </Badge>
              </div>
            </div>
            <Button render={<Link href="#manage-subscription" />} variant="outline" size="sm">
              Manage subscription
            </Button>
          </div>

          <div id="manage-subscription" className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            Subscription management (cancel, payment method, invoices) will open
            Stripe Customer Portal here once configured.
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Designs this period</span>
              <span className="font-medium tabular-nums">
                {used} / {limitNum === null ? "∞" : limitNum}
              </span>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={limitNum === null ? undefined : progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Your plan includes {designLimitLabel(plan)} designs per billing period.
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold">Plans</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Same pricing as on our marketing site. Upgrade anytime.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {displayPlans.map((p) => {
            const isCurrent = p.id === plan;
            const isHigher = planRank(p.id) > planRank(plan);

            return (
              <Card
                key={p.id}
                className={`relative flex flex-col p-0 ${
                  p.highlighted
                    ? "scale-[1.02] border-indigo-500 ring-1 ring-indigo-500/50"
                    : ""
                }`}
              >
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    {isCurrent && (
                      <Badge className="bg-emerald-500/20 text-emerald-300">Current plan</Badge>
                    )}
                    {p.badge && !isCurrent && (
                      <Badge className="bg-indigo-500/20 text-indigo-300">{p.badge}</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>

                  <div className="mt-6">
                    <span className="text-4xl font-bold">{p.price}</span>
                    {p.period && (
                      <span className="text-muted-foreground">{p.period}</span>
                    )}
                  </div>

                  <ul className="mt-6 flex flex-1 flex-col gap-3">
                    {p.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-indigo-400" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        Your plan
                      </Button>
                    ) : isHigher ? (
                      <CheckoutUpgradeButton
                        priceId={p.stripePriceId}
                        label={`Upgrade to ${p.name}`}
                        className={`w-full ${
                          p.highlighted
                            ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600"
                            : ""
                        }`}
                        variant={p.highlighted ? "default" : "outline"}
                      />
                    ) : (
                      <Button variant="ghost" className="w-full text-muted-foreground" disabled>
                        Included in higher tiers
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
