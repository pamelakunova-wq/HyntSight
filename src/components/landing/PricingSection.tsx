"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    cta: "Get Started",
    href: "/sign-up",
  },
];

const cardMotion = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

export default function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Start for free, upgrade when you&apos;re ready.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              {...cardMotion}
              transition={{
                ...cardMotion.transition,
                delay: 0.1 * index,
              }}
            >
              <Card
                className={`relative flex h-full flex-col overflow-visible rounded-2xl border bg-card p-0 transition-shadow duration-300 hover:shadow-lg ${
                  plan.highlighted
                    ? "border-indigo-500/50 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/20"
                    : "border-border"
                }`}
              >
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    {plan.badge && (
                      <Badge
                        className="border-0 bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/30"
                      >
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.tagline}
                  </p>

                  <div className="mt-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <ul className="mt-6 flex flex-1 flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-indigo-400"
                          aria-hidden
                        />
                        <span className="text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.highlighted ? (
                    <Button
                      asChild
                      className="mt-8 h-10 w-full border-0 bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white shadow-md shadow-indigo-500/25 transition-[filter,box-shadow] duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/30"
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="mt-8 w-full">
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
