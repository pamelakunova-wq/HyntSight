import { getStripe } from "./client";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";

export async function syncSubscriptionState(userId: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (!profile?.stripe_customer_id) return;

  try {
    const stripe = getStripe();
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      await supabase
        .from("profiles")
        .update({ plan: "spark", stripe_subscription_id: null })
        .eq("id", userId);
      return;
    }

    const sub = subscriptions.data[0];
    const priceId = sub.items.data[0]?.price.id;
    let plan: Plan = "spark";

    if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = "pro";
    else if (priceId === process.env.STRIPE_STUDIO_PRICE_ID) plan = "studio";

    await supabase
      .from("profiles")
      .update({ plan, stripe_subscription_id: sub.id })
      .eq("id", userId);
  } catch (err) {
    console.error("Stripe sync error:", err);
  }
}
