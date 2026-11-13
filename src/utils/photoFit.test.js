import { describe, expect, it } from 'vitest';
import { DEFAULT_FIT, fitStyles, isDefaultFit, normalizeFit, panFit, rotateFit } from './photoFit.js';
import { EMPTY_FORM, emptyStep, formToRecipe, recipeToForm } from './recipeForm.js';
import { MOCK_RECIPES } from '../data/mockRecipes.js';

describe('настройки кадра фото', () => {
  it('приводит данные к допустимым значениям', () => {
    expect(normalizeFit(null)).toEqual(DEFAULT_FIT);
    expect(normalizeFit({ x: 140, y: -5, zoom: 9, rotate: 450 })).toEqual({ x: 100, y: 0, zoom: 3, rotate: 90 });
    expect(isDefaultFit({ x: 50, y: 50, zoom: 1, rotate: 0 })).toBe(true);
  });

  it('поворот по 90° по кругу', () => {
    let f = DEFAULT_FIT;
    f = rotateFit(rotateFit(rotateFit(f)));
    expect(f.rotate).toBe(270);
    expect(rotateFit(f).rotate).toBe(0);
  });

  it('перетаскивание вправо открывает левую часть кадра, с учётом поворота', () => {
    expect(panFit(DEFAULT_FIT, 100, 0, 300, 300).x).toBeLessThan(50);
    // при повороте на 90° движение пальца вправо идёт вдоль оси y картинки
    const turned = panFit({ ...DEFAULT_FIT, rotate: 90 }, 100, 0, 300, 300);
    expect(turned.x).toBe(50);
    expect(turned.y).toBeGreaterThan(50);
  });

  it('при 90° стороны слоя меняются местами, масштаб — от точки кадра', () => {
    const { box, img } = fitStyles({ x: 30, y: 70, zoom: 2, rotate: 90 });
    expect(box).toMatchObject({ width: '100cqh', height: '100cqw' });
    expect(box.transform).toContain('rotate(90deg)');
    expect(img).toMatchObject({ objectPosition: '30% 70%', transform: 'scale(2)', transformOrigin: '30% 70%' });
  });

  it('форма сохраняет кадр обложки и шага, а настройки по умолчанию не пишет', () => {
    const fit = { x: 20, y: 80, zoom: 1.5, rotate: 90 };
    const v = {
      ...recipeToForm(MOCK_RECIPES[0]),
      photoFit: fit,
      steps: [{ ...emptyStep(), text: 'Шаг', photoUrl: 'https://example.com/a.jpg', photoFit: fit }, { ...emptyStep(), text: 'Без фото', photoFit: fit }],
    };
    const data = formToRecipe(v);
    expect(data.photoFit).toEqual(fit);
    expect(data.steps[0].photoFit).toEqual(fit);
    expect(data.steps[1].photoFit).toBeUndefined(); // без фото кадр не нужен
    expect(formToRecipe({ ...EMPTY_FORM, photoUrl: '/seed/a.webp', photoFit: DEFAULT_FIT }).photoFit).toBeNull();
  });
});
