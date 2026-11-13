import { describe, expect, it } from 'vitest';
import { calcCalories, calcNutrition, formatAmount, isToTaste, recipeKcal, recipeNutrition } from './recipe.js';

const ing = (productId, grams, amountText = '', scalable = true) => ({ productId, name: productId, grams, amountText, scalable });

describe('калорийность', () => {
  it('считает всего, на порцию и на 100 г по справочнику', () => {
    // картофель 77 ккал/100 г, оливковое масло 898 ккал/100 г
    const c = calcCalories([ing('potato', 500), ing('olive-oil', 30), ing('salt', 0, 'по вкусу', false)], 2);
    expect(c.total).toBe(654); // 385 + 269,4 = 654,4
    expect(c.perServing).toBe(327); // 654,4 / 2
    expect(c.per100g).toBe(123); // 654,4 / 530 г × 100
  });

  it('БЖУ считаются вместе с калориями: всего, на порцию и на 100 г', () => {
    // 2 яйца (110 г): Б 12,7 Ж 10,9 У 0,7; 50 г муки: Б 10,3 Ж 1,1 У 69,9 на 100 г
    const n = calcNutrition([ing('egg', 110), ing('flour', 50)], 2);
    expect(n.total).toEqual({ kcal: 340, protein: 19.1, fat: 12.5, carbs: 35.7 });
    expect(n.perServing).toEqual({ kcal: 170, protein: 9.6, fat: 6.3, carbs: 17.9 });
    expect(recipeNutrition([ing('egg', 110), ing('flour', 50)], null)).toEqual(n.per100g);
  });

  it('если продукта нет в справочнике — калорийность не показываем', () => {
    expect(calcCalories([ing('potato', 500), { productId: null, name: 'Желатин', grams: 10 }], 2)).toBeNull();
  });

  it('kcal рецепта: на порцию, а без порций — на 100 г', () => {
    const list = [ing('apple', 600), ing('flour', 160)];
    expect(recipeKcal(list, 4)).toBe(Math.round((600 * 0.47 + 160 * 3.34) / 4));
    expect(recipeKcal(list, null)).toBe(Math.round(((600 * 0.47 + 160 * 3.34) / 760) * 100));
  });
});

describe('пересчёт порций', () => {
  it('граммы округляются по-кухонному', () => {
    expect(formatAmount(ing('beef', 600), 1.5)).toBe('900 г');
    expect(formatAmount(ing('beef', 55), 2)).toBe('110 г');
  });

  it('штучные единицы склоняются', () => {
    expect(formatAmount(ing('garlic', 15, '3 зубчика'), 2)).toBe('6 зубчиков');
    expect(formatAmount(ing('garlic', 15, '3 зубчика'), 0.5)).toBe('1,5 зубчика');
    expect(formatAmount(ing('egg', 55, '1 яйцо'), 2)).toBe('2 яйца');
    expect(formatAmount(ing('egg', 220, '4 яйца'), 1.25)).toBe('5 яиц');
    expect(formatAmount(ing('oil', 30, '2 ст. л.'), 2)).toBe('4 ст. л.');
  });

  it('«по вкусу» не пересчитывается', () => {
    const salt = ing('salt', 0, 'по вкусу', false);
    expect(formatAmount(salt, 3)).toBe('по вкусу');
    expect(isToTaste(salt)).toBe(true);
  });
});
