import { Link } from 'react-router-dom';
import { ChefHat, Clock, CookingPot, Flame, Heart } from 'lucide-react';
import Photo from '../Photo/Photo.jsx';
import LikeBadge from '../LikeBadge/LikeBadge.jsx';
import Macros from '../Macros/Macros.jsx';
import { DIFFICULTY } from '../../data/constants.js';
import { equipmentItems } from '../../utils/equipment.js';
import { formatKcal, formatMinutes, formatShortDate, likePercent } from '../../utils/format.js';
import styles from './RecipeCard.module.css';

/**
 * Карточка рецепта для каталога (Figma 6:69).
 * Вся карточка кликабельна через растянутую ссылку на названии;
 * кнопка избранного лежит поверх неё, а не внутри <a> (вложенные интерактивные элементы недопустимы).
 */
export default function RecipeCard({ recipe, isFavorite = false, onToggleFavorite }) {
  const { id, title, photoUrl, category, difficulty, timeMinutes, kcal, likes, dislikes, favoritesCount = 0, author } = recipe;
  const difficultyLabel = DIFFICULTY[difficulty]?.label;
  const time = formatMinutes(timeMinutes);
  const kcalText = formatKcal(kcal);
  // Обязательная техника и «на выбор» одним пунктом: «Духовка или аэрогриль», «Плита +1»
  const equipList = equipmentItems(recipe).map((i) => i.label);
  const equipmentText = equipList.length > 1 ? `${equipList[0]} +${equipList.length - 1}` : equipList[0];

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Photo src={photoUrl} fit={recipe.photoFit} className={styles.photo} />
        <LikeBadge percent={likePercent(likes, dislikes)} className={styles.likeBadge} />
        {difficultyLabel && (
          <span className={styles.difficulty}>
            <ChefHat size={21} strokeWidth={1.75} className={styles.hat} aria-hidden="true" />
            {difficultyLabel}
          </span>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            className={`${styles.favButton} ${isFavorite ? styles.favActive : ''}`}
            aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(recipe)}
          >
            <Heart size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className={styles.body}>
        {category && <p className={styles.category}>{category}</p>}
        <h3 className={styles.title}>
          <Link to={`/recipe/${id}`} className={styles.link}>
            {title}
          </Link>
        </h3>

        <ul className={styles.params}>
          {time && (
            <li>
              <Clock size={16} strokeWidth={1.75} aria-hidden="true" />
              {time}
            </li>
          )}
          {kcalText && (
            <li>
              <Flame size={16} strokeWidth={1.75} aria-hidden="true" />
              {kcalText}
            </li>
          )}
          {equipmentText && (
            <li>
              <CookingPot size={16} strokeWidth={1.75} aria-hidden="true" />
              <span title={equipList.join(', ')}>{equipmentText}</span>
            </li>
          )}
        </ul>

        <Macros macros={recipe.macros} />

        <div className={styles.footer}>
          <span className={styles.author}>
            {author?.name}
            {recipe.created && (
              <>
                {author?.name ? ' · ' : ''}
                <time dateTime={recipe.created}>{formatShortDate(recipe.created)}</time>
              </>
            )}
          </span>
          <span className={styles.saves} aria-label={`Сохранили ${favoritesCount}`}>
            <Heart size={15} strokeWidth={1.75} aria-hidden="true" />
            {favoritesCount}
          </span>
        </div>
      </div>
    </article>
  );
}
