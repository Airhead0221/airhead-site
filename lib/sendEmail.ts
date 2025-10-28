export async function sendAnnouncementEmail(to: string[], title: string, body: string) {
  if (!to.length) return;
  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM!, to, subject: `Airhead022 — ${title}`, html: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(body).replace(/\n/g,"<br/>")}</p>` })
    });
    if (!res.ok) console.error("Resend error", await res.text());
  } else {
    console.warn("No RESEND_API_KEY set. Emails will not be sent.");
  }
}
export async function sendPasswordResetEmail(to: string, link: string) {
  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM!, to, subject: "Reset your Airhead022 password", html: `<p>Click to reset your password:</p><p><a href="${link}">${link}</a></p><p>If you didn’t request this, ignore this email.</p>` })
    });
    if (!res.ok) console.error("Resend error", await res.text());
  } else {
    console.warn("No RESEND_API_KEY set. Password reset email not sent.");
  }
}
function escapeHtml(s: string) { return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'} as any)[m]); }
