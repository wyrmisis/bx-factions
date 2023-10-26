// Data Models
import FactionDataModel from "../data-models/faction.mjs";
import RoomKeyDataModel from "../data-models/room-key.mjs";
import CharacterClassDataModel from "../data-models/character-class.mjs";

// Journal Entry Page Sheets
import FactionSheet from "../sheets/faction-sheet.js";
import RoomKeySheet from "../sheets/room-key-sheet.mjs";
import CharacterClassSheet from "../sheets/character-class-sheet.js";

// Helpers
import registerHandlebarsHelpers from "../config/handlebars.mjs";

/**
 * THE INIT HOOK
 * 
 * Things to do here:
 * - Tell Foundry to use our templates' data models 
 * - If there are templates that rely on system-specific stuff,
 *   set that up here
 * - Register sheets!
 */
Hooks.once('init', async function() {
  Object.assign(CONFIG.JournalEntryPage.dataModels, {
    "bx-factions.faction": FactionDataModel,
    "bx-factions.roomKey": RoomKeyDataModel,
  });

  DocumentSheetConfig.registerSheet(JournalEntryPage, "bx-factions", FactionSheet, {
    types: ["bx-factions.faction"],
    makeDefault: true
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "bx-factions", RoomKeySheet, {
    types: ["bx-factions.roomKey"],
    makeDefault: true
  });

  registerHandlebarsHelpers();

  /**
   * System-specific templates
   * - Old School Essentials
   *   - Character Class: A template that outputs structured 
   *     data for a B/X-compatible character class
   */
  if (game.system.id === 'ose' || game.system.id === 'ose-dev') {
    Object.assign(CONFIG.JournalEntryPage.dataModels, {
      "bx-factions.characterClass": CharacterClassDataModel,
    });

    DocumentSheetConfig.registerSheet(JournalEntryPage, "bx-factions", CharacterClassSheet, {
      types: ["bx-factions.characterClass"],
      makeDefault: true
    });
  }
});