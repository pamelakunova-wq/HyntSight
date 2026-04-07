export type Plan = "spark" | "pro" | "studio";
export type DesignStatus = "draft" | "generating" | "ready" | "exported";
export type ExportFormat = "svg" | "dxf" | "pdf" | "png";
export type GarmentType =
  | "t-shirt"
  | "blouse"
  | "jacket"
  | "pants"
  | "dress"
  | "skirt"
  | "coat"
  | "shorts"
  | "hoodie"
  | "other";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  designs_used_this_period: number;
  billing_period_start: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Design {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  description: string | null;
  garment_type: string | null;
  initial_prompt: string | null;
  current_canvas_json: Record<string, unknown> | null;
  thumbnail_url: string | null;
  status: DesignStatus;
  created_at: string;
  updated_at: string;
}

export interface DesignVersion {
  id: string;
  design_id: string;
  version_number: number;
  canvas_json: Record<string, unknown>;
  generated_image_url: string | null;
  feedback_prompt: string | null;
  feedback_area: FeedbackArea | null;
  parent_version_id: string | null;
  created_at: string;
}

export interface GenerationLog {
  id: string;
  user_id: string;
  design_id: string | null;
  model_used: string;
  input_tokens: number | null;
  output_tokens: number | null;
  image_count: number;
  cost_usd: number | null;
  prompt_text: string | null;
  created_at: string;
}

export interface FeedbackArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GenerationRequest {
  prompt: string;
  referenceImageUrls?: string[];
  garmentType?: string;
  designId: string;
}

export interface IterationRequest {
  designId: string;
  feedback: string;
  selectedArea?: FeedbackArea;
  currentVersionId: string;
}

export const PLAN_LIMITS: Record<
  Plan,
  {
    designs: number;
    iterationsPerDesign: number;
    storageMb: number;
    exports: ExportFormat[];
    priorityAi: boolean;
    teamMembers: number;
    versionHistory: boolean;
  }
> = {
  spark: {
    designs: 3,
    iterationsPerDesign: 2,
    storageMb: 500,
    exports: ["png"],
    priorityAi: false,
    teamMembers: 1,
    versionHistory: false,
  },
  pro: {
    designs: 30,
    iterationsPerDesign: Infinity,
    storageMb: 5120,
    exports: ["svg", "dxf", "pdf", "png"],
    priorityAi: false,
    teamMembers: 1,
    versionHistory: true,
  },
  studio: {
    designs: Infinity,
    iterationsPerDesign: Infinity,
    storageMb: 25600,
    exports: ["svg", "dxf", "pdf", "png"],
    priorityAi: true,
    teamMembers: 5,
    versionHistory: true,
  },
};

export const GARMENT_TYPES: { value: GarmentType; label: string }[] = [
  { value: "t-shirt", label: "T-Shirt" },
  { value: "blouse", label: "Blouse" },
  { value: "jacket", label: "Jacket / Blazer" },
  { value: "pants", label: "Pants / Trousers" },
  { value: "dress", label: "Dress" },
  { value: "skirt", label: "Skirt" },
  { value: "coat", label: "Coat" },
  { value: "shorts", label: "Shorts" },
  { value: "hoodie", label: "Hoodie" },
  { value: "other", label: "Other" },
];
