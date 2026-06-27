import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ChefHat, Bookmark, LogOut, User, ChevronDown, RefrigeratorIcon } from "lucide-react";
import type { Recipe, FridgeItem } from "./data";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import FavoritesPage from "./pages/FavoritesPage";
import FridgePage from "./pages/FridgePage";
import AuthPage from "./pages/AuthPage";
import RecipeDetail from "./components/RecipeDetail";
import {
  getToken, clearToken, getSavedUser,
  apiGetFridge, apiAddFridge, apiDeleteFridge,
  apiGetFavorites, apiAddFavorite, apiDeleteFavorite,
  mapFridgeItem, mapRecipe,
} from "./api";

function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [fridgeSearchIngredients, setFridgeSearchIngredients] = useState<string[] | null>(null);

  // recipeId → { favId, recipe }
  const [favMap, setFavMap] = useState<Record<number, { favId: number; recipe: Recipe }>>({});
  const savedIds = Object.keys(favMap).map(Number);
  const savedRecipes = Object.values(favMap).map((f) => f.recipe);

  // 앱 초기화: 저장된 토큰/유저 복구
  useEffect(() => {
    const token = getToken();
    const savedUser = getSavedUser();
    if (token && savedUser) {
      setUser(savedUser);
    }
  }, []);

  // 로그인 후 냉장고/즐겨찾기 로드
  useEffect(() => {
    if (!user) return;
    apiGetFridge()
      .then((items) => setFridgeItems(items.map(mapFridgeItem)))
      .catch(console.error);

    apiGetFavorites()
      .then((favs) => {
        const newMap: Record<number, { favId: number; recipe: Recipe }> = {};
        for (const fav of favs) {
          if (fav.recipe) {
            const recipe = mapRecipe(fav.recipe);
            newMap[recipe.id] = { favId: fav.id, recipe };
          }
        }
        setFavMap(newMap);
      })
      .catch(console.error);
  }, [user]);

  const toggleSave = async (id: number, recipe?: Recipe) => {
    if (id in favMap) {
      try {
        await apiDeleteFavorite(favMap[id].favId);
        setFavMap((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } catch (err) {
        console.error(err);
      }
    } else if (recipe) {
      try {
        const result = await apiAddFavorite(String(id));
        setFavMap((prev) => ({ ...prev, [id]: { favId: result.id, recipe } }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const goTo = (path: string) => {
    setSelectedRecipe(null);
    navigate(path);
  };

  const openRecipe = (recipe: Recipe, query: string[] = []) => {
    setSearchQuery(query);
    setSelectedRecipe(recipe);
  };

  const closeRecipe = () => setSelectedRecipe(null);

  const soonOrExpired = fridgeItems.filter((i) => {
    const days = Math.ceil(
      (new Date(i.expiresAt).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000
    );
    return days <= 3;
  }).length;

  const navItems: { key: string; label: string; icon?: React.ReactNode; badge?: number }[] = [
    { key: "/", label: "홈" },
    { key: "/fridge", label: "냉장고", icon: <RefrigeratorIcon className="w-3.5 h-3.5" />, badge: soonOrExpired },
    { key: "/recipes", label: "레시피" },
    { key: "/favorites", label: "즐겨찾기" },
  ];

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
    navigate("/");
  };

  const addFridgeItem = async (item: Omit<FridgeItem, "id" | "addedAt">) => {
    try {
      const result = await apiAddFridge({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        expires_at: item.expiresAt,
      });
      setFridgeItems((prev) => [...prev, mapFridgeItem(result)]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFridgeItem = async (id: number) => {
    try {
      await apiDeleteFridge(id);
      setFridgeItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFridgeSearchRecipes = (ingredients: string[]) => {
    setFridgeSearchIngredients(ingredients);
    goTo("/");
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setDropdownOpen(false);
    setSelectedRecipe(null);
    setFridgeItems([]);
    setFavMap({});
    navigate("/");
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        query={searchQuery}
        saved={selectedRecipe.id in favMap}
        onSave={() => toggleSave(selectedRecipe.id, selectedRecipe)}
        onBack={closeRecipe}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => goTo("/")} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-foreground text-[15px] tracking-tight">냉장고 셰프</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map(({ key, label, icon, badge }) => (
              <button
                key={key}
                onClick={() => goTo(key)}
                className={`relative flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${
                  location.pathname === key
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {icon}
                {label}
                {badge != null && badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
                {key === "/favorites" && savedIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {savedIds.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo("/favorites")}
              className="sm:hidden relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              {savedIds.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {savedIds.length}
                </span>
              )}
            </button>

            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="flex items-center gap-2 text-sm font-semibold text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors border border-border">
                <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </span>
                <span className="max-w-[120px] truncate">{user.name}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full pt-1.5 z-50 w-52">
                  <div className="bg-white border border-border rounded-xl shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-muted/40">
                      <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              savedIds={savedIds}
              onToggleSave={toggleSave}
              onSelectRecipe={(r: Recipe, q?: string[]) => openRecipe(r, q)}
              initialIngredients={fridgeSearchIngredients}
              onClearInitialIngredients={() => setFridgeSearchIngredients(null)}
            />
          }
        />
        <Route
          path="/recipes"
          element={
            <RecipesPage
              savedIds={savedIds}
              onToggleSave={toggleSave}
              onSelectRecipe={(r) => openRecipe(r)}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              savedRecipes={savedRecipes}
              savedIds={savedIds}
              onToggleSave={toggleSave}
              onSelectRecipe={(r) => openRecipe(r)}
            />
          }
        />
        <Route
          path="/fridge"
          element={
            <FridgePage
              items={fridgeItems}
              onAdd={addFridgeItem}
              onDelete={deleteFridgeItem}
              onSearchRecipes={handleFridgeSearchRecipes}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
