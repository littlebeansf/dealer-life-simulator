import type { Express } from "express";
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import { storage } from "./storage";

const SAVE_KEY = 'dealer_life_simulator_save';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // GET /api/save — load game
  app.get("/api/save", async (_req, res) => {
    try {
      const save = await storage.getSave(SAVE_KEY);
      if (!save) {
        res.json({ exists: false, data: null });
      } else {
        res.json({ exists: true, data: JSON.parse(save.data) });
      }
    } catch (e) {
      res.status(500).json({ error: 'Failed to load save' });
    }
  });

  // POST /api/save — save game
  app.post("/api/save", async (req, res) => {
    try {
      const { data } = req.body;
      if (!data) return res.status(400).json({ error: 'No data provided' });
      await storage.upsertSave(SAVE_KEY, JSON.stringify(data));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save game' });
    }
  });

  // DELETE /api/save — delete game
  app.delete("/api/save", async (_req, res) => {
    try {
      await storage.deleteSave(SAVE_KEY);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete save' });
    }
  });

  return httpServer;
}
