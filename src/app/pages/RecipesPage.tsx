import { useState, useEffect } from "react";
import { Search, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, difficultyColor } from "../data";
import type { Recipe, Difficulty } from "../data";
import RecipeCard from "../components/RecipeCard";
import { apiGetRecipes, mapRecipe } from "../api";

const DIFFICULTY_OPTIONS: Difficulty[] = ["쉬움", "보통", "어려움"];
const SORT_OPTIONS = [
  { value: "default", label: "기본순" },
  { value: "time", label: "조리시간 짧은순" },
  { value: "calories", label: "칼로리 낮은순" },
  { value: "difficulty", label: "쉬운순" },
];

interface Props {
  savedIds: number[];
  onToggleSave: (id: number, recipe?: Recipe) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function RecipesPage({ savedIds, onToggleSave, onSelectRecipe }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [difficulty, setDifficulty] = useState<Difficulty | "전체">("전체");
  const [sort, setSort] = useState("default");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [caloriesMax, setCaloriesMax] = useState(600);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    apiGetRecipes()
      .then((data) => setRecipes(data.map((r) => mapRecipe(r))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = recipes
    .filter((r) => {
      if (search && !r.name.includes(search)) return false;
      if (category !== "전체" && r.category !== category) return false;
      if (difficulty !== "전체" && r.difficulty !== difficulty) return false;
      if (r.calories > 0 && r.calories > caloriesMax) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "time") return parseInt(a.time) - parseInt(b.time);
      if (sort === "calories") return a.calories - b.calories;
      if (sort === "difficulty") {
        const order = { 쉬움: 0, 보통: 1, 어려움: 2 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

  const hasFilters = category !== "전체" || difficulty !== "전체" || caloriesMax < 600 || !!search;

  const clearFilters = () => {
    setSearch("");
    setCategory("전체");
    setDifficulty("전체");
    setCaloriesMax(600);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">레시피 탐색</h1>
        <p className="text-sm text-muted-foreground">
          총 {loading ? "..." : recipes.length}가지 레시피가 준비되어 있어요
        </p>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex-1 min-w-52 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="레시피 이름으로 검색..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilter((p) => !p)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-xl transition-colors ${
            showFilter || hasFilters ? "bg-primary text-white border-primary" : "bg-white border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          필터
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm border border-border rounded-xl px-3 py-2.5 bg-white text-muted-foreground outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <div className="flex border border-border rounded-xl overflow-hidden">
          <button onClick={() => setView("grid")} className={`p-2.5 transition-colors ${view === "grid" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView("list")} className={`p-2.5 transition-colors ${view === "list" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="bg-white border border-border rounded-2xl p-5 mb-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-foreground">상세 필터</p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <X className="w-3 h-3" /> 초기화
              </button>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-sm px-3.5 py-1.5 rounded-full border font-medium transition-colors ${
                    category === c ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">난이도</p>
            <div className="flex gap-2">
              {(["전체", ...DIFFICULTY_OPTIONS] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`text-sm px-3.5 py-1.5 rounded-full border font-medium transition-colors ${
                    difficulty === d
                      ? "bg-primary text-white border-primary"
                      : d !== "전체" && d in difficultyColor
                      ? `${difficultyColor[d as Difficulty]} border-transparent`
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              최대 칼로리 <span className="normal-case font-normal text-foreground ml-1">{caloriesMax}kcal 이하</span>
            </p>
            <input
              type="range" min={100} max={600} step={50} value={caloriesMax}
              onChange={(e) => setCaloriesMax(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>100kcal</span><span>600kcal</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-5 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-sm px-3.5 py-1.5 rounded-full border font-medium transition-colors ${
              category === c ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-4">{filtered.length}개의 레시피</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="font-semibold text-foreground mb-1">일치하는 레시피가 없어요</p>
              <p className="text-sm">검색어나 필터를 변경해 보세요</p>
              <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">필터 초기화</button>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
              {filtered.map((r) => (
                <RecipeCard
                  key={r.id} recipe={r} query={[]} saved={savedIds.includes(r.id)}
                  onSave={() => onToggleSave(r.id, r)} view={view} onClick={() => onSelectRecipe(r)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
