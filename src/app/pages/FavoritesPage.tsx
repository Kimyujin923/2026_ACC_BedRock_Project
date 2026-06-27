import { BookmarkX, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "../data";
import RecipeCard from "../components/RecipeCard";

interface Props {
  savedRecipes: Recipe[];
  savedIds: number[];
  onToggleSave: (id: number, recipe?: Recipe) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function FavoritesPage({ savedRecipes, savedIds, onToggleSave, onSelectRecipe }: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");

  if (savedRecipes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">즐겨찾기</h1>
          <p className="text-sm text-muted-foreground">저장해 둔 레시피를 빠르게 찾아보세요</p>
        </div>
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <BookmarkX className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground mb-2">저장된 레시피가 없어요</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            레시피 카드의 북마크 아이콘을 눌러 마음에 드는 레시피를 저장해 보세요.
          </p>
        </div>
      </div>
    );
  }

  const byCategory = savedRecipes.reduce<Record<string, Recipe[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">즐겨찾기</h1>
          <p className="text-sm text-muted-foreground">저장된 레시피 <span className="font-semibold text-primary">{savedRecipes.length}개</span></p>
        </div>
        <div className="flex border border-border rounded-xl overflow-hidden">
          <button onClick={() => setView("grid")} className={`p-2.5 transition-colors ${view === "grid" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView("list")} className={`p-2.5 transition-colors ${view === "list" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(byCategory).map(([cat, recipes]) => (
          <section key={cat}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-semibold text-foreground">{cat}</h2>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{recipes.length}</span>
            </div>
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
              {recipes.map((r) => (
                <RecipeCard
                  key={r.id} recipe={r} query={[]}
                  saved={savedIds.includes(r.id)}
                  onSave={() => onToggleSave(r.id, r)}
                  view={view} onClick={() => onSelectRecipe(r)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
