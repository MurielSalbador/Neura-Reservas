import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get("resourceId");
    const date = searchParams.get("date");

    if (!resourceId || !date) {
      return NextResponse.json({ error: "resourceId and date required" }, { status: 400 });
    }

    const startOfDay = new Date(date + "T00:00:00");
    const endOfDay = new Date(date + "T23:59:59");

    const bookings = await prisma.booking.findMany({
      where: {
        resourceId,
        status: { in: ["pending", "confirmed", "deposited", "paid"] },
        date: { gte: startOfDay, lte: endOfDay },
      },
      select: { startTime: true, endTime: true },
    });

    // Build booked hour slots
    const bookedSlots: string[] = [];
    for (const b of bookings) {
      if (b.startTime) {
        const h = b.startTime.getHours().toString().padStart(2, "0");
        bookedSlots.push(`${h}:00`);
      }
    }

    return NextResponse.json({ bookedSlots, date });
  } catch {
    return NextResponse.json({ error: "Error fetching availability" }, { status: 500 });
  }
}
