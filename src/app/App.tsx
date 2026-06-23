import { useState, useRef } from "react";
import { ChefHat, Bookmark, LogOut, User, ChevronDown, RefrigeratorIcon } from "lucide-react";
import type { Recipe, FridgeItem } from "./data";
import { SAMPLE_FRIDGE_ITEMS } from "./data";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import FavoritesPage from "./pages/FavoritesPage";
import FridgePage from "./pages/FridgePage";
import AuthPage from "./pages/AuthPage";
import RecipeDetail from "./components/RecipeDetail";

type Page = "home" | "recipes" | "favorites" | "fridge" | "auth";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [prevPage, setPrevPage] = useState<Page>("home");
  const [searchQuery, setSearchQuery] = useState<string[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>(SAMPLE_FRIDGE_ITEMS);
  const [fridgeSearchIngredients, setFridgeSearchIngredients] = useState<string[] | null>(null);
  let nextFridgeId = useRef(100);

  const toggleSave = (id: number) =>
    setSavedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const goTo = (p: Page) => {
    setSelectedRecipe(null);
    setPrevPage(page);
    setPage(p);
  };

  const openRecipe = (recipe: Recipe, query: string[] = []) => {
    setSearchQuery(query);
    setSelectedRecipe(recipe);
  };

  const closeRecipe = () => {
    setSelectedRecipe(null);
  };

  const soonOrExpired = fridgeItems.filter((i) => {
    const days = Math.ceil((new Date(i.expiresAt).getTime() - new Date().setHours(0,0,0,0)) / 86400000);
    return days <= 3;
  }).length;

  const navItems: { key: Page; label: string; icon?: React.ReactNode; badge?: number }[] = [
    { key: "home", label: "홈" },
    { key: "fridge", label: "냉장고", icon: <RefrigeratorIcon className="w-3.5 h-3.5" />, badge: soonOrExpired },
    { key: "recipes", label: "레시피" },
    { key: "favorites", label: "즐겨찾기" },
  ];

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
    goTo(prevPage);
  };

  const addFridgeItem = (item: Omit<FridgeItem, "id" | "addedAt">) => {
    const today = new Date().toISOString().split("T")[0];
    setFridgeItems((p) => [...p, { ...item, id: nextFridgeId.current++, addedAt: today }]);
  };

  const deleteFridgeItem = (id: number) => {
    setFridgeItems((p) => p.filter((i) => i.id !== id));
  };

  const handleFridgeSearchRecipes = (ingredients: string[]) => {
    setFridgeSearchIngredients(ingredients);
    goTo("home");
  };

  const handleLogout = () => {
    setUser(null);
    setDropdownOpen(false);
    setSelectedRecipe(null);
    setPage("auth");
  };

  // 비로그인 시 또는 auth 페이지 → 항상 AuthPage
  if (!user || page === "auth") {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Recipe detail takes over the full screen
  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        query={searchQuery}
        saved={savedIds.includes(selectedRecipe.id)}
        onSave={() => toggleSave(selectedRecipe.id)}
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
          {/* Logo */}
          <button onClick={() => goTo("home")} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-foreground text-[15px] tracking-tight">냉장고 셰프</span>
          </button>

          {/* Center nav */}
          <div className="hidden sm:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map(({ key, label, icon, badge }) => (
              <button
                key={key}
                onClick={() => goTo(key)}
                className={`relative flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${
                  page === key
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
                {key === "favorites" && savedIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {savedIds.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            {/* Mobile favorites */}
            <button
              onClick={() => goTo("favorites")}
              className="sm:hidden relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              {savedIds.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {savedIds.length}
                </span>
              )}
            </button>

            {user ? (
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
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
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
            ) : (
              <button
                onClick={() => goTo("auth")}
                className="text-sm font-semibold bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      {page === "home" && (
        <HomePage
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onSelectRecipe={(r) => openRecipe(r)}
          initialIngredients={fridgeSearchIngredients}
          onClearInitialIngredients={() => setFridgeSearchIngredients(null)}
        />
      )}
      {page === "recipes" && (
        <RecipesPage
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onSelectRecipe={(r) => openRecipe(r)}
        />
      )}
      {page === "favorites" && (
        <FavoritesPage
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onSelectRecipe={(r) => openRecipe(r)}
        />
      )}
      {page === "fridge" && (
        <FridgePage
          items={fridgeItems}
          onAdd={addFridgeItem}
          onDelete={deleteFridgeItem}
          onSearchRecipes={handleFridgeSearchRecipes}
        />
      )}
    </div>
  );
}
