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
    return `modules/bx-factions/dist/templates/room-key-sheet-${this.isEditable ? "edit" : "view"}.hbs`;
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

  async _onDragStart(event) {
    const document = await fromUuid(event.target.closest(".faction-member[data-uuid]")?.dataset.uuid);
    const dragData = document.toDragData();

    if (!dragData) return;

    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  async _onDrop(event) {
    const { type, uuid } = TextEditor.getDragEventData(event);

    if (type === "Actor")
      this.#handleDroppedInhabitant(uuid);
    if (type === "Item")
      this.#handleDroppedTreasure(uuid);

    return;
  }

  #handleDroppedInhabitant(uuid) {
    let list = [...this.object.system.inhabitants];
    const indexInList = list.findIndex((a) => a.uuid === uuid);

    if (indexInList !== -1)
      list[indexInList].number++;
    else
      list = [...list, {uuid, number: 1}];

    this.object.update({
      ['system.inhabitants']: list.filter(({uuid}) => !!uuid)
    });
  }

  #handleRemoveInhabitant(targetUuid) {
    const list = [...this.object.system.inhabitants]
      .filter(({uuid}) => uuid !== targetUuid);

    this.object.update({
      ['system.inhabitants']: list
    });
  }

  #handleUpdateInhabitantCount(e) {
    const value = e.target.value || 0;
    const uuid = e.target.closest("[data-uuid]")?.dataset.uuid;
    const list = [...this.object.system.inhabitants];
    const indexInList = list.findIndex(a => a.uuid === uuid);
    list[indexInList].number = value;
    this.object.update({
      ['system.inhabitants']: list.filter(({uuid}) => !!uuid)
    });
  }

  #handleDroppedTreasure(uuid) {
    let list = [...this.object.system.inhabitants];
    const indexInList = list.findIndex((a) => a.uuid === uuid);

    if (indexInList !== -1)
      list[indexInList].number++;
    else
      list = [...list, {uuid, number: 1}];

    this.object.update({
      ['system.treasure']: list.filter(({uuid}) => !!uuid)
    });
  }

  #handleRemoveTreasure(targetUuid) {
    const list = [...this.object.system.inhabitants]
      .filter(({uuid}) => uuid !== targetUuid);

    this.object.update({
      ['system.treasure']: list
    });
  }

  #handleUpdateTreasureCount(e) {
    const value = e.target.value || 0;
    const uuid = e.target.closest("[data-uuid]")?.dataset.uuid;
    const list = [...this.object.system.inhabitants];
    const indexInList = list.findIndex(a => a.uuid === uuid);
    list[indexInList].number = value;
    this.object.update({
      ['system.treasure']: list.filter(({uuid}) => !!uuid)
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
    html.on("change", "[data-tab='inhabitants'] .faction-member__quantity", this.#handleUpdateInhabitantCount.bind(this));
    html.on("change", "[data-tab='treasure'] .faction-member__quantity", this.#handleUpdateTreasureCount.bind(this));
    this._contextMenu(html);
  }

  #activateViewListeners(html) {
    
  }

  async #getContextOptions() {
    // const getPage = li => this.object.pages.get(li.data("page-id"));

    const getDocument = async (node) => await fromUuid(node.data("uuid"));
    
    return [{
      name: "SIDEBAR.Edit",
      icon: '<i class="fas fa-edit"></i>',
      condition: async (li) => {
        const doc = await getDocument(li);
        return this.isEditable && doc?.canUserModify(game.user, "update")
      },
      callback: async (li) => {
        const doc = await getDocument(li);
        doc && doc.sheet.render(true);
      }
    }, {
      name: "SIDEBAR.Delete",
      icon: '<i class="fas fa-trash"></i>',
      condition: async (li) => {
        const doc = await getDocument(li);
        return this.isEditable && doc?.canUserModify(game.user, "delete")
      },
      callback: async (li) => {
        const {uuid} = await getDocument(li);

        if (!uuid) return;

        if (uuid.includes('Actor'))
          this.#handleRemoveInhabitant(uuid);

        if (uuid.includes('Item'))
          this.#handleRemoveTreasure(uuid);
      }
    }];
  }

  async _contextMenu(html) {
    ContextMenu.create(this, html, ".faction-member", await this.#getContextOptions());
  }

  
}