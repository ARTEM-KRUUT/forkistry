import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { location, renderApp } from './renderApp.jsx';
import { db, TEST_USER } from './server.js';
import { getPopularAuthors } from '../api/recipes.js';
import { buildRecipeFilter, DEFAULT_FILTERS } from '../utils/filters.js';
import { MOCK_RECIPES } from '../data/mockRecipes.js';

describe('популярные авторы', () => {
  it('попадают авторы от 3 лайков, порядок — по лайкам, у каждого самый популярный рецепт', async () => {
    db.recipes.push({ ...MOCK_RECIPES[0], id: 'watrushki000001', title: 'Ватрушки из творога', author: TEST_USER.id, likes: 3, favoritesCount: 1 });
    db.recipes.push({ ...MOCK_RECIPES[0], id: 'other0000000001', title: 'Мало лайков', author: 'u_low', likes: 2, favoritesCount: 9 });
    db.users.push({ id: 'u_low', name: 'Новичок', avatarUrl: '', bio: '' });

    const authors = await getPopularAuthors();
    const names = authors.map((a) => a.name);
    expect(names).toContain('Тест Тестов'); // ровно 3 лайка — уже популярный
    expect(names).not.toContain('Новичок'); // 2 лайка — нет
    expect(authors.map((a) => a.likes)).toEqual([...authors.map((a) => a.likes)].sort((a, b) => b - a));

    const denis = authors.find((a) => a.name === 'Денис Лебедев');
    expect(denis).toMatchObject({ recipesCount: 3, likes: 510 + 120 + 130, favorites: 520 + 70 + 75 });
    expect(denis.topRecipe.title).toBe('Паста карбонара');
    expect(await getPopularAuthors({ limit: 2 })).toHaveLength(2);
  });

  it('страница списка: переход к автору и к его популярному рецепту', async () => {
    const { user } = renderApp('/authors');
    expect(screen.getByRole('heading', { level: 1, name: 'Популярные авторы' })).toBeInTheDocument();
    const denis = (await screen.findByText('Денис Лебедев')).closest('li');
    expect(within(denis).getByRole('link', { name: /Самый популярный рецепт: Паста карбонара/ })).toHaveAttribute('href', '/recipe/r3');
    // первая — Марина Котова: 905 лайков против 760 у Дениса
    expect(within(screen.getByText('Марина Котова').closest('li')).getByText('1')).toBeInTheDocument();
    await user.click(within(denis).getByText('Денис Лебедев'));
    expect(location.current.pathname).toBe('/author/u3');
  });

  it('на главной — ссылка «Все» на список', async () => {
    renderApp('/');
    await screen.findByRole('heading', { name: 'Популярные авторы' });
    const section = screen.getByRole('region', { name: 'Популярные авторы' });
    expect(within(section).getByRole('link', { name: 'Все' })).toHaveAttribute('href', '/authors');
  });

  it('никто не набрал 3 лайка — пустое состояние', async () => {
    db.recipes.forEach((r) => {
      r.likes = 0;
    });
    renderApp('/authors');
    expect(await screen.findByRole('heading', { name: 'Популярных авторов пока нет' })).toBeInTheDocument();
  });
});

describe('аэрогриль в технике', () => {
  it('без отмеченного аэрогриля рецепты с ним отфильтровываются', () => {
    expect(buildRecipeFilter({ ...DEFAULT_FILTERS, equipment: ['Плита'] })).toContain('equipment !~ "Аэрогриль"');
    expect(buildRecipeFilter({ ...DEFAULT_FILTERS, equipment: ['Аэрогриль'] })).not.toContain('equipment !~ "Аэрогриль"');
  });

  it('есть в панели «Что есть на кухне»', () => {
    renderApp('/');
    expect(screen.getByRole('button', { name: 'Аэрогриль' })).toBeInTheDocument();
  });
});
