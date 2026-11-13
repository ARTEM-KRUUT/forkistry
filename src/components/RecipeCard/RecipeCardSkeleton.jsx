import Skeleton from '../Skeleton/Skeleton.jsx';
import styles from './RecipeCard.module.css';

/** Заглушка карточки на время загрузки (повторяет её геометрию). */
export default function RecipeCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <Skeleton className={styles.photo} radius="0" />
      <div className={styles.body}>
        <Skeleton width="30%" height="14px" />
        <Skeleton width="75%" height="20px" />
        <Skeleton width="60%" height="16px" />
        <Skeleton width="45%" height="14px" />
      </div>
    </div>
  );
}
