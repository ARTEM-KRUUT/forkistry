import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderApp } from './renderApp.jsx';
import { db, http, HttpResponse, server } from './server.js';

const RECIPES_URL = '*/api/collections/recipes/records';

describe('каталог: загрузка, успех, пусто, ошибка', () => {
  it('сначала скелетоны, потом карточки и число рецептов', async () => {
    renderApp('/recipes');
    expect(screen.getByLabelText('Загрузка рецептов')).toBeInTheDocument();
    expect(await screen.findByText('14 рецептов')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(14);
    expect(screen.getByRole('link', { name: 'Паста карбонара' })).toHaveAttribute('href', '/recipe/r3');
  });

  it('пустой ответ — пустое состояние', async () => {
    server.use(http.get(RECIPES_URL, () => HttpResponse.json({ page: 1, perPage: 100, totalItems: 0, totalPages: 0, items: [] })));
    renderApp('/recipes');
    expect(await screen.findByRole('heading', { name: 'Ничего не нашлось' })).toBeInTheDocument();
  });

  it('с фильтрами пустое состояние предлагает их сбросить', async () => {
    server.use(http.get(RECIPES_URL, () => HttpResponse.json({ page: 1, perPage: 100, totalItems: 0, totalPages: 0, items: [] })));
    const { user } = renderApp('/recipes');
    await user.type(screen.getByRole('searchbox', { name: 'Поиск рецептов' }), 'тирамису');
    expect(await screen.findByRole('button', { name: 'Сбросить фильтры' })).toBeInTheDocument();
  });

  it('ошибка сети — сообщение и повтор загрузки', async () => {
    server.use(http.get(RECIPES_URL, () => HttpResponse.error(), { once: true }));
    const { user } = renderApp('/recipes');
    expect(await screen.findByRole('heading', { name: 'Не удалось загрузить' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));
    expect(await screen.findByText('14 рецептов')).toBeInTheDocument();
  });

  it('панель фильтров: выбор техники уходит в запрос к API', async () => {
    const { user } = renderApp('/recipes');
    await screen.findByText('14 рецептов');
    await user.click(screen.getByRole('button', { name: 'Фильтры' }));
    const dialog = screen.getByRole('dialog', { name: 'Фильтры' });
    await user.click(within(dialog).getByRole('button', { name: 'Духовка' }));
    await user.click(within(dialog).getByRole('button', { name: /^Показать/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Фильтры, выбрано 1' })).toBeInTheDocument();
    const last = db.requests.filter((r) => r instanceof URL).at(-1);
    expect(last.searchParams.get('filter')).toContain('equipment !~ "Блендер"');
    expect(last.searchParams.get('filter')).not.toContain('equipment !~ "Духовка"');
    expect(last.searchParams.get('filter')).toContain('equipmentAny ~ "Духовка"');
  });

  it('категория-чип отправляет фильтр по категории', async () => {
    const { user } = renderApp('/recipes');
    await screen.findByText('14 рецептов');
    await user.click(screen.getByRole('button', { name: 'Супы' }));
    expect(await screen.findByText('2 рецепта')).toBeInTheDocument();
  });
});
