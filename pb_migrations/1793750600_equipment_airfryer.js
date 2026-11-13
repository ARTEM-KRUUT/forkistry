/// <reference path="../.pocketbase/pb_data/types.d.ts" />
// Новая техника: «Аэрогриль» — допустимое значение поля recipes.equipment.

migrate(
  (app) => {
    const recipes = app.findCollectionByNameOrId('recipes');
    const field = recipes.fields.getByName('equipment');
    if (!field.values.includes('Аэрогриль')) field.values = [...field.values, 'Аэрогриль'];
    field.maxSelect = field.values.length;
    app.save(recipes);
  },
  (app) => {
    const recipes = app.findCollectionByNameOrId('recipes');
    const field = recipes.fields.getByName('equipment');
    field.values = field.values.filter((v) => v !== 'Аэрогриль');
    field.maxSelect = field.values.length;
    app.save(recipes);
  },
);
