const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/JqQkJazEyR4S93FfxcwC/webhook-trigger/4fed15e8-7427-4265-945b-c04f1a6478f4";

async function sendEmail(payload) {
  const { name, company, email, phone, service, message, planned_timing, customer_type } = payload;

  const html = `
    <h2>Új árajánlatkérés érkezett</h2>
    <p><strong>Név:</strong> ${name}</p>
    <p><strong>Cég:</strong> ${company}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Telefon:</strong> ${phone}</p>
    <p><strong>Érdeklődés tárgya:</strong> ${service}</p>
    <p><strong>Tervezett időzítés:</strong> ${planned_timing || "–"}</p>
    <p><strong>Érdeklődő típusa:</strong> ${customer_type || "–"}</p>
    <p><strong>Üzenet:</strong></p>
    <p>${message || "–"}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "EventVolt űrlap <onboarding@resend.dev>",
      to: ["info@eventvolt.hu"],
      reply_to: email,
      subject: `Új árajánlatkérés: ${name}`,
      html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Resend API hiba (${response.status}): ${errorData}`);
  }

  return { channel: "email", ok: true };
}

async function sendWebhook(payload) {
  const webhookPayload = {
    ...payload,
    message: payload.message || "",
    submittedAt: new Date().toISOString(),
  };

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(webhookPayload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Webhook hiba (${response.status}): ${errorData}`);
  }

  return { channel: "webhook", ok: true };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, company, email, phone, service, message, planned_timing, customer_type } = req.body || {};

  if (!name || !company || !email || !phone || !service) {
    return res
      .status(400)
      .json({ error: "Hiányzó kötelező mező: name, company, email, phone, service" });
  }

  const payload = { name, company, email, phone, service, message, planned_timing, customer_type };

  const results = await Promise.allSettled([
    sendEmail(payload),
    sendWebhook(payload),
  ]);

  const emailResult = results[0];
  const webhookResult = results[1];

  const emailOk = emailResult.status === "fulfilled";
  const webhookOk = webhookResult.status === "fulfilled";

  if (!emailOk) {
    console.error("Email küldési hiba:", emailResult.reason?.message || emailResult.reason);
  }
  if (!webhookOk) {
    console.error("Webhook továbbítási hiba:", webhookResult.reason?.message || webhookResult.reason);
  }

  if (emailOk && webhookOk) {
    return res.status(200).json({ success: true });
  }

  if (emailOk && !webhookOk) {
    return res.status(207).json({
      success: true,
      warning: "Az e-mail sikeresen elküldve, de a webhook továbbítás sikertelen.",
    });
  }

  if (!emailOk && webhookOk) {
    return res.status(207).json({
      success: true,
      warning: "A webhook továbbítás sikeres, de az e-mail küldés sikertelen.",
    });
  }

  return res.status(502).json({
    error: "Mindkét továbbítás sikertelen.",
    emailError: emailResult.reason?.message || "Ismeretlen hiba",
    webhookError: webhookResult.reason?.message || "Ismeretlen hiba",
  });
}
