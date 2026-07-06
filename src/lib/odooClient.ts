/**
 * Odoo JSON-RPC Client for Next.js
 */

const ODOO_URL = process.env.ODOO_URL || "http://localhost:8069";
const ODOO_DB = process.env.ODOO_DB || "restaurant_demo";
const ODOO_USER = process.env.ODOO_USER || "ziad46333@gmail.com";
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || "admin";

let odooSessionId: string | null = null;

export async function authenticateOdoo() {
  if (odooSessionId) return odooSessionId;

  const authPayload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      db: ODOO_DB,
      login: ODOO_USER,
      password: ODOO_PASSWORD,
    },
  };

  try {
    const authRes = await fetch(`${ODOO_URL}/web/session/authenticate`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify(authPayload),
      cache: "no-store",
    });

    const cookies = authRes.headers.get("set-cookie");
    if (cookies) {
      odooSessionId = cookies.split(";")[0];
    }
    return odooSessionId;
  } catch (error) {
    console.error("Odoo Auth Error:", error);
    return null;
  }
}

export async function odooCall(model: string, method: string, args: any[] = [], kwargs: any = {}) {
  const sessionId = await authenticateOdoo();
  if (!sessionId) {
    throw new Error("Could not authenticate with Odoo");
  }

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: { model, method, args, kwargs },
  };

  const res = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: sessionId,
      "ngrok-skip-browser-warning": "true"
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json();
  if (data.error) {
    // Session might have expired
    if (data.error.data && data.error.data.name === 'odoo.exceptions.AccessError') {
      odooSessionId = null; // force re-auth
      return odooCall(model, method, args, kwargs);
    }
    const errorMessage = data.error.data?.message || data.error.message;
    console.error("Odoo RPC Error Details:", data.error.data);
    throw new Error(errorMessage);
  }
  return data.result;
}
