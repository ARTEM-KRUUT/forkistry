// Генерирует миграцию PocketBase с демонстрационными рецептами из src/data/mockRecipes.js.
// Запуск: npm run seed  →  pb_migrations/1793750100_seed_recipes.js
// Миграция применяется сама при старте PocketBase (локально и на сервере), пароль администратора не нужен.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MOCK_RECIPES, MOCK_USERS } from '../src/data/mockRecipes.js';

// id записей PocketBase — 15 символов [a-z0-9]; фиксированные id делают миграцию повторяемой
const userId = (id) => `seeduser${id.replace(/\D/g, '').padStart(7, '0')}`;
const recipeId = (id) => `seedrecipe${id.replace(/\D/g, '').padStart(5, '0')}`;
const emails = { u1: 'marina', u2: 'olga', u3: 'denis', u4: 'anna' };
// Дата PocketBase: «2026-10-02 10:00:00.000Z»
const pbDate = (iso) => new Date(iso).toISOString().replace('T', ' ');

const data = {
  users: MOCK_USERS.map((u) => ({
    id: userId(u.id),
    email: `${emails[u.id] ?? u.id}@example.com`,
    name: u.name,
    bio: u.bio,
    avatarUrl: u.avatarUrl,
  })),
  recipes: MOCK_RECIPES.map((r) => ({
    id: recipeId(r.id),
    title: r.title,
    photoUrl: r.photoUrl,
    category: r.category,
    equipment: r.equipment,
    equipmentAny: r.equipmentAny ?? [],
    difficulty: r.difficulty,
    timeMinutes: r.timeMinutes,
    servings: r.servings ?? 0,
    yieldText: r.yieldText,
    ingredients: r.ingredients,
    steps: r.steps,
    author: userId(r.author),
    kcal: r.kcal ?? 0,
    protein: r.protein ?? 0,
    fat: r.fat ?? 0,
    carbs: r.carbs ?? 0,
    likes: r.likes,
    dislikes: r.dislikes,
    favoritesCount: r.favoritesCount,
    created: pbDate(r.created),
  })),
};

const migration = `/// <reference path="../.pocketbase/pb_data/types.d.ts" />
// СГЕНЕРИРОВАНО scripts/seed.js — не редактировать вручную, менять src/data/mockRecipes.js.
// Демонстрационные авторы и рецепты. Пароли авторов случайные: войти под ними нельзя.

const DATA = ${JSON.stringify(data, null, 2)};

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users');
    for (const u of DATA.users) {
      try {
        app.findRecordById('users', u.id);
        continue; // уже есть
      } catch (_) {}
      const rec = new Record(users);
      rec.set('id', u.id);
      rec.set('email', u.email);
      rec.set('emailVisibility', false);
      rec.set('verified', true);
      rec.set('name', u.name);
      rec.set('bio', u.bio);
      rec.set('avatarUrl', u.avatarUrl);
      rec.setPassword($security.randomString(32));
      app.save(rec);
    }

    const recipes = app.findCollectionByNameOrId('recipes');
    for (const r of DATA.recipes) {
      try {
        app.findRecordById('recipes', r.id);
        continue;
      } catch (_) {}
      const rec = new Record(recipes);
      for (const key of Object.keys(r)) {
        if (key !== 'created') rec.set(key, r[key]);
      }
      app.save(rec);
      // autodate проставляет текущее время — возвращаем дату публикации для сортировки «Сначала новые»
      app.db().newQuery('UPDATE recipes SET created = {:created} WHERE id = {:id}').bind({ created: r.created, id: r.id }).execute();
    }
  },
  (app) => {
    for (const r of DATA.recipes) {
      try {
        app.delete(app.findRecordById('recipes', r.id));
      } catch (_) {}
    }
    for (const u of DATA.users) {
      try {
        app.delete(app.findRecordById('users', u.id));
      } catch (_) {}
    }
  },
);
`;

const out = fileURLToPath(new URL('../pb_migrations/1793750100_seed_recipes.js', import.meta.url));
writeFileSync(out, migration);

// Обновление уже загруженных демо-рецептов: только содержимое, без оценок, сохранений и дат.
// Рецепты пользователей не затрагиваются — меняются строго записи с id демо-рецептов.
const CONTENT_FIELDS = ['title', 'photoUrl', 'photoFit', 'category', 'equipment', 'difficulty', 'timeMinutes', 'servings', 'yieldText', 'ingredients', 'steps', 'kcal', 'protein', 'fat', 'carbs', 'equipmentAny'];
// Версия содержимого: при каждом изменении текстов демо-рецептов — новый файл (PocketBase не применяет миграцию повторно)
const CONTENT_VERSION = { file: '1793750900_seed_content_v5.js', note: 'фото демо-рецептов' };
const content = data.recipes.map((r) => Object.fromEntries([['id', r.id], ...CONTENT_FIELDS.map((k) => [k, r[k]])]));
const update = `/// <reference path="../.pocketbase/pb_data/types.d.ts" />
// СГЕНЕРИРОВАНО scripts/seed.js. Содержимое демо-рецептов (${CONTENT_VERSION.note}).
// Лайки, сохранения, даты и рецепты пользователей не меняются.

const CONTENT = ${JSON.stringify(content, null, 2)};

migrate(
  (app) => {
    for (const r of CONTENT) {
      let rec;
      try {
        rec = app.findRecordById('recipes', r.id);
      } catch (_) {
        continue; // демо-рецепт удалён — не восстанавливаем
      }
      for (const key of Object.keys(r)) {
        if (key !== 'id') rec.set(key, r[key]);
      }
      app.save(rec);
    }
  },
  () => {
    // откат не нужен: тексты не влияют на схему
  },
);
`;
const outUpdate = fileURLToPath(new URL(`../pb_migrations/${CONTENT_VERSION.file}`, import.meta.url));
writeFileSync(outUpdate, update);
console.log(`Записано: ${out}\n         ${outUpdate}\nАвторов: ${data.users.length}, рецептов: ${data.recipes.length}`);
