import {
  findProduct,
  FREE_SHIPPING_THRESHOLD,
  orders,
  products,
} from "./data";
import type { BotReply, ChatContext } from "./types";

const money = (value: number) => `$${value.toFixed(2)}`;

const containsAny = (value: string, terms: string[]) =>
  terms.some((term) => value.includes(term));

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[?.!,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const detectProduct = (input: string, lastProductId?: string) => {
  const exactMatch = products.find((product) =>
    product.aliases.some((alias) => input.includes(alias)),
  );
  if (exactMatch) return exactMatch;

  if (
    lastProductId &&
    containsAny(input, ["it", "that", "available", "colour", "color"])
  ) {
    return findProduct(lastProductId);
  }

  return undefined;
};

export function generateBotReply(
  rawInput: string,
  context: ChatContext,
): BotReply {
  // Responses come from verified local product, policy and order data. The
  // intent router never invents an answer when the request is out of scope.
  const input = normalise(rawInput);
  const orderId = rawInput.toUpperCase().match(/OS-\d{4}/)?.[0];

  if (orderId || containsAny(input, ["track order", "where is my order"])) {
    if (!orderId) {
      return {
        body: "Please share your demo order number. Try OS-1042.",
        kind: "tracking",
      };
    }

    const order = orders[orderId];
    if (!order) {
      return {
        body: `I couldn't find ${orderId} in the demo order records. Check the number or ask a support specialist to help.`,
        kind: "fallback",
      };
    }

    return {
      body: `${order.id} is ${order.status.toLowerCase()}. It is currently at the ${order.location} and is expected ${order.estimate}.`,
      kind: "tracking",
      order,
    };
  }

  if (
    containsAny(input, [
      "free shipping",
      "free delivery",
      "shipping gap",
      "how much more",
    ])
  ) {
    const gap = Math.max(FREE_SHIPPING_THRESHOLD - context.cartTotal, 0);
    if (context.cartCount === 0) {
      return {
        body: `Standard shipping is free when your cart reaches ${money(FREE_SHIPPING_THRESHOLD)}. Add an item and I’ll calculate the exact difference for you.`,
        kind: "shipping",
      };
    }
    if (gap === 0) {
      return {
        body: `You’ve unlocked free standard shipping. Your current cart total is ${money(context.cartTotal)}.`,
        kind: "shipping",
      };
    }
    return {
      body: `You’re ${money(gap)} away from free standard shipping. Your current cart total is ${money(context.cartTotal)}.`,
      kind: "shipping",
    };
  }

  if (
    containsAny(input, [
      "checkout",
      "check out",
      "pay",
      "payment",
      "complete my order",
    ])
  ) {
    if (context.cartCount === 0) {
      return {
        body: "Your cart is empty right now. Add a product first, then I can guide you through checkout.",
        kind: "checkout",
      };
    }
    return {
      body: `Absolutely. You have ${context.cartCount} item${context.cartCount === 1 ? "" : "s"} in your cart. I’ll keep checkout clear and show all delivery costs before payment.`,
      kind: "checkout",
    };
  }

  if (containsAny(input, ["return", "refund", "exchange"])) {
    return {
      body: "You can return unused items in their original condition within 30 days. Return shipping is free, and refunds go back to the original payment method.",
      kind: "text",
    };
  }

  if (
    containsAny(input, ["shipping", "delivery", "express", "arrive"]) &&
    context.cartCount === 0
  ) {
    return {
      body: "Standard delivery takes 3–5 business days and is free over $50. Express delivery costs $15 and usually arrives in 1–2 business days.",
      kind: "shipping",
    };
  }

  if (
    containsAny(input, [
      "repair",
      "fix my",
      "broken",
      "technical support",
      "warranty claim",
    ])
  ) {
    return {
      body: "I don’t have verified repair or technical-support information, so I won’t guess. I can connect you with a human support specialist instead.",
      kind: "fallback",
    };
  }

  const product = detectProduct(input, context.lastProductId);
  if (product) {
    return {
      body: `${product.name}: ${product.details} It is ${money(product.price)}.`,
      kind: "product",
      productId: product.id,
      nextProductId: product.id,
    };
  }

  if (
    containsAny(input, [
      "hello",
      " hi ",
      "hey",
      "good morning",
      "good afternoon",
    ]) ||
    input === "hi"
  ) {
    return {
      body: "Hi, I’m Nova. I can help with products, shipping, checkout, returns and demo order tracking.",
      kind: "text",
    };
  }

  if (containsAny(input, ["help", "what can you do"])) {
    return {
      body: "Try asking about a product’s material or compatibility, your free-shipping progress, checkout, returns, or order OS-1042.",
      kind: "text",
    };
  }

  return {
    body: "I don’t have verified information for that request, so I won’t guess. I can connect you with a human support specialist instead.",
    kind: "fallback",
  };
}
