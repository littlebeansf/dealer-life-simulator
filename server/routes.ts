import type { Express } from "express";
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import { storage } from "./storage";

const SAVE_PREFIX = 'dealer_life_simulator_save';
const VALID_SLOTS = [0, 1, 2];

function slotKey(slot: number): string {
  return `${SAVE_PREFIX}_${slot}`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // GET /api/save/:slot — load game slot
  app.get("/api/save/:slot", async (req, res) => {
    const slot = parseInt(req.params.slot, 10);
    if (!VALID_SLOTS.includes(slot)) return res.status(400).json({ error: 'Invalid slot' });
    try {
      const save = await storage.getSave(slotKey(slot));
      if (!save) {
        res.json({ exists: false, data: null });
      } else {
        res.json({ exists: true, data: JSON.parse(save.data) });
      }
    } catch (e) {
      res.status(500).json({ error: 'Failed to load save' });
    }
  });

  // POST /api/save/:slot — save game to slot
  app.post("/api/save/:slot", async (req, res) => {
    const slot = parseInt(req.params.slot, 10);
    if (!VALID_SLOTS.includes(slot)) return res.status(400).json({ error: 'Invalid slot' });
    try {
      const { data } = req.body;
      if (!data) return res.status(400).json({ error: 'No data provided' });
      await storage.upsertSave(slotKey(slot), JSON.stringify(data));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save game' });
    }
  });

  // DELETE /api/save/:slot — delete game slot
  app.delete("/api/save/:slot", async (req, res) => {
    const slot = parseInt(req.params.slot, 10);
    if (!VALID_SLOTS.includes(slot)) return res.status(400).json({ error: 'Invalid slot' });
    try {
      await storage.deleteSave(slotKey(slot));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete save' });
    }
  });

  // Legacy slot-0 fallback: GET/POST/DELETE /api/save
  app.get("/api/save", async (_req, res) => {
    try {
      const save = await storage.getSave(slotKey(0));
      res.json(save ? { exists: true, data: JSON.parse(save.data) } : { exists: false, data: null });
    } catch { res.status(500).json({ error: 'Failed' }); }
  });
  app.post("/api/save", async (req, res) => {
    try {
      const { data } = req.body;
      if (!data) return res.status(400).json({ error: 'No data' });
      await storage.upsertSave(slotKey(0), JSON.stringify(data));
      res.json({ success: true });
    } catch { res.status(500).json({ error: 'Failed' }); }
  });
  app.delete("/api/save", async (_req, res) => {
    try {
      await storage.deleteSave(slotKey(0));
      res.json({ success: true });
    } catch { res.status(500).json({ error: 'Failed' }); }
  });

  return httpServer;
}
