import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        resources: { where: { isActive: true } },
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { bookings: true } },
      },
    });
    if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(business);
  } catch {
    return NextResponse.json({ error: "Error fetching business" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const business = await prisma.business.update({ where: { id: params.id }, data: body });
    return NextResponse.json(business);
  } catch {
    return NextResponse.json({ error: "Error updating business" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.business.update({ where: { id: params.id }, data: { isActive: false } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error deleting business" }, { status: 500 });
  }
}
