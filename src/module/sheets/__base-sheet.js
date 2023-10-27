import { templatePath } from "../config/constants.mjs";

export default class BXTemplateBaseSheet extends JournalTextPageSheet {
  /**
   * Effectively the template file's unique identifier. If you make a template, it should include the following:
   * - `${templateBase}-sheet-edit.hbs`
   * - `${templateBase}-sheet-view.hbs`
   */
  templateBase = ''

  /**
   * Given an HTML string, if an empty `<p />` tag, return `""`. Otherwise, return the string.
   * @param {string} str - What to peel the wrapping `<p />` off of 
   * @returns - The string or an empty string.
   */
  static falsyIfEmptyP(str) {
    return str === "<p></p>" ? "" : str
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "notes"}],
      submitOnChange: true,
      dragDrop: [
        {
          dragSelector: ".bx-template--view .document-list__item",
        }
      ]
    });
  }
  
  get template() {
    return `${templatePath}/${this.templateBase}-sheet-${this.isEditable ? "edit" : "view"}.hbs`;
  }

  async _onDragStart(event) {    
    const document = await fromUuid(event.target.closest(".document-list__item[data-uuid]")?.dataset.uuid);
    const dragData = document.toDragData();
    if (!dragData) return;
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  async _onDrop(event) {
    const targetList = event.target.closest("[data-list-type]")?.dataset.listType;
    const { type, uuid } = TextEditor.getDragEventData(event);
    this.delegateDropAction(uuid, type, targetList);
    return;
  }

  delegateDropAction(uuid, type, targetList) {
    console.warn('delegateDropAction called without calling sheet implementing its own call!');
  }

  handleDropped(dropped, key, { shouldDedupe, shouldIncrement }) {
    const object = foundry.utils.flattenObject(this.object);
    // Unique items (notable faction members, random tables) come in as strings
    // Nonunique items (faction members, room inhabitants, treasure) come in as objects 
    const uuid = typeof dropped === 'string' ? dropped : dropped.uuid;
    // Use this key to update the this.object
    const adjustedKey = `system.${key}`;

    let list;

    if (shouldDedupe) {
      list = [...object[adjustedKey], uuid];
      list = [...new Set(list)];
    } else if (shouldIncrement) {
      list = [...object[adjustedKey]];
      const indexInList = list.findIndex(a => a.uuid === uuid);
      if (indexInList !== -1)
        list[indexInList].number++;
      else
        list = [...list, {uuid, number: 1}];
      list = list.filter(({uuid}) => !!uuid);
    }

    if (!list) return;

    this.object.update({ [adjustedKey]: list });
  }

  delegateDeleteAction(uuid, listType) {
    console.warn('delegateDeleteAction called without calling sheet implementing its own call!');
  }

  handleDelete(targetUuid, key, { hasIncrement } = {}) {
    const incrementFilter = ({uuid}) => uuid !== targetUuid;
    const singleFilter = (uuid) => uuid !== targetUuid;
    const object = foundry.utils.flattenObject(this.object);
    const adjustedKey = `system.${key}`;
    let list = [...object[adjustedKey]]
      .filter(hasIncrement ? incrementFilter : singleFilter);

    this.object.update({ [adjustedKey]: list});
  }

  handleUpdateQuantity(uuid, key, value) {
    const object = foundry.utils.flattenObject(this.object);
    const adjustedKey = `system.${key}`;
    let list = [...object[adjustedKey]];
    const indexInList = list.findIndex(a => a.uuid === uuid);
    list[indexInList].number = value;
    this.object.update({ [adjustedKey]: list.filter(({uuid}) => !!uuid) });
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (this.isEditable) {
      this.activateEditListeners(html);
      this._contextMenu(html);
    } else {
      this.activateViewListeners(html);  
      this.#documentListListeners(html);
    }
  }

  activateEditListeners(html) {
    console.warn('activateEditListeners called without calling sheet implementing its own call!');
  }

  activateViewListeners(html) {
    console.warn('activateViewListeners called without calling sheet implementing its own call!');
  }

  async getContextOptions() {
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
        this.delegateDeleteAction(uuid, listType);
      }
    }];
  }

  async _contextMenu(html) {
    ContextMenu.create(this, html, ".document-list__item", await this.getContextOptions());
  }

  #documentListListeners(html) {
    html.find('.document-list__item').click(async (event) => {
      const document = await fromUuid(event.target.closest(".document-list__item[data-uuid]")?.dataset.uuid);
      document?.sheet?.render(true);
    });
  }
}