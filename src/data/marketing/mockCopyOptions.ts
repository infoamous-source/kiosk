// AI 카피라이터 Mock 데이터 (Gemini API 연동 전 사용)

export interface MockCopySet {
  tone: string;
  copies: string[];
}

const emotionalCopies: Record<string, string[]> = {
  default: [
    '당신의 일상에 작은 행복을 더해요',
    '한 번 써보면 다시 돌아갈 수 없어요',
    '소중한 당신을 위한 특별한 선택',
  ],
  food: [
    '한 입 먹으면 엄마 생각나는 그 맛',
    '매일 먹어도 질리지 않는 비밀이 있어요',
    '입 안에서 춤추는 행복, 지금 만나보세요',
  ],
  fashion: [
    '오늘도 나답게, 당신만의 스타일로',
    '거울 앞에서 한 번 더 웃게 되는 옷',
    '입는 순간, 자신감이 올라가요',
  ],
  beauty: [
    '피부가 먼저 말해주는 아름다움',
    '매일 아침 거울이 기다려지는 이유',
    '자연스러운 아름다움, 그게 진짜예요',
  ],
};

const funCopies: Record<string, string[]> = {
  default: [
    '이거 안 사면 후회할걸요? (진심)',
    '친구한테 추천했더니 절교 위기... 왜냐면 너무 좋아서!',
    '세상에 이런 가격에 이런 퀄리티라니!',
  ],
  food: [
    '배고프면 화나잖아요. 이걸로 해결!',
    '다이어트는 내일부터... 오늘은 이거 먹자!',
    '맛있어서 눈물이 나는 건 처음이에요',
  ],
  fashion: [
    '오픈런 각입니다. 진심으로요.',
    '룸메가 물어봐요. "그거 어디 거야?" (뿌듯)',
    '택배 올 때마다 심장이 쿵!',
  ],
  beauty: [
    '"무슨 화장품 써?" 라는 질문 받고 싶으면 이거!',
    'Before After가 이렇게 다를 수 있나요?!',
    '꿀피부 비결? 여기 있잖아요~',
  ],
};

const seriousCopies: Record<string, string[]> = {
  default: [
    '10년의 연구가 만든 프리미엄 품질',
    '전문가가 인정한 No.1 브랜드',
    '까다로운 기준으로 선별한 최상의 결과물',
  ],
  food: [
    '산지 직송, 신선함의 기준을 새로 쓰다',
    '엄격한 품질 관리로 매일 안전한 먹거리',
    '자연에서 온 건강, 식탁 위의 믿음',
  ],
  fashion: [
    '장인의 손끝에서 탄생한 프리미엄 라인',
    '트렌드를 넘어선 클래식의 가치',
    '소재부터 다른 프리미엄 퀄리티',
  ],
  beauty: [
    '피부과학 기반의 검증된 효과',
    '민감한 피부도 안심할 수 있는 성분 설계',
    '임상 테스트 완료, 신뢰할 수 있는 결과',
  ],
};

export function getMockCopyOptions(
  tone: 'emotional' | 'fun' | 'serious',
  productKeyword?: string
): string[] {
  const key = detectCategory(productKeyword || '');

  switch (tone) {
    case 'emotional':
      return emotionalCopies[key] || emotionalCopies.default;
    case 'fun':
      return funCopies[key] || funCopies.default;
    case 'serious':
      return seriousCopies[key] || seriousCopies.default;
    default:
      return emotionalCopies.default;
  }
}

function detectCategory(keyword: string): string {
  const lowerKeyword = keyword.toLowerCase();

  const foodKeywords = ['음식', '맛', '먹', '카페', '커피', '빵', '과일', '고기', '밥', '주스', '망고', 'food', 'cafe'];
  const fashionKeywords = ['옷', '패션', '신발', '가방', '악세', '코디', 'fashion', 'clothes'];
  const beautyKeywords = ['화장', '뷰티', '스킨', '피부', '메이크업', 'beauty', 'skin'];

  if (foodKeywords.some(k => lowerKeyword.includes(k))) return 'food';
  if (fashionKeywords.some(k => lowerKeyword.includes(k))) return 'fashion';
  if (beautyKeywords.some(k => lowerKeyword.includes(k))) return 'beauty';

  return 'default';
}
