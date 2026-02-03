import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

// 1) Harden scopes (trim whitespace, remove empties)
const scopes =
  process.env.SCOPES?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

// 2) Use a stable API version your SDK supports.
//    IMPORTANT: pick ONE that actually exists in your installed package.
//    Common stable choices are ApiVersion.April25 / ApiVersion.July25 (depending on SDK).
const STABLE_VERSION = ApiVersion.July25; // <-- change to whatever your SDK supports

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: STABLE_VERSION,
  scopes,
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,

  // This does NOT “force” non-expiring tokens; it just opts out of future behavior.
  // Safe to keep, but it won't fix your 500 by itself.
  future: {
    expiringOfflineAccessTokens: false,
  },

  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;

// Export the same stable version so the rest of your code uses it consistently
export const apiVersion = STABLE_VERSION;

export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
