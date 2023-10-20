const registerHandlebarsHelpers = async () => {
  const templatePath = 'modules/bx-factions/dist/templates';
  const partialPath = `${templatePath}/partials`;

  Handlebars.registerHelper(
    'partial', 
    (path) => `${partialPath}/${path}`
  )

  // Handlebars.registerPartial()

  const templates = await loadTemplates([
    `${partialPath}/document-list.hbs`
  ]);
}

export default registerHandlebarsHelpers;