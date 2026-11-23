import "server-only";

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), "data");
mkdirSync(dataDirectory, { recursive: true });

type DatabaseGlobal = typeof globalThis & {
  bookingDatabase?: Database.Database;
};

const globalForDatabase = globalThis as DatabaseGlobal;

const database =
  globalForDatabase.bookingDatabase ??
  new Database(path.join(dataDirectory, "bookings.sqlite"), { timeout: 5000 });

database.pragma("foreign_keys = ON");
database.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    show_date TEXT NOT NULL,
    show_time TEXT NOT NULL,
    seat_count INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    service_fee INTEGER NOT NULL,
    payment_method TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'paid')),
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at TEXT
  );

  CREATE TABLE IF NOT EXISTS order_seats (
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    showtime_key TEXT NOT NULL,
    seat_label TEXT NOT NULL,
    PRIMARY KEY (showtime_key, seat_label)
  );

  CREATE INDEX IF NOT EXISTS order_seats_order_id
    ON order_seats(order_id);
`);

globalForDatabase.bookingDatabase = database;

export default database;
