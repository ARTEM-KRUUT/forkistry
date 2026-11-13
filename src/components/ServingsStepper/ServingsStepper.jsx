import { Minus, Plus } from 'lucide-react';
import { plural } from '../../utils/format.js';
import styles from './ServingsStepper.module.css';

/** «− 2 порции +» (Figma 8:373). */
export default function ServingsStepper({ value, onChange, min = 1, max = 20 }) {
  return (
    <div className={styles.stepper} role="group" aria-label="Число порций">
      <button type="button" className={styles.btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Меньше порций">
        <Minus size={18} strokeWidth={2} aria-hidden="true" />
      </button>
      <output className={styles.value} aria-live="polite">
        {value} {plural(value, ['порция', 'порции', 'порций'])}
      </output>
      <button type="button" className={styles.btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Больше порций">
        <Plus size={18} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
