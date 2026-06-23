import { useState } from "react";
import {
  Plus, Trash2, AlertTriangle, Clock, ChevronRight, X,
  RefrigeratorIcon, Search,
} from "lucide-react";
import {
  FridgeItem, FridgeCategory, ExpiryStatus,
  FRIDGE_CATEGORIES, FRIDGE_UNITS, CATEGORY_EMOJI,
  getExpiryStatus, getDaysUntilExpiry,
} from "../data";

// ── Expiry helpers ─────────────────────────────────────────────────────────────

const expiryStyles: Record<ExpiryStatus, { badge: string; card: string; text: string; label: (d: number) => string }> = {
  expired: {
    badge: "bg-red-100 text-red-700 border-red-200",
    card: "border-red-200 bg-red-50/30",
    text: "text-red-600",
    label: (d) => `${Math.abs(d)}일 지남`,
  },
  soon: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    card: "border-amber-200 bg-amber-50/20",
    text: "text-amber-600",
    label: (d) => d === 0 ? "오늘 만료" : `D-${d}`,
  },
  ok: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    card: "border-border bg-white",
    text: "text-emerald-600",
    label: (d) => `D-${d}`,
  },
};

// ── Add Item Modal ─────────────────────────────────────────────────────────────

function AddItemModal({
  onAdd,
  onClose,
}: {
  onAdd: (item: Omit<FridgeItem, "id" | "addedAt">) => void;
  onClose: () => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("개");
  const [category, setCategory] = useState<FridgeCategory>("채소/과일");
  const [expiresAt, setExpiresAt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "재료 이름을 입력하세요";
    if (!quantity || Number(quantity) <= 0) e.quantity = "수량을 입력하세요";
    if (!expiresAt) e.expiresAt = "유통기한을 입력하세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd({ name: name.trim(), quantity: Number(quantity), unit, category, expiresAt });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-foreground">재료 추가</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">재료 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 당근"
              className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-all ${
                errors.name ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">수량</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-all ${
                  errors.quantity ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
                }`}
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">단위</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white cursor-pointer"
              >
                {FRIDGE_UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">카테고리</label>
            <div className="grid grid-cols-3 gap-2">
              {FRIDGE_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`text-xs px-2 py-2 rounded-xl border font-medium transition-colors text-center ${
                    category === c ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {CATEGORY_EMOJI[c]} {c}
                </button>
              ))}
            </div>
          </div>

          {/* Expiry date */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">유통기한</label>
            <input
              type="date"
              value={expiresAt}
              min={today}
              onChange={(e) => setExpiresAt(e.target.value)}
              className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-all ${
                errors.expiresAt ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
              }`}
            />
            {errors.expiresAt && <p className="text-xs text-red-500 mt-1">{errors.expiresAt}</p>}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Fridge Item Card ───────────────────────────────────────────────────────────

function FridgeCard({ item, onDelete }: { item: FridgeItem; onDelete: () => void }) {
  const status = getExpiryStatus(item.expiresAt);
  const days = getDaysUntilExpiry(item.expiresAt);
  const style = expiryStyles[status];
  const dateFormatted = new Date(item.expiresAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });

  return (
    <div className={`relative rounded-2xl border p-4 transition-all hover:shadow-sm ${style.card}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{CATEGORY_EMOJI[item.category]}</span>
          <div>
            <p className="font-semibold text-sm text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.category}</p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-bold text-foreground tabular-nums">
            {item.quantity}<span className="text-sm font-normal text-muted-foreground ml-0.5">{item.unit}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {dateFormatted} 까지
          </p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${style.badge}`}>
          {style.label(days)}
        </span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

interface Props {
  items: FridgeItem[];
  onAdd: (item: Omit<FridgeItem, "id" | "addedAt">) => void;
  onDelete: (id: number) => void;
  onSearchRecipes: (ingredients: string[]) => void;
}

export default function FridgePage({ items, onAdd, onDelete, onSearchRecipes }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FridgeCategory | "전체">("전체");
  const [sortBy, setSortBy] = useState<"expiry" | "name" | "added">("expiry");

  const expiredCount = items.filter((i) => getExpiryStatus(i.expiresAt) === "expired").length;
  const soonCount = items.filter((i) => getExpiryStatus(i.expiresAt) === "soon").length;

  const filtered = items
    .filter((i) => {
      if (search && !i.name.includes(search)) return false;
      if (activeCategory !== "전체" && i.category !== activeCategory) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "expiry") return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      if (sortBy === "name") return a.name.localeCompare(b.name, "ko");
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });

  const handleSearchRecipes = () => {
    const ingredients = items.map((i) => i.name);
    onSearchRecipes(ingredients);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">내 냉장고</h1>
          <p className="text-sm text-muted-foreground">
            재료 <span className="font-semibold text-foreground">{items.length}개</span>를 보관 중이에요
          </p>
        </div>
        <div className="flex gap-2">
          {items.length > 0 && (
            <button
              onClick={handleSearchRecipes}
              className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary px-4 py-2 rounded-xl hover:bg-primary/5 transition-colors"
            >
              냉장고 재료로 레시피 찾기
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-sm font-semibold bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            재료 추가
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground tabular-nums">{items.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">총 재료</p>
        </div>
        <div className={`rounded-2xl p-4 text-center border ${soonCount > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-border"}`}>
          <p className={`text-2xl font-bold tabular-nums ${soonCount > 0 ? "text-amber-600" : "text-foreground"}`}>{soonCount}</p>
          <p className={`text-xs mt-0.5 flex items-center justify-center gap-1 ${soonCount > 0 ? "text-amber-600" : "text-muted-foreground"}`}>
            {soonCount > 0 && <AlertTriangle className="w-3 h-3" />}
            유통기한 임박
          </p>
        </div>
        <div className={`rounded-2xl p-4 text-center border ${expiredCount > 0 ? "bg-red-50 border-red-200" : "bg-white border-border"}`}>
          <p className={`text-2xl font-bold tabular-nums ${expiredCount > 0 ? "text-red-600" : "text-foreground"}`}>{expiredCount}</p>
          <p className={`text-xs mt-0.5 ${expiredCount > 0 ? "text-red-600" : "text-muted-foreground"}`}>유통기한 지남</p>
        </div>
      </div>

      {/* Expiry warnings */}
      {(soonCount > 0 || expiredCount > 0) && (
        <div className="mb-6 space-y-2">
          {expiredCount > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <p className="text-sm text-red-700">
                <span className="font-semibold">{items.filter(i => getExpiryStatus(i.expiresAt) === "expired").map(i => i.name).join(", ")}</span>의 유통기한이 지났어요. 확인해 주세요.
              </p>
            </div>
          )}
          {soonCount > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-700">
                <span className="font-semibold">{items.filter(i => getExpiryStatus(i.expiresAt) === "soon").map(i => i.name).join(", ")}</span>의 유통기한이 3일 이내예요.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="재료 검색..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-border rounded-xl px-3 py-2 bg-white text-muted-foreground outline-none cursor-pointer"
        >
          <option value="expiry">유통기한순</option>
          <option value="name">이름순</option>
          <option value="added">최근 추가순</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["전체", ...FRIDGE_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`text-sm px-3.5 py-1.5 rounded-full border font-medium transition-colors ${
              activeCategory === c
                ? "bg-primary text-white border-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {c !== "전체" && `${CATEGORY_EMOJI[c as FridgeCategory]} `}{c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <RefrigeratorIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground mb-2">냉장고가 비어 있어요</p>
          <p className="text-sm text-muted-foreground mb-5">재료를 추가하면 유통기한을 관리하고<br />맞춤 레시피를 추천받을 수 있어요.</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-sm font-semibold bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            첫 재료 추가하기
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">검색 결과가 없어요</p>
          <p className="text-sm">다른 검색어나 카테고리를 선택해 보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <FridgeCard key={item.id} item={item} onDelete={() => onDelete(item.id)} />
          ))}
        </div>
      )}

      {showModal && (
        <AddItemModal onAdd={onAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
