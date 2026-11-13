import { useEffect, useState } from 'react';
import BottomSheet from '../BottomSheet/BottomSheet.jsx';
import Chip from '../Chip/Chip.jsx';
import Button from '../Button/Button.jsx';
import { countRecipes } from '../../api/recipes.js';
import { DIFFICULTY, EQUIPMENT, KCAL_OPTIONS, TIME_OPTIONS } from '../../data/constants.js';
import { DEFAULT_FILTERS, toggleValue } from '../../utils/filters.js';
import { plural } from '../../utils/format.js';
import styles from './FilterSheet.module.css';

/**
 * Панель фильтров каталога (Figma 8:249).
 * Работает с черновиком: изменения применяются только по кнопке «Показать N рецептов».
 */
export default function FilterSheet({ open, filters, onApply, onClose, returnFocusRef }) {
  const [draft, setDraft] = useState(filters);
  const [count, setCount] = useState(null);

  // При каждом открытии начинаем с текущих фильтров
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  // Живой счётчик результатов для черновика
  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setCount(null);
    const timer = setTimeout(() => {
      countRecipes(draft)
        .then((n) => active && setCount(n))
        .catch(() => active && setCount(undefined));
    }, 150);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [open, draft]);

  const patch = (p) => setDraft((d) => ({ ...d, ...p }));
  const single = (key, id) => patch({ [key]: draft[key] === id ? null : id });

  const applyLabel =
    count == null ? 'Показать' : count === 0 ? 'Ничего не найдено' : `Показать ${count} ${plural(count, ['рецепт', 'рецепта', 'рецептов'])}`;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
      title="Фильтры"
      footer={
        <>
          <Button
            variant="secondary"
            className={styles.reset}
            onClick={() => patch({ ...DEFAULT_FILTERS, search: draft.search, category: draft.category, sort: draft.sort })}
          >
            Сбросить
          </Button>
          <Button fullWidth className={styles.apply} onClick={() => onApply(draft)} disabled={count === 0}>
            {applyLabel}
          </Button>
        </>
      }
    >
      <div className={styles.groups}>
        <Group title="Техника, которая есть дома" hint="Покажем рецепты, для которых хватит этой техники">
          {EQUIPMENT.map((e) => (
            <Chip key={e} active={draft.equipment.includes(e)} onClick={() => patch({ equipment: toggleValue(draft.equipment, e) })}>
              {e}
            </Chip>
          ))}
        </Group>

        <Group title="Время приготовления">
          {TIME_OPTIONS.map((o) => (
            <Chip key={o.id} active={draft.time === o.id} onClick={() => single('time', o.id)}>
              {o.label}
            </Chip>
          ))}
        </Group>

        <Group title="Сложность">
          {Object.entries(DIFFICULTY).map(([id, { label }]) => (
            <Chip key={id} active={draft.difficulty.includes(id)} onClick={() => patch({ difficulty: toggleValue(draft.difficulty, id) })}>
              {label}
            </Chip>
          ))}
        </Group>

        <Group title="Калорийность на порцию">
          {KCAL_OPTIONS.map((o) => (
            <Chip key={o.id} active={draft.kcal === o.id} onClick={() => single('kcal', o.id)}>
              {o.label}
            </Chip>
          ))}
          <Chip active={!draft.kcal} onClick={() => patch({ kcal: null })}>
            Любая
          </Chip>
        </Group>
      </div>
    </BottomSheet>
  );
}

function Group({ title, hint, children }) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>
        <span className={styles.groupTitle}>{title}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </legend>
      <div className={styles.chips}>{children}</div>
    </fieldset>
  );
}
