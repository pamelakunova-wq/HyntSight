import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Stripe features are unavailable."
      );
    }
    _stripe = new Stripe(key, {
      apiVersion: "2025-12-18.acacia" as any,
      typescript: true,
    });
  }
  return _stripe;
}

