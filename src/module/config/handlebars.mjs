import { partialPath } from "./constants.mjs";

const registerHandlebarsHelpers = async () => {
  Handlebars.registerHelper(
    'bxTemplatePartial', 
    (path) => `${partialPath}/${path}`
  )

  Handlebars.registerHelper(
    'repeat',
    (length) => new Array(length).fill(null)
  );

  // Handlebars.registerPartial()

  const templates = await loadTemplates([
    `${partialPath}/document-list.hbs`
  ]);
}

export default registerHandlebarsHelpers;
