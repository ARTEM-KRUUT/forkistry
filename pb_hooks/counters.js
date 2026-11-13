// Общий код хуков (файл без .pb.js — PocketBase не загружает его сам, только через require).

const FIELDS = ['likes', 'dislikes', 'favoritesCount'];

/** Атомарно меняет счётчик рецепта на delta, не опуская ниже нуля. */
function bump(app, recipeId, field, delta) {
  if (!recipeId || !delta || FIELDS.indexOf(field) === -1) return;
  app
    .db()
    .newQuery('UPDATE recipes SET ' + field + ' = MAX(' + field + ' + {:delta}, 0) WHERE id = {:id}')
    .bind({ delta: delta, id: recipeId })
    .execute();
}

/** Поле счётчика для значения голоса: 1 → likes, -1 → dislikes. */
function voteField(value) {
  if (value === 1) return 'likes';
  if (value === -1) return 'dislikes';
  return null;
}

module.exports = { bump: bump, voteField: voteField };
