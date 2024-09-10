export default class FactionDataModel extends foundry.abstract.TypeDataModel {
  /**
   * @todo Should goals, territory, and relationships be more strictly defined?
   *  
   */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      notes: new fields.HTMLField({required: false, blank: true}),
      reinforcements: new fields.HTMLField({required: false, blank: true}),
      description: new fields.HTMLField({required: false, blank: true}),
      img: new fields.FilePathField({
        required: false,
        categories: ["IMAGE"],
      }),

      alignment: new fields.StringField({
        required: true,
        blank: false,
        choices: [
          game.i18n.localize("FACTIONS.templates.faction.alignment.lawful"),
          game.i18n.localize("FACTIONS.templates.faction.alignment.neutral"),
          game.i18n.localize("FACTIONS.templates.faction.alignment.chaotic"),
        ],
        initial: game.i18n.localize("FACTIONS.templates.faction.alignment.neutral"),
      }),
      morality: new fields.StringField({
        required: true,
        blank: false,
        choices: [
          game.i18n.localize("FACTIONS.templates.faction.alignment.good"),
          game.i18n.localize("FACTIONS.templates.faction.alignment.neutral"),
          game.i18n.localize("FACTIONS.templates.faction.alignment.evil"),
        ],
        initial: game.i18n.localize("FACTIONS.templates.faction.alignment.neutral"),
      }),
      fame: new fields.NumberField({min: 0, max: 3, initial: 0, integer: true}),
      infamy: new fields.NumberField({min: 0, max: 3, initial: 0, integer: true}),

      members: new fields.SchemaField({
        notables: new fields.ArrayField(
          /** @todo once core supports storing UUIDs, replace with that data type */
          new fields.StringField({required: false, blank: false})
        ),
        members: new fields.ArrayField(
          new fields.SchemaField({
            /** @todo once core supports storing UUIDs, replace with that data type */
            uuid: new fields.StringField({required: false, blank: false}),
            number: new fields.NumberField({min: 0, integer: true})
          })
        )
      }),
      
      relationships: new fields.HTMLField({required: false, blank: true}),
      goals: new fields.HTMLField({required: false, blank: true}),
      territory: new fields.HTMLField({required: false, blank: true}),
      resources: new fields.HTMLField({required: false, blank: true}),
    };
  }

  get reactionModifier() {
    return 0 + this.fame - this.infamy;
  }

  /**
   *  @returns {Promise[]} - An array of promises that make up the requested actors
   */
  get notableActors() {
    return this.members.notables
      .map(i => fromUuidSync(i))
      .filter(i => !!i);
  }

  get memberActors() {
    return this.members.members
      .map(
        ({ uuid, number }) => ({ actor: fromUuidSync(uuid), number })
      )
      .filter(({actor}) => !!actor);
  }

  get isTrueNeutral() {
    return game.settings.get('bx-factions', 'useFactionMorality') &&
      this.alignment === game.i18n.localize("FACTIONS.templates.faction.alignment.neutral") &&
      this.morality === game.i18n.localize("FACTIONS.templates.faction.alignment.neutral")
  }

  get displayedAlignment() {
    if (this.isTrueNeutral)
      return game.i18n.localize("FACTIONS.templates.faction.alignment.trueNeutral")

    const shouldUseFactionMorality = game.settings.get('bx-factions', 'useFactionMorality');

    if (!shouldUseFactionMorality)
      return game.i18n.localize(this.alignment);

    if (!this.morality && !this.alignment)
      return game.i18n.localize("FACTIONS.templates.faction.alignment.unaligned");

    if (!this.morality)
      return game.i18n.localize(this.alignment);
    if (!this.alignment)
      return game.i18n.localize(this.morality);

    return `${this.alignment} ${this.morality}`
  }
}
