import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";

export const dynamic = "force-dynamic";

function subscriptionIdFromSession(
  sub: Stripe.Checkout.Session["subscription"]
): string | null {
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

function customerIdFromSession(
  customer: Stripe.Checkout.Session["customer"]
): string | null {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

function stripeCustomerId(
  customer:
    | Stripe.Invoice["customer"]
    | Stripe.Subscription["customer"]
): string | null {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

function planFromPriceId(priceId: string | undefined): Plan {
  if (!priceId) return "spark";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_STUDIO_PRICE_ID) return "studio";
  return "spark";
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      if (!userId) break;

      const subscriptionId = subscriptionIdFromSession(session.subscription);
      const customerId = customerIdFromSession(session.customer);
      if (!subscriptionId || !customerId) break;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price.id;
      const plan = planFromPriceId(priceId);

      await supabase
        .from("profiles")
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan,
          billing_period_start: new Date().toISOString(),
        })
        .eq("id", userId);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = stripeCustomerId(subscription.customer);
      if (!customerId) break;

      const priceId = subscription.items.data[0]?.price.id;
      const plan = planFromPriceId(priceId);

      await supabase
        .from("profiles")
        .update({ plan })
        .eq("stripe_customer_id", customerId);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = stripeCustomerId(subscription.customer);
      if (!customerId) break;

      await supabase
        .from("profiles")
        .update({ plan: "spark", stripe_subscription_id: null })
        .eq("stripe_customer_id", customerId);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = stripeCustomerId(invoice.customer);
      if (!customerId) break;

      await supabase
        .from("profiles")
        .update({
          designs_used_this_period: 0,
          billing_period_start: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
