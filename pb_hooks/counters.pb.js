/// <reference path="../.pocketbase/pb_data/types.d.ts" />
// Счётчики рецепта: likes, dislikes, favoritesCount.
// Клиент их не пишет (правила коллекции recipes), меняют только эти хуки.
// Код после e.next() выполняется, когда запись уже сохранена/удалена.

onRecordCreate((e) => {
  e.next();
  const c = require(`${__hooks}/counters.js`);
  c.bump(e.app, e.record.get('recipe'), c.voteField(e.record.getInt('value')), 1);
}, 'votes');

onRecordUpdate((e) => {
  const before = e.record.original().getInt('value');
  e.next();
  const c = require(`${__hooks}/counters.js`);
  const after = e.record.getInt('value');
  if (before === after) return;
  const recipe = e.record.get('recipe');
  c.bump(e.app, recipe, c.voteField(before), -1);
  c.bump(e.app, recipe, c.voteField(after), 1);
}, 'votes');

onRecordDelete((e) => {
  const recipe = e.record.get('recipe');
  const field = require(`${__hooks}/counters.js`).voteField(e.record.getInt('value'));
  e.next();
  require(`${__hooks}/counters.js`).bump(e.app, recipe, field, -1);
}, 'votes');

onRecordCreate((e) => {
  e.next();
  require(`${__hooks}/counters.js`).bump(e.app, e.record.get('recipe'), 'favoritesCount', 1);
}, 'favorites');

onRecordDelete((e) => {
  const recipe = e.record.get('recipe');
  e.next();
  require(`${__hooks}/counters.js`).bump(e.app, recipe, 'favoritesCount', -1);
}, 'favorites');
