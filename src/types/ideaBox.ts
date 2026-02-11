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

// localStorage helpers migrated to hooks/useIdeaBox.ts + services/ideaBoxService.ts

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
