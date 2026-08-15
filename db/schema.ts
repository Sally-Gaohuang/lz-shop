import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  nameZh: text("name_zh").notNull(),
  description: text("description").notNull(),
  descriptionZh: text("description_zh").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const inquiries = sqliteTable("inquiries", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  language: text("language").notNull(),
  nickname: text("nickname").notNull(),
  contactMethod: text("contact_method").notNull(),
  contactValue: text("contact_value").notNull(),
  productId: text("product_id"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull(),
});