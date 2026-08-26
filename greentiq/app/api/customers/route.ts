import { NextRequest, NextResponse } from "next/server";
import { queryCustomers, addCustomer } from "@/lib/api/db";
import { customerSchema } from "@/lib/schemas";
import { CustomerStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const statusParam = searchParams.get("status");
    const status = statusParam ? (statusParam.split(",") as CustomerStatus[]) : undefined;

    const companyParam = searchParams.get("company") || searchParams.get("companies");
    const companies = companyParam ? companyParam.split(",") : undefined;

    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const phoneContains = searchParams.get("phoneContains") || undefined;
    const emailContains = searchParams.get("emailContains") || undefined;

    const sortBy = (searchParams.get("sortBy") as "name" | "email" | "lastContactDate" | "company" | "dealValue") || "lastContactDate";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const result = await queryCustomers({
      search,
      status,
      companies,
      dateFrom,
      dateTo,
      phoneContains,
      emailContains,
      sortBy,
      sortOrder,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod Validation
    const validation = customerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const newCustomer = await addCustomer(validation.data);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
