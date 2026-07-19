# OneStop Conversational Commerce Demo

A responsive React and TypeScript prototype developed for CEN207 Assessment 2.
It simulates a premium ecommerce storefront and demonstrates how a
conversational shopping assistant can support customers throughout the shopping
journey.

The application runs entirely with local demo data. It does not require an API
key, backend server, database or internet connection after the npm packages have
been installed.

## Contents

- [Technology stack](#technology-stack)
- [System requirements](#system-requirements)
- [Install and start](#install-and-start)
- [VS Code debugging](#vs-code-debugging)
- [Production build](#production-build)
- [Chatbot capabilities](#chatbot-capabilities)
- [Storefront and cart capabilities](#storefront-and-cart-capabilities)
- [Two-minute demonstration](#two-minute-demonstration)
- [Project structure](#project-structure)
- [How the chatbot works](#how-the-chatbot-works)
- [Accessibility and responsive behaviour](#accessibility-and-responsive-behaviour)
- [Current limitations](#current-limitations)
- [Troubleshooting](#troubleshooting)

## Technology stack

- React 19
- TypeScript 5
- Vite 8
- Lucide React icons
- Local deterministic intent routing
- CSS-based responsive design and accessibility modes

## System requirements

- Node.js `20.19.0+` or `22.12.0+`
- npm
- Windows, macOS or Linux
- VS Code and Chrome are recommended for debugging

Check the installed versions:

```powershell
node --version
npm --version
```

## Install and start

Open the complete `OneStop_Chatbot_Demo` folder in VS Code. Do not open only
the `src` folder.

Open **Terminal → New Terminal**, then run:

```powershell
npm ci
npm run dev
```

`npm ci` installs the exact versions recorded in `package-lock.json`. For normal
development after changing dependencies, use `npm install` instead.

Vite prints a local address, normally:

```text
http://localhost:5173
```

Open that address in Chrome. Keep the terminal running while using the
application.

To stop the development server:

```text
Ctrl + C
```

### Available npm commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run build` | Run TypeScript checking and create a production build |
| `npm run preview` | Serve the production build locally |

## VS Code debugging

The project contains ready-to-use configurations in `.vscode/launch.json` and
`.vscode/tasks.json`.

### Option A: Debug with F5

1. Install dependencies once with `npm ci`.
2. Open **Run and Debug** using `Ctrl + Shift + D`.
3. Select **OneStop: Chrome + Vite**.
4. Press `F5`.
5. VS Code starts Vite, opens Chrome and attaches the JavaScript debugger.
6. Add breakpoints directly in the TypeScript or TSX source files.
7. Stop debugging with `Shift + F5`.

Do not start a second `npm run dev` before using this F5 configuration because
its pre-launch task already starts Vite.

### Option B: Start Vite manually

Run:

```powershell
npm run dev
```

Open the local URL in Chrome and use Chrome DevTools for console, network,
responsive-layout and accessibility inspection.

### Recommended breakpoint locations

#### Chatbot intent and response debugging

Open `src/chatbot.ts` and place a breakpoint inside `generateBotReply()`.

Inspect:

- `rawInput`: the original customer message
- `input`: the normalised message
- `context.cartTotal`: current cart value
- `context.cartCount`: current number of cart items
- `context.lastProductId`: product used for follow-up questions
- `reply.kind`: product, shipping, checkout, tracking, fallback or text

#### Chat request lifecycle

Open `src/App.tsx` and place a breakpoint inside `sendMessage()`.

This function:

1. Adds the customer message to the conversation.
2. Displays the typing indicator.
3. Passes the message and live cart context to `generateBotReply()`.
4. Adds the assistant response to the conversation.
5. Highlights a recognised product or activates checkout guidance.

#### Shopping-cart state

Place breakpoints inside:

- `addToCart()` to inspect products being added
- `updateQuantity()` to inspect quantity changes and item removal
- the `cartTotal` calculation to inspect shipping calculations

React Developer Tools can also be used to inspect component state and renders.

## Production build

Run:

```powershell
npm run build
```

This performs TypeScript validation and writes the production files to `dist/`.

Test the production build locally:

```powershell
npm run preview
```

Open the URL printed by Vite. The production build is still a frontend-only
demo and does not require a backend server.

## Chatbot capabilities

Nova is a deterministic, rule-based assistant. Responses are generated from
verified local product, policy, cart and order data.

### Product information

Nova recognises the following products:

| Product | Supported information |
| --- | --- |
| The Everyday Shirt | 100% combed cotton, S/M/L/XL sizes, relaxed fit |
| Aura Headphones | Active noise cancellation, 30-hour battery, multipoint Bluetooth |
| Arc Phone | 6.5-inch OLED, 128GB, 48MP camera, IP67 water resistance |
| Pulse Watch | Heart rate, steps, sleep, iOS and Android compatibility |
| Field Backpack | Water-resistant canvas, padded sleeve for a 16-inch laptop |
| Halo Table Lamp | 2700K LED, three dimming levels, two-year warranty |

Example prompts:

```text
What material is the shirt and what sizes are available?
How long is the headphone battery?
Is the phone waterproof?
Does the watch work with Android?
Is the backpack water resistant?
Is the lamp dimmable?
```

A recognised product response also highlights the corresponding product card.

### Live free-shipping calculation

The free standard-shipping threshold is `$50.00`. Nova reads the live cart
total and calculates the remaining amount.

```text
How much more do I need for free shipping?
```

After one `$29.99` shirt is added, the expected answer is `$20.01`.

Nova also handles an empty cart and a cart that has already unlocked free
shipping.

### Checkout guidance

```text
Can you help me check out?
```

Nova presents:

```text
Review cart → Delivery → Payment → Confirmation
```

The **Review my cart** action opens the cart drawer. The checkout controls are
simulated and never collect real payment data.

### Returns and delivery information

Nova can explain the local demo policies:

- Unused items can be returned in their original condition within 30 days.
- Return shipping is free.
- Refunds use the original payment method.
- Standard delivery takes 3–5 business days.
- Standard delivery is free when the cart reaches `$50.00`.
- Express delivery costs `$15.00` and normally takes 1–2 business days.

Example prompts:

```text
What is your return policy?
Can I get a refund?
How long does delivery take?
How much is express delivery?
```

### Demo order tracking

Two local order records are available:

```text
Track order OS-1042
Track order OS-2077
```

The tracking card displays order status, location, estimated delivery time and
the progress stages from order placement to delivery.

An unknown order number returns a safe fallback instead of fabricated tracking
information.

### Human escalation

Unsupported questions produce a fallback response and a **Talk to a
specialist** button.

Example:

```text
Can you repair my laptop?
```

Selecting the button creates a simulated support ticket such as `CS-4868`.
A production implementation could securely transfer the conversation to a CRM
or support platform after customer consent.

### Basic conversation and controls

Nova also supports greetings, `Help`, and `What can you do?`.

The chat interface includes:

- Suggested question buttons
- A typing indicator
- Minimise and reopen controls
- Larger-text mode
- High-contrast mode
- Screen-reader status announcements

## Storefront and cart capabilities

The storefront supports:

- Six product cards with descriptions, prices, ratings, reviews and badges
- Search by product name, description or category
- All, Apparel, Tech, Accessories and Home filters
- Add to cart and add another
- Increase and decrease item quantities
- Remove an item by reducing its quantity to zero
- Live cart count and subtotal
- `$50.00` free-shipping progress
- `$7.95` standard-delivery charge below the threshold
- Live order-total calculation
- Four-step simulated checkout
- Responsive desktop, tablet and mobile layouts

## Two-minute demonstration

For a reliable recording, use this sequence:

1. Ask:

   ```text
   What material is the shirt and what sizes are available?
   ```

2. Click **Add to cart** on **The Everyday Shirt**.

3. Ask:

   ```text
   How much more do I need for free shipping?
   ```

   Expected result: `$20.01`.

4. Ask:

   ```text
   Can you help me check out?
   ```

5. Select **Review my cart** and show the four checkout steps and transparent
   cost summary.

6. Close the cart and ask:

   ```text
   Track order OS-1042
   ```

7. Enable larger text and high-contrast mode from Nova's header.

8. Ask:

   ```text
   Can you repair my laptop?
   ```

9. Select **Talk to a specialist** to create a simulated support ticket.

See `ASSESSMENT_GUIDE.md` for a timed narration script and report-ready
technical explanation.

## Project structure

```text
OneStop_Chatbot_Demo/
├── .vscode/
│   ├── launch.json        VS Code Chrome debugging configuration
│   └── tasks.json         Vite pre-launch task
├── design-system/         UI design-system notes
├── dist/                  Current production build
├── public/
│   └── product-sprite.png Local product-image asset
├── src/
│   ├── App.tsx            Storefront, cart, chatbot UI and React state
│   ├── chatbot.ts         Intent recognition and verified responses
│   ├── data.ts            Products, policies and mock order data
│   ├── main.tsx           React application entry point
│   ├── styles.css         Visual system, layout and accessibility modes
│   └── types.ts           Shared TypeScript types
├── ASSESSMENT_GUIDE.md    Two-minute script and report explanation
├── index.html             Vite HTML entry point
├── package.json           Dependencies and npm commands
├── package-lock.json      Reproducible dependency versions
├── tsconfig.json          TypeScript configuration
└── vite.config.ts         Vite configuration
```

`node_modules/` is generated locally by npm and should not be submitted or
committed to version control.

## How the chatbot works

The chatbot does not call a large language model. `generateBotReply()`:

1. Converts the message to lowercase and removes punctuation.
2. Detects an order number or supported intent.
3. Identifies product aliases such as `shirt`, `headphones` or `watch`.
4. Reads verified information from `src/data.ts`.
5. Uses live React cart state for free-shipping calculations.
6. Returns a structured response type used by the interface.
7. Falls back to human escalation if no verified response exists.

This design prevents unsupported questions from producing invented answers and
keeps the assessed demonstration repeatable.

## Accessibility and responsive behaviour

The interface includes:

- Semantic headings, buttons, forms and dialog roles
- Text labels and accessible names for controls
- Visible keyboard focus indicators
- Screen-reader live regions for messages and notifications
- Larger-text and high-contrast modes
- A skip-to-products link
- Minimum touch-friendly control sizes
- Reduced-motion support
- Responsive product grids and mobile chatbot launcher

On widths below approximately `1120px`, Nova begins minimised. Select **Ask
Nova** at the bottom-right to open it.

Recommended responsive checks in Chrome DevTools:

- 375px mobile
- 768px tablet
- 1024px small desktop/tablet landscape
- 1440px desktop

## Current limitations

- The chatbot recognises English keywords only.
- Products must be added through the product-card button; chat cannot directly
  modify the cart.
- The favourite buttons are visual placeholders.
- There are no separate product-detail or colour/size selection pages.
- Login, address entry, payment and order creation are simulated.
- Products, policies, tracking and support tickets use mock local data.
- Cart and conversation state reset after a browser refresh.
- The application does not use generative AI or support unrestricted questions.
- No personal or payment information is stored.

## Troubleshooting

### `npm ci` reports that package files are not in sync

The corrected project lock file supports `npm ci`. If the lock file was edited
or replaced, repair it with:

```powershell
npm install
```

Then run:

```powershell
npm run dev
```

### `npm` is not recognised

Install a current Node.js LTS release, restart VS Code and open a new terminal.
Confirm installation with:

```powershell
node --version
npm --version
```

### PowerShell cannot run `npm.ps1`

Use the Windows command shims without changing the system execution policy:

```powershell
npm.cmd ci
npm.cmd run dev
```

### Port 5173 is already in use

Start Vite on another port:

```powershell
npm run dev -- --port 5174
```

Then open:

```text
http://localhost:5174
```

The supplied F5 configuration expects port `5173`, so either stop the process
using that port or update `.vscode/launch.json` when debugging on another port.

### Dependencies need a clean reinstall

Close the development server, delete `node_modules` using File Explorer, then
run:

```powershell
npm ci
```

### Chrome does not open when F5 is pressed

Run `npm run dev` manually and open the printed URL. Also confirm that the
selected debug configuration is **OneStop: Chrome + Vite**.

### The chatbot is not visible

On smaller windows, select **Ask Nova** at the bottom-right. On desktop, check
that the chat was not minimised using the arrow in its header.

### The cart or conversation disappeared

The prototype intentionally stores state in React memory only. Refreshing or
closing the page resets the demonstration.

### npm reports an audit vulnerability

An audit warning does not prevent the local classroom demo from running. Do not
run `npm audit fix --force` immediately because it may replace locked core
dependencies with incompatible versions. Review and test dependency upgrades
before any public deployment.

## Assessment note

This prototype demonstrates expected behaviour and potential business value; it
does not provide measured evidence of conversion improvements. In the report,
use terms such as **expected outcome**, **target KPI** and **the prototype
demonstrates**.
