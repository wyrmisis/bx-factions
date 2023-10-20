// Data Models
import FactionDataModel from "../data-models/faction.mjs";
import RoomKeyDataModel from "../data-models/room-key.mjs";

// Journal Entry Page Sheets
import FactionSheet from "../sheets/faction-sheet.js";
import RoomKeySheet from "../sheets/room-key-sheet.mjs";

import { prepareSettings } from '../config/settings.mjs';
import registerHandlebarsHelpers from "../config/handlebars.mjs";

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


  prepareSettings();
  registerHandlebarsHelpers();
});