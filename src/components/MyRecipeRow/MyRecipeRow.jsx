import { Link } from 'react-router-dom';
import { Pencil, ThumbsUp, Trash2 } from 'lucide-react';
import Photo from '../Photo/Photo.jsx';
import { formatCount, formatKcal, formatMinutes } from '../../utils/format.js';
import styles from './MyRecipeRow.module.css';

/** Строка «Мои рецепты» в профиле (Figma 10:537): фото, название, мета, лайки, правка, удаление. */
export default function MyRecipeRow({ recipe, onDelete }) {
  const meta = [formatMinutes(recipe.timeMinutes), formatKcal(recipe.kcal)].filter(Boolean).join(' · ');
  return (
    <li className={styles.row}>
      <Photo src={recipe.photoUrl} fit={recipe.photoFit} className={styles.photo} />
      <div className={styles.info}>
        <Link to={`/recipe/${recipe.id}`} className={styles.title}>
          {recipe.title}
        </Link>
        {meta && <span className={styles.meta}>{meta}</span>}
        <span className={styles.likes} aria-label={`Лайков: ${recipe.likes}`}>
          <ThumbsUp size={14} strokeWidth={2} aria-hidden="true" />
          {formatCount(recipe.likes)}
        </span>
      </div>
      <div className={styles.actions}>
        <Link to={`/recipe/${recipe.id}/edit`} className={styles.action} aria-label={`Редактировать «${recipe.title}»`}>
          <Pencil size={18} strokeWidth={1.75} aria-hidden="true" />
        </Link>
        <button type="button" className={styles.action} onClick={() => onDelete(recipe)} aria-label={`Удалить «${recipe.title}»`}>
          <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
