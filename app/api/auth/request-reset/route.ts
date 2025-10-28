import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/sendEmail";
const schema = z.object({ email: z.string().email() });
export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ ok: true });
  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true });
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30);
  await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt: expires }});
  const link = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset/${token}`;
  await sendPasswordResetEmail(email, link);
  return NextResponse.json({ ok: true });
}
