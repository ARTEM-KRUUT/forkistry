import { describe, expect, it } from 'vitest';
import { formatCount, formatDate, formatShortDate, formatKcal, formatMinutes, formatTimer, initials, likePercent, plural, shortName } from './format.js';

describe('format', () => {
  it('время приготовления', () => {
    expect(formatMinutes(90)).toBe('1 ч 30 мин');
    expect(formatMinutes(45)).toBe('45 мин');
    expect(formatMinutes(120)).toBe('2 ч');
    expect(formatMinutes(0)).toBe('');
  });

  it('калорийность: пусто, если не посчитана', () => {
    expect(formatKcal(310.4)).toBe('310 ккал');
    expect(formatKcal(null)).toBe('');
    expect(formatKcal(0)).toBe('');
  });

  it('доля лайков; без голосов — null (бейдж не показываем)', () => {
    expect(likePercent(95, 5)).toBe(95);
    expect(likePercent(1, 2)).toBe(33);
    expect(likePercent(0, 0)).toBeNull();
  });

  it('склонение по числу', () => {
    const forms = ['рецепт', 'рецепта', 'рецептов'];
    expect([1, 2, 5, 11, 12, 21, 22, 25, 111].map((n) => plural(n, forms))).toEqual([
      'рецепт', 'рецепта', 'рецептов', 'рецептов', 'рецептов', 'рецепт', 'рецепта', 'рецептов', 'рецептов',
    ]);
  });

  it('дата публикации', () => {
    expect(formatDate('2026-09-15 18:00:00.000Z')).toBe('15 сентября 2026');
    expect(formatShortDate('2026-09-15T12:00:00Z', new Date('2026-11-04'))).toBe('15 сентября');
    expect(formatShortDate('2025-03-02T12:00:00Z', new Date('2026-11-04'))).toBe('2 мар. 2025');
    expect(formatDate('')).toBe('');
  });

  it('имена и числа', () => {
    expect(initials('Анна Белова')).toBe('АБ');
    expect(shortName('Марина Котова')).toBe('Марина К.');
    expect(formatCount(2840).replace(/\s/g, ' ')).toBe('2 840');
    expect(formatTimer(2400)).toBe('40 мин');
    expect(formatTimer(90)).toBe('1 мин 30 с');
  });
});
