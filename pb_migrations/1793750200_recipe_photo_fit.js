/// <reference path="../.pocketbase/pb_data/types.d.ts" />
// Настройки показа обложки рецепта: { x, y, zoom, rotate } (src/utils/photoFit.js).
// У шагов те же настройки лежат внутри JSON steps[i].photoFit — отдельное поле не нужно.

migrate(
  (app) => {
    const recipes = app.findCollectionByNameOrId('recipes');
    recipes.fields.add(new JSONField({ name: 'photoFit', maxSize: 2000 }));
    app.save(recipes);
  },
  (app) => {
    const recipes = app.findCollectionByNameOrId('recipes');
    const f = recipes.fields.getByName('photoFit');
    if (f) recipes.fields.removeById(f.id);
    app.save(recipes);
  },
);
