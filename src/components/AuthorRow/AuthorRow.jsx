import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Heart, ThumbsUp } from 'lucide-react';
import Avatar from '../Avatar/Avatar.jsx';
import Photo from '../Photo/Photo.jsx';
import { formatCount, plural } from '../../utils/format.js';
import styles from './AuthorRow.module.css';

/**
 * Автор в списке «Популярные авторы»: фото, имя, рецепты, лайки, избранное и самый популярный рецепт.
 * Две отдельные ссылки — на автора и на рецепт (вложенные ссылки недопустимы).
 */
export default function AuthorRow({ author, place }) {
  const { id, name, avatarUrl, recipesCount, likes, favorites, topRecipe } = author;
  return (
    <li className={styles.row}>
      <Link to={`/author/${id}`} className={styles.author}>
        <span className={styles.place} aria-hidden="true">
          {place}
        </span>
        <Avatar name={name} url={avatarUrl} size={56} tone="neutral" />
        <span className={styles.info}>
          <span className={styles.name}>{name}</span>
          <span className={styles.stats}>
            <span aria-label={`${recipesCount} ${plural(recipesCount, ['рецепт', 'рецепта', 'рецептов'])}`}>
              <BookOpen size={14} strokeWidth={2} aria-hidden="true" />
              {recipesCount}
            </span>
            <span className={styles.likes} aria-label={`${likes} ${plural(likes, ['лайк', 'лайка', 'лайков'])}`}>
              <ThumbsUp size={14} strokeWidth={2} aria-hidden="true" />
              {formatCount(likes)}
            </span>
            <span className={styles.fav} aria-label={`в избранном ${favorites}`}>
              <Heart size={14} strokeWidth={2} aria-hidden="true" />
              {formatCount(favorites)}
            </span>
          </span>
        </span>
        <ChevronRight size={18} strokeWidth={2} className={styles.chevron} aria-hidden="true" />
      </Link>

      {topRecipe && (
        <Link to={`/recipe/${topRecipe.id}`} className={styles.recipe} aria-label={`Самый популярный рецепт: ${topRecipe.title}`}>
          <Photo src={topRecipe.photoUrl} fit={topRecipe.photoFit} className={styles.recipePhoto} />
          <span className={styles.recipeInfo}>
            <span className={styles.recipeLabel}>Самый популярный рецепт</span>
            <span className={styles.recipeTitle}>{topRecipe.title}</span>
          </span>
          <span className={styles.recipeLikes} aria-hidden="true">
            <ThumbsUp size={13} strokeWidth={2} />
            {formatCount(topRecipe.likes)}
          </span>
        </Link>
      )}
    </li>
  );
}
