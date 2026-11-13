import { useEffect, useRef } from 'react';
import { Check, ImageIcon, Pause, Play } from 'lucide-react';
import Photo from '../Photo/Photo.jsx';
import Button from '../Button/Button.jsx';
import { formatClock } from '../../hooks/useStepTimers.js';
import styles from './CookModeB.module.css';

/**
 * Вариант Б (Figma 18:854): все шаги списком. Выполненные свёрнуты с галочкой,
 * текущий — в рамке с фото и таймером, следующие — карточки со своими таймерами.
 */
export default function CookModeB({ steps, current, onGo, onFinish, timers }) {
  const currentRef = useRef(null);

  // Текущий шаг — в поле зрения после перехода
  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [current]);

  return (
    <div className={styles.root}>
      <ol className={styles.list}>
        {steps.map((step, i) => {
          const t = timers.timers[i];
          if (i < current) {
            return (
              <li key={i}>
                <button type="button" className={styles.done} onClick={() => onGo(i)} aria-label={`Шаг ${i + 1} выполнен: ${step.text}. Вернуться к шагу`}>
                  <span className={styles.check} aria-hidden="true">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className={styles.doneText}>{step.text}</span>
                </button>
              </li>
            );
          }

          if (i === current) {
            const isLast = i === steps.length - 1;
            return (
              <li key={i} ref={currentRef} className={styles.current} aria-current="step">
                <p className={styles.currentLabel}>Шаг {i + 1} · сейчас</p>
                {step.photoUrl && <Photo src={step.photoUrl} fit={step.photoFit} alt={`Шаг ${i + 1}`} className={styles.currentPhoto} />}
                <p className={styles.currentText}>{step.text}</p>
                {t.duration > 0 && <InlineTimer timer={t} onToggle={() => timers.toggle(i)} large />}
                <Button variant="secondary" fullWidth onClick={() => (isLast ? onFinish() : onGo(i + 1))}>
                  {isLast ? 'Последний шаг выполнен' : 'Шаг выполнен'}
                </Button>
              </li>
            );
          }

          return (
            <li key={i} className={styles.next}>
              <button type="button" className={styles.nextHead} onClick={() => onGo(i)} aria-label={`Перейти к шагу ${i + 1}`}>
                <span className={styles.thumb}>
                  {step.photoUrl ? <Photo src={step.photoUrl} fit={step.photoFit} className={styles.thumbPhoto} /> : <ImageIcon size={18} strokeWidth={1.75} aria-hidden="true" />}
                </span>
                <span className={styles.nextBody}>
                  <span className={styles.nextNum}>Шаг {i + 1}</span>
                  <span className={styles.nextText}>{step.text}</span>
                </span>
              </button>
              {t.duration > 0 && <InlineTimer timer={t} onToggle={() => timers.toggle(i)} />}
            </li>
          );
        })}
      </ol>

      <div className={styles.footer}>
        <Button variant="secondary" fullWidth onClick={onFinish}>
          Завершить готовку
        </Button>
      </div>
    </div>
  );
}

/** Таймер внутри карточки шага: кнопка старт/пауза, время и полоса прогресса. */
function InlineTimer({ timer, onToggle, large = false }) {
  const { duration, remaining, running, done } = timer;
  const started = running || remaining < duration || done;
  const progress = duration ? 1 - remaining / duration : 0;

  return (
    <div className={`${styles.timer} ${large ? styles.timerLarge : ''} ${done ? styles.timerDone : ''}`}>
      <button
        type="button"
        className={large ? styles.timerBtnLarge : styles.timerBtn}
        onClick={onToggle}
        aria-label={running ? 'Пауза' : started && !done ? 'Продолжить таймер' : 'Запустить таймер'}
      >
        {running ? <Pause size={large ? 18 : 15} strokeWidth={2} aria-hidden="true" /> : <Play size={large ? 18 : 15} strokeWidth={2} aria-hidden="true" />}
      </button>
      {large || started ? (
        <div className={styles.timerInfo}>
          <div className={styles.timerRow}>
            <span className={large ? styles.clockLarge : styles.clock} role="timer" aria-live={done ? 'assertive' : 'off'}>
              {done ? 'Готово' : formatClock(remaining)}
            </span>
            <span className={styles.of}>из {formatClock(duration)}</span>
          </div>
          <span className={styles.bar} aria-hidden="true">
            <span className={styles.barFill} style={{ width: `${progress * 100}%` }} />
          </span>
        </div>
      ) : (
        <span className={styles.timerHint}>Таймер · {formatClock(duration)}</span>
      )}
    </div>
  );
}
