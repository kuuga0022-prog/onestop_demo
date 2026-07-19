# CEN207 Assessment Guide

## Recommended two-minute recording

Keep every group member visible for authentication and share the browser window.

### 0:00-0:15 — Objective and technology

> OneStop customers abandon carts when product, delivery and return information
> is unclear. Our prototype is a React and TypeScript storefront running in
> Chrome on Windows. Nova provides immediate, verified support during the
> shopping journey.

### 0:15-0:30 — Code structure

> `detectProduct` recognises product entities, `generateBotReply` routes
> customer intent, `addToCart` updates shared cart state, and the shipping
> calculation compares the cart total with the fifty-dollar threshold. Mock
> order records demonstrate how a future CRM integration would work.

### 0:30-1:40 — Live demonstration

1. Type:

   ```text
   What material is the shirt and what sizes are available?
   ```

2. Click **Add to cart** on **The Everyday Shirt**.

3. Type:

   ```text
   How much more do I need for free shipping?
   ```

   Expected response: `$20.01`.

4. Type:

   ```text
   Can you help me check out?
   ```

   Click **Review my cart** to show the checkout steps and transparent costs.

5. Close the cart and type:

   ```text
   Track order OS-1042
   ```

6. Click the larger-text and high-contrast buttons in Nova's header.

7. Type:

   ```text
   Can you repair my laptop?
   ```

   Click **Talk to a specialist** to create a simulated support ticket.

### 1:40-2:00 — Outcome

> The prototype demonstrates how instant product answers, visible shipping
> costs, guided checkout, tracking, accessibility and safe human escalation can
> reduce purchase uncertainty. It uses local verified data, so it runs reliably
> without an API key and does not invent unsupported answers.

## Report-ready code explanation

The software prototype was developed as a responsive single-page application
using React and TypeScript. Product, policy and mock order data are stored
locally to provide a reliable demonstration without external services. React
state synchronises the product catalogue, cart drawer and chatbot, allowing the
assistant to calculate shipping information from the customer's current cart.

The `generateBotReply()` function normalises each message, recognises customer
intent and retrieves a verified response. It supports product information,
shipping, checkout, returns and order tracking. When no verified answer exists,
the chatbot uses a fallback response and offers human escalation rather than
generating potentially inaccurate information. The order-tracking feature uses
mock data to demonstrate how a production system could connect to OneStop's CRM
or order-management platform.

Accessibility features include semantic HTML, labelled form controls, keyboard
focus indicators, screen-reader live regions, larger text, high-contrast mode
and reduced-motion support. Responsive breakpoints adapt the storefront and
chatbot for mobile, tablet and desktop displays.

## Suggested screenshots for the report

Capture these states at desktop width:

1. Storefront with Nova open beside the product grid.
2. Shirt material and size response.
3. Cart showing `$20.01` remaining for free shipping.
4. Checkout guidance and transparent cost summary.
5. `OS-1042` tracking timeline.
6. High-contrast mode.
7. Human-support ticket confirmation.

Do not describe simulated conversion improvements as measured results. Use
phrases such as “expected outcome”, “target KPI” or “the prototype demonstrates”.
