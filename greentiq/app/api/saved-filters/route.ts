import { NextRequest, NextResponse } from "next/server";
import { getSavedFilters, addSavedFilter } from "@/lib/api/db";
import { savedFilterSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const filters = await getSavedFilters();
    return NextResponse.json(filters);
  } catch (error) {
    console.error("GET /api/saved-filters error:", error);
    return NextResponse.json({ error: "Failed to fetch saved filters" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = savedFilterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newFilter = await addSavedFilter(validation.data);
    return NextResponse.json(newFilter, { status: 201 });
  } catch (error) {
    console.error("POST /api/saved-filters error:", error);
    return NextResponse.json({ error: "Failed to create saved filter" }, { status: 500 });
  }
}
