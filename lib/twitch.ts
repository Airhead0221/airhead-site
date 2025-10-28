type Token = { access_token: string; refresh_token?: string; expires_in?: number; };
async function refreshToken(): Promise<string> {
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET!;
  const refresh = process.env.TWITCH_REFRESH_TOKEN!;
  const res = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type":"application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh, client_id: clientId, client_secret: clientSecret })
  });
  if (!res.ok) throw new Error("Twitch refresh failed: " + (await res.text()));
  const json = await res.json() as Token;
  return json.access_token;
}
export async function helix(path: string, params: Record<string,string|number|undefined> = {}) {
  const qs = Object.entries(params).filter(([,v])=>v!==undefined).map(([k,v])=>`${k}=${encodeURIComponent(String(v))}`).join("&");
  let token = process.env.TWITCH_ACCESS_TOKEN!;
  const url = `https://api.twitch.tv/helix${path}${qs?`?${qs}`:""}`;
  let res = await fetch(url, { headers: { "Client-Id": process.env.TWITCH_CLIENT_ID!, "Authorization": `Bearer ${token}` } });
  if (res.status === 401) { token = await refreshToken(); res = await fetch(url, { headers: { "Client-Id": process.env.TWITCH_CLIENT_ID!, "Authorization": `Bearer ${token}` } }); }
  if (!res.ok) throw new Error(`Helix ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}
