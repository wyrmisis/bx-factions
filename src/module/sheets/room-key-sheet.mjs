
import BXTemplateBaseSheet from "./__base-sheet";

export default class RoomKeySheet extends BXTemplateBaseSheet {
  static ListTypes = {
    inhabitant: 'inhabitant',
    treasure: 'treasure'
  }

  templateBase = 'room-key';

  async getData(options={}) {
    const falsyIfEmptyP = (str) => str === "<p></p>" ? "" : str;
    
    const context = await super.getData(options);
    
    context.description = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.description), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.secrets = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.secrets), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.traps = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.traps), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.inhabitantNotes = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.inhabitantNotes), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.treasureNotes = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.treasureNotes), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });

    context.inhabitants = await Promise.all(this.object.system.inhabitantActors);
    context.treasure = await Promise.all(this.object.system.treasureItems);
    
    return context;
  }

  delegateDropAction(uuid, type, listType) {
    if (!this.isEditable) return;
    if (listType === RoomKeySheet.ListTypes.inhabitant)
      this.#handleDroppedInhabitant(uuid);
    if (listType === RoomKeySheet.ListTypes.treasure)
      this.#handleDroppedTreasure(uuid);
  }

  #handleDroppedInhabitant(uuid) {
    this.handleDropped(uuid, 'inhabitants', { shouldIncrement: true });
  }

  #handleDroppedTreasure(uuid) {
    this.handleDropped(uuid, 'treasure', { shouldIncrement: true });
  }

  delegateDeleteAction(uuid, listType) {
    if (listType === RoomKeySheet.ListTypes.inhabitant)
      this.#handleRemoveInhabitant(uuid);
    if (listType === RoomKeySheet.ListTypes.treasure)
      this.#handleRemoveTreasure(uuid);
  }

  #handleRemoveInhabitant(targetUuid) {
    this.handleDelete(targetUuid, 'inhabitants', { hasIncrement: true });
  }
  #handleRemoveTreasure(targetUuid) {
    this.handleDelete(targetUuid, 'treasure', { hasIncrement: true });
  }

  #handleUpdateInhabitantCount(e) {
    const value = e.target.value || 0;
    const uuid = e.target.closest("[data-uuid]")?.dataset.uuid;
    const listType = e.target.closest("[data-list-type]")?.dataset.listType;
    let key;

    if (listType === RoomKeySheet.ListTypes.inhabitant)
      key = 'inhabitants';
    if (listType === RoomKeySheet.ListTypes.treasure)
      key = 'treasure';
    if (!key)
      return;

    this.handleUpdateQuantity(uuid, key, value);
  }

  activateEditListeners(html) {
    html.on("change", ".document-list__item__quantity", this.#handleUpdateInhabitantCount.bind(this));
  }

  activateViewListeners(html) {}
}
