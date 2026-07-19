export type Category = "All" | "Apparel" | "Tech" | "Accessories" | "Home";

export type Product = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  price: number;
  category: Exclude<Category, "All">;
  rating: number;
  reviews: number;
  badge?: string;
  aliases: string[];
  details: string;
  spritePosition: string;
};

export type Order = {
  id: string;
  status: string;
  summary: string;
  estimate: string;
  location: string;
  progress: number;
  steps: string[];
};

export type MessageKind =
  | "text"
  | "product"
  | "shipping"
  | "checkout"
  | "tracking"
  | "fallback"
  | "ticket";

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  body: string;
  kind?: MessageKind;
  productId?: string;
  order?: Order;
  ticketId?: string;
  timestamp: string;
};

export type ChatContext = {
  cartTotal: number;
  cartCount: number;
  lastProductId?: string;
};

export type BotReply = Omit<ChatMessage, "id" | "role" | "timestamp"> & {
  nextProductId?: string;
};
