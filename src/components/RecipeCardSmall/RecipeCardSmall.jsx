import { Link } from 'react-router-dom';
import Photo from '../Photo/Photo.jsx';
import LikeBadge from '../LikeBadge/LikeBadge.jsx';
import Macros from '../Macros/Macros.jsx';
import { formatKcal, formatMinutes, likePercent } from '../../utils/format.js';
import styles from './RecipeCardSmall.module.css';

/**
 * Малая карточка для горизонтальных лент на главной (Figma 6:107).
 * fluid — на всю ширину ячейки сетки (избранное, Figma 10:399).
 */
export default function RecipeCardSmall({ recipe, fluid = false }) {
  const { id, title, photoUrl, timeMinutes, kcal, likes, dislikes } = recipe;
  const meta = [formatMinutes(timeMinutes), formatKcal(kcal)].filter(Boolean).join(' · ');

  return (
    <Link to={`/recipe/${id}`} className={`${styles.card} ${fluid ? styles.fluid : ''}`}>
      <div className={styles.media}>
        <Photo src={photoUrl} fit={recipe.photoFit} className={styles.photo} />
        <LikeBadge percent={likePercent(likes, dislikes)} className={styles.likeBadge} />
      </div>
      <span className={styles.title}>{title}</span>
      {meta && <span className={styles.meta}>{meta}</span>}
      <Macros macros={recipe.macros} />
    </Link>
  );
}
