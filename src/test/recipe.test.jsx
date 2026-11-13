import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { location, loginAsTestUser, renderApp } from './renderApp.jsx';
import { db, TEST_USER } from './server.js';

const ingredients = () => within(screen.getByRole('region', { name: 'Ингредиенты' })).getAllByRole('listitem').map((li) => li.textContent);

describe('страница рецепта', () => {
  it('параметры, техника, калорийность и шаги', async () => {
    renderApp('/recipe/r1');
    expect(await screen.findByRole('heading', { level: 1, name: 'Курица с картофелем в духовке' })).toBeInTheDocument();
    // БЖУ и калорийность на порцию
    expect(screen.getAllByText('На порцию')).toHaveLength(2);
    expect(screen.getByText('Белки')).toBeInTheDocument();
    expect(screen.getByText('Углеводы')).toBeInTheDocument();
    expect(screen.getByText(/Всего примерно .* ккал · Б \d+ · Ж/)).toBeInTheDocument();
    // у курицы техника «на выбор»
    expect(screen.getByText('Духовка или аэрогриль')).toBeInTheDocument();
    expect(screen.getByText(/Опубликовано/)).toHaveTextContent('Опубликовано 2 октября 2026');
    expect(screen.getByRole('link', { name: 'Начать готовить' })).toHaveAttribute('href', '/recipe/r1/cook');
    expect(screen.getByRole('button', { name: 'Показать ещё 2 шага' })).toBeInTheDocument();
  });

  it('пересчёт ингредиентов под число порций', async () => {
    const { user } = renderApp('/recipe/r1');
    await screen.findByRole('heading', { level: 1 });
    expect(ingredients()).toContain('Куриные бёдра600 г');
    await user.click(screen.getByRole('button', { name: 'Больше порций' }));
    await user.click(screen.getByRole('button', { name: 'Больше порций' }));
    expect(screen.getByText('4 порции')).toBeInTheDocument();
    expect(ingredients()).toEqual(expect.arrayContaining(['Куриные бёдра1200 г', 'Чеснок6 зубчиков', 'Соль, перецпо вкусу']));
  });

  it('продукта нет в справочнике — калорийность не показываем', async () => {
    renderApp('/recipe/r11');
    await screen.findByRole('heading', { level: 1, name: 'Панакота с ягодным соусом' });
    expect(screen.queryByText('На порцию')).not.toBeInTheDocument();
    expect(screen.queryByText('Белки')).not.toBeInTheDocument();
    expect(screen.queryByText(/Всего примерно/)).not.toBeInTheDocument();
  });

  it('рецепт без порций показывает выход и калорийность на 100 г', async () => {
    renderApp('/recipe/r6');
    await screen.findByRole('heading', { level: 1, name: 'Шарлотка с яблоками' });
    expect(screen.getByText('1 пирог, форма 24 см')).toBeInTheDocument();
    expect(screen.getAllByText('На 100 г')).toHaveLength(2);
    expect(screen.queryByRole('group', { name: 'Число порций' })).not.toBeInTheDocument();
  });

  it('несуществующий рецепт — «Рецепт не найден»', async () => {
    renderApp('/recipe/nope');
    expect(await screen.findByRole('heading', { name: 'Рецепт не найден' })).toBeInTheDocument();
  });

  it('гость ставит лайк → вход → возвращается к рецепту, лайк засчитан (Use Case 1)', async () => {
    const { user } = renderApp('/recipe/r1');
    await screen.findByRole('heading', { level: 1 });
    await user.click(screen.getByRole('button', { name: 'Нравится, 286' }));
    expect(location.current.pathname).toBe('/login');

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByRole('button', { name: 'Нравится, 287' })).toHaveAttribute('aria-pressed', 'true');
    expect(location.current.pathname).toBe('/recipe/r1');
    expect(db.votes).toEqual([expect.objectContaining({ user: TEST_USER.id, recipe: 'r1', value: 1 })]);
  });

  it('избранное у вошедшего — запись в API и счётчик «Сохранили»', async () => {
    loginAsTestUser();
    const { user } = renderApp('/recipe/r1');
    await screen.findByRole('heading', { level: 1 });
    await user.click(screen.getByRole('button', { name: 'В избранное' }));
    expect(await screen.findByRole('button', { name: 'Убрать из избранного' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Сохранили 341')).toBeInTheDocument();
    expect(db.favorites).toEqual([expect.objectContaining({ user: TEST_USER.id, recipe: 'r1' })]);
  });

  it('кнопки автора видны только автору', async () => {
    loginAsTestUser();
    renderApp('/recipe/r1');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.queryByRole('button', { name: 'Удалить' })).not.toBeInTheDocument();
  });
});
