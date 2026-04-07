import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDesign } from "@/lib/ai/pipeline";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { prompt, referenceImageUrls, garmentType, designId } = body;

    if (!prompt || !designId) {
      return NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Missing prompt or designId",
          },
        },
        { status: 400 }
      );
    }

    const { data: design } = await supabase
      .from("designs")
      .select("id")
      .eq("id", designId)
      .eq("user_id", user.id)
      .single();

    if (!design) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Design not found" } },
        { status: 404 }
      );
    }

    const usage = await checkUsageLimit(user.id);
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: {
            code: "PLAN_LIMIT",
            message: `You've used all ${usage.limit} designs on the ${usage.plan} plan.`,
            upgradePlan: usage.plan === "spark" ? "pro" : "studio",
          },
        },
        { status: 403 }
      );
    }

    await supabase
      .from("designs")
      .update({ status: "generating" })
      .eq("id", designId);

    const result = await generateDesign(
      { prompt, referenceImageUrls, garmentType, designId },
      user.id
    );

    await incrementUsage(user.id);

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("Generation error:", err);
    return NextResponse.json(
      {
        error: {
          code: "GENERATION_FAILED",
          message:
            err instanceof Error ? err.message : "Generation failed",
        },
      },
      { status: 500 }
    );
  }
}
