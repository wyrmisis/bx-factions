export const prepareSettings = () => {
  game.settings.register(game.modules.get('bx-factions').id, "useFactionRepModifiers", {
    name: game.i18n.localize("FACTIONS.settings.useFactionRepModifiers.label"),
    hint: game.i18n.localize("FACTIONS.settings.useFactionRepModifiers.hint"),
    default: true,
    scope: "world",
    type: Boolean,
    config: true,
  });
}