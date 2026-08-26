import { NextRequest, NextResponse } from "next/server";
import { deleteSavedFilter } from "@/lib/api/db";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteSavedFilter(id);
    if (!success) {
      return NextResponse.json({ error: "Saved filter not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Saved filter deleted" });
  } catch (error) {
    console.error("DELETE /api/saved-filters/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete saved filter" }, { status: 500 });
  }
}
