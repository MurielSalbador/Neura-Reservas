export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const userId = searchParams.get("userId");
    const ownerId = searchParams.get("ownerId");
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const upcoming = searchParams.get("upcoming");

    const bookings = await prisma.booking.findMany({
      where: {
        ...(businessId ? { businessId } : {}),
        ...(userId ? { userId } : {}),
        ...(ownerId ? { business: { ownerId } } : {}),
        ...(status ? { status: status as never } : {}),
        ...(upcoming === "true"
          ? { date: { gte: new Date(new Date().toISOString().split("T")[0] + "T00:00:00") } }
          : date
          ? {
              date: {
                gte: new Date(date + "T00:00:00"),
                lte: new Date(date + "T23:59:59"),
              },
            }
          : {}),
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            coverUrl: true,
            city: true,
            category: { select: { name: true } },
          },
        },
        resource: { select: { id: true, name: true, type: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: "Error fetching bookings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check for conflicts on hourly/appointment bookings
    if (body.startTime && body.endTime) {
      const conflict = await prisma.booking.findFirst({
        where: {
          resourceId: body.resourceId,
          status: { in: ["pending", "confirmed", "deposited", "paid"] },
          startTime: { lt: new Date(body.endTime) },
          endTime: { gt: new Date(body.startTime) },
        },
      });
      if (conflict) {
        return NextResponse.json({ error: "El horario ya está reservado" }, { status: 409 });
      }
    }

    const booking = await prisma.booking.create({
      data: {
        ...body,
        date: new Date(body.date),
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      },
      include: {
        business: { select: { name: true } },
        resource: { select: { name: true } },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating booking" }, { status: 500 });
  }
}
