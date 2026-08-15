import { env } from "cloudflare:workers";
import { PRODUCTS } from "../lib/products";

function binding() {
  if (!env.DB) throw new Error("Database is unavailable.");
  return env.DB;
}

export async function ensureStoreSchema() {
  const db = binding();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      name_zh TEXT NOT NULL,
      description TEXT NOT NULL,
      description_zh TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      language TEXT NOT NULL,
      nickname TEXT NOT NULL,
      contact_method TEXT NOT NULL,
      contact_value TEXT NOT NULL,
      product_id TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries (status)"),
  ]);

  await db.batch(
    PRODUCTS.map((product, index) =>
      db
        .prepare(`INSERT OR IGNORE INTO products
          (id, category, name, name_zh, description, description_zh, active, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, 1, ?)`)
        .bind(
          product.id,
          product.category,
          product.name,
          product.nameZh,
          product.description,
          product.descriptionZh,
          index,
        ),
    ),
  );
}

export async function listProducts() {
  await ensureStoreSchema();
  return binding()
    .prepare(`SELECT id, category, name, name_zh AS nameZh,
      description, description_zh AS descriptionZh
      FROM products WHERE active = 1 ORDER BY sort_order, name`)
    .all();
}

export async function saveInquiry(input: {
  type: string;
  language: string;
  nickname: string;
  contactMethod: string;
  contactValue: string;
  productId: string;
  message: string;
}) {
  await ensureStoreSchema();
  const db = binding();
  const reference = `RM-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;

  await db.batch([
    db.prepare("DELETE FROM inquiries WHERE created_at < datetime('now', '-90 days')"),
    db
      .prepare(`INSERT INTO inquiries
        (id, type, language, nickname, contact_method, contact_value, product_id, message, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))`)
      .bind(
        reference,
        input.type,
        input.language,
        input.nickname,
        input.contactMethod,
        input.contactValue,
        input.productId || null,
        input.message,
      ),
  ]);

  return reference;
}