import { Plus, Trash2 } from 'lucide-react';
import Input from '../Input/Input.jsx';
import Select from '../Select/Select.jsx';
import { PRODUCTS } from '../../data/products.js';
import { UNITS, toGrams } from '../../data/units.js';
import { emptyIngredient, findProduct, parseQty } from '../../utils/recipeForm.js';
import styles from './IngredientEditor.module.css';

const LIST_ID = 'forkistry-products';
const UNIT_OPTIONS = UNITS.map((u) => ({ value: u.id, label: u.option ?? u.label }));
const NO_HINT = new Set(['g', 'kg', 'taste']);

/** «≈ 75 г» рядом с количеством — чтобы было видно, во что переводится «1 шт.» или «3 ст. л.». */
function gramsHint(row, product) {
  if (NO_HINT.has(row.unit)) return null;
  const g = toGrams(product, parseQty(row.qty), row.unit);
  if (g === null) return null;
  return `≈ ${g < 10 ? Math.round(g * 10) / 10 : Math.round(g)} г`.replace('.', ',');
}

/**
 * Ингредиенты в редакторе (Figma 12:644): продукт с подсказками из справочника,
 * количество и единица (г, мл, шт., ложки…), удаление.
 * Подсказки — нативный <datalist>: работает с клавиатуры и в мобильных браузерах.
 */
export default function IngredientEditor({ rows, onChange, errorOf, touch, error }) {
  const update = (i, patch) => onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));

  // Выбрали продукт из справочника, а количество ещё не вводили — подставляем его обычную единицу
  const changeName = (i, name) => {
    const row = rows[i];
    const product = findProduct(name);
    const patch = { name };
    if (product?.unit && row.qty === '' && row.unit !== 'taste') patch.unit = product.unit;
    update(i, patch);
  };

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>
        <span className={styles.title}>Ингредиенты</span>
        <span className={styles.hint}>
          Продукт выбирается из подсказок. Количество — в граммах, штуках, ложках или «по вкусу»: для калорийности всё переведётся в граммы
        </span>
      </legend>

      <datalist id={LIST_ID}>
        {PRODUCTS.map((p) => (
          <option key={p.id} value={p.name} />
        ))}
      </datalist>

      <ul className={styles.list}>
        {rows.map((row, i) => {
          const product = findProduct(row.name);
          const unknown = row.name.trim() && !product;
          const noPieceWeight = product && row.unit === 'pcs' && !product.piece;
          const hint = product && gramsHint(row, product);
          return (
            <li key={row.key} className={styles.item}>
              <div className={styles.row}>
                <Input
                  label={`Ингредиент ${i + 1}`}
                  hideLabel
                  className={styles.name}
                  placeholder="Продукт"
                  list={LIST_ID}
                  autoComplete="off"
                  value={row.name}
                  onChange={(e) => changeName(i, e.target.value)}
                  onBlur={() => touch(`ingredients.${i}.name`)}
                  error={errorOf(`ingredients.${i}.name`)}
                />
                <button type="button" className={styles.remove} onClick={() => remove(i)} aria-label={`Удалить ингредиент ${i + 1}`}>
                  <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
              <div className={styles.amountRow}>
                {row.unit !== 'taste' && (
                  <Input
                    label={`Количество ингредиента ${i + 1}`}
                    hideLabel
                    className={styles.qty}
                    placeholder="Сколько"
                    inputMode="decimal"
                    value={row.qty}
                    onChange={(e) => update(i, { qty: e.target.value })}
                    onBlur={() => touch(`ingredients.${i}.qty`)}
                    error={errorOf(`ingredients.${i}.qty`)}
                  />
                )}
                <Select
                  label={`Единица ингредиента ${i + 1}`}
                  hideLabel
                  className={styles.unit}
                  options={UNIT_OPTIONS}
                  value={row.unit}
                  onChange={(unit) => update(i, { unit })}
                />
                {hint && (
                  <span className={styles.grams} aria-live="polite">
                    {hint}
                  </span>
                )}
              </div>
              {unknown && <p className={styles.note}>Продукта нет в справочнике — калорийность рецепта не посчитается</p>}
              {noPieceWeight && <p className={styles.note}>Вес одной штуки этого продукта неизвестен — укажите граммы или ложки, иначе калорийность не посчитается</p>}
            </li>
          );
        })}
      </ul>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="button" className={styles.add} onClick={() => onChange([...rows, emptyIngredient()])}>
        <Plus size={18} strokeWidth={2} aria-hidden="true" />
        Добавить ингредиент
      </button>
    </fieldset>
  );
}
