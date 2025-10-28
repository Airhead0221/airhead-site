import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
export default async function Account() {
  const session = await getServerSession();
  if (!session) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Account</h1>
        <div className="flex gap-3">
          <a href="/login" className="px-4 py-2 rounded bg-white text-black">Log in</a>
          <a href="/register" className="px-4 py-2 rounded border border-white/30">Create account</a>
          <a href="/forgot-password" className="px-4 py-2 rounded border border-white/30">Forgot password</a>
        </div>
      </div>
    );
  }
  const user = (session as any).user;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Account</h1>
      <div>Name: {user.name}</div>
      <div>Email: {user.email}</div>
      <form action={toggleEmailOptIn} className="flex items-center gap-3">
        <input type="hidden" name="current" value={dbUser?.emailOptIn ? "1":"0"} />
        <button className="px-4 py-2 rounded border border-white/20">
          {dbUser?.emailOptIn ? "Disable Announcement Emails" : "Enable Announcement Emails"}
        </button>
      </form>
      <Link href="/api/auth/signout" className="text-sm underline">Sign out</Link>
    </div>
  );
}
async function toggleEmailOptIn(formData: FormData) {
  "use server";
  const { prisma } = await import("@/lib/prisma");
  const { getServerSession } = await import("next-auth");
  const session = await getServerSession();
  if (!session) return;
  const userId = (session as any).user.id;
  const current = formData.get("current") === "1";
  await prisma.user.update({ where: { id: userId }, data: { emailOptIn: !current }});
}
