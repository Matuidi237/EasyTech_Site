import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const prerender = false;

const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const history = (submissions.get(ip) || []).filter((t) => now - t < windowMs);
  history.push(now);
  submissions.set(ip, history);
  return history.length > 5;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const data = await request.formData();

  // Honeypot
  if (data.get("website")) {
    return new Response(null, { status: 200 });
  }

  // Anti-bot: minimum delay between page load and submission
  const loadedAt = Number(data.get("loadedAt") || 0);
  if (loadedAt && Date.now() - loadedAt < 3000) {
    return new Response(null, { status: 200 });
  }

  if (isRateLimited(clientAddress || "unknown")) {
    return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
  }

  const required = ["name", "organization", "email", "phone", "orgType", "need"];
  for (const field of required) {
    const val = data.get(field)?.toString().trim() ?? "";
    if (!val || val.length < (field === "need" ? 10 : 2)) {
      return new Response(JSON.stringify({ error: `Champ manquant ou invalide : ${field}` }), { status: 400 });
    }
  }

  const email = data.get("email")?.toString().trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Email invalide" }), { status: 400 });
  }

  const phone = data.get("phone")?.toString().trim() ?? "";
  if (phone.replace(/[\s\+\-]/g, "").length < 5) {
    return new Response(JSON.stringify({ error: "Téléphone invalide" }), { status: 400 });
  }

  const payload = {
    name: data.get("name")?.toString(),
    organization: data.get("organization")?.toString(),
    email: data.get("email")?.toString(),
    phone: data.get("phone")?.toString(),
    orgType: data.get("orgType")?.toString(),
    need: data.get("need")?.toString()
  };

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const port = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_TO,
        replyTo: payload.email,
        subject: `Nouvelle demande de démo – ${payload.organization}`,
        text: [
          `Nom : ${payload.name}`,
          `Organisation : ${payload.organization}`,
          `Email : ${payload.email}`,
          `Téléphone : ${payload.phone}`,
          `Type d'organisation : ${payload.orgType}`,
          `Besoin exprimé : ${payload.need}`
        ].join("\n")
      });
      console.log(`[contact] Email envoyé — ${payload.organization} <${payload.email}>`);
    } catch (err: any) {
      console.error("[contact] Erreur SMTP :", err?.message ?? err);
      return new Response(JSON.stringify({ error: "Erreur d'envoi" }), { status: 500 });
    }
  } else {
    console.log("[contact] SMTP non configuré — demande reçue :", payload);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
