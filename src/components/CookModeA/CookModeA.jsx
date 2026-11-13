import { useEffect } from 'react';
import Photo from '../Photo/Photo.jsx';
import TimerCard from '../TimerCard/TimerCard.jsx';
import Button from '../Button/Button.jsx';
import styles from './CookModeA.module.css';

/**
 * Вариант А (Figma 18:790): один шаг на экране крупным текстом, фото этапа, таймер, «Назад»/«Далее».
 * Стрелки ←/→ на клавиатуре тоже листают шаги.
 */
export default function CookModeA({ steps, current, onGo, onFinish, timers }) {
  const step = steps[current];
  const timer = timers.timers[current];
  const isLast = current === steps.length - 1;

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea, select, [role="dialog"]')) return;
      if (e.key === 'ArrowRight' && !isLast) onGo(current + 1);
      if (e.key === 'ArrowLeft' && current > 0) onGo(current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, isLast, onGo]);

  return (
    <div className={styles.root}>
      <ol className={styles.progress} aria-label={`Шаг ${current + 1} из ${steps.length}`}>
        {steps.map((_, i) => (
          <li key={i} className={i < current ? styles.segDone : i === current ? styles.segCurrent : styles.seg}>
            <button type="button" className={styles.segBtn} onClick={() => onGo(i)} aria-label={`Перейти к шагу ${i + 1}`} aria-current={i === current ? 'step' : undefined} />
          </li>
        ))}
      </ol>

      <section className={styles.step} aria-live="polite" aria-atomic="true">
        {step.photoUrl && <Photo src={step.photoUrl} fit={step.photoFit} alt={`Шаг ${current + 1}`} className={styles.photo} />}
        <p className={styles.num}>Шаг {current + 1}</p>
        <p className={styles.text}>{step.text}</p>
      </section>

      <div className={styles.spacer} />

      {timer.duration > 0 && (
        <div className={styles.timer}>
          <TimerCard
            timer={timer}
            onToggle={() => timers.toggle(current)}
            onReset={() => timers.reset(current)}
            onStop={() => timers.stop(current)}
          />
        </div>
      )}

      <div className={styles.nav}>
        <Button variant="secondary" fullWidth onClick={() => onGo(current - 1)} disabled={current === 0}>
          Назад
        </Button>
        {isLast ? (
          <Button fullWidth onClick={onFinish}>
            Готово
          </Button>
        ) : (
          <Button fullWidth onClick={() => onGo(current + 1)}>
            Далее
          </Button>
        )}
      </div>
    </div>
  );
}
