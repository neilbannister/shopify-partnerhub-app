import { json } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { session } = await authenticate.admin(request);

    return json({
      ok: true,
      shop: session.shop,
      isOnline: session.isOnline,
    });
  } catch (error) {
    console.error("[api.shopify.sync.metrics.range] error:", error);
    return json(
      { ok: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
