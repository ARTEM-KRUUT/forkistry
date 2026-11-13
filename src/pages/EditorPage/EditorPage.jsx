import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ImagePlus, Lock, SearchX } from 'lucide-react';
import IconButton from '../../components/IconButton/IconButton.jsx';
import Input from '../../components/Input/Input.jsx';
import Select from '../../components/Select/Select.jsx';
import Chip from '../../components/Chip/Chip.jsx';
import SegmentedControl from '../../components/SegmentedControl/SegmentedControl.jsx';
import Switch from '../../components/Switch/Switch.jsx';
import PhotoFitEditor from '../../components/PhotoFitEditor/PhotoFitEditor.jsx';
import IngredientEditor from '../../components/IngredientEditor/IngredientEditor.jsx';
import StepEditor from '../../components/StepEditor/StepEditor.jsx';
import Button from '../../components/Button/Button.jsx';
import DeleteRecipeDialog from '../../components/DeleteRecipeDialog/DeleteRecipeDialog.jsx';
import Skeleton from '../../components/Skeleton/Skeleton.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { useGoBack } from '../../hooks/useGoBack.js';
import { useForm } from '../../hooks/useForm.js';
import { createRecipe, getRecipe, updateRecipe } from '../../api/recipes.js';
import { fieldErrors, isNotFound } from '../../api/errors.js';
import { CATEGORIES, DIFFICULTY, EQUIPMENT } from '../../data/constants.js';
import { EMPTY_FORM, formToRecipe, recipeToForm } from '../../utils/recipeForm.js';
import { isUrlOrPath, validateRecipe } from '../../utils/validation.js';
import { toggleValue } from '../../utils/filters.js';
import { plural } from '../../utils/format.js';
import styles from './EditorPage.module.css';

/** Одна форма для /recipe/new и /recipe/:id/edit (Figma 12:579). Редактировать может только автор. */
export default function EditorPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const goBack = useGoBack(id ? `/recipe/${id}` : '/profile');
  const recipe = useAsync(() => (id ? getRecipe(id) : Promise.resolve(null)), [id]);
  const title = id ? 'Редактирование' : 'Новый рецепт';

  let content;
  // Новый рецепт открывается сразу, без загрузки
  if (!id) content = <RecipeForm key="new" recipe={null} />;
  else if (recipe.status === 'loading') content = <FormSkeleton />;
  else if (recipe.status === 'error')
    content = isNotFound(recipe.error) ? (
      <EmptyState icon={SearchX} title="Рецепт не найден" action={{ label: 'В профиль', to: '/profile' }} />
    ) : (
      <ErrorState onRetry={recipe.reload} />
    );
  else if (id && recipe.data.author?.id !== user.id)
    content = (
      <EmptyState
        icon={Lock}
        title="Редактировать может только автор"
        text="Вы можете сохранить рецепт в избранное или приготовить по нему"
        action={{ label: 'К рецепту', to: `/recipe/${id}` }}
      />
    );
  else content = <RecipeForm key={id ?? 'new'} recipe={recipe.data} />;

  return (
    <div className={styles.page}>
      <div className={styles.bar}>
        <IconButton icon={ChevronLeft} label="Назад" variant="soft" onClick={goBack} />
        <h1 className={styles.barTitle}>{title}</h1>
      </div>
      {content}
    </div>
  );
}

function RecipeForm({ recipe }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(recipe);
  const form = useForm(recipe ? recipeToForm(recipe) : EMPTY_FORM, validateRecipe);
  const { values, setValue, touch, errorOf } = form;
  const [formError, setFormError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const errorCount = Object.values(form.errors).filter(Boolean).length;
  const photo = values.photoUrl.trim();

  const onSubmit = form.handleSubmit(async (v) => {
    setFormError('');
    const data = formToRecipe(v);
    try {
      const saved = isEdit ? await updateRecipe(recipe.id, data) : await createRecipe(data, user.id);
      navigate(`/recipe/${saved.id}`, { replace: true });
    } catch (e) {
      const errs = fieldErrors(e);
      if (Object.keys(errs).length) {
        form.setServerErrors(errs);
        setFormError('Сервер не принял часть полей — они отмечены красным');
      } else {
        setFormError(e.message || 'Не удалось сохранить рецепт');
      }
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.fields}>
        <div className={styles.photoBox}>
          {photo && isUrlOrPath(photo) ? (
            <PhotoFitEditor src={photo} fit={values.photoFit} onChange={(fit) => setValue('photoFit', fit)} aspect="4 / 3" label="Кадр обложки" />
          ) : (
            <div className={styles.photoEmpty}>
              <ImagePlus size={28} strokeWidth={1.75} aria-hidden="true" />
              <span className={styles.photoTitle}>Фото блюда</span>
              <span className={styles.photoHint}>Превью появится после вставки ссылки</span>
            </div>
          )}
        </div>
        <Input label="Ссылка на фото" type="url" inputMode="url" placeholder="https://…" {...form.field('photoUrl')} />
        <Input label="Название рецепта" placeholder="Например, яблочный пирог" {...form.field('title')} />
        <Select
          label="Категория"
          placeholder="Выберите категорию"
          options={CATEGORIES.map((c) => ({ value: c.id, label: c.id }))}
          value={values.category}
          onChange={(v) => setValue('category', v)}
          onBlur={() => touch('category')}
          error={errorOf('category')}
        />
        <Input label="Время приготовления, мин" type="number" inputMode="numeric" min="1" max="1440" placeholder="Например, 45" {...form.field('timeMinutes')} />

        <div className={styles.group}>
          <span className={styles.groupTitle}>Нужная техника</span>
          <fieldset className={styles.subgroup}>
            <legend className={styles.legend}>
              <span className={styles.subTitle}>Обязательно</span>
              <span className={styles.groupHint}>Без этой техники рецепт не приготовить, например плита и духовка вместе</span>
            </legend>
            <div className={styles.chips}>
              {EQUIPMENT.map((e) => (
                <Chip
                  key={e}
                  active={values.equipment.includes(e)}
                  onClick={() => {
                    setValue('equipment', toggleValue(values.equipment, e));
                    if (values.equipmentAny.includes(e)) setValue('equipmentAny', values.equipmentAny.filter((x) => x !== e));
                  }}
                >
                  {e}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset className={styles.subgroup}>
            <legend className={styles.legend}>
              <span className={styles.subTitle}>Подойдёт любая из</span>
              <span className={styles.groupHint}>Отметьте, если технику можно заменить: например, духовка или аэрогриль</span>
            </legend>
            <div className={styles.chips}>
              {EQUIPMENT.map((e) => (
                <Chip
                  key={e}
                  active={values.equipmentAny.includes(e)}
                  onClick={() => {
                    setValue('equipmentAny', toggleValue(values.equipmentAny, e));
                    if (values.equipment.includes(e)) setValue('equipment', values.equipment.filter((x) => x !== e));
                  }}
                >
                  {e}
                </Chip>
              ))}
            </div>
            {values.equipmentAny.length === 1 && <p className={styles.groupHint}>Отметьте хотя бы ещё одну — иначе это просто обязательная техника</p>}
          </fieldset>
        </div>

        <div className={styles.group}>
          <span className={styles.groupTitle} id="difficulty-label">
            Сложность
          </span>
          <SegmentedControl
            label="Сложность"
            options={Object.entries(DIFFICULTY).map(([value, { label }]) => ({ value, label }))}
            value={values.difficulty}
            onChange={(v) => setValue('difficulty', v)}
          />
        </div>

        <div className={styles.group}>
          <span className={styles.groupTitle}>Выход блюда</span>
          <Switch label="Делится на порции" checked={values.portions === 'servings'} onChange={(on) => setValue('portions', on ? 'servings' : 'yield')} />
          {values.portions === 'servings' ? (
            <Input label="Число порций" type="number" inputMode="numeric" min="1" max="50" {...form.field('servings')} />
          ) : (
            <Input label="Выход готового блюда" placeholder="Например, 1 пирог, форма 24 см" {...form.field('yieldText')} />
          )}
        </div>

        <IngredientEditor
          rows={values.ingredients}
          onChange={(rows) => setValue('ingredients', rows)}
          errorOf={errorOf}
          touch={touch}
          error={form.submitted ? form.errors.ingredients : ''}
        />

        <StepEditor
          steps={values.steps}
          onChange={(steps) => setValue('steps', steps)}
          errorOf={errorOf}
          touch={touch}
          error={form.submitted ? form.errors.steps : ''}
        />

        {isEdit && (
          <Button variant="danger" fullWidth onClick={() => setConfirmDelete(true)}>
            Удалить рецепт
          </Button>
        )}
      </div>

      <div className={styles.publish}>
        {form.submitted && errorCount > 0 && (
          <p className={styles.summary} role="alert">
            Исправьте {errorCount} {plural(errorCount, ['поле', 'поля', 'полей'])}, чтобы {isEdit ? 'сохранить' : 'опубликовать'}
          </p>
        )}
        {formError && (
          <p className={styles.summary} role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" fullWidth loading={form.submitting}>
          {isEdit ? 'Сохранить' : 'Опубликовать'}
        </Button>
      </div>

      {isEdit && (
        <DeleteRecipeDialog
          recipe={confirmDelete ? recipe : null}
          onClose={() => setConfirmDelete(false)}
          onDeleted={() => navigate('/profile', { replace: true })}
        />
      )}
    </form>
  );
}

function FormSkeleton() {
  return (
    <div className={styles.fields} aria-busy="true" aria-label="Загрузка рецепта">
      <Skeleton height="140px" radius="var(--radius-card)" />
      <Skeleton height="48px" />
      <Skeleton height="48px" />
      <Skeleton height="48px" />
      <Skeleton height="120px" />
    </div>
  );
}
