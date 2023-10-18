import FactionDataModel from "../data-models/faction.mjs";
import FactionSheet from "../sheets/faction-sheet.js";

import { prepareSettings } from '../config/settings.mjs';

Hooks.once('init', async function() {
  Object.assign(CONFIG.JournalEntryPage.dataModels, {
    "bx-factions.faction": FactionDataModel
  });

  DocumentSheetConfig.registerSheet(JournalEntryPage, "bx-factions", FactionSheet, {
    types: ["bx-factions.faction"],
    makeDefault: true
  });

  prepareSettings();
});