import { NextRequest, NextResponse } from "next/server";
import { reorderSavedFilters } from "@/lib/api/db";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.orderedIds)) {
      return NextResponse.json({ error: "orderedIds array is required" }, { status: 400 });
    }

    const updatedFilters = await reorderSavedFilters(body.orderedIds);
    return NextResponse.json(updatedFilters);
  } catch (error) {
    console.error("PATCH /api/saved-filters/reorder error:", error);
    return NextResponse.json({ error: "Failed to reorder saved filters" }, { status: 500 });
  }
}
