import { json } from "@remix-run/node";
import { authenticate } from "../../../shopify.server";

export async function loader({ request }) {
  try {
    const { session } = await authenticate.admin(request);

    return json({
      ok: true,
      shop: session.shop,
      isOnline: session.isOnline,
    });
  } catch (error) {
    console.error("metrics/range error:", error);
    return json(
      { ok: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
