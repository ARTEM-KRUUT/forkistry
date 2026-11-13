import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import RequireAuth from './components/RequireAuth/RequireAuth.jsx';

import HomePage from './pages/HomePage/HomePage.jsx';
import CatalogPage from './pages/CatalogPage/CatalogPage.jsx';
import RecipePage from './pages/RecipePage/RecipePage.jsx';
import CookPage from './pages/CookPage/CookPage.jsx';
import AuthorPage from './pages/AuthorPage/AuthorPage.jsx';
import AuthorsPage from './pages/AuthorsPage/AuthorsPage.jsx';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import EditorPage from './pages/EditorPage/EditorPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';

// Витрина компонентов только в режиме разработки и не попадает в production-сборку
const UiKitPage = import.meta.env.DEV ? lazy(() => import('./pages/UiKitPage/UiKitPage.jsx')) : null;

/**
 * Маршруты сгруппированы по тому, какие элементы оболочки видны:
 * – шапка + нижняя панель: обычные экраны;
 * – только нижняя панель: страница рецепта (вместо шапки — фото с кнопками);
 * – без оболочки: режим готовки, редактор, вход и регистрация.
 * Профиль и редактор доступны только после входа (RequireAuth); избранное гостю показывает приглашение.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout showHeader showBottomNav />}>
        <Route index element={<HomePage />} />
        <Route path="recipes" element={<CatalogPage />} />
        <Route path="authors" element={<AuthorsPage />} />
        <Route path="author/:id" element={<AuthorPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        {UiKitPage && (
          <Route
            path="ui"
            element={
              <Suspense fallback={null}>
                <UiKitPage />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<Layout showHeader={false} showBottomNav headerOnDesktop />}>
        <Route path="recipe/:id" element={<RecipePage />} />
      </Route>

      <Route element={<Layout showHeader={false} showBottomNav={false} />}>
        <Route
          path="recipe/new"
          element={
            <RequireAuth>
              <EditorPage />
            </RequireAuth>
          }
        />
        <Route
          path="recipe/:id/edit"
          element={
            <RequireAuth>
              <EditorPage />
            </RequireAuth>
          }
        />
        <Route path="recipe/:id/cook" element={<CookPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}
