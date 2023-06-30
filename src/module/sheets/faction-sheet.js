export default class FactionSheet extends JournalTextPageSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "notes"}],
      submitOnChange: true,
      dragDrop: [
        {
          dragSelector: ".journal-page-content .faction-member",
        }
      ]
    });
  }
  
  get template() {
    return `modules/bx-factions/dist/templates/faction-sheet-${this.isEditable ? "edit" : "view"}.hbs`;
  }

  async getData(options={}) {
    const falsyIfEmptyP = (str) => str === "<p></p>" ? "" : str;
    
    const context = await super.getData(options);
    
    context.description = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.description), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.notes = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.notes), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.reinforcements = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.reinforcements), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.territory = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.territory), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.goals = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.goals), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.relationships = await TextEditor.enrichHTML(
      falsyIfEmptyP(this.object.system.relationships), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });
    context.notableActors = await Promise.all(this.object.system.notableActors);
    context.memberActors = await Promise.all(this.object.system.memberActors);

    context.reactionModifier = this.object.system.reactionModifier;

    context.alignmentOptions = [
      "FACTIONS.alignment.lawful",
      "FACTIONS.alignment.neutral",
      "FACTIONS.alignment.chaotic"
    ];
    
    return context;
  }

  async _onDragStart(event) {    
    const actor = await fromUuid(event.target.closest(".faction-member[data-uuid]")?.dataset.uuid);
    const dragData = actor.toDragData();

    if (!dragData) return;

    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  async _onDrop(event) {
    const targetList = event.target.closest("[data-list-type]")?.dataset.listType;
    const { type, uuid } = TextEditor.getDragEventData(event);

    if (type === "Actor") {
      if (targetList === "notables")
        this.#handleDroppedNotableMember(uuid);

      if (targetList === "members")
        this.#handleDroppedMember(uuid);
    }

    return;
  }

  #handleDroppedNotableMember(uuid) {
    const updatedList = [...this.object.system.members.notables, uuid];
    const dedupedUpdatedList = [...new Set(updatedList)];

    this.object.update({
      ['system.members.notables']: dedupedUpdatedList
    });
  }

  #handleDroppedMember(uuid) {
    let list = [...this.object.system.members.members];
    const indexInList = list.findIndex((a) => a.uuid === uuid);

    if (indexInList !== -1)
      list[indexInList].number++;
    else
      list = [...list, {uuid, number: 1}];

    this.object.update({
      ['system.members.members']: list.filter(({uuid}) => !!uuid)
    });
  }

  #handleRemoveNotableMember(targetUuid) {
    const list = [...this.object.system.members.notables]
      .filter(uuid => uuid !== targetUuid)
    
    this.object.update({
      ['system.members.notables']: list
    });
  }
  #handleRemoveMember(targetUuid) {
    const list = [...this.object.system.members.members]
      .filter(({uuid}) => uuid !== targetUuid);

    this.object.update({
      ['system.members.members']: list
    });
  }

  #handleUpdateMemberCount(e) {
    const value = e.target.value || 0;
    const uuid = e.target.closest("[data-uuid]")?.dataset.uuid;
    const list = [...this.object.system.members.members];
    const indexInList = list.findIndex(a => a.uuid === uuid);
    list[indexInList].number = value;
    this.object.update({
      ['system.members.members']: list.filter(({uuid}) => !!uuid)
    });
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (this.isEditable)
      this.#activateEditListeners(html);
    else
      this.#activateViewListeners(html);  
  }

  #activateEditListeners(html) {
    html.on("change", ".faction-member__quantity", this.#handleUpdateMemberCount.bind(this));
    this._contextMenu(html);
  }

  #activateViewListeners(html) {
    
  }

  async #getContextOptions() {
    // const getPage = li => this.object.pages.get(li.data("page-id"));

    const getActor = async (node) => await fromUuid(node.data("uuid"));
    
    return [{
      name: "SIDEBAR.Edit",
      icon: '<i class="fas fa-edit"></i>',
      condition: async (li) => {
        const actor = await getActor(li);
        return this.isEditable && actor?.canUserModify(game.user, "update")
      },
      callback: async (li) => {
        const actor = await getActor(li);
        actor && actor.sheet.render(true);
      }
    }, {
      name: "SIDEBAR.Delete",
      icon: '<i class="fas fa-trash"></i>',
      condition: async (li) => {
        const actor = await getActor(li);
        return this.isEditable && actor?.canUserModify(game.user, "delete")
      },
      callback: async (li) => {
        const {uuid} = await getActor(li);

        if (!uuid) return;

        const listType = li.closest('[data-list-type]').data("list-type");

        if (listType === "notables")
          this.#handleRemoveNotableMember(uuid);
        if (listType === "members")
          this.#handleRemoveMember(uuid);
      }
    }];
  }

  async _contextMenu(html) {
    ContextMenu.create(this, html, ".faction-member", await this.#getContextOptions());
  }

  
}