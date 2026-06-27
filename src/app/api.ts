import type { Recipe, FridgeItem, FridgeCategory, Difficulty } from './data';

const BASE = import.meta.env.VITE_API_URL ?? '';

// ── Token ─────────────────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem('auth_token');
const storeToken = (t: string) => localStorage.setItem('auth_token', t);
export const clearToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

function decodeJwt(token: string): Record<string, unknown> {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

// ── HTTP ──────────────────────────────────────────────────────────────────────

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string; message?: string };
    throw new Error(err.detail ?? err.message ?? `오류 ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

interface AuthResponse {
  access_token?: string;
  token?: string;
  user?: { name: string; email: string };
}

export async function apiLogin(email: string, password: string) {
  const data = await http<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const token = data.access_token ?? data.token ?? '';
  storeToken(token);
  const payload = decodeJwt(token);
  const user = {
    name: data.user?.name ?? (payload.name as string) ?? (payload.username as string) ?? email.split('@')[0],
    email: data.user?.email ?? (payload.email as string) ?? (payload.sub as string) ?? email,
  };
  localStorage.setItem('auth_user', JSON.stringify(user));
  return { token, ...user };
}

export async function apiRegister(name: string, email: string, password: string) {
  await http('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return apiLogin(email, password);
}

export function getSavedUser(): { name: string; email: string } | null {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Recipes ───────────────────────────────────────────────────────────────────

export interface ApiStep {
  step: number;
  description: string;
  image?: string;
}

export interface ApiNutrition {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  sodium: string;
}

export interface ApiRecipe {
  id: string;
  name: string;
  category?: string;
  cooking_method?: string;
  ingredients_raw?: string;
  ingredients?: string[];
  steps?: ApiStep[];
  main_image?: string;
  nutrition?: ApiNutrition;
  hash_tags?: string;
  sodium_tip?: string;
}

export function apiGetRecipes(params?: { category?: string; search?: string }) {
  const qs = new URLSearchParams();
  if (params?.category && params.category !== '전체') qs.set('category', params.category);
  if (params?.search) qs.set('search', params.search);
  const q = qs.toString();
  return http<ApiRecipe[]>(`/recipes${q ? `?${q}` : ''}`);
}

export function apiGetRecipe(id: string) {
  return http<ApiRecipe>(`/recipes/${id}`);
}

// ── Recommend ─────────────────────────────────────────────────────────────────

export interface ApiContext {
  name: string;
  category?: string;
  cooking_method?: string;
  main_image?: string;
}

export interface RecommendResult {
  ingredients: string[];
  contexts: ApiContext[];
  answer: string;
}

export function apiRecommend(ingredients: string[]) {
  return http<RecommendResult>('/recommend', {
    method: 'POST',
    body: JSON.stringify({ ingredients }),
  });
}

// ── Fridge ────────────────────────────────────────────────────────────────────

export interface ApiFridgeItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiry_date: string;
  added_at: string;
}

export function apiGetFridge() {
  return http<ApiFridgeItem[]>('/fridge');
}

export function apiAddFridge(item: {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiry_date: string;
}) {
  return http<ApiFridgeItem>('/fridge', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export function apiDeleteFridge(id: number) {
  return http<void>(`/fridge/${id}`, { method: 'DELETE' });
}

// ── Favorites ─────────────────────────────────────────────────────────────────

export interface ApiFavorite {
  id: number;
  recipe_id: string;
  recipe?: ApiRecipe;
}

export function apiGetFavorites() {
  return http<ApiFavorite[]>('/favorites');
}

export function apiAddFavorite(recipeId: string, recipeName: string, recipeImage?: string) {
  return http<ApiFavorite>('/favorites', {
    method: 'POST',
    body: JSON.stringify({
      recipe_id: recipeId,
      recipe_name: recipeName,
      recipe_image: recipeImage ?? '',
    }),
  });
}

export function apiDeleteFavorite(id: number) {
  return http<void>(`/favorites/${id}`, { method: 'DELETE' });
}

// ── Mappers ───────────────────────────────────────────────────────────────────

export function mapRecipe(api: ApiRecipe, query: string[] = []): Recipe {
  const ingredientNames = (api.ingredients ?? [])
    .map((s) => s.trim().split(/\s+/)[0])
    .filter((s) => s && !['고명', '소스', '재료'].includes(s));

  const matched =
    query.length > 0
      ? ingredientNames.filter((name) =>
          query.some((q) => name.includes(q) || q.includes(name))
        )
      : [];

  const score =
    matched.length > 0 && ingredientNames.length > 0
      ? Math.round((matched.length / ingredientNames.length) * 100)
      : 0;

  const steps = (api.steps ?? []).map((s) => ({
    step: s.step,
    desc: s.description.replace(/[a-z]$/, '').trim(),
    ...(s.image ? { tip: undefined } : {}),
  }));

  return {
    id: parseInt(api.id) || 0,
    name: api.name,
    description: [api.category, api.cooking_method].filter(Boolean).join(' · '),
    time: `${(steps.length || 3) * 5}분`,
    servings: 2,
    difficulty: '보통' as Difficulty,
    matchedIngredients: matched,
    extraIngredients: ingredientNames.filter((n) => !matched.includes(n)).slice(0, 5),
    tags: [api.category, api.cooking_method].filter(Boolean) as string[],
    category: api.category ?? '기타',
    imageUrl: (api.main_image ?? '').replace('http://', 'https://'),
    calories: Number(api.nutrition?.calories) || 0,
    matchScore: score,
    protein: Number(api.nutrition?.protein) || 0,
    carbs: Number(api.nutrition?.carbs) || 0,
    fat: Number(api.nutrition?.fat) || 0,
    steps,
    allIngredients: (api.ingredients ?? [])
      .filter((s) => !['고명', '소스'].includes(s.trim().split(/\s+/)[0]))
      .map((s) => {
        const parts = s.trim().split(/\s+/);
        return { name: parts[0], amount: parts.slice(1).join(' ') };
      }),
  };
}

export function mapFridgeItem(api: ApiFridgeItem): FridgeItem {
  return {
    id: api.id,
    name: api.name,
    quantity: api.quantity,
    unit: api.unit,
    category: api.category as FridgeCategory,
    expiresAt: api.expiry_date,
    addedAt: api.added_at,
  };
}
