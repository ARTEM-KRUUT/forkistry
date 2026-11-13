import { useState } from 'react';
import { Timer } from 'lucide-react';
import Photo from '../Photo/Photo.jsx';
import { formatTimer, plural } from '../../utils/format.js';
import styles from './StepList.module.css';

/**
 * Шаги на странице рецепта (Figma 8:400). Длинный список свёрнут до preview шагов,
 * остальные раскрываются кнопкой — подробно по шагам ведёт режим готовки.
 */
export default function StepList({ steps = [], preview = 4 }) {
  const [expanded, setExpanded] = useState(false);
  const hidden = steps.length - preview;
  const visible = expanded || hidden <= 0 ? steps : steps.slice(0, preview);

  return (
    <>
      <ol className={styles.list}>
        {visible.map((step, i) => (
          <li key={i} className={styles.step}>
            <span className={styles.num} aria-hidden="true">
              {i + 1}
            </span>
            <div className={styles.body}>
              <p className={styles.text}>
                <span className="visually-hidden">Шаг {i + 1}. </span>
                {step.text}
              </p>
              {step.timerSeconds > 0 && (
                <p className={styles.timer}>
                  <Timer size={16} strokeWidth={2} aria-hidden="true" />
                  Таймер · {formatTimer(step.timerSeconds)}
                </p>
              )}
              {step.photoUrl && <Photo src={step.photoUrl} fit={step.photoFit} className={styles.photo} alt={`Шаг ${i + 1}`} />}
            </div>
          </li>
        ))}
      </ol>
      {hidden > 0 && !expanded && (
        <button type="button" className={styles.more} onClick={() => setExpanded(true)}>
          Показать ещё {hidden} {plural(hidden, ['шаг', 'шага', 'шагов'])}
        </button>
      )}
    </>
  );
}
