import { Plus, Trash2 } from 'lucide-react';
import Input from '../Input/Input.jsx';
import PhotoFitEditor from '../PhotoFitEditor/PhotoFitEditor.jsx';
import { emptyStep } from '../../utils/recipeForm.js';
import { isUrlOrPath } from '../../utils/validation.js';
import styles from './StepEditor.module.css';

/** Шаги в редакторе (Figma 12:693): карточка шага с текстом, фото этапа по ссылке и таймером. */
export default function StepEditor({ steps, onChange, errorOf, touch, error }) {
  const update = (i, patch) => onChange(steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const remove = (i) => onChange(steps.filter((_, idx) => idx !== i));

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>
        <span className={styles.title}>Шаги</span>
        <span className={styles.hint}>Время указывайте, если на шаге нужно ждать — в режиме готовки появится таймер</span>
      </legend>

      <ol className={styles.list}>
        {steps.map((step, i) => (
          <li key={step.key} className={styles.card}>
            <div className={styles.head}>
              <span className={styles.num}>Шаг {i + 1}</span>
              <button type="button" className={styles.remove} onClick={() => remove(i)} aria-label={`Удалить шаг ${i + 1}`}>
                <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
            <Input
              label={`Что делать на шаге ${i + 1}`}
              hideLabel
              multiline
              rows={3}
              placeholder="Например, очистите яблоки и нарежьте тонкими дольками"
              value={step.text}
              onChange={(e) => update(i, { text: e.target.value })}
              onBlur={() => touch(`steps.${i}.text`)}
              error={errorOf(`steps.${i}.text`)}
            />
            <div className={styles.photoRow}>
              {!isUrlOrPath(step.photoUrl) && (
                <div className={styles.thumb}>
                  <Plus size={20} strokeWidth={2} aria-hidden="true" />
                </div>
              )}
              <Input
                label="Фото этапа"
                className={styles.photoInput}
                type="url"
                inputMode="url"
                placeholder="Необязательно, ссылка на изображение"
                value={step.photoUrl}
                onChange={(e) => update(i, { photoUrl: e.target.value })}
                onBlur={() => touch(`steps.${i}.photoUrl`)}
                error={errorOf(`steps.${i}.photoUrl`)}
              />
            </div>
            {isUrlOrPath(step.photoUrl) && (
              <PhotoFitEditor
                src={step.photoUrl.trim()}
                fit={step.photoFit}
                onChange={(photoFit) => update(i, { photoFit })}
                aspect="4 / 5"
                label={`Кадр фото шага ${i + 1}`}
              />
            )}
            <div className={styles.timerRow}>
              <Input
                label="Таймер, мин"
                className={styles.timer}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                placeholder="Без таймера"
                value={step.timerMinutes}
                onChange={(e) => update(i, { timerMinutes: e.target.value })}
                onBlur={() => touch(`steps.${i}.timerMinutes`)}
                error={errorOf(`steps.${i}.timerMinutes`)}
              />
            </div>
          </li>
        ))}
      </ol>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="button" className={styles.add} onClick={() => onChange([...steps, emptyStep()])}>
        <Plus size={18} strokeWidth={2} aria-hidden="true" />
        Добавить шаг
      </button>
    </fieldset>
  );
}
