import { NextRequest, NextResponse } from "next/server";
import { addCustomerNote } from "@/lib/api/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.content || typeof body.content !== "string" || body.content.trim() === "") {
      return NextResponse.json({ error: "Note content cannot be empty" }, { status: 400 });
    }

    const updatedCustomer = await addCustomerNote(id, body.content.trim());
    if (!updatedCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCustomer, { status: 201 });
  } catch (error) {
    console.error("POST /api/customers/[id]/notes error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
