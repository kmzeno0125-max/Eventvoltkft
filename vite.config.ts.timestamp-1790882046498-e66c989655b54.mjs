var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/send-email.js
var send_email_exports = {};
__export(send_email_exports, {
  default: () => handler
});
async function sendEmail(payload) {
  const { name, company, email, phone, service, message, planned_timing, customer_type } = payload;
  const html = `
    <h2>\xDAj \xE1raj\xE1nlatk\xE9r\xE9s \xE9rkezett</h2>
    <p><strong>N\xE9v:</strong> ${name}</p>
    <p><strong>C\xE9g:</strong> ${company}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Telefon:</strong> ${phone}</p>
    <p><strong>\xC9rdekl\u0151d\xE9s t\xE1rgya:</strong> ${service}</p>
    <p><strong>Tervezett id\u0151z\xEDt\xE9s:</strong> ${planned_timing || "\u2013"}</p>
    <p><strong>\xC9rdekl\u0151d\u0151 t\xEDpusa:</strong> ${customer_type || "\u2013"}</p>
    <p><strong>\xDCzenet:</strong></p>
    <p>${message || "\u2013"}</p>
  `;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: "EventVolt \u0171rlap <onboarding@resend.dev>",
      to: ["info@eventvolt.hu"],
      reply_to: email,
      subject: `\xDAj \xE1raj\xE1nlatk\xE9r\xE9s: ${name}`,
      html
    })
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
    submittedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(webhookPayload)
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Webhook hiba (${response.status}): ${errorData}`);
  }
  return { channel: "webhook", ok: true };
}
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { name, company, email, phone, service, message, planned_timing, customer_type } = req.body || {};
  if (!name || !company || !email || !phone || !service) {
    return res.status(400).json({ error: "Hi\xE1nyz\xF3 k\xF6telez\u0151 mez\u0151: name, company, email, phone, service" });
  }
  const payload = { name, company, email, phone, service, message, planned_timing, customer_type };
  const results = await Promise.allSettled([
    sendEmail(payload),
    sendWebhook(payload)
  ]);
  const emailResult = results[0];
  const webhookResult = results[1];
  const emailOk = emailResult.status === "fulfilled";
  const webhookOk = webhookResult.status === "fulfilled";
  if (!emailOk) {
    console.error("Email k\xFCld\xE9si hiba:", emailResult.reason?.message || emailResult.reason);
  }
  if (!webhookOk) {
    console.error("Webhook tov\xE1bb\xEDt\xE1si hiba:", webhookResult.reason?.message || webhookResult.reason);
  }
  if (emailOk && webhookOk) {
    return res.status(200).json({ success: true });
  }
  if (emailOk && !webhookOk) {
    return res.status(207).json({
      success: true,
      warning: "Az e-mail sikeresen elk\xFCldve, de a webhook tov\xE1bb\xEDt\xE1s sikertelen."
    });
  }
  if (!emailOk && webhookOk) {
    return res.status(207).json({
      success: true,
      warning: "A webhook tov\xE1bb\xEDt\xE1s sikeres, de az e-mail k\xFCld\xE9s sikertelen."
    });
  }
  return res.status(502).json({
    error: "Mindk\xE9t tov\xE1bb\xEDt\xE1s sikertelen.",
    emailError: emailResult.reason?.message || "Ismeretlen hiba",
    webhookError: webhookResult.reason?.message || "Ismeretlen hiba"
  });
}
var WEBHOOK_URL;
var init_send_email = __esm({
  "api/send-email.js"() {
    WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/JqQkJazEyR4S93FfxcwC/webhook-trigger/4fed15e8-7427-4265-945b-c04f1a6478f4";
  }
});

// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///home/project/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "api-middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith("/api/")) {
            try {
              const handler2 = (await Promise.resolve().then(() => (init_send_email(), send_email_exports))).default;
              const chunks = [];
              for await (const chunk of req) {
                chunks.push(chunk);
              }
              const bodyStr = Buffer.concat(chunks).toString("utf-8");
              req.body = bodyStr ? JSON.parse(bodyStr) : {};
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (obj) => {
                if (!res.headersSent) {
                  res.setHeader("Content-Type", "application/json");
                }
                res.end(JSON.stringify(obj));
                return res;
              };
              await handler2(req, res);
            } catch (err) {
              console.error("API middleware hiba:", err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Szerver hiba" }));
              }
            }
            return;
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  server: {
    historyApiFallback: true
  },
  preview: {
    historyApiFallback: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBpL3NlbmQtZW1haWwuanMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0L2FwaVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcHJvamVjdC9hcGkvc2VuZC1lbWFpbC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9wcm9qZWN0L2FwaS9zZW5kLWVtYWlsLmpzXCI7Y29uc3QgV0VCSE9PS19VUkwgPVxuICBcImh0dHBzOi8vc2VydmljZXMubGVhZGNvbm5lY3RvcmhxLmNvbS9ob29rcy9KcVFrSmF6RXlSNFM5M0ZmeGN3Qy93ZWJob29rLXRyaWdnZXIvNGZlZDE1ZTgtNzQyNy00MjY1LTk0NWItYzA0ZjFhNjQ3OGY0XCI7XG5cbmFzeW5jIGZ1bmN0aW9uIHNlbmRFbWFpbChwYXlsb2FkKSB7XG4gIGNvbnN0IHsgbmFtZSwgY29tcGFueSwgZW1haWwsIHBob25lLCBzZXJ2aWNlLCBtZXNzYWdlLCBwbGFubmVkX3RpbWluZywgY3VzdG9tZXJfdHlwZSB9ID0gcGF5bG9hZDtcblxuICBjb25zdCBodG1sID0gYFxuICAgIDxoMj5cdTAwREFqIFx1MDBFMXJhalx1MDBFMW5sYXRrXHUwMEU5clx1MDBFOXMgXHUwMEU5cmtlemV0dDwvaDI+XG4gICAgPHA+PHN0cm9uZz5OXHUwMEU5djo8L3N0cm9uZz4gJHtuYW1lfTwvcD5cbiAgICA8cD48c3Ryb25nPkNcdTAwRTlnOjwvc3Ryb25nPiAke2NvbXBhbnl9PC9wPlxuICAgIDxwPjxzdHJvbmc+RW1haWw6PC9zdHJvbmc+ICR7ZW1haWx9PC9wPlxuICAgIDxwPjxzdHJvbmc+VGVsZWZvbjo8L3N0cm9uZz4gJHtwaG9uZX08L3A+XG4gICAgPHA+PHN0cm9uZz5cdTAwQzlyZGVrbFx1MDE1MWRcdTAwRTlzIHRcdTAwRTFyZ3lhOjwvc3Ryb25nPiAke3NlcnZpY2V9PC9wPlxuICAgIDxwPjxzdHJvbmc+VGVydmV6ZXR0IGlkXHUwMTUxelx1MDBFRHRcdTAwRTlzOjwvc3Ryb25nPiAke3BsYW5uZWRfdGltaW5nIHx8IFwiXHUyMDEzXCJ9PC9wPlxuICAgIDxwPjxzdHJvbmc+XHUwMEM5cmRla2xcdTAxNTFkXHUwMTUxIHRcdTAwRURwdXNhOjwvc3Ryb25nPiAke2N1c3RvbWVyX3R5cGUgfHwgXCJcdTIwMTNcIn08L3A+XG4gICAgPHA+PHN0cm9uZz5cdTAwREN6ZW5ldDo8L3N0cm9uZz48L3A+XG4gICAgPHA+JHttZXNzYWdlIHx8IFwiXHUyMDEzXCJ9PC9wPlxuICBgO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovL2FwaS5yZXNlbmQuY29tL2VtYWlsc1wiLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtwcm9jZXNzLmVudi5SRVNFTkRfQVBJX0tFWX1gLFxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgZnJvbTogXCJFdmVudFZvbHQgXHUwMTcxcmxhcCA8b25ib2FyZGluZ0ByZXNlbmQuZGV2PlwiLFxuICAgICAgdG86IFtcImluZm9AZXZlbnR2b2x0Lmh1XCJdLFxuICAgICAgcmVwbHlfdG86IGVtYWlsLFxuICAgICAgc3ViamVjdDogYFx1MDBEQWogXHUwMEUxcmFqXHUwMEUxbmxhdGtcdTAwRTlyXHUwMEU5czogJHtuYW1lfWAsXG4gICAgICBodG1sLFxuICAgIH0pLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgY29uc3QgZXJyb3JEYXRhID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgIHRocm93IG5ldyBFcnJvcihgUmVzZW5kIEFQSSBoaWJhICgke3Jlc3BvbnNlLnN0YXR1c30pOiAke2Vycm9yRGF0YX1gKTtcbiAgfVxuXG4gIHJldHVybiB7IGNoYW5uZWw6IFwiZW1haWxcIiwgb2s6IHRydWUgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2VuZFdlYmhvb2socGF5bG9hZCkge1xuICBjb25zdCB3ZWJob29rUGF5bG9hZCA9IHtcbiAgICAuLi5wYXlsb2FkLFxuICAgIG1lc3NhZ2U6IHBheWxvYWQubWVzc2FnZSB8fCBcIlwiLFxuICAgIHN1Ym1pdHRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gIH07XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChXRUJIT09LX1VSTCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHdlYmhvb2tQYXlsb2FkKSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGNvbnN0IGVycm9yRGF0YSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFdlYmhvb2sgaGliYSAoJHtyZXNwb25zZS5zdGF0dXN9KTogJHtlcnJvckRhdGF9YCk7XG4gIH1cblxuICByZXR1cm4geyBjaGFubmVsOiBcIndlYmhvb2tcIiwgb2s6IHRydWUgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICBpZiAocmVxLm1ldGhvZCAhPT0gXCJQT1NUXCIpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDUpLmpzb24oeyBlcnJvcjogXCJNZXRob2Qgbm90IGFsbG93ZWRcIiB9KTtcbiAgfVxuXG4gIGNvbnN0IHsgbmFtZSwgY29tcGFueSwgZW1haWwsIHBob25lLCBzZXJ2aWNlLCBtZXNzYWdlLCBwbGFubmVkX3RpbWluZywgY3VzdG9tZXJfdHlwZSB9ID0gcmVxLmJvZHkgfHwge307XG5cbiAgaWYgKCFuYW1lIHx8ICFjb21wYW55IHx8ICFlbWFpbCB8fCAhcGhvbmUgfHwgIXNlcnZpY2UpIHtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDQwMClcbiAgICAgIC5qc29uKHsgZXJyb3I6IFwiSGlcdTAwRTFueXpcdTAwRjMga1x1MDBGNnRlbGV6XHUwMTUxIG1lelx1MDE1MTogbmFtZSwgY29tcGFueSwgZW1haWwsIHBob25lLCBzZXJ2aWNlXCIgfSk7XG4gIH1cblxuICBjb25zdCBwYXlsb2FkID0geyBuYW1lLCBjb21wYW55LCBlbWFpbCwgcGhvbmUsIHNlcnZpY2UsIG1lc3NhZ2UsIHBsYW5uZWRfdGltaW5nLCBjdXN0b21lcl90eXBlIH07XG5cbiAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsU2V0dGxlZChbXG4gICAgc2VuZEVtYWlsKHBheWxvYWQpLFxuICAgIHNlbmRXZWJob29rKHBheWxvYWQpLFxuICBdKTtcblxuICBjb25zdCBlbWFpbFJlc3VsdCA9IHJlc3VsdHNbMF07XG4gIGNvbnN0IHdlYmhvb2tSZXN1bHQgPSByZXN1bHRzWzFdO1xuXG4gIGNvbnN0IGVtYWlsT2sgPSBlbWFpbFJlc3VsdC5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCI7XG4gIGNvbnN0IHdlYmhvb2tPayA9IHdlYmhvb2tSZXN1bHQuc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiO1xuXG4gIGlmICghZW1haWxPaykge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFbWFpbCBrXHUwMEZDbGRcdTAwRTlzaSBoaWJhOlwiLCBlbWFpbFJlc3VsdC5yZWFzb24/Lm1lc3NhZ2UgfHwgZW1haWxSZXN1bHQucmVhc29uKTtcbiAgfVxuICBpZiAoIXdlYmhvb2tPaykge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJXZWJob29rIHRvdlx1MDBFMWJiXHUwMEVEdFx1MDBFMXNpIGhpYmE6XCIsIHdlYmhvb2tSZXN1bHQucmVhc29uPy5tZXNzYWdlIHx8IHdlYmhvb2tSZXN1bHQucmVhc29uKTtcbiAgfVxuXG4gIGlmIChlbWFpbE9rICYmIHdlYmhvb2tPaykge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gIH1cblxuICBpZiAoZW1haWxPayAmJiAhd2ViaG9va09rKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjA3KS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICB3YXJuaW5nOiBcIkF6IGUtbWFpbCBzaWtlcmVzZW4gZWxrXHUwMEZDbGR2ZSwgZGUgYSB3ZWJob29rIHRvdlx1MDBFMWJiXHUwMEVEdFx1MDBFMXMgc2lrZXJ0ZWxlbi5cIixcbiAgICB9KTtcbiAgfVxuXG4gIGlmICghZW1haWxPayAmJiB3ZWJob29rT2spIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDcpLmpzb24oe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIHdhcm5pbmc6IFwiQSB3ZWJob29rIHRvdlx1MDBFMWJiXHUwMEVEdFx1MDBFMXMgc2lrZXJlcywgZGUgYXogZS1tYWlsIGtcdTAwRkNsZFx1MDBFOXMgc2lrZXJ0ZWxlbi5cIixcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXMuc3RhdHVzKDUwMikuanNvbih7XG4gICAgZXJyb3I6IFwiTWluZGtcdTAwRTl0IHRvdlx1MDBFMWJiXHUwMEVEdFx1MDBFMXMgc2lrZXJ0ZWxlbi5cIixcbiAgICBlbWFpbEVycm9yOiBlbWFpbFJlc3VsdC5yZWFzb24/Lm1lc3NhZ2UgfHwgXCJJc21lcmV0bGVuIGhpYmFcIixcbiAgICB3ZWJob29rRXJyb3I6IHdlYmhvb2tSZXN1bHQucmVhc29uPy5tZXNzYWdlIHx8IFwiSXNtZXJldGxlbiBoaWJhXCIsXG4gIH0pO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCc7XG5cbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAge1xuICAgICAgbmFtZTogJ2FwaS1taWRkbGV3YXJlJyxcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgICBpZiAocmVxLnVybD8uc3RhcnRzV2l0aCgnL2FwaS8nKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IChhd2FpdCBpbXBvcnQoJy4vYXBpL3NlbmQtZW1haWwuanMnKSkuZGVmYXVsdDtcblxuICAgICAgICAgICAgICBjb25zdCBjaHVua3MgPSBbXTtcbiAgICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiByZXEpIHtcbiAgICAgICAgICAgICAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc3QgYm9keVN0ciA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZygndXRmLTgnKTtcbiAgICAgICAgICAgICAgcmVxLmJvZHkgPSBib2R5U3RyID8gSlNPTi5wYXJzZShib2R5U3RyKSA6IHt9O1xuXG4gICAgICAgICAgICAgIC8vIFBvbHlmaWxsIEV4cHJlc3Mtc3R5bGUgcmVzLnN0YXR1cygpIGFuZCByZXMuanNvbigpIG9uIG5hdGl2ZSBOb2RlIHJlc3BvbnNlXG4gICAgICAgICAgICAgIHJlcy5zdGF0dXMgPSAoY29kZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gY29kZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICByZXMuanNvbiA9IChvYmopID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIGF3YWl0IGhhbmRsZXIocmVxLCByZXMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0FQSSBtaWRkbGV3YXJlIGhpYmE6JywgZXJyKTtcbiAgICAgICAgICAgICAgaWYgKCFyZXMuaGVhZGVyc1NlbnQpIHtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ1N6ZXJ2ZXIgaGliYScgfSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaGlzdG9yeUFwaUZhbGxiYWNrOiB0cnVlLFxuICB9LFxuICBwcmV2aWV3OiB7XG4gICAgaGlzdG9yeUFwaUZhbGxiYWNrOiB0cnVlLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsZUFBZSxVQUFVLFNBQVM7QUFDaEMsUUFBTSxFQUFFLE1BQU0sU0FBUyxPQUFPLE9BQU8sU0FBUyxTQUFTLGdCQUFnQixjQUFjLElBQUk7QUFFekYsUUFBTSxPQUFPO0FBQUE7QUFBQSxrQ0FFZ0IsSUFBSTtBQUFBLGtDQUNKLE9BQU87QUFBQSxpQ0FDTCxLQUFLO0FBQUEsbUNBQ0gsS0FBSztBQUFBLDJEQUNLLE9BQU87QUFBQSx5REFDTixrQkFBa0IsUUFBRztBQUFBLDREQUN2QixpQkFBaUIsUUFBRztBQUFBO0FBQUEsU0FFdkQsV0FBVyxRQUFHO0FBQUE7QUFHckIsUUFBTSxXQUFXLE1BQU0sTUFBTSxpQ0FBaUM7QUFBQSxJQUM1RCxRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsTUFDUCxnQkFBZ0I7QUFBQSxNQUNoQixlQUFlLFVBQVUsUUFBUSxJQUFJLGNBQWM7QUFBQSxJQUNyRDtBQUFBLElBQ0EsTUFBTSxLQUFLLFVBQVU7QUFBQSxNQUNuQixNQUFNO0FBQUEsTUFDTixJQUFJLENBQUMsbUJBQW1CO0FBQUEsTUFDeEIsVUFBVTtBQUFBLE1BQ1YsU0FBUyxxQ0FBc0IsSUFBSTtBQUFBLE1BQ25DO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxDQUFDO0FBRUQsTUFBSSxDQUFDLFNBQVMsSUFBSTtBQUNoQixVQUFNLFlBQVksTUFBTSxTQUFTLEtBQUs7QUFDdEMsVUFBTSxJQUFJLE1BQU0sb0JBQW9CLFNBQVMsTUFBTSxNQUFNLFNBQVMsRUFBRTtBQUFBLEVBQ3RFO0FBRUEsU0FBTyxFQUFFLFNBQVMsU0FBUyxJQUFJLEtBQUs7QUFDdEM7QUFFQSxlQUFlLFlBQVksU0FBUztBQUNsQyxRQUFNLGlCQUFpQjtBQUFBLElBQ3JCLEdBQUc7QUFBQSxJQUNILFNBQVMsUUFBUSxXQUFXO0FBQUEsSUFDNUIsY0FBYSxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLEVBQ3RDO0FBRUEsUUFBTSxXQUFXLE1BQU0sTUFBTSxhQUFhO0FBQUEsSUFDeEMsUUFBUTtBQUFBLElBQ1IsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUI7QUFBQSxJQUM5QyxNQUFNLEtBQUssVUFBVSxjQUFjO0FBQUEsRUFDckMsQ0FBQztBQUVELE1BQUksQ0FBQyxTQUFTLElBQUk7QUFDaEIsVUFBTSxZQUFZLE1BQU0sU0FBUyxLQUFLO0FBQ3RDLFVBQU0sSUFBSSxNQUFNLGlCQUFpQixTQUFTLE1BQU0sTUFBTSxTQUFTLEVBQUU7QUFBQSxFQUNuRTtBQUVBLFNBQU8sRUFBRSxTQUFTLFdBQVcsSUFBSSxLQUFLO0FBQ3hDO0FBRUEsZUFBTyxRQUErQixLQUFLLEtBQUs7QUFDOUMsTUFBSSxJQUFJLFdBQVcsUUFBUTtBQUN6QixXQUFPLElBQUksT0FBTyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8scUJBQXFCLENBQUM7QUFBQSxFQUM3RDtBQUVBLFFBQU0sRUFBRSxNQUFNLFNBQVMsT0FBTyxPQUFPLFNBQVMsU0FBUyxnQkFBZ0IsY0FBYyxJQUFJLElBQUksUUFBUSxDQUFDO0FBRXRHLE1BQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUztBQUNyRCxXQUFPLElBQ0osT0FBTyxHQUFHLEVBQ1YsS0FBSyxFQUFFLE9BQU8saUZBQThELENBQUM7QUFBQSxFQUNsRjtBQUVBLFFBQU0sVUFBVSxFQUFFLE1BQU0sU0FBUyxPQUFPLE9BQU8sU0FBUyxTQUFTLGdCQUFnQixjQUFjO0FBRS9GLFFBQU0sVUFBVSxNQUFNLFFBQVEsV0FBVztBQUFBLElBQ3ZDLFVBQVUsT0FBTztBQUFBLElBQ2pCLFlBQVksT0FBTztBQUFBLEVBQ3JCLENBQUM7QUFFRCxRQUFNLGNBQWMsUUFBUSxDQUFDO0FBQzdCLFFBQU0sZ0JBQWdCLFFBQVEsQ0FBQztBQUUvQixRQUFNLFVBQVUsWUFBWSxXQUFXO0FBQ3ZDLFFBQU0sWUFBWSxjQUFjLFdBQVc7QUFFM0MsTUFBSSxDQUFDLFNBQVM7QUFDWixZQUFRLE1BQU0sNkJBQXVCLFlBQVksUUFBUSxXQUFXLFlBQVksTUFBTTtBQUFBLEVBQ3hGO0FBQ0EsTUFBSSxDQUFDLFdBQVc7QUFDZCxZQUFRLE1BQU0sc0NBQTZCLGNBQWMsUUFBUSxXQUFXLGNBQWMsTUFBTTtBQUFBLEVBQ2xHO0FBRUEsTUFBSSxXQUFXLFdBQVc7QUFDeEIsV0FBTyxJQUFJLE9BQU8sR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLEtBQUssQ0FBQztBQUFBLEVBQy9DO0FBRUEsTUFBSSxXQUFXLENBQUMsV0FBVztBQUN6QixXQUFPLElBQUksT0FBTyxHQUFHLEVBQUUsS0FBSztBQUFBLE1BQzFCLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxJQUNYLENBQUM7QUFBQSxFQUNIO0FBRUEsTUFBSSxDQUFDLFdBQVcsV0FBVztBQUN6QixXQUFPLElBQUksT0FBTyxHQUFHLEVBQUUsS0FBSztBQUFBLE1BQzFCLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxJQUNYLENBQUM7QUFBQSxFQUNIO0FBRUEsU0FBTyxJQUFJLE9BQU8sR0FBRyxFQUFFLEtBQUs7QUFBQSxJQUMxQixPQUFPO0FBQUEsSUFDUCxZQUFZLFlBQVksUUFBUSxXQUFXO0FBQUEsSUFDM0MsY0FBYyxjQUFjLFFBQVEsV0FBVztBQUFBLEVBQ2pELENBQUM7QUFDSDtBQXZIQSxJQUF5TztBQUF6TztBQUFBO0FBQW1PLElBQU0sY0FDdk87QUFBQTtBQUFBOzs7QUNEdU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZSxXQUFXO0FBRitGLElBQU0sMkNBQTJDO0FBS25MLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixnQkFBZ0IsUUFBUTtBQUN0QixlQUFPLFlBQVksSUFBSSxPQUFPLEtBQUssS0FBSyxTQUFTO0FBQy9DLGNBQUksSUFBSSxLQUFLLFdBQVcsT0FBTyxHQUFHO0FBQ2hDLGdCQUFJO0FBQ0Ysb0JBQU1BLFlBQVcsTUFBTSx1RUFBK0I7QUFFdEQsb0JBQU0sU0FBUyxDQUFDO0FBQ2hCLCtCQUFpQixTQUFTLEtBQUs7QUFDN0IsdUJBQU8sS0FBSyxLQUFLO0FBQUEsY0FDbkI7QUFDQSxvQkFBTSxVQUFVLE9BQU8sT0FBTyxNQUFNLEVBQUUsU0FBUyxPQUFPO0FBQ3RELGtCQUFJLE9BQU8sVUFBVSxLQUFLLE1BQU0sT0FBTyxJQUFJLENBQUM7QUFHNUMsa0JBQUksU0FBUyxDQUFDLFNBQVM7QUFDckIsb0JBQUksYUFBYTtBQUNqQix1QkFBTztBQUFBLGNBQ1Q7QUFDQSxrQkFBSSxPQUFPLENBQUMsUUFBUTtBQUNsQixvQkFBSSxDQUFDLElBQUksYUFBYTtBQUNwQixzQkFBSSxVQUFVLGdCQUFnQixrQkFBa0I7QUFBQSxnQkFDbEQ7QUFDQSxvQkFBSSxJQUFJLEtBQUssVUFBVSxHQUFHLENBQUM7QUFDM0IsdUJBQU87QUFBQSxjQUNUO0FBRUEsb0JBQU1BLFNBQVEsS0FBSyxHQUFHO0FBQUEsWUFDeEIsU0FBUyxLQUFLO0FBQ1osc0JBQVEsTUFBTSx3QkFBd0IsR0FBRztBQUN6QyxrQkFBSSxDQUFDLElBQUksYUFBYTtBQUNwQixvQkFBSSxhQUFhO0FBQ2pCLG9CQUFJLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUNoRCxvQkFBSSxJQUFJLEtBQUssVUFBVSxFQUFFLE9BQU8sZUFBZSxDQUFDLENBQUM7QUFBQSxjQUNuRDtBQUFBLFlBQ0Y7QUFDQTtBQUFBLFVBQ0Y7QUFDQSxlQUFLO0FBQUEsUUFDUCxDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sb0JBQW9CO0FBQUEsRUFDdEI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLG9CQUFvQjtBQUFBLEVBQ3RCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsiaGFuZGxlciJdCn0K
