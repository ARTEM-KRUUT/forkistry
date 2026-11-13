// Правила проверки форм. Каждая функция возвращает { поле: 'текст ошибки' }.

export const isEmail = (s = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
/** Абсолютная ссылка http(s) или путь от корня сайта (/seed/…). */
export const isUrlOrPath = (s = '') => /^(https?:\/\/[^\s/]+\.[^\s]+|\/[^\s/][^\s]*)$/i.test(s.trim());

export function validateLogin({ email, password }) {
  return {
    email: !email.trim() ? 'Введите email' : !isEmail(email) ? 'Проверьте email, например name@mail.ru' : '',
    password: !password ? 'Введите пароль' : '',
  };
}

export function validateRegister({ name, email, password, passwordConfirm }) {
  return {
    name: !name.trim() ? 'Введите имя' : name.trim().length < 2 ? 'Имя слишком короткое' : name.trim().length > 60 ? 'Не больше 60 символов' : '',
    email: !email.trim() ? 'Введите email' : !isEmail(email) ? 'Проверьте email, например name@mail.ru' : '',
    password: !password ? 'Придумайте пароль' : password.length < 8 ? 'Пароль не короче 8 символов' : '',
    passwordConfirm: !passwordConfirm ? 'Повторите пароль' : passwordConfirm !== password ? 'Пароли не совпадают' : '',
  };
}

export function validateProfile({ name, bio, avatarUrl }) {
  return {
    name: !name.trim() ? 'Введите имя' : name.trim().length > 60 ? 'Не больше 60 символов' : '',
    bio: bio.length > 300 ? 'Не больше 300 символов' : '',
    avatarUrl: avatarUrl.trim() && !isUrlOrPath(avatarUrl) ? 'Нужна ссылка вида https://…' : '',
  };
}

const num = (v) => (v === '' || v === null || v === undefined ? NaN : Number(String(v).replace(',', '.')));

/** «800», «800 г», «12,5» — граммы числом; null, если это текст («по вкусу», «2 ст. л.»). */
export function parseGrams(text = '') {
  const m = text.trim().match(/^(\d+(?:[.,]\d+)?)\s*(г|гр|g)?\.?$/i);
  return m ? Number(m[1].replace(',', '.')) : null;
}

/**
 * Форма рецепта. Ключи вложенных полей: ingredients.0.name, steps.2.text и т. п.
 * values.portions: 'servings' | 'yield' — делится на порции или указывается выход.
 */
export function validateRecipe(v) {
  const e = {};
  const title = v.title.trim();
  e.title = !title ? 'Введите название рецепта' : title.length < 3 ? 'Слишком короткое название' : title.length > 120 ? 'Не больше 120 символов' : '';
  e.photoUrl = v.photoUrl.trim() && !isUrlOrPath(v.photoUrl) ? 'Нужна ссылка на фото вида https://…' : '';
  e.category = !v.category ? 'Укажите категорию' : '';
  e.difficulty = !v.difficulty ? 'Выберите сложность' : '';

  const time = num(v.timeMinutes);
  e.timeMinutes = Number.isNaN(time) ? 'Укажите время' : !Number.isInteger(time) || time < 1 || time > 1440 ? 'От 1 до 1440 минут' : '';

  if (v.portions === 'servings') {
    const s = num(v.servings);
    e.servings = Number.isNaN(s) ? 'Укажите число порций' : !Number.isInteger(s) || s < 1 || s > 50 ? 'От 1 до 50 порций' : '';
  } else {
    e.yieldText = !v.yieldText.trim() ? 'Укажите выход, например «1 пирог, форма 24 см»' : v.yieldText.length > 80 ? 'Не больше 80 символов' : '';
  }

  e.ingredients = v.ingredients.length === 0 ? 'Добавьте хотя бы один ингредиент' : '';
  v.ingredients.forEach((ing, i) => {
    e[`ingredients.${i}.name`] = !ing.name.trim() ? 'Укажите продукт' : '';
    if (ing.unit === 'taste') {
      e[`ingredients.${i}.qty`] = '';
      return;
    }
    const raw = String(ing.qty ?? '').trim();
    const qty = num(raw);
    e[`ingredients.${i}.qty`] = !raw
      ? 'Сколько?'
      : Number.isNaN(qty)
        ? 'Только число'
        : qty <= 0
          ? 'Больше нуля'
          : qty > 100000
            ? 'Слишком много'
            : '';
  });

  e.steps = v.steps.length === 0 ? 'Добавьте хотя бы один шаг' : '';
  v.steps.forEach((st, i) => {
    e[`steps.${i}.text`] = !st.text.trim() ? 'Опишите шаг' : '';
    const t = num(st.timerMinutes);
    e[`steps.${i}.timerMinutes`] = st.timerMinutes !== '' && (Number.isNaN(t) || t < 0 || t > 1440) ? 'От 0 до 1440 минут' : '';
    e[`steps.${i}.photoUrl`] = st.photoUrl.trim() && !isUrlOrPath(st.photoUrl) ? 'Нужна ссылка вида https://…' : '';
  });

  return e;
}
