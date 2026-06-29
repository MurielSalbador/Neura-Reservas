import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: "admin" } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: { select: { bookings: true } },
        bookings: {
          select: { totalAmount: true, status: true, date: true },
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt,
      bookingCount: u._count.bookings,
      lastBooking: u.bookings[0] ?? null,
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}
