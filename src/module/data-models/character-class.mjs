export default class CharacterClassDataModel extends foundry.abstract.TypeDataModel {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "xp"}]
    });
  }

  /**
   *
   */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({required: false, blank: true}),
      restrictions: new fields.HTMLField({required: false, blank: true}),

      img: new fields.FilePathField({
        required: false,
        categories: ["IMAGE"],
      }),

      prerequisites: new fields.SchemaField({
        str: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
        int: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
        wis: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
        dex: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
        con: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
        cha: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
      }),

      primerequisites: new fields.SchemaField({
        half: new fields.SchemaField({
          str: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
          int: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
          wis: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
          dex: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
          con: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
          cha: new fields.NumberField({ nullable: true, min: 0, max: 20 })
        }),
        halfIsAnd: new fields.BooleanField({ initial: true }),
        full: new fields.SchemaField({
          str: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
          int: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
          wis: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
          dex: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
          con: new fields.NumberField({ nullable: true, min: 0, max: 20 }),
          cha: new fields.NumberField({ nullable: true, min: 0, max: 20 })
        }),
        fullIsAnd: new fields.BooleanField({ initial: true })
      }),

      weapons: new fields.StringField({ blank: false, required: false }),
      armor: new fields.StringField({ blank: false, required: false }),
      languages: new fields.StringField({ blank: false, required: false }),

      hitDieSize: new fields.NumberField({
        min: 4,
        choices: [4, 6, 8, 10, 12, 20],
        initial: 6,
        integer: true
      }),

      gearTable: new fields.StringField({required: false, blank: false}),

      features: new fields.ArrayField(
        new fields.StringField({ blank: false, required: false })
      ),

      spellList: new fields.ArrayField(
        new fields.StringField({ blank: false, required: false })
      ),

      xp: new fields.ArrayField(
        new fields.SchemaField({
          value: new fields.NumberField({min: 0, initial: 0}),
          attackBonus: new fields.NumberField({ min: 0, initial: 0 }),
          thac0: new fields.NumberField({ min: 1, max: 20 }),
          hd: new fields.SchemaField({
            count: new fields.NumberField({min: 1, initial: 1, integer: true}),
            modifier: new fields.NumberField({min: 0, initial: 0}),
            canUseConMod: new fields.BooleanField({ initial: true })
          }),
          saves: new fields.SchemaField({
            death: new fields.NumberField({min: 1, max: 20, integer: true}),
            wands: new fields.NumberField({min: 1, max: 20, integer: true}),
            paralysis: new fields.NumberField({min: 1, max: 20, integer: true}),
            breath: new fields.NumberField({min: 1, max: 20, integer: true}),
            spell: new fields.NumberField({min: 1, max: 20, integer: true}),
          })
        }),
        {
          initial: [{
            value: 2000,
            attackBonus: 0,
            thac0: 19,
            hd: {
              count: 1,
              modifier: 0,
              canUseConMod: true
            },
            saves: {
              death: 19,
              wands: 19,
              paralysis: 19,
              breath: 19,
              spell: 19
            }
          }]
        }
      ),
      /**
       * Leveled resources are resources that
       * increase as a character increases their
       * level in this class.
       * Think spell slots, thief skills, etc.
       * A character can have resources, but will
       * most likely have 0-1
       */
      leveledResources: new fields.ArrayField(
        new fields.SchemaField({
          // First level: the type of resource ("Spell Slots")
          label: new fields.StringField({blank: false}),
          pool: new fields.ArrayField(
            new fields.SchemaField({
              // Second level: a "tier" of this resource type ("Spell Slots" > "1st")
              label: new fields.StringField({blank: false}),
              perLevel: new fields.ArrayField(
                // Third level: amount of this tier of resource at Index+1 level
                // (Magic User of level 1 has "Spell Slots" > "1st" > 1)
                new fields.NumberField({ blank: true, nullable: true })
              )
            })
          )
        })
      ),
    };
  }

  /**
   *  @returns {Promise[]} - An array of promises that make up the requested items
   */
  get featureItems() {
    return this.features
      .map(i => fromUuidSync(i))
      .filter(i => !!i);
  }

  get maxLevel() {
    return this.xp?.length || 0;
  }

  /**
   *  @todo Separate by spell level
   *  
   * @returns {Promise[]} - An array of promises that make up the requested items
   */
  async getSpellItems() {
    const items = await Promise.all(this.spellList.map(i => fromUuid(i)));
    const highestLevel = items
      .reduce((highest, i) => {
          return i.system.lvl > highest 
            ? i.system.lvl
            : highest
        }, 1 );
    const list = new Array(highestLevel).fill(null).map(() => []);
    items.forEach(i => {
      const idx = (i.system.lvl || 1) - 1;
      try {
        list[idx].push(i)
      } catch (e) {
        console.error(e);
        console.info(list, idx, i);
      }
    });

    return list;
  }

  static filterFalsyKeyVals(source) {
    return Object.keys(source)
      .filter(k => !!source[k])
      .reduce((obj, k) => ({
        ...obj, [k]: source[k]
      }), {});
  }

  get hasPrerequisites() {
    return !!Object.keys(this.prerequisitesFormatted).length;
  }
  get prerequisitesFormatted() {
    return CharacterClassDataModel
      .filterFalsyKeyVals(this.prerequisites)
  }
  get prerequsiitesCount() {
    return Object.keys(this.preequisitesFormatted).length;
  }

  get halfRequisitesFormatted() {
    return CharacterClassDataModel
      .filterFalsyKeyVals(this.primerequisites.half)
  }
  get halfRequisitesCount() {
    return Object.keys(this.halfRequisitesFormatted).length;
  }

  get fullRequisitesFormatted() {
    return CharacterClassDataModel
      .filterFalsyKeyVals(this.primerequisites.full)
  }
  get fullRequisitesCount() {
    return Object.keys(this.fullRequisitesFormatted).length;
  }

  get hasSpells() {
    return !!this.spellList.length;
  }
}
