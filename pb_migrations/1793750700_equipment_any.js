/// <reference path="../.pocketbase/pb_data/types.d.ts" />
// Техника «на выбор»: рецепту хватает ЛЮБОЙ одной из списка (например, духовка или аэрогриль).
// Поле equipment остаётся списком обязательной техники — старые рецепты сохраняют прежний смысл.

migrate(
  (app) => {
    const recipes = app.findCollectionByNameOrId('recipes');
    const values = recipes.fields.getByName('equipment').values;
    recipes.fields.add(new SelectField({ name: 'equipmentAny', values, maxSelect: values.length }));
    app.save(recipes);
  },
  (app) => {
    const recipes = app.findCollectionByNameOrId('recipes');
    const f = recipes.fields.getByName('equipmentAny');
    if (f) recipes.fields.removeById(f.id);
    app.save(recipes);
  },
);
