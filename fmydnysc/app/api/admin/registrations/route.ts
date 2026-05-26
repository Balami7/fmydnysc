import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check authentication cookie
    const authCookie = request.cookies.get("admin_auth");
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all registrations from database
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Transform database records to match frontend interface
    const transformedRecords = registrations.map((reg: any) => ({
      id: reg.id,
      first_name: reg.firstName,
      last_name: reg.lastName,
      organisation: reg.organisation,
      status: reg.status,
      phone: reg.phone,
      email: reg.email,
      created_at: reg.createdAt.toISOString(),
    }));

    return NextResponse.json(transformedRecords);
  } catch (error) {
    console.error("Fetch registrations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}