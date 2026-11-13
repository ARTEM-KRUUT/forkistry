import { describe, expect, it } from 'vitest';
import { DEFAULT_FILTERS, buildRecipeFilter, countActiveFilters, describeFilters, sortParam, toggleValue } from './filters.js';

const f = (patch) => ({ ...DEFAULT_FILTERS, ...patch });

describe('фильтр PocketBase', () => {
  it('без фильтров — пустая строка', () => {
    expect(buildRecipeFilter(DEFAULT_FILTERS)).toBe('');
  });

  it('техника: исключаем рецепты, которым нужна невыбранная техника', () => {
    const s = buildRecipeFilter(f({ equipment: ['Плита', 'Духовка'] }));
    expect(s).toContain('equipment !~ "Блендер"');
    expect(s).toContain('equipment !~ "Микроволновка"');
    expect(s).not.toContain('equipment !~ "Плита"');
    expect(s).not.toContain('equipment !~ "Духовка"');
    // техника «на выбор»: хватит любой одной из того, что есть дома, или её нет вовсе
    expect(s).toContain('(equipmentAny:length = 0 || equipmentAny ~ "Плита" || equipmentAny ~ "Духовка")');
  });

  it('поиск — по названию и ингредиентам в нескольких регистрах (SQLite LIKE не понимает кириллицу)', () => {
    const s = buildRecipeFilter(f({ search: 'борщ' }));
    expect(s).toContain('title ~ "борщ"');
    expect(s).toContain('title ~ "Борщ"');
    expect(s).toContain('ingredients ~ "борщ"');
  });

  it('экранирует кавычки в поиске', () => {
    expect(buildRecipeFilter(f({ search: 'a"b' }))).toContain('title ~ "a\\"b"');
  });

  it('категория, время, сложность, калорийность, автор', () => {
    const s = buildRecipeFilter(f({ category: 'Супы', time: '30', difficulty: ['easy', 'hard'], kcal: '300', author: 'u1' }));
    expect(s).toBe('category = "Супы" && timeMinutes <= 30 && (difficulty = "easy" || difficulty = "hard") && kcal > 0 && kcal <= 300 && author = "u1"');
  });

  it('сортировка', () => {
    expect(sortParam('new')).toBe('-created');
    expect(sortParam('fast')).toMatch(/^timeMinutes/);
    expect(sortParam('popular')).toMatch(/^-likes/);
  });
});

describe('подписи фильтров', () => {
  it('строка над списком и счётчик на кнопке', () => {
    const filters = f({ equipment: ['Духовка', 'Плита'], time: '60' });
    expect(describeFilters(filters)).toBe('Духовка, плита · до 60 мин');
    expect(countActiveFilters(filters)).toBe(3);
  });

  it('мультивыбор', () => {
    expect(toggleValue(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleValue(['a', 'b'], 'a')).toEqual(['b']);
  });
});
