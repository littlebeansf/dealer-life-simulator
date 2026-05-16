// Pixel art asset index — all imported as data URLs for zero extra HTTP requests

// ─── Start Screen ────────────────────────────────────────────────────────────
import startScreen from './start_screen.jpg';

// ─── Location Backgrounds ────────────────────────────────────────────────────
import locGoblinland from './loc_goblinland.jpg';
import locElvenwood from './loc_elvenwood.jpg';
import locDwarfMines from './loc_dwarf_mines.jpg';
import locGhostMarsh from './loc_ghost_marsh.jpg';
import locOrcWarcamp from './loc_orc_warcamp.jpg';
import locFairyGlade from './loc_fairy_glade.jpg';
import locVampireCourt from './loc_vampire_court.jpg';
import locGolemQuarry from './loc_golem_quarry.jpg';
import locDragonPeaks from './loc_dragon_peaks.jpg';
import locMoonfangWilds from './loc_moonfang_wilds.jpg';

// ─── Item Icons ───────────────────────────────────────────────────────────────
import itemMoonleaf from './item_moonleaf.jpg';
import itemGoblinDust from './item_goblin_dust.jpg';
import itemDreamSap from './item_dream_sap.jpg';
import itemPixieSparks from './item_pixie_sparks.jpg';
import itemDragonResin from './item_dragon_resin.jpg';
import itemGhostMist from './item_ghost_mist.jpg';
import itemOgreBrew from './item_ogre_brew.jpg';
import itemWitchroot from './item_witchroot.jpg';
import itemVampireAsh from './item_vampire_ash.jpg';
import itemSirenTears from './item_siren_tears.jpg';

// ─── Race Portraits ──────────────────────────────────────────────────────────
import raceGoblin from './race_goblin.jpg';
import raceElf from './race_elf.jpg';
import raceDwarf from './race_dwarf.jpg';
import raceGolem from './race_golem.jpg';
import raceGhost from './race_ghost.jpg';
import raceOrc from './race_orc.jpg';
import raceFairy from './race_fairy.jpg';
import raceVampire from './race_vampire.jpg';
import raceWerewolf from './race_werewolf.jpg';
import raceDragonkin from './race_dragonkin.jpg';

// ─── Exports ─────────────────────────────────────────────────────────────────

export { startScreen };

export const LOCATION_IMAGES: Record<string, string> = {
  goblinland: locGoblinland,
  elvenwood: locElvenwood,
  dwarf_mines: locDwarfMines,
  ghost_marsh: locGhostMarsh,
  orc_warcamp: locOrcWarcamp,
  fairy_glade: locFairyGlade,
  vampire_court: locVampireCourt,
  golem_quarry: locGolemQuarry,
  dragon_peaks: locDragonPeaks,
  moonfang_wilds: locMoonfangWilds,
};

export const ITEM_IMAGES: Record<string, string> = {
  moonleaf: itemMoonleaf,
  goblin_dust: itemGoblinDust,
  dream_sap: itemDreamSap,
  pixie_sparks: itemPixieSparks,
  dragon_resin: itemDragonResin,
  ghost_mist: itemGhostMist,
  ogre_brew: itemOgreBrew,
  witchroot: itemWitchroot,
  vampire_ash: itemVampireAsh,
  siren_tears: itemSirenTears,
};

export const RACE_IMAGES: Record<string, string> = {
  goblin: raceGoblin,
  elf: raceElf,
  dwarf: raceDwarf,
  golem: raceGolem,
  ghost: raceGhost,
  orc: raceOrc,
  fairy: raceFairy,
  vampire: raceVampire,
  werewolf: raceWerewolf,
  dragonkin: raceDragonkin,
};
