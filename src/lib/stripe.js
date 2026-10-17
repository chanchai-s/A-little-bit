import { loadStripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error(
    "[stripe] VITE_STRIPE_PUBLISHABLE_KEY is not set. Add it to your .env file."
  );
}

export const stripePromise = loadStripe(publishableKey);
