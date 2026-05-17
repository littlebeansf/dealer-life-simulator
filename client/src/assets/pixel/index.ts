// Location backgrounds (JPEG)
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

// Start screen (JPEG)
import startScreen from './start_screen.jpg';

// Race sprites — transparent PNG (128×128)
import raceGoblin from './race_goblin.png';
import raceElf from './race_elf.png';
import raceDwarf from './race_dwarf.png';
import raceGolem from './race_golem.png';
import raceGhost from './race_ghost.png';
import raceOrc from './race_orc.png';
import raceFairy from './race_fairy.png';
import raceVampire from './race_vampire.png';
import raceWerewolf from './race_werewolf.png';
import raceDragonkin from './race_dragonkin.png';

// Item sprites — transparent PNG (96×96)
import itemMoonleaf from './item_moonleaf.png';
import itemGoblinDust from './item_goblin_dust.png';
import itemDreamSap from './item_dream_sap.png';
import itemPixieSparks from './item_pixie_sparks.png';
import itemDragonResin from './item_dragon_resin.png';
import itemGhostMist from './item_ghost_mist.png';
import itemOgreBrew from './item_ogre_brew.png';
import itemWitchroot from './item_witchroot.png';
import itemVampireAsh from './item_vampire_ash.png';
import itemSirenTears from './item_siren_tears.png';

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

export { startScreen };

// World map
import worldMap from './world_map.jpg';
export { worldMap };
