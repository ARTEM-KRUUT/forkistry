import styles from './Macros.module.css';

const fmt = (v) => String(Math.round(v)).replace('.', ',');

/**
 * Белки, жиры, углеводы. variant: compact — «Б 32 · Ж 18 · У 45» в карточках,
 * cells — три колонки с подписями на странице рецепта.
 */
export default function Macros({ macros, variant = 'compact', className = '' }) {
  if (!macros) return null;
  const items = [
    ['Б', 'Белки', macros.protein],
    ['Ж', 'Жиры', macros.fat],
    ['У', 'Углеводы', macros.carbs],
  ];
  const label = `Белки ${fmt(macros.protein)} г, жиры ${fmt(macros.fat)} г, углеводы ${fmt(macros.carbs)} г`;

  if (variant === 'cells') {
    return (
      <dl className={`${styles.cells} ${className}`}>
        {items.map(([short, full, value]) => (
          <div key={short} className={styles.cell}>
            <dt className={styles.cellLabel}>{full}</dt>
            <dd className={styles.cellValue}>{fmt(value)} г</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <span className={`${styles.compact} ${className}`} aria-label={label} title={label}>
      {items.map(([short, , value], i) => (
        <span key={short} aria-hidden="true">
          {i > 0 && <span className={styles.dot}> · </span>}
          <span className={styles.letter}>{short}</span> {fmt(value)}
        </span>
      ))}
    </span>
  );
}
