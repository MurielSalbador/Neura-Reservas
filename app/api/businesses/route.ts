export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("cat");
    const featured = searchParams.get("featured") === "true";
    const query = searchParams.get("q");
    const slug = searchParams.get("slug");

    // Detalle completo por slug
    if (slug) {
      const business = await prisma.business.findUnique({
        where: { slug, isActive: true },
        include: {
          category: { select: { name: true, slug: true, icon: true } },
          resources: {
            where: { isActive: true },
            select: { id: true, name: true, description: true, price: true, duration: true, capacity: true },
          },
        },
      });
      if (!business) return NextResponse.json(null);
      return NextResponse.json(business);
    }

    const businesses = await prisma.business.findMany({
      where: {
        isActive: true,
        ...(featured ? { isFeatured: true } : {}),
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        category: { select: { name: true, slug: true, icon: true } },
        resources: {
          where: { isActive: true },
          select: { id: true, name: true, price: true, duration: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
    });

    return NextResponse.json(businesses);
  } catch {
    return NextResponse.json({ error: "Error fetching businesses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const business = await prisma.business.create({
      data: body,
      include: { category: true },
    });
    return NextResponse.json(business, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating business" }, { status: 500 });
  }
}
