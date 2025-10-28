"use client";
import { useState } from "react";
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const r = await fetch("/api/newsletter/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    if (r.ok) setOk(true); else setErr("Subscription failed");
  }
  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@email.com" className="px-3 py-2 rounded bg-white/10 border border-white/20 w-64" />
      <button className="px-4 py-2 rounded bg-white text-black">Subscribe</button>
      {ok ? <span className="text-green-400 text-sm">Subscribed!</span> : null}
      {err ? <span className="text-red-400 text-sm">{err}</span> : null}
    </form>
  );
}
