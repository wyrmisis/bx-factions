export default class RoomKeyDataModel extends foundry.abstract.TypeDataModel {
  /**
   * @todo Should goals, territory, and relationships be more strictly defined?
   *  
   */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({required: false, blank: true}),
      img: new fields.FilePathField({
        required: false,
        categories: ["IMAGE"],
      }),

      inhabitantNotes: new fields.HTMLField({required: false, blank: true}),
      inhabitants: new fields.ArrayField(
        new fields.SchemaField({
          uuid: new fields.StringField({required: false, blank: false}),
          number: new fields.NumberField({min: 0, integer: true})
        })
      ),

      treasureNotes: new fields.HTMLField({required: false, blank: true}),
      treasure: new fields.ArrayField(
        new fields.SchemaField({
          uuid: new fields.StringField({required: false, blank: false}),
          number: new fields.NumberField({min: 0, integer: true})
        })
      ),
      
      secrets: new fields.HTMLField({required: false, blank: true}),
      traps: new fields.HTMLField({required: false, blank: true}),
    };
  }

  // @TODO Get random encounter table from first available Dungeon Level Overview

  get inhabitantActors() {
    return this.inhabitants
      .map(
        ({ uuid, number }) => ({ actor: fromUuidSync(uuid), number })
      )
      .filter(({actor}) => !!actor);
  }

  get treasureItems() {
    return this.treasure
      .map(
        ({ uuid, number }) => ({ item: fromUuidSync(uuid), number })
      )
      .filter(({item}) => !!item);
  }
}