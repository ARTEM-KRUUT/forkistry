import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { location, loginAsTestUser, renderApp } from './renderApp.jsx';
import { db, TEST_USER } from './server.js';
import { MOCK_RECIPES } from '../data/mockRecipes.js';

describe('CRUD рецепта', () => {
  it('создание: валидация пустой формы, затем публикация', async () => {
    loginAsTestUser();
    const { user } = renderApp('/recipe/new');
    await user.click(screen.getByRole('button', { name: 'Опубликовать' }));
    expect(screen.getByText('Введите название рецепта')).toBeInTheDocument();
    expect(screen.getByText('Укажите категорию')).toBeInTheDocument();
    expect(screen.getByLabelText('Категория')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/Исправьте 6 полей/)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Название рецепта'), 'Яблочный пирог');
    await user.selectOptions(screen.getByLabelText('Категория'), 'Выпечка');
    await user.type(screen.getByLabelText('Время приготовления, мин'), '80');
    // «Обязательно» — плита; «подойдёт любая из» — духовка или аэрогриль
    await user.click(within(screen.getByRole('group', { name: /^Обязательно/ })).getByRole('button', { name: 'Плита' }));
    const anyGroup = screen.getByRole('group', { name: /^Подойдёт любая из/ });
    await user.click(within(anyGroup).getByRole('button', { name: 'Духовка' }));
    await user.click(within(anyGroup).getByRole('button', { name: 'Аэрогриль' }));
    await user.click(screen.getByRole('switch', { name: 'Делится на порции' }));
    await user.type(screen.getByLabelText('Выход готового блюда'), '1 пирог, форма 24 см');
    await user.type(screen.getByLabelText('Ингредиент 1'), 'Яблоки');
    await user.type(screen.getByLabelText('Количество ингредиента 1'), '800');
    await user.click(screen.getByRole('button', { name: 'Добавить ингредиент' }));
    await user.type(screen.getByLabelText('Ингредиент 2'), 'Яйцо куриное С0');
    // единица подставилась сама по справочнику, видно, во что она переводится
    expect(screen.getByLabelText('Единица ингредиента 2')).toHaveValue('pcs');
    await user.type(screen.getByLabelText('Количество ингредиента 2'), '2');
    expect(screen.getByText('≈ 130 г')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Добавить ингредиент' }));
    await user.type(screen.getByLabelText('Ингредиент 3'), 'Мука пшеничная');
    await user.selectOptions(screen.getByLabelText('Единица ингредиента 3'), 'tbsp');
    await user.type(screen.getByLabelText('Количество ингредиента 3'), '3');
    await user.click(screen.getByRole('button', { name: 'Добавить ингредиент' }));
    await user.type(screen.getByLabelText('Ингредиент 4'), 'Корица');
    await user.selectOptions(screen.getByLabelText('Единица ингредиента 4'), 'taste');
    expect(screen.queryByLabelText('Количество ингредиента 4')).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Что делать на шаге 1'), 'Нарежьте яблоки');
    await user.type(screen.getByLabelText('Таймер, мин'), '45');
    await user.click(screen.getByRole('button', { name: 'Опубликовать' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Яблочный пирог' })).toBeInTheDocument();
    const { body } = db.requests.find((r) => r.method === 'POST');
    expect(body).toMatchObject({
      title: 'Яблочный пирог',
      category: 'Выпечка',
      equipment: ['Плита'],
      equipmentAny: ['Духовка', 'Аэрогриль'],
      timeMinutes: 80,
      servings: 0,
      yieldText: '1 пирог, форма 24 см',
      author: TEST_USER.id,
      // (800 г × 0,47 + 130 г × 1,57 + 75 г × 3,34) = 830,6 ккал на 1005 г → 83 ккал на 100 г
      kcal: 83,
    });
    expect(body.steps[0]).toEqual({ text: 'Нарежьте яблоки', timerSeconds: 2700, photoUrl: '' });
    expect(body.ingredients[1]).toMatchObject({ productId: 'egg-c0', qty: 2, unit: 'pcs', grams: 130, amountText: '2 шт.' });
    expect(body.ingredients[2]).toMatchObject({ productId: 'flour', qty: 3, unit: 'tbsp', grams: 75, amountText: '3 ст. л.' });
    expect(body.ingredients[3]).toMatchObject({ name: 'Корица', unit: 'taste', amountText: 'по вкусу', scalable: false });
    expect(body.likes).toBeUndefined();
  });

  it('редактировать чужой рецепт нельзя', async () => {
    loginAsTestUser();
    renderApp('/recipe/r1/edit');
    expect(await screen.findByRole('heading', { name: 'Редактировать может только автор' })).toBeInTheDocument();
  });

  it('редактирование своего рецепта: форма заполнена, изменения сохраняются', async () => {
    db.recipes.push({ ...MOCK_RECIPES[1], id: 'mine00000000001', author: TEST_USER.id, servings: 2, kcal: 334 });
    loginAsTestUser();
    const { user } = renderApp('/recipe/mine00000000001/edit');
    const title = await screen.findByLabelText('Название рецепта');
    expect(title).toHaveValue('Шакшука с томатами и зеленью');
    await user.clear(title);
    await user.type(title, 'Шакшука по-домашнему');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Шакшука по-домашнему' })).toBeInTheDocument();
    expect(db.recipes.find((r) => r.id === 'mine00000000001').title).toBe('Шакшука по-домашнему');
  });

  it('удаление с подтверждением', async () => {
    db.recipes.push({ ...MOCK_RECIPES[1], id: 'mine00000000002', author: TEST_USER.id, servings: 2 });
    loginAsTestUser();
    const { user } = renderApp('/recipe/mine00000000002');
    await screen.findByRole('heading', { level: 1 });
    await user.click(screen.getByRole('button', { name: 'Удалить' }));
    const dialog = screen.getByRole('dialog', { name: 'Удалить рецепт?' });
    await user.click(within(dialog).getByRole('button', { name: 'Отмена' }));
    expect(db.recipes.some((r) => r.id === 'mine00000000002')).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Удалить' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Удалить' }));
    await screen.findByRole('heading', { name: 'Мои рецепты' });
    expect(location.current.pathname).toBe('/profile');
    expect(db.recipes.some((r) => r.id === 'mine00000000002')).toBe(false);
  });
});
