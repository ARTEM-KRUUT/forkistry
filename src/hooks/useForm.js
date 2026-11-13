import { useCallback, useState } from 'react';

/**
 * Состояние формы и валидация.
 * validate(values) → { поле: 'текст ошибки' } (пустая строка или отсутствие ключа — ошибки нет).
 * Ошибка поля видна после ухода с поля (blur) или после попытки отправки.
 * Серверные ошибки (setServerErrors) показываются, пока поле не изменят.
 */
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const errors = validate(values);
  const hasErrors = Object.values(errors).some(Boolean);

  const errorOf = (key) => serverErrors[key] || (touched[key] || submitted ? errors[key] : '') || '';

  const setValue = useCallback((key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    setServerErrors((s) => (s[key] ? { ...s, [key]: '' } : s));
  }, []);

  const touch = useCallback((key) => setTouched((t) => (t[key] ? t : { ...t, [key]: true })), []);

  /** props для <Input>: value, onChange, onBlur, error, name */
  const field = (key) => ({
    name: key,
    value: values[key] ?? '',
    onChange: (e) => setValue(key, e.target.value),
    onBlur: () => touch(key),
    error: errorOf(key),
  });

  const handleSubmit = (onValid) => async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitted(true);
    if (Object.values(validate(values)).some(Boolean)) {
      // После перерисовки ставим фокус на первое поле с ошибкой
      setTimeout(() => form.querySelector('[aria-invalid="true"]')?.focus(), 0);
      return;
    }
    setSubmitting(true);
    try {
      await onValid(values);
    } finally {
      setSubmitting(false);
    }
  };

  return { values, setValues, setValue, touch, field, errorOf, errors, hasErrors, submitted, submitting, handleSubmit, setServerErrors };
}
