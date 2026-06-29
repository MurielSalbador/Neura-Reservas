import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { businesses: { where: { isActive: true } } } } },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = await prisma.category.create({ data: body });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  }
}
