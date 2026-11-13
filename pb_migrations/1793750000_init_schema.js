/// <reference path="../.pocketbase/pb_data/types.d.ts" />
// Схема Forkistry: поля пользователя, рецепты, голоса, избранное (CLAUDE.md → «Данные»).

const URL_PATTERN = '^(https?://|/)\\S+$'; // абсолютная ссылка или путь от корня сайта (/seed/...)

const CATEGORIES = ['Завтраки', 'Супы', 'Горячее', 'Паста', 'Салаты', 'Выпечка', 'Десерты'];
const EQUIPMENT = ['Плита', 'Духовка', 'Блендер', 'Миксер', 'Мультиварка', 'Микроволновка'];

// Счётчики пишут только хуки (pb_hooks/counters.pb.js), клиенту передавать их нельзя
const NO_COUNTERS = '@request.body.likes:isset = false && @request.body.dislikes:isset = false && @request.body.favoritesCount:isset = false';

migrate(
  (app) => {
    // users: профиль автора виден всем (email скрыт настройкой emailVisibility)
    const users = app.findCollectionByNameOrId('users');
    // Ссылка на аватар — текст с шаблоном: URLField не принимает пути от корня сайта (/seed/...)
    users.fields.add(new TextField({ name: 'avatarUrl', max: 500, pattern: URL_PATTERN }));
    users.fields.add(new TextField({ name: 'bio', max: 300 }));
    users.viewRule = '';
    app.save(users);

    const recipes = new Collection({
      type: 'base',
      name: 'recipes',
      listRule: '',
      viewRule: '',
      createRule: `@request.auth.id != "" && @request.body.author = @request.auth.id && ${NO_COUNTERS}`,
      updateRule: `author = @request.auth.id && @request.body.author:isset = false && ${NO_COUNTERS}`,
      deleteRule: 'author = @request.auth.id',
      fields: [
        { name: 'title', type: 'text', required: true, min: 3, max: 120 },
        { name: 'photoUrl', type: 'text', max: 500, pattern: URL_PATTERN },
        { name: 'category', type: 'select', required: true, maxSelect: 1, values: CATEGORIES },
        { name: 'equipment', type: 'select', maxSelect: EQUIPMENT.length, values: EQUIPMENT },
        { name: 'difficulty', type: 'select', required: true, maxSelect: 1, values: ['easy', 'medium', 'hard'] },
        { name: 'timeMinutes', type: 'number', required: true, min: 1, max: 1440, onlyInt: true },
        { name: 'servings', type: 'number', min: 1, max: 50, onlyInt: true },
        { name: 'yieldText', type: 'text', max: 80 },
        { name: 'ingredients', type: 'json', required: true, maxSize: 100000 },
        { name: 'steps', type: 'json', required: true, maxSize: 200000 },
        { name: 'author', type: 'relation', required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true },
        { name: 'kcal', type: 'number', min: 0 },
        { name: 'likes', type: 'number', min: 0, onlyInt: true },
        { name: 'dislikes', type: 'number', min: 0, onlyInt: true },
        { name: 'favoritesCount', type: 'number', min: 0, onlyInt: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_recipes_author ON recipes (author)',
        'CREATE INDEX idx_recipes_category ON recipes (category)',
      ],
    });
    app.save(recipes);

    const own = 'user = @request.auth.id';
    const votes = new Collection({
      type: 'base',
      name: 'votes',
      listRule: own,
      viewRule: own,
      createRule: '@request.auth.id != "" && @request.body.user = @request.auth.id',
      updateRule: `${own} && @request.body.user:isset = false && @request.body.recipe:isset = false`,
      deleteRule: own,
      fields: [
        { name: 'user', type: 'relation', required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true },
        { name: 'recipe', type: 'relation', required: true, maxSelect: 1, collectionId: recipes.id, cascadeDelete: true },
        // required не пропускает 0, поэтому допустимы только -1 и 1
        { name: 'value', type: 'number', required: true, min: -1, max: 1, onlyInt: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_votes_user_recipe ON votes (user, recipe)'],
    });
    app.save(votes);

    const favorites = new Collection({
      type: 'base',
      name: 'favorites',
      listRule: own,
      viewRule: own,
      createRule: '@request.auth.id != "" && @request.body.user = @request.auth.id',
      updateRule: null, // запись избранного не меняют — только добавляют и удаляют
      deleteRule: own,
      fields: [
        { name: 'user', type: 'relation', required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true },
        { name: 'recipe', type: 'relation', required: true, maxSelect: 1, collectionId: recipes.id, cascadeDelete: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_favorites_user_recipe ON favorites (user, recipe)'],
    });
    app.save(favorites);
  },
  (app) => {
    for (const name of ['favorites', 'votes', 'recipes']) {
      app.delete(app.findCollectionByNameOrId(name));
    }
    const users = app.findCollectionByNameOrId('users');
    for (const name of ['avatarUrl', 'bio']) {
      const f = users.fields.getByName(name);
      if (f) users.fields.removeById(f.id);
    }
    users.viewRule = 'id = @request.auth.id';
    app.save(users);
  },
);
