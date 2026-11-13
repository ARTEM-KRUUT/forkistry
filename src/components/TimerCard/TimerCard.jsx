import { Pause, Play, RotateCcw, X } from 'lucide-react';
import { formatClock } from '../../hooks/useStepTimers.js';
import styles from './TimerCard.module.css';

const R = 48;
const C = 2 * Math.PI * R;

/** Таймер шага, вариант А (Figma 18:827): кольцо с кнопкой старт/пауза, время, «Сброс» и «Стоп». */
export default function TimerCard({ timer, onToggle, onReset, onStop }) {
  const { duration, remaining, running, done } = timer;
  const progress = duration ? remaining / duration : 0;
  const label = done ? 'Время вышло' : running ? 'Таймер идёт' : remaining < duration ? 'На паузе' : 'Таймер шага';

  return (
    <section className={`${styles.card} ${done ? styles.done : ''}`} aria-label="Таймер шага">
      <div className={styles.ring}>
        <svg viewBox="0 0 108 108" className={styles.svg} aria-hidden="true">
          <circle cx="54" cy="54" r={R} className={styles.track} />
          <circle cx="54" cy="54" r={R} className={styles.progress} strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
        </svg>
        <button type="button" className={styles.toggle} onClick={onToggle} aria-label={running ? 'Пауза' : remaining < duration && !done ? 'Продолжить' : 'Запустить таймер'}>
          {running ? <Pause size={24} strokeWidth={2} aria-hidden="true" /> : <Play size={24} strokeWidth={2} aria-hidden="true" />}
        </button>
      </div>
      <div className={styles.info}>
        <p className={styles.label}>{label}</p>
        <p className={styles.time} role="timer" aria-live={done ? 'assertive' : 'off'}>
          {done ? 'Готово' : formatClock(remaining)}
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.pill} onClick={onReset}>
            <RotateCcw size={15} strokeWidth={2} aria-hidden="true" />
            Сброс
          </button>
          <button type="button" className={styles.pill} onClick={onStop} disabled={!running && remaining === duration && !done}>
            <X size={15} strokeWidth={2} aria-hidden="true" />
            Стоп
          </button>
        </div>
      </div>
    </section>
  );
}
