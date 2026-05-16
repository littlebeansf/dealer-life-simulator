import { users, gameSaves } from '@shared/schema';
import type { User, InsertUser, GameSave, InsertGameSave } from '@shared/schema';
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS game_saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    save_key TEXT NOT NULL UNIQUE,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

export const db = drizzle(sqlite);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSave(saveKey: string): Promise<GameSave | undefined>;
  upsertSave(saveKey: string, data: string): Promise<void>;
  deleteSave(saveKey: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.username, username)).get();
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return db.insert(users).values(insertUser).returning().get();
  }

  async getSave(saveKey: string): Promise<GameSave | undefined> {
    return db.select().from(gameSaves).where(eq(gameSaves.saveKey, saveKey)).get();
  }

  async upsertSave(saveKey: string, data: string): Promise<void> {
    const existing = db.select().from(gameSaves).where(eq(gameSaves.saveKey, saveKey)).get();
    if (existing) {
      db.update(gameSaves)
        .set({ data, updatedAt: Date.now() })
        .where(eq(gameSaves.saveKey, saveKey))
        .run();
    } else {
      db.insert(gameSaves).values({ saveKey, data, updatedAt: Date.now() }).run();
    }
  }

  async deleteSave(saveKey: string): Promise<void> {
    db.delete(gameSaves).where(eq(gameSaves.saveKey, saveKey)).run();
  }
}

export const storage = new DatabaseStorage();
