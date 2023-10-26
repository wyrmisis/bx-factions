// Data Models
import FactionDataModel from "../data-models/faction.mjs";
import RoomKeyDataModel from "../data-models/room-key.mjs";

// Journal Entry Page Sheets
import FactionSheet from "../sheets/faction-sheet.js";
import RoomKeySheet from "../sheets/room-key-sheet.mjs";

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
});