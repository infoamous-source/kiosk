// ─── 아이디어 상자 타입 ───

/** 저장 항목의 종류 */
export type IdeaItemType = 'persona' | 'usp' | 'copy' | 'hashtag' | 'color' | 'roi' | 'ad' | 'other';

/** 아이디어 상자에 저장되는 항목 하나 */
export interface IdeaItem {
  id: string;
  type: IdeaItemType;
  title: string;
  content: string;           // JSON 문자열 또는 텍스트
  preview?: string;           // 미리보기용 짧은 텍스트
  toolId?: string;            // 어떤 툴에서 생성했는지
  createdAt: string;
  tags?: string[];
}

/** 사용자별 아이디어 상자 */
export interface IdeaBoxData {
  userId: string;
  items: IdeaItem[];
  updatedAt: string;
}

// ─── 헬퍼 함수 ───

/** localStorage 키 */
export function getIdeaBoxKey(userId: string): string {
  return `kiosk-ideabox-${userId}`;
}

/** 아이디어 상자 로드 */
export function loadIdeaBox(userId: string): IdeaItem[] {
  try {
    const key = getIdeaBoxKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      const data: IdeaBoxData = JSON.parse(stored);
      return data.items;
    }
  } catch {
    // ignore
  }
  return [];
}

/** 아이디어 상자 저장 */
export function saveIdeaBox(userId: string, items: IdeaItem[]): void {
  const key = getIdeaBoxKey(userId);
  const data: IdeaBoxData = {
    userId,
    items,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(data));
}

/** 아이디어 추가 */
export function addIdeaItem(userId: string, item: Omit<IdeaItem, 'id' | 'createdAt'>): IdeaItem {
  const items = loadIdeaBox(userId);
  const newItem: IdeaItem = {
    ...item,
    id: `idea-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  // 최대 100개 유지
  if (items.length > 100) items.splice(100);
  saveIdeaBox(userId, items);
  return newItem;
}

/** 아이디어 삭제 */
export function removeIdeaItem(userId: string, itemId: string): void {
  const items = loadIdeaBox(userId);
  const filtered = items.filter(i => i.id !== itemId);
  saveIdeaBox(userId, filtered);
}

/** 타입별 라벨 (번역 키 매핑) */
export const ideaTypeLabels: Record<IdeaItemType, string> = {
  persona: 'profile.ideaBox.typePersona',
  usp: 'profile.ideaBox.typeUSP',
  copy: 'profile.ideaBox.typeCopy',
  hashtag: 'profile.ideaBox.typeHashtag',
  color: 'profile.ideaBox.typeColor',
  roi: 'profile.ideaBox.typeROI',
  ad: 'profile.ideaBox.typeAd',
  other: 'profile.ideaBox.typeOther',
};

/** 타입별 아이콘 이모지 */
export const ideaTypeIcons: Record<IdeaItemType, string> = {
  persona: '👤',
  usp: '💡',
  copy: '✍️',
  hashtag: '#️⃣',
  color: '🎨',
  roi: '📊',
  ad: '📱',
  other: '📝',
};
