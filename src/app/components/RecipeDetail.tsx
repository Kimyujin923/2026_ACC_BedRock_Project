import { useState } from "react";
import { ArrowLeft, Clock, Users, Flame, Star, Bookmark, BookmarkCheck, Share2, Printer, CheckCircle2 } from "lucide-react";
import type { Recipe } from "../data";
import { difficultyColor } from "../data";

function MatchBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-primary tabular-nums">{score}%</span>
    </div>
  );
}

interface Props {
  recipe: Recipe;
  query: string[];
  saved: boolean;
  onSave: () => void;
  onBack: () => void;
}

export default function RecipeDetail({ recipe, query, saved, onSave, onBack }: Props) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (step: number) =>
    setCompletedSteps((p) => p.includes(step) ? p.filter((s) => s !== step) : [...p, step]);

  const progress = Math.round((completedSteps.length / recipe.steps.length) * 100);

  const nutrients = [
    { label: "칼로리", value: recipe.calories, unit: "kcal", color: "bg-orange-50 text-orange-700" },
    { label: "단백질", value: recipe.protein, unit: "g", color: "bg-blue-50 text-blue-700" },
    { label: "탄수화물", value: recipe.carbs, unit: "g", color: "bg-yellow-50 text-yellow-700" },
    { label: "지방", value: recipe.fat, unit: "g", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            돌아가기
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
            >
              {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
              {saved ? "저장됨" : "저장"}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Hero */}
        <div className="rounded-2xl overflow-hidden mb-8 relative h-72 bg-muted">
          <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {recipe.tags.map((t) => (
                <span key={t} className="text-xs bg-white/20 backdrop-blur-sm text-white border border-white/20 px-2.5 py-0.5 rounded-full font-medium">{t}</span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{recipe.name}</h1>
            <p className="text-sm text-white/80">{recipe.description}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { icon: Clock, label: "조리시간", value: recipe.time },
            { icon: Users, label: "인분", value: `${recipe.servings}인분` },
            { icon: Flame, label: "칼로리", value: `${recipe.calories}kcal` },
            { icon: Star, label: "난이도", value: recipe.difficulty },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white border border-border rounded-xl p-4 text-center">
              <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
              <p className="font-bold text-sm text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Steps */}
          <div className="space-y-5">
            {completedSteps.length > 0 && (
              <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-primary">조리 진행도</p>
                  <p className="text-sm font-bold text-primary">{completedSteps.length} / {recipe.steps.length} 완료</p>
                </div>
                <div className="h-2 bg-primary/15 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                {progress === 100 && (
                  <p className="text-sm text-primary font-semibold mt-2 text-center">🎉 요리 완성! 맛있게 드세요.</p>
                )}
              </div>
            )}

            <div>
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {recipe.steps.length}
                </span>
                단계별 조리법
              </h2>
              <div className="space-y-3">
                {recipe.steps.map(({ step, desc, tip }) => {
                  const done = completedSteps.includes(step);
                  return (
                    <button
                      key={step}
                      onClick={() => toggleStep(step)}
                      className={`w-full text-left flex gap-4 p-4 rounded-2xl border transition-all duration-200 group ${
                        done ? "bg-primary/5 border-primary/20" : "bg-white border-border hover:border-primary/30 hover:shadow-sm"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {done ? (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center group-hover:border-primary transition-colors">
                            <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">{step}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{desc}</p>
                        {tip && !done && (
                          <p className="mt-2 text-xs text-primary bg-primary/8 px-3 py-1.5 rounded-lg inline-block">💡 {tip}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {query.length > 0 && (
              <div className="bg-white border border-border rounded-2xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI 매칭 결과</p>
                <MatchBar score={recipe.matchScore} />
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {recipe.matchedIngredients.map((ing) => (
                    <span
                      key={ing}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                        query.includes(ing) ? "bg-primary text-white border-primary" : "bg-secondary text-secondary-foreground border-border"
                      }`}
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-border rounded-2xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">재료 ({recipe.servings}인분 기준)</p>
              <ul className="space-y-2">
                {recipe.allIngredients.map(({ name, amount }) => {
                  const isMatched = recipe.matchedIngredients.includes(name) && query.includes(name);
                  return (
                    <li key={name} className={`flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0 ${isMatched ? "text-primary font-semibold" : "text-foreground"}`}>
                      <span className="flex items-center gap-1.5">
                        {isMatched && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />}
                        {name}
                      </span>
                      <span className={`text-xs ${isMatched ? "text-primary" : "text-muted-foreground"}`}>{amount}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-white border border-border rounded-2xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">영양 정보</p>
              <div className="grid grid-cols-2 gap-2">
                {nutrients.map(({ label, value, unit, color }) => (
                  <div key={label} className={`rounded-xl px-3 py-2.5 ${color}`}>
                    <p className="text-xs opacity-70 mb-0.5">{label}</p>
                    <p className="font-bold text-sm">{value}<span className="text-xs font-normal ml-0.5">{unit}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
