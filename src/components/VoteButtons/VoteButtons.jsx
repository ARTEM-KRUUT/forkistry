import { Heart, ThumbsDown, ThumbsUp } from 'lucide-react';
import { formatCount } from '../../utils/format.js';
import styles from './VoteButtons.module.css';

/**
 * Лайк / дизлайк и число сохранений (Figma 8:359).
 * myVote: 1 | -1 | 0. onVote(value) — повторное нажатие отменяет голос (решает вызывающий код).
 */
export default function VoteButtons({ likes, dislikes, favoritesCount, myVote = 0, onVote }) {
  return (
    <div className={styles.root}>
      <button
        type="button"
        className={`${styles.vote} ${styles.like} ${myVote === 1 ? styles.likeActive : ''}`}
        aria-pressed={myVote === 1}
        aria-label={`Нравится, ${likes}`}
        onClick={() => onVote(1)}
      >
        <ThumbsUp size={18} strokeWidth={2} aria-hidden="true" />
        {formatCount(likes)}
      </button>
      <button
        type="button"
        className={`${styles.vote} ${myVote === -1 ? styles.dislikeActive : ''}`}
        aria-pressed={myVote === -1}
        aria-label={`Не нравится, ${dislikes}`}
        onClick={() => onVote(-1)}
      >
        <ThumbsDown size={18} strokeWidth={2} aria-hidden="true" />
        {formatCount(dislikes)}
      </button>
      <span className={styles.saved}>
        <Heart size={18} strokeWidth={1.75} aria-hidden="true" />
        Сохранили {formatCount(favoritesCount)}
      </span>
    </div>
  );
}
