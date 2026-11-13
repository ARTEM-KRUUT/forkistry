import { describe, expect, it } from 'vitest';
import { isEmail, isUrlOrPath, parseGrams, validateLogin, validateRecipe, validateRegister } from './validation.js';
import { EMPTY_FORM } from './recipeForm.js';

const errorsOf = (e) => Object.fromEntries(Object.entries(e).filter(([, v]) => v));

describe('валидация входа и регистрации', () => {
  it('email и пароль', () => {
    expect(isEmail('name@mail.ru')).toBe(true);
    expect(isEmail('name@mail')).toBe(false);
    expect(errorsOf(validateLogin({ email: '', password: '' }))).toEqual({ email: 'Введите email', password: 'Введите пароль' });
  });

  it('регистрация: длина пароля и совпадение', () => {
    const e = errorsOf(validateRegister({ name: 'Ольга', email: 'o@mail.ru', password: '1234567', passwordConfirm: '7654321' }));
    expect(e).toEqual({ password: 'Пароль не короче 8 символов', passwordConfirm: 'Пароли не совпадают' });
  });
});

describe('валидация рецепта', () => {
  it('пустая форма — ошибки у обязательных полей', () => {
    const e = errorsOf(validateRecipe(EMPTY_FORM));
    expect(Object.keys(e).sort()).toEqual(['category', 'ingredients.0.name', 'ingredients.0.qty', 'steps.0.text', 'timeMinutes', 'title']);
  });

  it('количество ингредиента: число больше нуля, для «по вкусу» не нужно', () => {
    const row = (qty, unit) => ({ key: 'k', name: 'Мука пшеничная', qty, unit, orig: null });
    const check = (qty, unit) => validateRecipe({ ...EMPTY_FORM, ingredients: [row(qty, unit)] })['ingredients.0.qty'];
    expect(check('3', 'tbsp')).toBe('');
    expect(check('1,5', 'pcs')).toBe('');
    expect(check('', 'g')).toBe('Сколько?');
    expect(check('три', 'tsp')).toBe('Только число');
    expect(check('0', 'g')).toBe('Больше нуля');
    expect(check('', 'taste')).toBe('');
  });

  it('выход вместо порций и некорректная ссылка на фото', () => {
    const e = errorsOf(validateRecipe({ ...EMPTY_FORM, title: 'Пирог', portions: 'yield', yieldText: '', photoUrl: 'not a link' }));
    expect(e.yieldText).toMatch(/выход/i);
    expect(e.photoUrl).toMatch(/ссылка/i);
    expect(e.servings).toBeUndefined();
  });

  it('ссылки и граммы', () => {
    expect(isUrlOrPath('https://images.example.ru/pie.jpg')).toBe(true);
    expect(isUrlOrPath('/seed/borsch.webp')).toBe(true);
    expect(isUrlOrPath('//evil.com/x.jpg')).toBe(false);
    expect(parseGrams('800')).toBe(800);
    expect(parseGrams('300 г')).toBe(300);
    expect(parseGrams('12,5')).toBe(12.5);
    expect(parseGrams('по вкусу')).toBeNull();
    expect(parseGrams('2 ст. л.')).toBeNull();
  });
});
