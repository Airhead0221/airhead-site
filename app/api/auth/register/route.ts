import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcrypt";
const schema = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().min(2).max(50) });
export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { email, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  const passwordHash = await hash(password, 12);
  const user = await prisma.user.create({ data: { email, name, passwordHash } });
  return NextResponse.json({ ok: true, id: user.id });
}
