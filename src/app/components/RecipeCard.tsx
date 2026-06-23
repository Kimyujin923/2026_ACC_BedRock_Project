import { Clock, Users, Flame, Bookmark, BookmarkCheck } from "lucide-react";
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
  query?: string[];
  saved: boolean;
  onSave: () => void;
  view?: "grid" | "list";
  onClick: () => void;
  showMatch?: boolean;
}

export default function RecipeCard({ recipe, query = [], saved, onSave, view = "grid", onClick, showMatch = false }: Props) {
  if (view === "list") {
    return (
      <article
        onClick={onClick}
        className="flex gap-4 bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer"
      >
        <div className="w-32 shrink-0 bg-muted overflow-hidden">
          <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 py-4 pr-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{recipe.name}</h3>
            <button onClick={(e) => { e.stopPropagation(); onSave(); }} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
              {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{recipe.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.time}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{recipe.servings}인분</span>
            <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{recipe.calories}kcal</span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${difficultyColor[recipe.difficulty]}`}>{recipe.difficulty}</span>
          </div>
          {showMatch && <MatchBar score={recipe.matchScore} />}
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={onClick}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col cursor-pointer"
    >
      <div className="relative h-44 bg-muted overflow-hidden">
        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4 text-gray-500" />}
        </button>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {recipe.tags.map((t) => (
            <span key={t} className="text-xs bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-0.5 rounded-full font-medium">{t}</span>
          ))}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-base text-foreground leading-snug">{recipe.name}</h3>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[recipe.difficulty]}`}>{recipe.difficulty}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{recipe.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.time}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{recipe.servings}인분</span>
          <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{recipe.calories}kcal</span>
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {recipe.matchedIngredients.map((ing) => (
            <span
              key={ing}
              className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                query.includes(ing) ? "bg-primary text-white border-primary" : "bg-secondary text-secondary-foreground border-border"
              }`}
            >
              {ing}
            </span>
          ))}
          {recipe.extraIngredients.slice(0, 2).map((ing) => (
            <span key={ing} className="text-xs px-2 py-0.5 rounded-full text-muted-foreground border border-border bg-muted">{ing}</span>
          ))}
        </div>
        {showMatch && (
          <div className="mt-auto">
            <MatchBar score={recipe.matchScore} />
          </div>
        )}
      </div>
    </article>
  );
}
