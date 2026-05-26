import { NextResponse } from "next/server";
import { Workbook } from "exceljs";
import { prisma } from "@/lib/prisma";

// Add this line to prevent Next.js from running this code during 'npm run build'
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch all registrations
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Create a new workbook
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Registrations");

    // Add headers
    worksheet.columns = [
      { header: "First Name", key: "firstName", width: 15 },
      { header: "Last Name", key: "lastName", width: 15 },
      { header: "Organisation", key: "organisation", width: 30 },
      { header: "Status", key: "status", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Registration Date", key: "createdAt", width: 18 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF10B981" },
    };

    // Add data rows
    registrations.forEach((reg: any) => {
      worksheet.addRow({
        firstName: reg.firstName,
        lastName: reg.lastName,
        organisation: reg.organisation,
        status: reg.status,
        email: reg.email,
        phone: reg.phone,
        createdAt: new Date(reg.createdAt).toLocaleDateString(),
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return file with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="registrations-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate export file" },
      { status: 500 }
    );
  }
}
