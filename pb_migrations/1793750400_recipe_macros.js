/// <reference path="../.pocketbase/pb_data/types.d.ts" />
// БЖУ рецепта (г): на порцию, у рецептов без порций — на 100 г. Считаются на клиенте при сохранении,
// как и kcal; хранятся, чтобы карточки каталога показывали их без загрузки ингредиентов.

const FIELDS = ['protein', 'fat', 'carbs'];

migrate(
  (app) => {
    const recipes = app.findCollectionByNameOrId('recipes');
    for (const name of FIELDS) recipes.fields.add(new NumberField({ name, min: 0 }));
    app.save(recipes);
  },
  (app) => {
    const recipes = app.findCollectionByNameOrId('recipes');
    for (const name of FIELDS) {
      const f = recipes.fields.getByName(name);
      if (f) recipes.fields.removeById(f.id);
    }
    app.save(recipes);
  },
);
