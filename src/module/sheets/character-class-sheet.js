import BXTemplateBaseSheet from "./__base-sheet";

export default class CharacterClassSheet extends BXTemplateBaseSheet {
  static ListTypes = {
    feature: "features",
    spell: "spells"
  }

  templateBase = 'character-class';

  async getData(options={}) {
    const context = await super.getData(options);

    context.description = await TextEditor.enrichHTML(
      CharacterClassSheet.falsyIfEmptyP(this.object.system.description), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });

    context.combat = await TextEditor.enrichHTML(
      CharacterClassSheet.falsyIfEmptyP(this.object.system.combat), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });

    context.restrictions = await TextEditor.enrichHTML(
      CharacterClassSheet.falsyIfEmptyP(this.object.system.restrictions), {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    });

    context.spells = await this.object.system.getSpellItems();

    context.gearTable = (this.object.system.gearTable && this.object.system.gearTable !== '0')
      ? await TextEditor.enrichHTML(this.object.system.gearTable)
      : '';

    context.hitDieOptions = this.object.system.schema.fields.hitDieSize.choices

    return context;
  }

  /**
   * @param {string} uuid - The UUID of the dropped Document
   * @param {string} type - The Class of the dropped Document
   * @param {string} targetList -The preset document list the Document is dropped onto  
   * @returns 
   */
  async delegateDropAction(uuid, type, targetList) {
    if (!this.isEditable) return;

    const bulkAdd = (key, obj, list = []) => this.object.update({
      [key]: [...new Set([...obj, ...list])]
    })

    const flatten = (folder, result = []) => {
      result = result.concat(folder.contents);
      for (let child of folder.children)
        result = flatten(child.folder, result);
      return result;
    }

    // This is likely the gear table; overwrite!
    if (type === 'RollTable')
      return this.object.update({
        'system.gearTable': `@UUID[${uuid}]`
      });

    if (type === 'Item') {
      const item = await fromUuid(uuid);
      if (item.type === 'ability')
        return bulkAdd('system.features', this.object.system.features, [uuid]);
      if (item.type === 'spell')
        return bulkAdd('system.spellList', this.object.system.spellList, [uuid]);
    }

    if (type === 'Folder') {
      const list = flatten(await fromUuid(uuid));
      const addedAbilities = list.filter(i => i.type === 'ability').map(i => i.uuid);
      const addedSpells = list.filter(i => i.type === 'spell').map(i => i.uuid);
      addedAbilities.length && await bulkAdd('system.features', this.object.system.features, addedAbilities);
      addedSpells.length && await bulkAdd('system.spellList', this.object.system.spellList, addedSpells);
    }
  }

  delegateDeleteAction(uuid, listType) {
    if (listType === CharacterClassSheet.ListTypes.spell)
      this.#handleRemoveSpell(uuid);
    if (listType === CharacterClassSheet.ListTypes.feature)
      this.#handleRemoveFeature(uuid);
  }

  #handleRemoveFeature(targetUuid) {
    this.handleDelete(targetUuid, 'features');
  }
  #handleRemoveSpell(targetUuid) {
    this.handleDelete(targetUuid, 'spellList');
  }

  async #addXPRow(event) {
    const highestLevel = this.object.system.xp.length - 1;

    const newRow = structuredClone((highestLevel > -1)
      ? this.object.system.xp[highestLevel]
      : this.object.system.schema.fields.xp.initial[0]
    );

    await this.object.update({
      'system.xp': [...this.object.system.xp, newRow]
    });
  }

  async #removeXPRow(event) {
    const rows = [...this.object.system.xp];
    if (!rows?.length) return;

    await this.object.update({
      'system.xp': rows.splice(0, rows.length-1)
    })
  }

  async #addResource(event) {
    const template = { label: '', pool: []};

    const resources = [...this.object.system.leveledResources, template];

    await this.object.update({
      'system.leveledResources': resources
    });
  }

  async #addResourcePool(event) {
    const {categoryId} = event.target.closest('[data-category-id]').dataset;
    const resourceList = [...this.object.system.leveledResources]
    const resource = structuredClone(resourceList[categoryId]);
    const template = {label: '', perLevel: []};
    resource.pool.push(template);
    resourceList[categoryId] = resource;
    await this.object.update({
      'system.leveledResources': resourceList
    });
  }

  async #deleteResource(event) {
    const {categoryId} = event.target.closest('[data-category-id]').dataset;
    const resourceList = [...this.object.system.leveledResources];
    resourceList.splice(categoryId, 1);
    await this.object.update({
      'system.leveledResources': resourceList
    });
  }

  async #deleteResourcePool(event) {
    const {categoryId} = event.target.closest('[data-category-id]').dataset;
    const {poolId} = event.target.closest('[data-pool-id]').dataset;
    const resourceList = [...this.object.system.leveledResources];
    resourceList[categoryId].pool.splice(poolId, 1);
    await this.object.update({
      'system.leveledResources': resourceList
    });
  }

  async #rollGearTable(event) {
    const { id, uuid } = event.target.closest('[data-uuid]')?.dataset?.id;
    if (id === 'null' || !uuid) return;
    const table = await fromUuid(uuid);
    if (!table) return;
    table.draw();
  }

  /**
   * @todo Can't seem to null this out.
   */
  async #removeGearTable(event) {
    await this.object.update({
      'system.gearTable': 0
    });
  }

  activateEditListeners(html) {
    // Random gear table
    html.find('.details-grid__field--gear-table .content-link').on('contextmenu', this.#rollGearTable.bind(this));
    html.find('.details-grid__field--gear-table .remove-gear-table').on('click', this.#removeGearTable.bind(this));
    // XP Table
    html.find('.add-level').on('click', this.#addXPRow.bind(this));
    html.find('.remove-level').on('click', this.#removeXPRow.bind(this));
    // Class Resources
    html.find('.add-resource').on('click', this.#addResource.bind(this));
    html.find('.delete-resource').on('click', this.#deleteResource.bind(this));
    html.find('.add-resource-pool').on('click', this.#addResourcePool.bind(this));
    html.find('.delete-resource-pool').on('click', this.#deleteResourcePool.bind(this));
  }
}