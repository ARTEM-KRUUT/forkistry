import { ChefHat } from 'lucide-react';
import { DIFFICULTY } from '../../data/constants.js';
import styles from './DifficultyHats.module.css';

/** Сложность тремя колпаками: закрашены по уровню (Figma 17:790). */
export default function DifficultyHats({ difficulty, size = 18 }) {
  const level = DIFFICULTY[difficulty]?.level ?? 0;
  return (
    <span className={styles.hats} role="img" aria-label={`Сложность: ${DIFFICULTY[difficulty]?.label ?? 'не указана'}`}>
      {[1, 2, 3].map((n) => (
        <ChefHat key={n} size={size} strokeWidth={1.75} className={n <= level ? styles.on : styles.off} aria-hidden="true" />
      ))}
    </span>
  );
}
