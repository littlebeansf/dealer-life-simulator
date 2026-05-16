import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameSaves = sqliteTable("game_saves", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  saveKey: text("save_key").notNull().unique(),
  data: text("data").notNull(), // JSON stringified GameState
  updatedAt: integer("updated_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSaveSchema = createInsertSchema(gameSaves).pick({
  saveKey: true,
  data: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GameSave = typeof gameSaves.$inferSelect;
export type InsertGameSave = z.infer<typeof insertGameSaveSchema>;
