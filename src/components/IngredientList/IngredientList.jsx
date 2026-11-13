import { formatAmount, isToTaste } from '../../utils/recipe.js';
import styles from './IngredientList.module.css';

/** Список ингредиентов с количеством под выбранное число порций (factor). */
export default function IngredientList({ ingredients = [], factor = 1 }) {
  return (
    <ul className={styles.list}>
      {ingredients.map((ing, i) => (
        <li key={`${ing.name}-${i}`} className={styles.row}>
          <span>{ing.name}</span>
          <span className={isToTaste(ing) || ing.scalable === false ? styles.muted : styles.amount}>{formatAmount(ing, factor)}</span>
        </li>
      ))}
    </ul>
  );
}
