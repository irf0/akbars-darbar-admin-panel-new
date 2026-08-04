# Akbar's Darbar Admin Dashboard

Electron desktop app for managing a live restaurant's food delivery operations — menu, orders, riders, and business settings, all updated in real time.

Part of the Darbar ecosystem — see the [full real-time architecture](https://github.com/irf0) across all three apps.

## Features

- **Real-time Menu Management** — add, edit, or remove items with instant sync to the customer app
- **Live Business Settings** — toggle shop open/close, enable/disable delivery or COD, adjust prices — all reflected instantly across apps
- **Coupons & Riders Management** — full CRUD for discount coupons and delivery rider accounts
- **Multi-order Rider Assignment** — assign multiple orders to a single rider for batched deliveries
- **KOT Printing** — print kitchen order tickets directly from the dashboard
- **Analytics Dashboard** — revenue trends, order breakdown by type, and most popular menu items

## Tech Stack

- Electron, TypeScript
- Firebase (Firestore, Cloud Functions, Auth)
- Recharts (analytics charts)
