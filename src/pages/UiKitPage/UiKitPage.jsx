import { useState } from 'react';
import { Heart, Search, Flame } from 'lucide-react';
import Button from '../../components/Button/Button.jsx';
import Chip from '../../components/Chip/Chip.jsx';
import Input from '../../components/Input/Input.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import Header from '../../components/Header/Header.jsx';
import RecipeCard from '../../components/RecipeCard/RecipeCard.jsx';
import RecipeCardSkeleton from '../../components/RecipeCard/RecipeCardSkeleton.jsx';
import RecipeCardSmall from '../../components/RecipeCardSmall/RecipeCardSmall.jsx';
import CategoryTile from '../../components/CategoryTile/CategoryTile.jsx';
import Skeleton from '../../components/Skeleton/Skeleton.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import { CATEGORIES, EQUIPMENT } from '../../data/constants.js';
import styles from './UiKitPage.module.css';

const SAMPLE = {
  id: 'demo',
  title: 'Борщ с говядиной',
  photoUrl: '/seed/borsch.webp',
  category: 'Супы',
  difficulty: 'easy',
  timeMinutes: 90,
  kcal: 310,
  equipment: ['Плита'],
  likes: 95,
  dislikes: 5,
  favoritesCount: 120,
  author: { id: '1', name: 'Марина Котова' },
};

const NO_DATA = {
  ...SAMPLE,
  id: 'demo-2',
  title: 'Шарлотка с яблоками и корицей в духовке',
  photoUrl: '/broken.jpg',
  category: 'Выпечка',
  difficulty: 'hard',
  kcal: null,
  equipment: ['Духовка', 'Миксер'],
  likes: 0,
  dislikes: 0,
  favoritesCount: 0,
};

/** Витрина компонентов дизайн-системы (только в режиме разработки, маршрут /ui). */
export default function UiKitPage() {
  const [favorite, setFavorite] = useState(false);
  const [equipment, setEquipment] = useState(['Плита']);
  const [category, setCategory] = useState('Супы');
  const [title, setTitle] = useState('');
  const [touched, setTouched] = useState(false);

  const toggleEquipment = (item) =>
    setEquipment((prev) => (prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]));

  return (
    <div className={styles.page}>
      <h1 className={styles.h1}>Компоненты</h1>

      <Section title="Header · гость / авторизован">
        <div className={styles.frame}>
          <Header />
          <Header user={{ name: 'Анна Белова' }} />
        </div>
      </Section>

      <Section title="Button">
        <Button fullWidth>Начать готовить</Button>
        <Button variant="secondary" fullWidth>
          Начать готовить
        </Button>
        <div className={styles.row}>
          <Button variant="danger">Удалить</Button>
          <Button loading>Сохранить</Button>
          <Button disabled>Недоступна</Button>
          <Button variant="link">Перейти в каталог</Button>
        </div>
      </Section>

      <Section title="Chip">
        <div className={styles.scroll}>
          {EQUIPMENT.map((item) => (
            <Chip key={item} active={equipment.includes(item)} onClick={() => toggleEquipment(item)}>
              {item}
            </Chip>
          ))}
        </div>
        <div className={styles.row}>
          <Chip icon={Flame}>До 400 ккал</Chip>
        </div>
      </Section>

      <Section title="Input">
        <Input label="Поиск" placeholder="Борщ, сырники…" type="search" />
        <Input
          label="Название"
          placeholder="Например, борщ с говядиной"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched(true)}
          error={touched && !title.trim() ? 'Введите название рецепта' : ''}
        />
        <Input label="Ссылка на фото" placeholder="https://…" hint="Формат JPG, PNG или WebP" />
        <Input label="Описание шага" multiline placeholder="Что делать на этом шаге" />
      </Section>

      <Section title="Avatar">
        <div className={styles.row}>
          <Avatar name="Анна Белова" size={40} />
          <Avatar name="Марина Котова" size={56} />
          <Avatar name="Игорь" url="/broken.jpg" size={72} />
        </div>
      </Section>

      <Section title="CategoryTile">
        <div className={styles.scroll}>
          {CATEGORIES.map((c) => (
            <CategoryTile
              key={c.id}
              label={c.id}
              color={c.color}
              selected={category === c.id}
              onClick={() => setCategory(c.id)}
            />
          ))}
        </div>
      </Section>

      <Section title="RecipeCard · данные / без фото, оценок и ккал / загрузка">
        <div className={styles.grid}>
          <RecipeCard recipe={SAMPLE} isFavorite={favorite} onToggleFavorite={() => setFavorite((v) => !v)} />
          <RecipeCard recipe={NO_DATA} onToggleFavorite={() => {}} />
          <RecipeCardSkeleton />
        </div>
      </Section>

      <Section title="RecipeCardSmall">
        <div className={styles.scroll}>
          <RecipeCardSmall recipe={SAMPLE} />
          <RecipeCardSmall recipe={NO_DATA} />
          <div className={styles.smallSkeleton}>
            <Skeleton height="140px" radius="var(--radius-photo-sm)" />
            <Skeleton width="80%" height="18px" />
            <Skeleton width="50%" height="14px" />
          </div>
        </div>
      </Section>

      <Section title="EmptyState">
        <EmptyState
          icon={Heart}
          title="Здесь будут сохранённые рецепты"
          text="Войдите в профиль, чтобы сохранять рецепты и возвращаться к ним с любого устройства"
          action={{ label: 'Войти', to: '/login' }}
          secondaryAction={{ label: 'Перейти в каталог', to: '/recipes' }}
        />
        <EmptyState
          icon={Search}
          title="Ничего не нашлось"
          text="Попробуйте убрать часть фильтров"
          action={{ label: 'Сбросить фильтры', onClick: () => {} }}
        />
      </Section>

      <Section title="ErrorState">
        <ErrorState onRetry={() => {}} />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>{title}</h2>
      <div className={styles.stack}>{children}</div>
    </section>
  );
}
