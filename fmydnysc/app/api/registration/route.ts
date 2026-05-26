import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const requiredFields = [
    "first_name",
    "last_name",
    "organisation",
    "status",
    "phone",
    "email"
  ] as const;

  for (const field of requiredFields) {
    const v = body[field];
    if (typeof v !== "string" || !v.trim()) {
      return NextResponse.json({
        error: `Missing or invalid required field: ${field}`
      }, { status: 400 });
    }
  }

  const email = (body.email as string).trim();
  const phone = (body.phone as string).trim();

  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }
  if (!/^\+?[0-9\s\-]{7,15}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
  }

  try {
    const registration = await prisma.registration.create({
      data: {
        firstName: (body.first_name as string).trim(),
        lastName: (body.last_name as string).trim(),
        guestCategory: "",
        position: "",
        organisation: (body.organisation as string).trim(),
        status: (body.status as string).trim(),
        country: "",
        state: "",
        city: "",
        buildingApart: "",
        street: "",
        phone,
        email,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Registration submitted successfully", 
        id: registration.id 
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    console.error("Registration DB error:", error);
    return NextResponse.json({ error: `Database error: ${message}` }, { status: 500 });
  }
}

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({ 
      orderBy: { createdAt: "desc" } 
    });
    return NextResponse.json({ 
      success: true, 
      count: registrations.length, 
      data: registrations 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to fetch registrations: ${message}` }, { status: 500 });
  }
}