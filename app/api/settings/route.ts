export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "settings.json");

function read(): Record<string, unknown> {
  try {
    if (!fs.existsSync(FILE)) return { calendarMonth: null };
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return { calendarMonth: null };
  }
}

function write(data: Record<string, unknown>) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(read());
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const updated = { ...read(), ...body };
    write(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error saving settings" }, { status: 500 });
  }
}
