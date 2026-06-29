export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        business: true,
        resource: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Error fetching booking" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = await req.json();

    // Convert date strings to proper Date objects — Prisma rejects bare ISO strings without timezone
    for (const field of ["date", "endDate", "startTime", "endTime"]) {
      if (body[field] && typeof body[field] === "string") {
        const s: string = body[field];
        body[field] = new Date(s.endsWith("Z") ? s : s + "Z");
      }
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(booking);
  } catch (err) {
    console.error("PATCH /api/bookings/[id] error:", err);
    const message = err instanceof Error ? err.message : "Error updating booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.booking.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error deleting booking" }, { status: 500 });
  }
}
