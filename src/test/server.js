// Мок PocketBase REST API для тестов (MSW). Данные — те же моковые рецепты, что идут в seed.
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { MOCK_RECIPES, MOCK_USERS } from '../data/mockRecipes.js';

export const TEST_USER = { id: 'user000000test1', email: 'test@example.com', name: 'Тест Тестов', avatarUrl: '', bio: '' };
export const TEST_PASSWORD = 'secret123';

const toUser = (u) => ({ id: u.id, name: u.name, avatarUrl: u.avatarUrl ?? '', bio: u.bio ?? '' });

/** Состояние «базы»; сбрасывается перед каждым тестом. */
export const db = { recipes: [], users: [], favorites: [], votes: [], requests: [] };

export function resetDb() {
  db.users = [...MOCK_USERS.map(toUser), { ...TEST_USER }];
  db.recipes = MOCK_RECIPES.map((r) => ({ ...r, servings: r.servings ?? 0, kcal: r.kcal ?? 0 }));
  db.favorites = [];
  db.votes = [];
  db.requests = [];
}

const withAuthor = (r) => ({ ...r, expand: { author: toUser(db.users.find((u) => u.id === r.author) ?? { id: r.author, name: '' }) } });
const authUser = (request) => (request.headers.get('Authorization') === 'test-token' ? TEST_USER : null);
const list = (items, url) => {
  const perPage = Number(url.searchParams.get('perPage') ?? 30);
  return HttpResponse.json({ page: 1, perPage, totalItems: items.length, totalPages: 1, items: items.slice(0, perPage) });
};
const notFound = () => HttpResponse.json({ status: 404, message: 'Not found', data: {} }, { status: 404 });

/** Очень простой разбор фильтра — только то, что нужно тестам (author/category/user/recipe = "…"). */
function simpleFilter(items, filter) {
  if (!filter) return items;
  const eq = [...filter.matchAll(/(\w+) = "([^"]*)"/g)].map(([, k, v]) => [k, v]);
  return items.filter((it) => eq.every(([k, v]) => String(it[k]) === v));
}

export const handlers = [
  http.get('*/api/collections/recipes/records', ({ request }) => {
    const url = new URL(request.url);
    db.requests.push(url);
    return list(simpleFilter(db.recipes, url.searchParams.get('filter')).map(withAuthor), url);
  }),
  http.get('*/api/collections/recipes/records/:id', ({ params }) => {
    const r = db.recipes.find((x) => x.id === params.id);
    return r ? HttpResponse.json(withAuthor(r)) : notFound();
  }),
  http.post('*/api/collections/recipes/records', async ({ request }) => {
    if (!authUser(request)) return HttpResponse.json({ status: 400, message: 'Failed', data: {} }, { status: 400 });
    const body = await request.json();
    db.requests.push({ method: 'POST', body });
    const rec = { ...body, id: `new${Date.now()}`.slice(0, 15), likes: 0, dislikes: 0, favoritesCount: 0, created: new Date().toISOString() };
    db.recipes.push(rec);
    return HttpResponse.json(withAuthor(rec));
  }),
  http.patch('*/api/collections/recipes/records/:id', async ({ request, params }) => {
    const r = db.recipes.find((x) => x.id === params.id);
    if (!r || r.author !== authUser(request)?.id) return notFound();
    Object.assign(r, await request.json());
    return HttpResponse.json(withAuthor(r));
  }),
  http.delete('*/api/collections/recipes/records/:id', ({ request, params }) => {
    const r = db.recipes.find((x) => x.id === params.id);
    if (!r || r.author !== authUser(request)?.id) return notFound();
    db.recipes = db.recipes.filter((x) => x !== r);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/api/collections/users/records/:id', ({ params }) => {
    const u = db.users.find((x) => x.id === params.id);
    return u ? HttpResponse.json(u) : notFound();
  }),
  http.post('*/api/collections/users/auth-with-password', async ({ request }) => {
    const { identity, password } = await request.json();
    if (identity === TEST_USER.email && password === TEST_PASSWORD) return HttpResponse.json({ token: 'test-token', record: TEST_USER });
    return HttpResponse.json({ status: 400, message: 'Failed to authenticate.', data: {} }, { status: 400 });
  }),
  http.post('*/api/collections/users/auth-refresh', ({ request }) =>
    authUser(request) ? HttpResponse.json({ token: 'test-token', record: TEST_USER }) : HttpResponse.json({}, { status: 401 }),
  ),
  http.post('*/api/collections/users/records', async ({ request }) => {
    const body = await request.json();
    if (body.email === TEST_USER.email) {
      return HttpResponse.json({ status: 400, message: 'Failed', data: { email: { code: 'validation_not_unique', message: 'Value must be unique.' } } }, { status: 400 });
    }
    return HttpResponse.json({ id: 'createduser0001', ...body });
  }),

  http.get('*/api/collections/favorites/records', ({ request }) => {
    const url = new URL(request.url);
    const user = authUser(request);
    const items = db.favorites.filter((f) => f.user === user?.id).map((f) => ({ ...f, expand: { recipe: withAuthor(db.recipes.find((r) => r.id === f.recipe)) } }));
    return list(items, url);
  }),
  http.post('*/api/collections/favorites/records', async ({ request }) => {
    const body = await request.json();
    const fav = { id: `fav${db.favorites.length + 1}`, ...body };
    db.favorites.push(fav);
    return HttpResponse.json(fav);
  }),
  http.delete('*/api/collections/favorites/records/:id', ({ params }) => {
    db.favorites = db.favorites.filter((f) => f.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/api/collections/votes/records', ({ request }) => {
    const url = new URL(request.url);
    return list(simpleFilter(db.votes, url.searchParams.get('filter')), url);
  }),
  http.post('*/api/collections/votes/records', async ({ request }) => {
    const body = await request.json();
    const vote = { id: `vote${db.votes.length + 1}`, ...body };
    db.votes.push(vote);
    return HttpResponse.json(vote);
  }),
];

export const server = setupServer(...handlers);
export { http, HttpResponse };
