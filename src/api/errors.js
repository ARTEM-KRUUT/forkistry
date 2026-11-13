/** Ошибка запроса к API со статусом HTTP (0 — нет сети). data — ошибки полей PocketBase. */
export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const isNotFound = (error) => error instanceof ApiError && error.status === 404;

// Коды ошибок валидации PocketBase → понятный текст под полем
const CODE_MESSAGES = {
  validation_required: 'Обязательное поле',
  validation_not_unique: 'Уже занято',
  validation_invalid_email: 'Некорректный email',
  validation_length_out_of_range: 'Недопустимая длина',
  validation_min_text_constraint: 'Слишком коротко',
  validation_max_text_constraint: 'Слишком длинно',
  validation_invalid_format: 'Неверный формат',
  validation_values_mismatch: 'Значения не совпадают',
};

/** Ошибки полей из ответа сервера: { email: 'Уже занято' }. */
export function fieldErrors(error) {
  const out = {};
  if (!(error instanceof ApiError) || !error.data) return out;
  for (const [field, info] of Object.entries(error.data)) {
    out[field] = CODE_MESSAGES[info?.code] || info?.message || 'Неверное значение';
  }
  return out;
}
