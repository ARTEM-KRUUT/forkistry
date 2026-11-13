import DifficultyHats from '../DifficultyHats/DifficultyHats.jsx';
import Macros from '../Macros/Macros.jsx';
import { DIFFICULTY } from '../../data/constants.js';
import { formatKcal, formatMinutes } from '../../utils/format.js';
import styles from './RecipeParams.module.css';

/**
 * Карточка «Время · Сложность · Калорийность» (Figma 8:332).
 * Калорийность — на порцию или на 100 г; если не посчитана, колонки нет.
 * Над ними — БЖУ на ту же порцию (или 100 г).
 */
export default function RecipeParams({ timeMinutes, difficulty, kcal, macros, perServing }) {
  return (
    <div className={styles.card}>
      {macros && (
        <div className={styles.macros}>
          <p className={styles.macrosTitle}>{perServing ? 'На порцию' : 'На 100 г'}</p>
          <Macros macros={macros} variant="cells" />
        </div>
      )}
    <dl className={styles.row}>
      <div className={styles.item}>
        <dt className={styles.label}>Время</dt>
        <dd className={styles.value}>{formatMinutes(timeMinutes)}</dd>
      </div>
      <div className={styles.item}>
        <dt className={styles.label}>Сложность</dt>
        <dd className={styles.value}>
          <DifficultyHats difficulty={difficulty} />
          <span>{DIFFICULTY[difficulty]?.label}</span>
        </dd>
      </div>
      {kcal != null && (
        <div className={styles.item}>
          <dt className={styles.label}>{perServing ? 'На порцию' : 'На 100 г'}</dt>
          <dd className={styles.value}>{formatKcal(kcal)}</dd>
        </div>
      )}
    </dl>
    </div>
  );
}
