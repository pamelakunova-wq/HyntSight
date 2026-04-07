import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.garmentType) {
    return NextResponse.json(
      { error: "name and garmentType are required" },
      { status: 400 }
    );
  }

  const { name, garmentType } = body as { name: string; garmentType: string };

  // Find or create a default project for the user
  let projectId: string;

  const { data: existingProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (existingProjects && existingProjects.length > 0) {
    projectId = existingProjects[0].id;
  } else {
    const { data: newProject, error: projectError } = await supabase
      .from("projects")
      .insert({ user_id: user.id, name: "Default Project" })
      .select("id")
      .single();

    if (projectError || !newProject) {
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 }
      );
    }
    projectId = newProject.id;
  }

  // Create the design
  const { data: design, error: designError } = await supabase
    .from("designs")
    .insert({
      project_id: projectId,
      user_id: user.id,
      name,
      garment_type: garmentType,
      status: "draft",
    })
    .select("id")
    .single();

  if (designError || !design) {
    return NextResponse.json(
      { error: "Failed to create design" },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: design.id });
}
