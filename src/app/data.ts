export type Difficulty = "쉬움" | "보통" | "어려움";

export interface Step {
  step: number;
  desc: string;
  tip?: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  time: string;
  servings: number;
  difficulty: Difficulty;
  matchedIngredients: string[];
  extraIngredients: string[];
  tags: string[];
  category: string;
  imageUrl: string;
  calories: number;
  matchScore: number;
  protein: number;
  carbs: number;
  fat: number;
  steps: Step[];
  allIngredients: { name: string; amount: string }[];
}

export const ALL_RECIPES: Recipe[] = [
  {
    id: 1,
    name: "감자 스팸 볶음",
    description: "고소한 스팸과 포슬포슬한 감자의 조화. 밥 한 그릇 뚝딱 해치울 수 있는 든든한 반찬.",
    time: "20분", servings: 2, difficulty: "쉬움",
    matchedIngredients: ["감자", "스팸"], extraIngredients: ["식용유", "간장", "참기름"],
    tags: ["볶음", "반찬"], category: "반찬",
    imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=900&h=500&fit=crop&auto=format",
    calories: 320, matchScore: 98, protein: 14, carbs: 38, fat: 12,
    allIngredients: [
      { name: "감자", amount: "2개 (300g)" }, { name: "스팸", amount: "200g" },
      { name: "식용유", amount: "2큰술" }, { name: "간장", amount: "1큰술" },
      { name: "참기름", amount: "1작은술" }, { name: "통깨", amount: "약간" }, { name: "소금", amount: "약간" },
    ],
    steps: [
      { step: 1, desc: "감자는 껍질을 벗기고 얇게 슬라이스합니다. 찬물에 5분 담가 전분을 제거합니다.", tip: "찬물에 담그면 볶을 때 달라붙지 않아요." },
      { step: 2, desc: "스팸은 감자와 비슷한 두께로 썰어 준비합니다." },
      { step: 3, desc: "팬에 식용유를 두르고 중강불로 달군 뒤 스팸을 노릇해질 때까지 2~3분 볶아 꺼냅니다.", tip: "스팸을 먼저 볶으면 기름이 나와 감자가 더 고소해요." },
      { step: 4, desc: "같은 팬에 물기를 뺀 감자를 넣고 중불에서 5~7분 볶습니다." },
      { step: 5, desc: "볶아둔 스팸을 다시 넣고 간장, 소금으로 간을 합니다. 1분 더 볶아 섞어줍니다." },
      { step: 6, desc: "불을 끄고 참기름과 통깨를 뿌려 완성합니다." },
    ],
  },
  {
    id: 2,
    name: "감자 된장국",
    description: "구수한 된장과 포근한 감자가 어우러진 따뜻한 국물 요리. 온 가족이 즐기는 집밥의 정석.",
    time: "25분", servings: 4, difficulty: "쉬움",
    matchedIngredients: ["감자", "양파"], extraIngredients: ["된장", "대파", "멸치육수"],
    tags: ["국물", "한식"], category: "국·찌개",
    imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=900&h=500&fit=crop&auto=format",
    calories: 180, matchScore: 91, protein: 8, carbs: 28, fat: 4,
    allIngredients: [
      { name: "감자", amount: "2개 (300g)" }, { name: "양파", amount: "1/2개" },
      { name: "된장", amount: "2큰술" }, { name: "대파", amount: "1대" },
      { name: "멸치육수", amount: "600ml" }, { name: "애호박", amount: "1/3개" }, { name: "청양고추", amount: "1개 (선택)" },
    ],
    steps: [
      { step: 1, desc: "감자는 한입 크기로 깍둑썰기하고, 양파는 채 썰고, 호박은 반달 모양으로 썹니다." },
      { step: 2, desc: "냄비에 멸치육수 600ml를 붓고 중불로 끓입니다." },
      { step: 3, desc: "육수가 끓으면 된장을 체에 걸러 넣고 잘 풀어줍니다.", tip: "된장을 체에 내리면 국물이 더 깔끔해요." },
      { step: 4, desc: "감자와 양파를 넣고 감자가 익을 때까지 10분 끓입니다." },
      { step: 5, desc: "호박과 청양고추를 넣고 3분 더 끓입니다." },
      { step: 6, desc: "대파를 썰어 넣고 간을 보아 된장으로 조절한 뒤 완성합니다." },
    ],
  },
  {
    id: 3,
    name: "스팸 김치볶음밥",
    description: "묵은지와 스팸의 환상적인 만남. 간단하지만 깊은 맛의 한 그릇 요리.",
    time: "15분", servings: 2, difficulty: "쉬움",
    matchedIngredients: ["스팸", "김치"], extraIngredients: ["밥", "달걀", "참기름"],
    tags: ["볶음밥", "한끼"], category: "한끼",
    imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=900&h=500&fit=crop&auto=format",
    calories: 450, matchScore: 87, protein: 18, carbs: 62, fat: 14,
    allIngredients: [
      { name: "밥", amount: "2공기 (400g)" }, { name: "스팸", amount: "150g" },
      { name: "묵은지", amount: "150g" }, { name: "달걀", amount: "2개" },
      { name: "참기름", amount: "1큰술" }, { name: "식용유", amount: "2큰술" }, { name: "김", amount: "약간 (선택)" },
    ],
    steps: [
      { step: 1, desc: "스팸은 1cm 주사위 모양으로 썰고, 김치는 잘게 썰어 물기를 꼭 짭니다.", tip: "김치 물기를 빼야 볶음밥이 질어지지 않아요." },
      { step: 2, desc: "팬에 식용유를 두르고 스팸을 볶아 노릇해지면 꺼냅니다." },
      { step: 3, desc: "같은 팬에 김치를 넣고 중강불에서 3분 볶아 수분을 날립니다." },
      { step: 4, desc: "밥을 넣고 주걱으로 김치와 섞으며 강불에서 볶습니다." },
      { step: 5, desc: "스팸을 다시 넣고 섞은 뒤 한쪽으로 밀어 달걀 프라이를 올립니다." },
      { step: 6, desc: "참기름을 두르고 김 가루와 함께 냅니다." },
    ],
  },
  {
    id: 4,
    name: "부대찌개",
    description: "스팸, 소시지, 김치, 라면이 한데 어우러진 국민 찌개. 여럿이 나눠 먹기 딱 좋아요.",
    time: "30분", servings: 3, difficulty: "보통",
    matchedIngredients: ["스팸", "김치", "양파"], extraIngredients: ["소시지", "라면", "두부"],
    tags: ["찌개", "한식"], category: "국·찌개",
    imageUrl: "https://images.unsplash.com/photo-1744870132190-5c02d3f8d9f9?w=900&h=500&fit=crop&auto=format",
    calories: 520, matchScore: 95, protein: 26, carbs: 54, fat: 22,
    allIngredients: [
      { name: "스팸", amount: "200g" }, { name: "비엔나소시지", amount: "100g" },
      { name: "김치", amount: "200g" }, { name: "양파", amount: "1/2개" },
      { name: "두부", amount: "1/2모" }, { name: "라면사리", amount: "1개" },
      { name: "고추장", amount: "1큰술" }, { name: "고춧가루", amount: "1큰술" },
      { name: "다진마늘", amount: "1큰술" }, { name: "멸치육수", amount: "500ml" },
    ],
    steps: [
      { step: 1, desc: "모든 재료를 먹기 좋은 크기로 썰어 준비합니다." },
      { step: 2, desc: "냄비 바닥에 김치를 깔고, 그 위에 스팸, 소시지, 두부, 양파를 얹습니다." },
      { step: 3, desc: "멸치육수를 붓고, 고추장, 고춧가루, 다진마늘을 넣습니다.", tip: "육수 대신 물에 다시팩을 넣어도 돼요." },
      { step: 4, desc: "뚜껑을 덮고 중강불로 10분 끓입니다." },
      { step: 5, desc: "라면사리를 넣고 면이 익을 때까지 3분 더 끓입니다." },
      { step: 6, desc: "간을 보고 부족하면 국간장으로 조절해 완성합니다." },
    ],
  },
  {
    id: 5,
    name: "감자채 볶음",
    description: "채 썬 감자를 참기름에 고슬하게 볶아낸 바삭한 반찬.",
    time: "12분", servings: 3, difficulty: "쉬움",
    matchedIngredients: ["감자"], extraIngredients: ["마늘", "참기름", "소금"],
    tags: ["볶음", "반찬"], category: "반찬",
    imageUrl: "https://images.unsplash.com/photo-1683225757624-86943fb48966?w=900&h=500&fit=crop&auto=format",
    calories: 210, matchScore: 82, protein: 4, carbs: 42, fat: 5,
    allIngredients: [
      { name: "감자", amount: "3개 (450g)" }, { name: "다진마늘", amount: "1작은술" },
      { name: "참기름", amount: "1큰술" }, { name: "소금", amount: "1/2작은술" },
      { name: "통깨", amount: "약간" }, { name: "식용유", amount: "1큰술" },
    ],
    steps: [
      { step: 1, desc: "감자를 곱게 채 썰어 찬물에 5분 담갔다가 건져 물기를 뺍니다.", tip: "채 써는 도구를 사용하면 빠르고 일정해요." },
      { step: 2, desc: "팬에 식용유와 참기름을 두르고 다진마늘을 볶아 향을 냅니다." },
      { step: 3, desc: "감자채를 넣고 중강불에서 볶습니다. 계속 저어주세요." },
      { step: 4, desc: "감자가 투명해지면 소금으로 간하고 통깨를 뿌려 완성합니다." },
    ],
  },
  {
    id: 6,
    name: "달걀찜",
    description: "뚝배기에 보글보글 익힌 부드러운 달걀찜. 식탁에 올리면 늘 먼저 비워지는 인기 반찬.",
    time: "15분", servings: 2, difficulty: "쉬움",
    matchedIngredients: ["달걀"], extraIngredients: ["멸치육수", "대파", "소금"],
    tags: ["찜", "반찬"], category: "반찬",
    imageUrl: "https://images.unsplash.com/photo-1661366394743-fe30fe478ef7?w=900&h=500&fit=crop&auto=format",
    calories: 140, matchScore: 78, protein: 11, carbs: 4, fat: 9,
    allIngredients: [
      { name: "달걀", amount: "3개" }, { name: "멸치육수", amount: "200ml" },
      { name: "대파", amount: "약간" }, { name: "소금", amount: "1/3작은술" }, { name: "참기름", amount: "1/2작은술" },
    ],
    steps: [
      { step: 1, desc: "달걀 3개를 볼에 깨고 잘 풀어줍니다." },
      { step: 2, desc: "멸치육수와 소금을 넣고 섞습니다.", tip: "육수를 쓰면 훨씬 깊은 맛이 나요." },
      { step: 3, desc: "뚝배기에 달걀물을 붓고 중불로 올립니다. 가장자리가 익으면 안쪽을 저어줍니다." },
      { step: 4, desc: "반쯤 익으면 뚜껑을 덮고 약불에서 3분 더 익힙니다." },
      { step: 5, desc: "참기름을 두르고 대파를 얹어 완성합니다." },
    ],
  },
  {
    id: 7,
    name: "두부 김치찌개",
    description: "잘 익은 김치와 부드러운 두부가 어우러진 칼칼한 찌개. 추운 날 더욱 생각나는 메뉴.",
    time: "25분", servings: 2, difficulty: "쉬움",
    matchedIngredients: ["두부", "김치"], extraIngredients: ["돼지고기", "대파", "고춧가루"],
    tags: ["찌개", "한식"], category: "국·찌개",
    imageUrl: "https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=900&h=500&fit=crop&auto=format",
    calories: 280, matchScore: 88, protein: 18, carbs: 12, fat: 16,
    allIngredients: [
      { name: "두부", amount: "1모" }, { name: "김치", amount: "200g" },
      { name: "돼지고기", amount: "100g (선택)" }, { name: "대파", amount: "1/2대" },
      { name: "고춧가루", amount: "1큰술" }, { name: "다진마늘", amount: "1작은술" },
      { name: "참기름", amount: "1작은술" }, { name: "멸치육수", amount: "400ml" },
    ],
    steps: [
      { step: 1, desc: "두부는 먹기 좋게 깍둑썰고, 김치는 적당히 썰어 준비합니다." },
      { step: 2, desc: "냄비에 참기름을 두르고 돼지고기를 볶다가 김치를 넣어 함께 볶습니다." },
      { step: 3, desc: "멸치육수를 붓고 고춧가루, 다진마늘을 넣어 중불로 10분 끓입니다." },
      { step: 4, desc: "두부를 넣고 5분 더 끓인 뒤 대파를 얹어 완성합니다." },
    ],
  },
  {
    id: 8,
    name: "닭갈비",
    description: "매콤달콤한 양념에 재운 닭고기를 채소와 함께 볶은 춘천식 닭갈비.",
    time: "35분", servings: 3, difficulty: "보통",
    matchedIngredients: ["닭고기", "양파"], extraIngredients: ["고추장", "고춧가루", "설탕"],
    tags: ["볶음", "한식"], category: "메인",
    imageUrl: "https://images.unsplash.com/photo-1576621936609-e8e60791caea?w=900&h=500&fit=crop&auto=format",
    calories: 480, matchScore: 85, protein: 38, carbs: 32, fat: 20,
    allIngredients: [
      { name: "닭고기", amount: "600g" }, { name: "양파", amount: "1개" },
      { name: "고구마", amount: "1개" }, { name: "대파", amount: "1대" },
      { name: "고추장", amount: "3큰술" }, { name: "고춧가루", amount: "2큰술" },
      { name: "설탕", amount: "1큰술" }, { name: "다진마늘", amount: "1큰술" },
      { name: "간장", amount: "2큰술" }, { name: "참기름", amount: "1큰술" },
    ],
    steps: [
      { step: 1, desc: "닭고기는 한입 크기로 썰고 고추장, 고춧가루, 간장, 설탕, 마늘을 섞어 30분 이상 재웁니다.", tip: "오래 재울수록 맛이 배어요. 하룻밤이 가장 좋아요." },
      { step: 2, desc: "양파, 고구마는 먹기 좋은 크기로 썰어 준비합니다." },
      { step: 3, desc: "팬에 식용유를 두르고 양념한 닭고기를 중강불로 볶습니다." },
      { step: 4, desc: "고구마와 양파를 넣고 함께 볶으며 익힙니다." },
      { step: 5, desc: "대파를 넣고 참기름을 두르며 완성합니다." },
    ],
  },
];

export const QUICK_INGREDIENTS = [
  "감자", "양파", "달걀", "두부", "김치", "스팸", "대파", "당근", "마늘", "버섯",
  "돼지고기", "닭고기", "시금치", "콩나물", "호박",
];

export const CATEGORIES = ["전체", "반찬", "국·찌개", "한끼", "메인", "간식"];
export const FILTER_TAGS = ["전체", "볶음", "국물", "볶음밥", "찌개", "반찬", "찜", "한식"];

export const difficultyColor: Record<Difficulty, string> = {
  쉬움: "text-emerald-600 bg-emerald-50",
  보통: "text-blue-600 bg-blue-50",
  어려움: "text-red-600 bg-red-50",
};

// ── 냉장고 ────────────────────────────────────────────────────────────────────

export type FridgeCategory = "채소/과일" | "육류/해산물" | "유제품/계란" | "양념/소스" | "냉동식품" | "기타";

export const FRIDGE_CATEGORIES: FridgeCategory[] = [
  "채소/과일", "육류/해산물", "유제품/계란", "양념/소스", "냉동식품", "기타",
];

export const FRIDGE_UNITS = ["개", "g", "kg", "ml", "L", "팩", "봉지", "줌", "컵", "조각"];

export interface FridgeItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: FridgeCategory;
  expiresAt: string; // "YYYY-MM-DD"
  addedAt: string;   // "YYYY-MM-DD"
}

export type ExpiryStatus = "expired" | "soon" | "ok";

export function getExpiryStatus(expiresAt: string): ExpiryStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiresAt);
  exp.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "soon";
  return "ok";
}

export function getDaysUntilExpiry(expiresAt: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiresAt);
  exp.setHours(0, 0, 0, 0);
  return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export const CATEGORY_EMOJI: Record<FridgeCategory, string> = {
  "채소/과일": "🥦",
  "육류/해산물": "🥩",
  "유제품/계란": "🥛",
  "양념/소스": "🧂",
  "냉동식품": "🧊",
  "기타": "🛒",
};

export const SAMPLE_FRIDGE_ITEMS: FridgeItem[] = [
  { id: 1, name: "감자", quantity: 3, unit: "개", category: "채소/과일", expiresAt: "2025-06-28", addedAt: "2025-06-20" },
  { id: 2, name: "달걀", quantity: 6, unit: "개", category: "유제품/계란", expiresAt: "2025-07-05", addedAt: "2025-06-20" },
  { id: 3, name: "양파", quantity: 2, unit: "개", category: "채소/과일", expiresAt: "2025-06-22", addedAt: "2025-06-15" },
  { id: 4, name: "스팸", quantity: 1, unit: "개", category: "기타", expiresAt: "2025-09-01", addedAt: "2025-06-20" },
  { id: 5, name: "김치", quantity: 500, unit: "g", category: "양념/소스", expiresAt: "2025-07-20", addedAt: "2025-06-10" },
];
