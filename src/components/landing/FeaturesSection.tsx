"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Wand2,
  ImageIcon,
  Download,
  PenTool,
  RefreshCw,
  History,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

type Accent =
  | "indigo"
  | "violet"
  | "amber"
  | "emerald"
  | "rose"
  | "cyan";

const accentIconBg: Record<Accent, string> = {
  indigo: "bg-indigo-500/15 text-indigo-400",
  violet: "bg-violet-500/15 text-violet-400",
  amber: "bg-amber-500/15 text-amber-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  rose: "bg-rose-500/15 text-rose-400",
  cyan: "bg-cyan-500/15 text-cyan-400",
};

const accentHoverRing: Record<Accent, string> = {
  indigo: "hover:ring-indigo-400/30",
  violet: "hover:ring-violet-400/30",
  amber: "hover:ring-amber-400/30",
  emerald: "hover:ring-emerald-400/30",
  rose: "hover:ring-rose-400/30",
  cyan: "hover:ring-cyan-400/30",
};

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: Accent;
}[] = [
  {
    icon: Wand2,
    title: "Describe, Don\u2019t Draw",
    description:
      "Just explain what you want in plain English. Our AI understands fashion terminology and design intent.",
    accent: "indigo",
  },
  {
    icon: ImageIcon,
    title: "Photo References",
    description:
      "Upload reference photos and mood boards. The AI combines your vision with professional design standards.",
    accent: "violet",
  },
  {
    icon: Download,
    title: "Production-Ready Export",
    description:
      "Export in DXF, SVG, and PDF \u2014 the exact formats your manufacturer needs.",
    accent: "amber",
  },
  {
    icon: PenTool,
    title: "Interactive Editor",
    description:
      "Fine-tune every detail with built-in drawing tools. Select areas and give targeted feedback.",
    accent: "emerald",
  },
  {
    icon: RefreshCw,
    title: "Iterate Instantly",
    description:
      "Don\u2019t like something? Describe what to change and get a new version in seconds.",
    accent: "rose",
  },
  {
    icon: History,
    title: "Version History",
    description:
      "Every iteration is saved. Compare versions, branch, and restore any previous design.",
    accent: "cyan",
  },
];

const hero = features[0];
const supporting = features.slice(1);

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

export default function FeaturesSection() {
  const HeroIcon = hero.icon;

  return (
    <section
      id="features"
      className="bg-gradient-to-b from-background via-indigo-950/20 to-background px-6 py-20"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything you need to design
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From concept to production-ready files, HyntSight handles every
            step of the design process.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <Card
            className={`overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] py-0 shadow-xl shadow-indigo-950/20 ring-1 ring-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:shadow-indigo-500/10 md:rounded-3xl ${accentHoverRing[hero.accent]} hover:-translate-y-0.5 hover:ring-1`}
          >
            <CardContent className="grid gap-10 p-6 md:grid-cols-2 md:gap-12 md:p-10 lg:p-12">
              <div className="flex flex-col justify-center gap-5">
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl ${accentIconBg[hero.accent]}`}
                >
                  <HeroIcon className="size-7" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {hero.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  {hero.description}
                </p>
              </div>

              <div className="relative flex min-h-[220px] items-center justify-center md:min-h-[280px]">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10"
                />
                <div className="relative w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5 shadow-inner backdrop-blur-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-amber-400/90">
                    Your prompt
                  </p>
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-zinc-300">
                    &ldquo;A-line midi skirt, high waist, subtle pleats, linen
                    blend, ready for pattern grading.&rdquo;
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex size-2 animate-pulse rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
                    AI interprets fashion terminology and intent
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {["Silhouette", "Fabric", "Specs"].map((label) => (
                      <div
                        key={label}
                        className="rounded-lg border border-white/5 bg-white/[0.03] px-2 py-2 text-center text-[10px] font-medium text-zinc-400"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supporting.map(({ icon: Icon, title, description, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.45,
                delay: 0.1 * (i + 1),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Card
                className={`h-full rounded-2xl border border-border bg-card/80 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${accentHoverRing[accent]} hover:ring-1`}
              >
                <CardContent className="flex flex-col gap-4 p-6">
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl ${accentIconBg[accent]}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
