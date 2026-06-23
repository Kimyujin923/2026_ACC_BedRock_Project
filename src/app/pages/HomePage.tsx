import { useState, useRef, useEffect } from "react";
import { Search, X, Sparkles, ChefHat, ChevronRight, Clock, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { ALL_RECIPES, QUICK_INGREDIENTS, FILTER_TAGS } from "../data";
import type { Recipe } from "../data";
import { difficultyColor } from "../data";
import RecipeCard from "../components/RecipeCard";

interface Props {
  savedIds: number[];
  onToggleSave: (id: number) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  initialIngredients?: string[] | null;
  onClearInitialIngredients?: () => void;
}

export default function HomePage({ savedIds, onToggleSave, onSelectRecipe, initialIngredients, onClearInitialIngredients }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Recipe[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeTag, setActiveTag] = useState("전체");
  const [sortBy, setSortBy] = useState<"match" | "time" | "calories">("match");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialIngredients && initialIngredients.length > 0) {
      setIngredients(initialIngredients);
      onClearInitialIngredients?.();
      // 자동 검색 트리거
      setSearching(true);
      setSearched(false);
      setTimeout(() => {
        const r = ALL_RECIPES.filter((rec) => rec.matchedIngredients.some((i) => initialIngredients.includes(i)));
        setResults(r.length ? r : ALL_RECIPES.slice(0, 4));
        setSearching(false);
        setSearched(true);
        setActiveTag("전체");
      }, 1400);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addIngredient = (val: string) => {
    const v = val.trim().replace(/,+$/, "");
    if (v && !ingredients.includes(v)) setIngredients((p) => [...p, v]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addIngredient(inputValue); }
    else if (e.key === "Backspace" && !inputValue && ingredients.length > 0)
      setIngredients((p) => p.slice(0, -1));
  };

  const handleSearch = () => {
    if (!ingredients.length) return;
    setSearching(true);
    setSearched(false);
    setTimeout(() => {
      const r = ALL_RECIPES.filter((rec) => rec.matchedIngredients.some((i) => ingredients.includes(i)));
      setResults(r.length ? r : ALL_RECIPES.slice(0, 4));
      setSearching(false);
      setSearched(true);
      setActiveTag("전체");
    }, 1400);
  };

  const filtered = results
    .filter((r) => activeTag === "전체" || r.tags.includes(activeTag))
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "time") return parseInt(a.time) - parseInt(b.time);
      return a.calories - b.calories;
    });

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Left panel */}
        <aside className="space-y-4">
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-sm text-foreground">재료로 레시피 찾기</h2>
            </div>
            <div
              className="min-h-[80px] border border-border rounded-xl p-3 flex flex-wrap gap-2 cursor-text bg-muted/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all"
              onClick={() => inputRef.current?.focus()}
            >
              {ingredients.map((ing) => (
                <span key={ing} className="flex items-center gap-1 bg-primary text-white text-sm px-3 py-1 rounded-full font-medium">
                  {ing}
                  <button onClick={(e) => { e.stopPropagation(); setIngredients((p) => p.filter((x) => x !== ing)); }}>
                    <X className="w-3 h-3 opacity-70 hover:opacity-100" />
                  </button>
                </span>
              ))}
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => { if (inputValue.trim()) addIngredient(inputValue); }}
                placeholder={ingredients.length === 0 ? "재료 입력 후 Enter..." : "재료 추가..."}
                className="flex-1 min-w-24 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!ingredients.length || searching}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {searching ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 검색 중...</>
              ) : (
                <><Search className="w-4 h-4" /> 레시피 찾기</>
              )}
            </button>
          </div>

          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">자주 쓰는 재료</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_INGREDIENTS.map((item) => (
                <button
                  key={item}
                  onClick={() => addIngredient(item)}
                  disabled={ingredients.includes(item)}
                  className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${
                    ingredients.includes(item)
                      ? "bg-primary/10 text-primary border-primary/30 cursor-default"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-secondary"
                  }`}
                >
                  {ingredients.includes(item) ? "✓ " : ""}{item}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
            <p className="text-xs font-semibold text-primary mb-1">AI 셰프 엔진</p>
            <p className="text-xs text-muted-foreground leading-relaxed">재료를 벡터로 변환해 수만 개의 레시피 DB에서 최적 조합을 찾고, Claude AI가 맞춤 레시피를 생성합니다.</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {["AWS Bedrock", "Claude 3", "Vector DB"].map((t) => (
                <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{t}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* Right panel */}
        <main className="min-w-0">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(searched ? FILTER_TAGS : ["전체"]).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`text-sm px-3.5 py-1.5 rounded-full font-medium transition-colors border ${
                    activeTag === tag ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {searched && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="text-xs text-muted-foreground px-2 py-1.5 bg-white outline-none cursor-pointer"
                  >
                    <option value="match">매칭순</option>
                    <option value="time">조리시간순</option>
                    <option value="calories">칼로리순</option>
                  </select>
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground mr-2" />
                </div>
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setView("grid")} className={`p-1.5 transition-colors ${view === "grid" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setView("list")} className={`p-1.5 transition-colors ${view === "list" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {searching && (
            <div className="bg-white border border-border rounded-2xl p-10 text-center shadow-sm">
              <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-5" />
              <p className="font-semibold text-foreground mb-3">AI가 레시피를 분석하고 있어요</p>
              <div className="space-y-2 text-sm text-muted-foreground max-w-xs mx-auto">
                {["재료를 임베딩 벡터로 변환 중...", "레시피 DB 유사도 검색 중...", "Claude AI 레시피 생성 중..."].map((s, i) => (
                  <p key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>{i + 1}. {s}</p>
                ))}
              </div>
            </div>
          )}

          {searched && !searching && (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                <span className="font-semibold text-foreground">{ingredients.join(", ")}</span>으로{" "}
                <span className="font-semibold text-primary">{filtered.length}개</span>의 레시피를 찾았어요
              </p>
              <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-3"}>
                {filtered.map((r) => (
                  <RecipeCard
                    key={r.id} recipe={r} query={ingredients}
                    saved={savedIds.includes(r.id)} onSave={() => onToggleSave(r.id)}
                    view={view} onClick={() => onSelectRecipe(r)} showMatch
                  />
                ))}
              </div>
            </>
          )}

          {!searched && !searching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 bg-primary/5 border border-primary/15 rounded-2xl p-7 flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <ChefHat className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">냉장고에 뭐가 있나요?</p>
                  <p className="text-sm text-muted-foreground">왼쪽에 재료를 입력하면 AI가 맞춤 레시피를 추천해 드려요. 예: 감자, 스팸, 양파</p>
                </div>
              </div>
              {ALL_RECIPES.slice(0, 4).map((r) => (
                <article
                  key={r.id}
                  onClick={() => onSelectRecipe(r)}
                  className="bg-white border border-border rounded-2xl overflow-hidden flex gap-3 p-3 hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                    <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.description}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{r.time}</span>
                      <span className={`px-1.5 py-0.5 rounded-full font-medium ${difficultyColor[r.difficulty]}`}>{r.difficulty}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 self-center ml-auto" />
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
