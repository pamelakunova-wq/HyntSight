import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  badge?: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Spark",
    price: "$0",
    tagline: "Try the magic",
    features: [
      "3 designs",
      "2 iterations per design",
      "PNG export (watermarked)",
      "500 MB storage",
    ],
    cta: "Start Free",
    href: "/sign-up",
  },
  {
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
    cta: "Start Pro Trial",
    href: "/sign-up",
  },
  {
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
    cta: "Contact Sales",
    href: "/sign-up",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Start for free, upgrade when you&apos;re ready.
        </p>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col rounded-xl border bg-card p-0 ${
                plan.highlighted
                  ? "scale-105 border-indigo-500 ring-1 ring-indigo-500/50"
                  : "border-border"
              }`}
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.badge && (
                    <Badge className="bg-indigo-500/20 text-indigo-300">
                      {plan.badge}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

                <div className="mt-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-indigo-400" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  render={<Link href={plan.href} />}
                  className={`mt-8 w-full ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600"
                      : ""
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
