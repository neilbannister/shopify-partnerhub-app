import { json } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { session } = await authenticate.admin(request);
    return json({ ok: true, shop: session.shop, isOnline: session.isOnline });
  } catch (e) {
    console.error("[api.shopify.sync.metrics.range] error:", e);
    return json(
      { ok: false, error: e?.message || String(e) },
      { status: 401 }
    );
  }
}
