import { describe, expect, it } from 'vitest';
import { safeRedirect } from './redirect.js';

describe('safeRedirect — возврат после входа только внутрь приложения', () => {
  it('пропускает внутренние пути', () => {
    expect(safeRedirect({ pathname: '/recipe/abc', search: '?x=1' })).toBe('/recipe/abc?x=1');
    expect(safeRedirect('/favorites')).toBe('/favorites');
  });

  it('не пускает на чужой сайт (open redirect)', () => {
    expect(safeRedirect('//evil.com')).toBe('/');
    expect(safeRedirect('/\\evil.com')).toBe('/');
    expect(safeRedirect('https://evil.com')).toBe('/');
    expect(safeRedirect({ pathname: '//evil.com' })).toBe('/');
  });

  it('не возвращает на сам вход и без адреса ведёт на главную', () => {
    expect(safeRedirect('/login')).toBe('/');
    expect(safeRedirect(undefined)).toBe('/');
  });
});
