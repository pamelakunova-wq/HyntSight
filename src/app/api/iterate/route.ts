import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { iterateDesign } from "@/lib/ai/pipeline";

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
    const { designId, feedback, selectedArea, currentVersionId } = body;

    if (!designId || !feedback || !currentVersionId) {
      return NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Missing required fields",
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

    const result = await iterateDesign(
      { designId, feedback, selectedArea, currentVersionId },
      user.id
    );

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("Iteration error:", err);
    return NextResponse.json(
      {
        error: {
          code: "ITERATION_FAILED",
          message:
            err instanceof Error ? err.message : "Iteration failed",
        },
      },
      { status: 500 }
    );
  }
}
