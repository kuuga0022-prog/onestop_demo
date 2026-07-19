import type { Category, Order, Product } from "./types";

export const FREE_SHIPPING_THRESHOLD = 50;

export const categories: Category[] = [
  "All",
  "Apparel",
  "Tech",
  "Accessories",
  "Home",
];

// The catalogue is intentionally local so the assessed demo works without
// internet access, credentials or a production product API.
export const products: Product[] = [
  {
    id: "classic-shirt",
    name: "The Everyday Shirt",
    eyebrow: "OneStop Essentials",
    description: "Soft, breathable cotton with a clean tailored finish.",
    price: 29.99,
    category: "Apparel",
    rating: 4.9,
    reviews: 128,
    badge: "Bestseller",
    aliases: ["shirt", "cotton", "fabric", "material", "size", "sizes"],
    details:
      "It is made from 100% combed cotton and is available in sizes S, M, L and XL. The fit is relaxed through the body.",
    spritePosition: "0% 0%",
  },
  {
    id: "aura-headphones",
    name: "Aura Headphones",
    eyebrow: "Studio Series",
    description: "Immersive sound, active noise control, 30-hour battery.",
    price: 89,
    category: "Tech",
    rating: 4.8,
    reviews: 94,
    badge: "New",
    aliases: ["headphones", "headset", "noise cancellation", "battery"],
    details:
      "Aura offers active noise cancellation, a 30-hour battery and multipoint Bluetooth for two connected devices.",
    spritePosition: "50% 0%",
  },
  {
    id: "arc-phone",
    name: "Arc Phone",
    eyebrow: "OneStop Mobile",
    description: "A vivid 6.5-inch display and all-day performance.",
    price: 499,
    category: "Tech",
    rating: 4.7,
    reviews: 211,
    aliases: ["phone", "smartphone", "mobile", "waterproof", "camera"],
    details:
      "Arc has a 6.5-inch OLED display, 128GB storage, a 48MP camera and IP67 water resistance.",
    spritePosition: "100% 0%",
  },
  {
    id: "pulse-watch",
    name: "Pulse Watch",
    eyebrow: "Wellness Tech",
    description: "Heart rate, sleep and movement insights in one glance.",
    price: 199,
    category: "Tech",
    rating: 4.8,
    reviews: 76,
    aliases: ["watch", "smartwatch", "heart rate", "ios", "android"],
    details:
      "Pulse tracks heart rate, steps and sleep. It is compatible with both iOS and Android devices.",
    spritePosition: "0% 100%",
  },
  {
    id: "field-backpack",
    name: "Field Backpack",
    eyebrow: "Everyday Carry",
    description: "Structured canvas with a padded 16-inch laptop sleeve.",
    price: 74.5,
    category: "Accessories",
    rating: 4.9,
    reviews: 63,
    badge: "Low stock",
    aliases: ["bag", "backpack", "laptop", "canvas"],
    details:
      "The Field Backpack uses water-resistant cotton canvas and includes a padded sleeve for laptops up to 16 inches.",
    spritePosition: "50% 100%",
  },
  {
    id: "halo-lamp",
    name: "Halo Table Lamp",
    eyebrow: "Home Edit",
    description: "Warm, dimmable light with a sculptural silhouette.",
    price: 59,
    category: "Home",
    rating: 4.6,
    reviews: 51,
    aliases: ["lamp", "light", "dimmable", "desk"],
    details:
      "Halo uses a warm 2700K LED, offers three dimming levels and includes a two-year warranty.",
    spritePosition: "100% 100%",
  },
];

// These records simulate the order data that a production chatbot would read
// from OneStop's CRM or order-management system.
export const orders: Record<string, Order> = {
  "OS-1042": {
    id: "OS-1042",
    status: "Shipped",
    summary: "Everyday Shirt · Ivory · Size M",
    estimate: "Tuesday, 21 July",
    location: "Sydney distribution centre",
    progress: 68,
    steps: ["Order placed", "Packed", "Shipped", "Out for delivery"],
  },
  "OS-2077": {
    id: "OS-2077",
    status: "Out for delivery",
    summary: "Aura Headphones · Deep teal",
    estimate: "Today, by 6:00 PM",
    location: "With local courier",
    progress: 92,
    steps: ["Order placed", "Packed", "Shipped", "Out for delivery"],
  },
};

export const findProduct = (id?: string) =>
  products.find((product) => product.id === id);
