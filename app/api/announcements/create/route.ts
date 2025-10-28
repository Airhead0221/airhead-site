import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendAnnouncementEmail } from "@/lib/sendEmail";
const bodySchema = z.object({ title: z.string().min(3), body: z.string().min(3), published: z.boolean().optional().default(true), blast: z.boolean().optional().default(true) });
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const role = (session as any)?.user?.role;
  const userId = (session as any)?.user?.id;
  if (!session || (role !== "ADMIN" && role !== "MOD")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const { title, body, published, blast } = parsed.data;
  const created = await prisma.announcement.create({ data: { title, body, published, authorId: userId } });
  if (blast) {
    const subs = await prisma.newsletterSignup.findMany({ where: { verified: true }});
    await sendAnnouncementEmail(subs.map(s => s.email), title, body);
  }
  return NextResponse.json({ ok: true, id: created.id });
}
