import BXTemplateBaseSheet from "./__base-sheet";

export default class FactionSheet extends BXTemplateBaseSheet {
  static ListTypes = {
    notable: 'notable',
    member: 'member'
  }

  templateBase = 'faction';

  async getData(options={}) {
    const context = await super.getData(options);
    
    context.description = await TextEditor.enrichHTML(
      FactionSheet.falsyIfEmptyP(this.object.system.description), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.notes = await TextEditor.enrichHTML(
      FactionSheet.falsyIfEmptyP(this.object.system.notes), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.reinforcements = await TextEditor.enrichHTML(
      FactionSheet.falsyIfEmptyP(this.object.system.reinforcements), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.territory = await TextEditor.enrichHTML(
      FactionSheet.falsyIfEmptyP(this.object.system.territory), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.goals = await TextEditor.enrichHTML(
      FactionSheet.falsyIfEmptyP(this.object.system.goals), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.relationships = await TextEditor.enrichHTML(
      FactionSheet.falsyIfEmptyP(this.object.system.relationships), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.resources = await TextEditor.enrichHTML(
      FactionSheet.falsyIfEmptyP(this.object.system.resources), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.notableActors = await Promise.all(this.object.system.notableActors);
    context.memberActors = await Promise.all(this.object.system.memberActors);

    context.reactionModifier = this.object.system.reactionModifier;

    context.alignmentOptions = [
      "FACTIONS.templates.faction.alignment.lawful",
      "FACTIONS.templates.faction.alignment.neutral",
      "FACTIONS.templates.faction.alignment.chaotic"
    ];

    context.canDisplayReputation = game.settings.get('bx-factions', 'useFactionRepModifiers');
    
    return context;
  }

  delegateDropAction(uuid, type, listType) {
    if (!this.isEditable) return;

    if (listType === FactionSheet.ListTypes.notable)
      this.#handleDroppedNotableMember(uuid);
    if (listType === FactionSheet.ListTypes.member)
      this.#handleDroppedMember(uuid);
  }

  #handleDroppedNotableMember(uuid) {
    this.handleDropped(uuid, 'members.notables', { shouldDedupe: true });
  }

  #handleDroppedMember(uuid) {
    this.handleDropped(uuid, 'members.members', { shouldIncrement: true });
  }

  delegateDeleteAction(uuid, listType) {
    if (listType === FactionSheet.ListTypes.notable)
      this.#handleRemoveNotableMember(uuid);
    if (listType === FactionSheet.ListTypes.member)
      this.#handleRemoveMember(uuid);
  }

  #handleRemoveNotableMember(targetUuid) {
    this.handleDelete(targetUuid, 'members.notables');
  }
  #handleRemoveMember(targetUuid) {
    this.handleDelete(targetUuid, 'members.members', { hasIncrement: true });
  }

  #handleUpdateMemberCount(e) {
    const value = e.target.value || 0;
    const uuid = e.target.closest("[data-uuid]")?.dataset.uuid;
    this.handleUpdateQuantity(uuid, 'members.members', value);
  }

  activateEditListeners(html) {
    html.on("change", ".document-list__item__quantity", this.#handleUpdateMemberCount.bind(this));
  }

  activateViewListeners(html) {}
}