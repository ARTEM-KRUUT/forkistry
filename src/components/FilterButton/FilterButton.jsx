import { forwardRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import styles from './FilterButton.module.css';

/** Тёмная кнопка фильтров со счётчиком выбранных значений (Figma 7:169). */
const FilterButton = forwardRef(function FilterButton({ count = 0, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label={count ? `Фильтры, выбрано ${count}` : 'Фильтры'}
      aria-haspopup="dialog"
    >
      <SlidersHorizontal size={20} strokeWidth={2} aria-hidden="true" />
      {count > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  );
});

export default FilterButton;
