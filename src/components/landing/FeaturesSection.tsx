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

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Wand2,
    title: "Describe, Don\u2019t Draw",
    description:
      "Just explain what you want in plain English. Our AI understands fashion terminology and design intent.",
  },
  {
    icon: ImageIcon,
    title: "Photo References",
    description:
      "Upload reference photos and mood boards. The AI combines your vision with professional design standards.",
  },
  {
    icon: Download,
    title: "Production-Ready Export",
    description:
      "Export in DXF, SVG, and PDF \u2014 the exact formats your manufacturer needs.",
  },
  {
    icon: PenTool,
    title: "Interactive Editor",
    description:
      "Fine-tune every detail with built-in drawing tools. Select areas and give targeted feedback.",
  },
  {
    icon: RefreshCw,
    title: "Iterate Instantly",
    description:
      "Don\u2019t like something? Describe what to change and get a new version in seconds.",
  },
  {
    icon: History,
    title: "Version History",
    description:
      "Every iteration is saved. Compare versions, branch, and restore any previous design.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Everything you need to design
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          From concept to production-ready files, HyntSight handles every step of the design process.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="rounded-xl border border-border bg-card p-6">
              <CardContent className="flex flex-col gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <Icon className="size-5 text-indigo-400" />
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
