Hooks.once('init', async function() {
  game.settings.register(game.modules.get('bx-factions').id, "useFactionRepModifiers", {
    name: game.i18n.localize("FACTIONS.settings.useFactionRepModifiers.label"),
    hint: game.i18n.localize("FACTIONS.settings.useFactionRepModifiers.hint"),
    default: true,
    scope: "world",
    type: Boolean,
    config: true,
  });
  game.settings.register(game.modules.get('bx-factions').id, "useFactionMorality", {
    name: game.i18n.localize("FACTIONS.settings.useFactionMorality.label"),
    hint: game.i18n.localize("FACTIONS.settings.useFactionMorality.hint"),
    default: false,
    scope: "world",
    type: Boolean,
    config: true,
  });
});
