import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  ChevronDown,
  Contrast,
  Heart,
  Headphones,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Type,
  UserRound,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { generateBotReply } from "./chatbot";
import {
  categories,
  findProduct,
  FREE_SHIPPING_THRESHOLD,
  products,
} from "./data";
import type { Category, ChatMessage, Product } from "./types";

const money = (value: number) => `$${value.toFixed(2)}`;

const timestamp = () =>
  new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

const makeMessage = (
  role: ChatMessage["role"],
  body: string,
  extra: Partial<ChatMessage> = {},
): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  body,
  timestamp: timestamp(),
  ...extra,
});

const initialMessage = makeMessage(
  "assistant",
  "Hi, I’m Nova — your OneStop shopping assistant. Ask me about a product, delivery, checkout or an order.",
);

type ProductCardProps = {
  product: Product;
  quantity: number;
  highlighted: boolean;
  onAdd: (product: Product) => void;
};

function ProductCard({
  product,
  quantity,
  highlighted,
  onAdd,
}: ProductCardProps) {
  return (
    <article
      className={`product-card ${highlighted ? "is-highlighted" : ""}`}
      data-testid={`product-${product.id}`}
    >
      <div
        className="product-image"
        role="img"
        aria-label={`${product.name} product photograph`}
        style={{ backgroundPosition: product.spritePosition }}
      >
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className="icon-button favourite-button"
          aria-label={`Save ${product.name} to favourites`}
          type="button"
        >
          <Heart size={18} strokeWidth={1.8} />
        </button>
      </div>
      <div className="product-copy">
        <div className="product-meta">
          <span>{product.eyebrow}</span>
          <span className="rating" aria-label={`${product.rating} out of 5 stars`}>
            <Star size={13} fill="currentColor" aria-hidden="true" />
            {product.rating}
          </span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-action-row">
          <div>
            <strong>{money(product.price)}</strong>
            <small>{product.reviews} reviews</small>
          </div>
          <button
            className="add-button"
            onClick={() => onAdd(product)}
            type="button"
            data-testid={`add-${product.id}`}
          >
            <Plus size={17} aria-hidden="true" />
            {quantity ? `Add another · ${quantity}` : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

type ChatAssistantProps = {
  messages: ChatMessage[];
  isTyping: boolean;
  isOpen: boolean;
  isLargeText: boolean;
  isHighContrast: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  onOpenCart: () => void;
  onEscalate: () => void;
  onToggleLargeText: () => void;
  onToggleContrast: () => void;
};

function ChatAssistant({
  messages,
  isTyping,
  isOpen,
  isLargeText,
  isHighContrast,
  onClose,
  onSend,
  onOpenCart,
  onEscalate,
  onToggleLargeText,
  onToggleContrast,
}: ChatAssistantProps) {
  const [draft, setDraft] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim() || isTyping) return;
    onSend(draft);
    setDraft("");
  };

  const quickPrompts = [
    "What material is the shirt?",
    "How much more for free shipping?",
    "Track OS-1042",
  ];

  return (
    <aside
      className={`assistant-shell ${isOpen ? "is-open" : "is-closed"}`}
      aria-label="Nova shopping assistant"
      data-testid="chat-assistant"
    >
      <header className="assistant-header">
        <div className="assistant-identity">
          <span className="assistant-avatar" aria-hidden="true">
            <Sparkles size={18} />
          </span>
          <div>
            <strong>Nova</strong>
            <span>
              <i aria-hidden="true" /> Online · OneStop assistant
            </span>
          </div>
        </div>
        <div className="assistant-tools">
          <button
            type="button"
            aria-label="Toggle larger text"
            title="Toggle larger text"
            aria-pressed={isLargeText}
            onClick={onToggleLargeText}
            data-testid="large-text-toggle"
          >
            <Type size={17} />
          </button>
          <button
            type="button"
            aria-label="Toggle high contrast"
            title="Toggle high contrast"
            aria-pressed={isHighContrast}
            onClick={onToggleContrast}
            data-testid="contrast-toggle"
          >
            <Contrast size={17} />
          </button>
          <button type="button" aria-label="Minimise chat" onClick={onClose}>
            <ChevronDown size={18} />
          </button>
        </div>
      </header>

      <div
        className="message-log"
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="conversation-date">
          <span>Shopping session · Today</span>
        </div>
        {messages.map((message) => {
          const product = findProduct(message.productId);
          return (
            <div
              className={`message-row message-${message.role}`}
              key={message.id}
            >
              {message.role === "assistant" && (
                <span className="message-avatar" aria-hidden="true">
                  <Bot size={15} />
                </span>
              )}
              <div>
                <div className="message-bubble">
                  <p>{message.body}</p>

                  {message.kind === "product" && product && (
                    <div className="message-product">
                      <span
                        className="message-product-image"
                        style={{ backgroundPosition: product.spritePosition }}
                        aria-hidden="true"
                      />
                      <span>
                        <b>{product.name}</b>
                        <small>{product.category} · {money(product.price)}</small>
                      </span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </div>
                  )}

                  {message.kind === "shipping" && (
                    <div className="shipping-note">
                      <Truck size={17} aria-hidden="true" />
                      <span>Costs are calculated from the live demo cart.</span>
                    </div>
                  )}

                  {message.kind === "checkout" && (
                    <div className="checkout-guide">
                      {["Review cart", "Delivery", "Payment", "Confirmation"].map(
                        (step, index) => (
                          <span key={step}>
                            <i>{index + 1}</i>
                            {step}
                          </span>
                        ),
                      )}
                      <button type="button" onClick={onOpenCart}>
                        Review my cart
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}

                  {message.kind === "tracking" && message.order && (
                    <div className="tracking-card" data-testid="tracking-card">
                      <div className="tracking-title">
                        <span>
                          <PackageCheck size={18} />
                        </span>
                        <div>
                          <b>{message.order.status}</b>
                          <small>{message.order.id}</small>
                        </div>
                      </div>
                      <div className="tracking-progress">
                        <span style={{ width: `${message.order.progress}%` }} />
                      </div>
                      <div className="tracking-steps">
                        {message.order.steps.map((step, index) => {
                          const isComplete =
                            index < Math.ceil(message.order!.progress / 25);
                          return (
                            <span
                              key={step}
                              className={isComplete ? "is-complete" : ""}
                            >
                              <i>{isComplete ? <Check size={10} /> : null}</i>
                              {step}
                            </span>
                          );
                        })}
                      </div>
                      <p className="tracking-estimate">
                        Estimated: <strong>{message.order.estimate}</strong>
                      </p>
                    </div>
                  )}

                  {message.kind === "fallback" && (
                    <button
                      className="support-button"
                      type="button"
                      onClick={onEscalate}
                      data-testid="escalate-button"
                    >
                      <Headphones size={16} />
                      Talk to a specialist
                    </button>
                  )}

                  {message.kind === "ticket" && message.ticketId && (
                    <div className="ticket-confirmation">
                      <Check size={16} />
                      Support ticket <strong>{message.ticketId}</strong> created
                    </div>
                  )}
                </div>
                <span className="message-time">{message.timestamp}</span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="message-row message-assistant">
            <span className="message-avatar" aria-hidden="true">
              <Bot size={15} />
            </span>
            <div className="typing-indicator" aria-label="Nova is typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <div className="quick-prompts" aria-label="Suggested questions">
        {quickPrompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => onSend(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <form className="chat-form" onSubmit={submit}>
        <label htmlFor="nova-message">Message Nova</label>
        <div className="chat-input-wrap">
          <input
            id="nova-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about products or your order..."
            autoComplete="off"
            maxLength={240}
            data-testid="chat-input"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim() || isTyping}
            data-testid="send-message"
          >
            <Send size={18} />
          </button>
        </div>
        <p>Prototype responses use verified demo data. No personal data is stored.</p>
      </form>
    </aside>
  );
}

export default function App() {
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastProductId, setLastProductId] = useState<string>();
  const [highlightedProductId, setHighlightedProductId] = useState<string>();
  const [isChatOpen, setIsChatOpen] = useState(() => window.innerWidth >= 1120);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [coachCart, setCoachCart] = useState(false);
  const [toast, setToast] = useState("");

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => cart[product.id])
        .map((product) => ({ product, quantity: cart[product.id] })),
    [cart],
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const freeShippingGap = Math.max(
    FREE_SHIPPING_THRESHOLD - cartTotal,
    0,
  );
  const shippingProgress = Math.min(
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const searchMatch =
        !query ||
        `${product.name} ${product.eyebrow} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(query);
      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("large-text-mode", isLargeText);
    root.classList.toggle("high-contrast-mode", isHighContrast);

    return () => {
      root.classList.remove("large-text-mode", "high-contrast-mode");
    };
  }, [isLargeText, isHighContrast]);

  const addToCart = (product: Product) => {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1,
    }));
    setToast(`${product.name} added to your cart`);
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((current) => {
      const nextQuantity = Math.max((current[id] ?? 0) + change, 0);
      const next = { ...current };
      if (nextQuantity === 0) delete next[id];
      else next[id] = nextQuantity;
      return next;
    });
  };

  const sendMessage = (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isTyping) return;
    setIsChatOpen(true);
    setMessages((current) => [...current, makeMessage("user", message)]);
    setIsTyping(true);

    // A short delay demonstrates an asynchronous support experience while
    // keeping the entire assessed prototype deterministic and offline.
    window.setTimeout(() => {
      const reply = generateBotReply(message, {
        cartTotal,
        cartCount,
        lastProductId,
      });
      if (reply.nextProductId) {
        setLastProductId(reply.nextProductId);
        setHighlightedProductId(reply.nextProductId);
      }
      if (reply.kind === "checkout" && cartCount > 0) {
        setCoachCart(true);
      }
      setMessages((current) => [
        ...current,
        makeMessage("assistant", reply.body, reply),
      ]);
      setIsTyping(false);
    }, 520);
  };

  const escalateToHuman = () => {
    if (isTyping) return;
    const ticketId = `CS-${Math.floor(2000 + Math.random() * 7000)}`;
    setMessages((current) => [
      ...current,
      makeMessage(
        "assistant",
        "Done — a support specialist can now continue from this conversation. In a production system, the transcript would be passed securely after consent.",
        { kind: "ticket", ticketId },
      ),
    ]);
  };

  const openCart = () => {
    setCartOpen(true);
    setCoachCart(false);
  };

  const toggleLargeText = () => {
    const nextValue = !isLargeText;
    setIsLargeText(nextValue);
    setToast(`Larger text ${nextValue ? "enabled" : "disabled"}`);
  };

  const toggleHighContrast = () => {
    const nextValue = !isHighContrast;
    setIsHighContrast(nextValue);
    setToast(`High contrast ${nextValue ? "enabled" : "disabled"}`);
  };

  return (
    <div
      className={`app ${isLargeText ? "large-text" : ""} ${isHighContrast ? "high-contrast" : ""}`}
    >
      <a className="skip-link" href="#products">
        Skip to products
      </a>

      <div className="announcement">
        <span>Free standard shipping over $50</span>
        <span className="announcement-divider" aria-hidden="true" />
        <span>30-day free returns</span>
        <button type="button">
          Shop with confidence <ArrowUpRight size={14} />
        </button>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <button className="mobile-menu" aria-label="Open navigation" type="button">
            <Menu size={22} />
          </button>
          <a className="brand" href="#" aria-label="OneStop home">
            <span className="brand-mark" aria-hidden="true">
              O
            </span>
            <span>OneStop</span>
          </a>

          <nav aria-label="Primary navigation">
            <a className="is-active" href="#products">New in</a>
            <a href="#products">Clothing</a>
            <a href="#products">Technology</a>
            <a href="#products">Home</a>
          </nav>

          <div className="header-search">
            <Search size={18} aria-hidden="true" />
            <label htmlFor="product-search">Search products</label>
            <input
              id="product-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search OneStop"
            />
            <kbd>⌘ K</kbd>
          </div>

          <div className="header-actions">
            <button type="button" aria-label="Your account">
              <UserRound size={20} />
            </button>
            <button
              className={coachCart ? "coach-highlight" : ""}
              onClick={openCart}
              type="button"
              aria-label={`Open cart with ${cartCount} items`}
              data-testid="cart-button"
            >
              <ShoppingBag size={20} />
              <span className="cart-label">Cart</span>
              {cartCount > 0 && <b>{cartCount}</b>}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="section-kicker">
              <Sparkles size={15} />
              The thoughtful everyday edit
            </span>
            <h1>
              Everything you need.
              <br />
              <em>Nothing you don’t.</em>
            </h1>
            <p>
              Considered essentials for work, home and everywhere between —
              backed by instant answers from Nova.
            </p>
            <div className="hero-actions">
              <a className="primary-cta" href="#products">
                Explore the collection <ArrowRight size={18} />
              </a>
              <button type="button" onClick={() => setIsChatOpen(true)}>
                <MessageCircle size={17} />
                Ask Nova
              </button>
            </div>
          </div>
          <div className="hero-panel">
            <span className="hero-panel-label">OneStop standard</span>
            <div className="hero-metric">
              <strong>4.8</strong>
              <span>
                <span className="hero-stars" aria-label="4.8 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} fill="currentColor" />
                  ))}
                </span>
                Average product rating
              </span>
            </div>
            <div className="benefit-list">
              <span><Truck size={18} /> Clear delivery estimates</span>
              <span><RotateCcw size={18} /> Free 30-day returns</span>
              <span><ShieldCheck size={18} /> Secure checkout</span>
            </div>
            <div className="hero-orb orb-one" aria-hidden="true" />
            <div className="hero-orb orb-two" aria-hidden="true" />
          </div>
        </section>

        <section className="shopping-workspace">
          <div className="catalogue">
            <div className="catalogue-heading" id="products">
              <div>
                <span className="section-kicker">Curated for right now</span>
                <h2>Everyday favourites</h2>
                <p>Useful, well made and ready when you are.</p>
              </div>
              <div className="catalogue-count">
                <span>{visibleProducts.length} products</span>
                <button type="button">
                  Featured <ChevronDown size={15} />
                </button>
              </div>
            </div>

            <div className="catalogue-filters" aria-label="Product categories">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={category === item ? "is-active" : ""}
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {visibleProducts.length ? (
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={cart[product.id] ?? 0}
                    highlighted={highlightedProductId === product.id}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-results">
                <Search size={24} />
                <h3>No matching products</h3>
                <p>Try a different search or browse all categories.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}

            <footer className="catalogue-footer">
              <span>Thoughtfully selected · Clearly explained</span>
              <p>
                This CEN207 prototype uses simulated product, order and support
                data for demonstration only.
              </p>
            </footer>
          </div>

          <ChatAssistant
            messages={messages}
            isTyping={isTyping}
            isOpen={isChatOpen}
            isLargeText={isLargeText}
            isHighContrast={isHighContrast}
            onClose={() => setIsChatOpen(false)}
            onSend={sendMessage}
            onOpenCart={openCart}
            onEscalate={escalateToHuman}
            onToggleLargeText={toggleLargeText}
            onToggleContrast={toggleHighContrast}
          />
        </section>
      </main>

      {!isChatOpen && (
        <button
          className="chat-launcher"
          type="button"
          onClick={() => setIsChatOpen(true)}
          aria-label="Open Nova shopping assistant"
        >
          <span><Sparkles size={19} /></span>
          <b>Ask Nova</b>
          <small>Online now</small>
        </button>
      )}

      {cartOpen && (
        <div
          className="drawer-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCartOpen(false);
          }}
        >
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            data-testid="cart-drawer"
          >
            <header>
              <div>
                <span>Your selection</span>
                <h2 id="cart-title">Shopping cart</h2>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
              >
                <X size={20} />
              </button>
            </header>

            {cartItems.length ? (
              <>
                <div className="shipping-progress-card">
                  <div>
                    <Truck size={18} />
                    <p>
                      {freeShippingGap > 0 ? (
                        <>Add <strong>{money(freeShippingGap)}</strong> for free shipping</>
                      ) : (
                        <strong>Free standard shipping unlocked</strong>
                      )}
                    </p>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${shippingProgress}%` }} />
                  </div>
                </div>

                <div className="cart-lines">
                  {cartItems.map(({ product, quantity }) => (
                    <div className="cart-line" key={product.id}>
                      <span
                        className="cart-line-image"
                        style={{ backgroundPosition: product.spritePosition }}
                        aria-hidden="true"
                      />
                      <div>
                        <span>{product.category}</span>
                        <h3>{product.name}</h3>
                        <strong>{money(product.price)}</strong>
                      </div>
                      <div className="quantity-control">
                        <button
                          type="button"
                          aria-label={`Remove one ${product.name}`}
                          onClick={() => updateQuantity(product.id, -1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          aria-label={`Add one ${product.name}`}
                          onClick={() => updateQuantity(product.id, 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checkout-steps" aria-label="Checkout progress">
                  {["Review", "Delivery", "Payment", "Confirm"].map((step, index) => (
                    <span
                      key={step}
                      className={checkoutStep >= index + 1 ? "is-active" : ""}
                    >
                      <i>{checkoutStep > index + 1 ? <Check size={11} /> : index + 1}</i>
                      {step}
                    </span>
                  ))}
                </div>

                <div className="cart-summary">
                  <span><span>Subtotal</span><strong>{money(cartTotal)}</strong></span>
                  <span>
                    <span>Standard delivery</span>
                    <strong>{freeShippingGap === 0 ? "Free" : "$7.95"}</strong>
                  </span>
                  <span className="cart-total">
                    <span>Total</span>
                    <strong>
                      {money(cartTotal + (freeShippingGap === 0 ? 0 : 7.95))}
                    </strong>
                  </span>
                </div>

                <button
                  className="checkout-button"
                  type="button"
                  onClick={() => {
                    if (checkoutStep < 4) {
                      setCheckoutStep((step) => step + 1);
                      setToast("Demo checkout moved to the next step");
                    } else {
                      setToast("Prototype checkout complete");
                    }
                  }}
                >
                  {checkoutStep < 4 ? "Continue securely" : "Place demo order"}
                  <ArrowRight size={18} />
                </button>
                <p className="secure-note">
                  <ShieldCheck size={15} />
                  Demo checkout only — no payment information is collected.
                </p>
              </>
            ) : (
              <div className="empty-cart">
                <ShoppingBag size={28} />
                <h3>Your cart is ready for something good</h3>
                <p>Add an everyday essential, then ask Nova about delivery.</p>
                <button type="button" onClick={() => setCartOpen(false)}>
                  Browse products
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      <div
        className={`toast ${toast ? "is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        <Check size={16} />
        {toast}
      </div>
    </div>
  );
}
