import { describe, expect, it } from 'vitest';
import { formatQtyUnit, roundForUnit, toGrams } from './units.js';
import { getProduct } from './products.js';
import { calcCalories, formatAmount } from '../utils/recipe.js';

describe('единицы количества', () => {
  it('перевод в граммы: свой вес ложки и штуки у продукта', () => {
    expect(toGrams(getProduct('egg-c0'), 1, 'pcs')).toBe(65);
    expect(toGrams(getProduct('flour'), 3, 'tbsp')).toBe(75);
    expect(toGrams(getProduct('sugar'), 2, 'tsp')).toBe(16);
    expect(toGrams(getProduct('garlic'), 3, 'clove')).toBe(15);
  });

  it('жидкости — через плотность, ложки без своего веса — по объёму', () => {
    expect(toGrams(getProduct('sunflower-oil'), 100, 'ml')).toBeCloseTo(92);
    expect(toGrams(getProduct('water'), 1, 'l')).toBe(1000);
    expect(toGrams(getProduct('water'), 1, 'tbsp')).toBe(15);
    expect(toGrams(undefined, 2, 'tsp')).toBe(10);
  });

  it('штука без веса и пустое количество не переводятся', () => {
    expect(toGrams(getProduct('flour'), 2, 'pcs')).toBeNull();
    expect(toGrams(getProduct('flour'), NaN, 'g')).toBeNull();
    expect(toGrams(getProduct('salt'), 0, 'taste')).toBe(0);
  });

  it('подписи и склонение', () => {
    expect(formatQtyUnit(3, 'tbsp')).toBe('3 ст. л.');
    expect(formatQtyUnit(1.5, 'cup')).toBe('1,5 стакана');
    expect(formatQtyUnit(5, 'clove')).toBe('5 зубчиков');
    expect(formatQtyUnit(0, 'taste')).toBe('по вкусу');
  });

  it('пересчёт порций: ложки и штуки — до половинок, граммы — по-кухонному', () => {
    expect(roundForUnit(3 * 1.5, 'tbsp')).toBe(4.5);
    expect(roundForUnit(1 * 0.5, 'pcs')).toBe(0.5);
    expect(roundForUnit(333, 'g')).toBe(330);
    const egg = { productId: 'egg-c0', name: 'Яйцо куриное С0', qty: 1, unit: 'pcs', grams: 65, amountText: '1 шт.', scalable: true };
    expect(formatAmount(egg, 3)).toBe('3 шт.');
    const flour = { productId: 'flour', name: 'Мука', qty: 3, unit: 'tbsp', grams: 75, amountText: '3 ст. л.', scalable: true };
    expect(formatAmount(flour, 2)).toBe('6 ст. л.');
  });

  it('калории: «по вкусу» пропускаем, непереведённое количество — калорийность неизвестна', () => {
    const taste = { productId: 'salt', unit: 'taste', grams: 0 };
    const egg = { productId: 'egg', unit: 'pcs', qty: 2, grams: 110 };
    expect(calcCalories([egg, taste], 1).total).toBe(173);
    expect(calcCalories([egg, { productId: 'flour', unit: 'pcs', qty: 2, grams: 0 }], 1)).toBeNull();
  });
});
