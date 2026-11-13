import { describe, expect, it } from 'vitest';
import { formToRecipe, ingredientToQty, recipeToForm, rowToIngredient, splitEquipment } from './recipeForm.js';
import { MOCK_RECIPES } from '../data/mockRecipes.js';

const row = (name, qty, unit) => ({ key: name, name, qty, unit, orig: null });

describe('форма редактора ↔ рецепт', () => {
  it('рецепт → форма → рецепт без изменений сохраняет ингредиенты как были', () => {
    const original = MOCK_RECIPES.find((r) => r.id === 'r1');
    const form = recipeToForm(original);
    // старые подписи разобраны на число и единицу
    expect(form.ingredients.find((i) => i.name === 'Чеснок')).toMatchObject({ qty: '3', unit: 'clove' });
    expect(form.ingredients.find((i) => i.name === 'Оливковое масло')).toMatchObject({ qty: '2', unit: 'tbsp' });
    expect(form.ingredients.find((i) => i.name === 'Соль, перец')).toMatchObject({ unit: 'taste' });

    const back = formToRecipe(form);
    expect(back.ingredients).toEqual(original.ingredients);
    expect(back.steps.map((s) => s.timerSeconds)).toEqual(original.steps.map((s) => s.timerSeconds));
    expect(back.kcal).toBe(original.kcal);
  });

  it('штуки и ложки переводятся в граммы по справочнику', () => {
    expect(rowToIngredient(row('Яйцо куриное С0', '1', 'pcs'))).toMatchObject({ productId: 'egg-c0', qty: 1, unit: 'pcs', grams: 65, amountText: '1 шт.' });
    expect(rowToIngredient(row('Мука пшеничная', '3', 'tbsp'))).toMatchObject({ grams: 75, amountText: '3 ст. л.' });
    expect(rowToIngredient(row('Мука пшеничная', '3', 'tsp'))).toMatchObject({ grams: 24, amountText: '3 ч. л.' });
    expect(rowToIngredient(row('Молоко 2,5%', '1', 'cup'))).toMatchObject({ grams: 206, amountText: '1 стакан' });
    expect(rowToIngredient(row('Соль', '', 'taste'))).toMatchObject({ grams: 0, amountText: 'по вкусу', scalable: false });
  });

  it('калорийность рецепта считается и для штук, и для ложек', () => {
    const data = formToRecipe({
      ...recipeToForm(MOCK_RECIPES[0]),
      portions: 'servings',
      servings: '1',
      ingredients: [row('Яйцо куриное С0', '2', 'pcs'), row('Мука пшеничная', '3', 'tbsp')],
    });
    // 2 × 65 г × 1,57 + 75 г × 3,34 = 204,1 + 250,5
    expect(data.kcal).toBe(455);
  });

  it('штука без известного веса или неизвестный продукт — калорийность не показываем', () => {
    const base = { ...recipeToForm(MOCK_RECIPES[0]), portions: 'servings', servings: '1' };
    expect(formToRecipe({ ...base, ingredients: [row('Мука пшеничная', '2', 'pcs')] }).kcal).toBeNull();
    expect(formToRecipe({ ...base, ingredients: [row('Трюфель', '10', 'g')] }).kcal).toBeNull();
  });

  it('техника: одна «на выбор» становится обязательной, повторы убираются', () => {
    expect(splitEquipment(['Плита'], ['Духовка', 'Аэрогриль'])).toEqual({ equipment: ['Плита'], equipmentAny: ['Духовка', 'Аэрогриль'] });
    expect(splitEquipment([], ['Духовка'])).toEqual({ equipment: ['Духовка'], equipmentAny: [] });
    expect(splitEquipment(['Плита'], ['Плита', 'Духовка'])).toEqual({ equipment: ['Плита', 'Духовка'], equipmentAny: [] });
  });

  it('разбор старых подписей', () => {
    expect(ingredientToQty({ amountText: '1 щепотка', grams: 1 })).toEqual({ qty: '1', unit: 'pinch' });
    expect(ingredientToQty({ amountText: '4 яйца', grams: 220 })).toEqual({ qty: '4', unit: 'pcs' });
    expect(ingredientToQty({ amountText: '', grams: 600 })).toEqual({ qty: '600', unit: 'g' });
    expect(ingredientToQty({ amountText: 'для подачи', grams: 0 })).toEqual({ qty: '', unit: 'taste' });
  });
});
