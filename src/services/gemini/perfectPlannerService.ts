import { generateText, isGeminiEnabled } from './geminiClient';
import type { PerfectPlannerResult } from '../../types/school';

// ─── JSON 파싱 헬퍼 ───

function extractJSON(text: string): string {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  return text;
}

// ─── 판매 계획 생성 ───

export async function generateSalesPlan(
  productName: string,
  coreTarget: string,
  usp: string,
  strongOffer: string,
): Promise<{ result: PerfectPlannerResult['output']; isMock: boolean }> {
  if (isGeminiEnabled()) {
    try {
      const prompt = `당신은 한국 이커머스 판매 전략 전문가예요.
상세페이지 기획안과 라이브커머스 큐시트를 동시에 만들어주세요.

상품/브랜드: ${productName}
핵심 타겟: ${coreTarget}
차별점(USP): ${usp}
강력한 혜택/제안: ${strongOffer}

다음 JSON 형식으로 정확히 응답하세요 (다른 텍스트 없이 JSON만):
{
  "landingPage": {
    "headline": "메인 헤드라인 (주목을 끄는 한 줄)",
    "subheadline": "서브 헤드라인 (보충 설명)",
    "problemSection": {
      "title": "이런 고민 있으세요?",
      "painPoints": ["고객 불만1", "고객 불만2", "고객 불만3"]
    },
    "features": [
      { "title": "특장점1 제목", "description": "설명", "benefit": "고객이 얻는 이점" },
      { "title": "특장점2 제목", "description": "설명", "benefit": "고객이 얻는 이점" },
      { "title": "특장점3 제목", "description": "설명", "benefit": "고객이 얻는 이점" }
    ],
    "trustSignals": [
      { "type": "review", "content": "고객 리뷰 예시" },
      { "type": "stats", "content": "통계 수치 예시" },
      { "type": "certification", "content": "인증/수상 예시" }
    ],
    "closingCTA": {
      "mainCopy": "마감 카피",
      "buttonText": "버튼 텍스트",
      "urgency": "긴급성 문구"
    },
    "checklist": ["상세페이지 체크 항목1", "항목2", "항목3", "항목4", "항목5"]
  },
  "liveCommerce": {
    "opening": {
      "greeting": "인사말",
      "hook": "시청자 관심 끄는 한마디",
      "todaysOffer": "오늘의 특별 제안"
    },
    "demoPoints": [
      { "timestamp": "0-1분", "action": "무엇을 보여줄지", "talkingPoint": "무슨 말을 할지" },
      { "timestamp": "1-3분", "action": "...", "talkingPoint": "..." },
      { "timestamp": "3-5분", "action": "...", "talkingPoint": "..." },
      { "timestamp": "5-7분", "action": "...", "talkingPoint": "..." }
    ],
    "qnaHandling": [
      { "commonQuestion": "예상 질문1", "answer": "답변" },
      { "commonQuestion": "예상 질문2", "answer": "답변" },
      { "commonQuestion": "예상 질문3", "answer": "답변" }
    ],
    "closing": {
      "finalOffer": "마지막 제안",
      "urgencyTactic": "긴박감 전략",
      "farewell": "마무리 인사"
    },
    "checklist": ["라이브 준비 항목1", "항목2", "항목3", "항목4", "항목5"]
  },
  "salesLogic": "이 판매 전략이 효과적인 이유를 2-3문장으로 설명"
}

규칙:
- 상세페이지는 AIDA 공식 (Attention→Interest→Desire→Action) 기반
- 라이브커머스는 오프닝→시연→Q&A→클로징 구조
- 모든 텍스트는 TOPIK 3급 수준 쉬운 한국어 (~해요 체)
- 실제 한국 이커머스에서 쓰는 자연스러운 카피
- 체크리스트는 마케팅 초보가 놓치기 쉬운 실전 항목`;

      const text = await generateText(prompt);
      if (text) {
        const parsed = JSON.parse(extractJSON(text));
        if (parsed.landingPage && parsed.liveCommerce && parsed.salesLogic) {
          return { result: parsed, isMock: false };
        }
      }
    } catch (err) {
      console.warn('[PerfectPlanner] AI generation failed, using mock:', err);
    }
  }

  return { result: getMockSalesPlan(productName, usp, strongOffer), isMock: true };
}

// ─── Mock 데이터 ───

function getMockSalesPlan(
  productName: string,
  usp: string,
  strongOffer: string,
): PerfectPlannerResult['output'] {
  return {
    landingPage: {
      headline: `${productName}, 이제 바꿀 때가 됐어요`,
      subheadline: `${usp || '당신이 찾던 바로 그 제품'}이 여기 있어요`,
      problemSection: {
        title: '이런 고민 있으세요?',
        painPoints: [
          '좋은 제품을 찾느라 시간을 많이 쓰고 있어요',
          '비싼 돈을 내고도 만족하지 못했어요',
          '진짜 효과 있는 제품인지 믿기 어려워요',
        ],
      },
      features: [
        {
          title: '차별화된 품질',
          description: `${usp || '다른 제품과 다른 특별한 점'}이 있어요`,
          benefit: '더 이상 여러 제품을 비교하지 않아도 돼요',
        },
        {
          title: '검증된 효과',
          description: '실제 사용자들이 인정한 만족도예요',
          benefit: '안심하고 선택할 수 있어요',
        },
        {
          title: '합리적인 가격',
          description: '좋은 품질을 부담 없는 가격에 제공해요',
          benefit: '가격 때문에 고민할 필요 없어요',
        },
      ],
      trustSignals: [
        { type: 'review', content: '"써보고 깜짝 놀랐어요! 주변에 다 추천하고 있어요" - 김○○님' },
        { type: 'stats', content: '구매 고객 만족도 95%, 재구매율 78%' },
        { type: 'certification', content: '한국 소비자 만족지수 1위 (2024)' },
      ],
      closingCTA: {
        mainCopy: `지금 ${productName}을 만나보세요`,
        buttonText: `${strongOffer || '특별 할인가'} 확인하기`,
        urgency: '이번 주까지만 이 가격! 한정 수량 200개',
      },
      checklist: [
        '메인 사진이 제품의 장점을 잘 보여주나요?',
        '고객 후기 사진을 3개 이상 넣었나요?',
        '배송/교환/반품 정보를 쉽게 찾을 수 있나요?',
        '가격과 할인 정보가 눈에 잘 보이나요?',
        '모바일에서도 글자가 잘 읽히나요?',
      ],
    },
    liveCommerce: {
      opening: {
        greeting: `안녕하세요 여러분! 오늘은 정말 특별한 제품을 가져왔어요!`,
        hook: `이거 보시면 바로 "이거다!" 하실 거예요. 진짜 대박이에요!`,
        todaysOffer: `${strongOffer || '오늘 방송에서만 특별 할인'} + 추가 사은품까지!`,
      },
      demoPoints: [
        {
          timestamp: '0-1분',
          action: '제품 박스 개봉, 첫인상 보여주기',
          talkingPoint: '패키지부터 다르죠? 이게 바로 프리미엄이에요!',
        },
        {
          timestamp: '1-3분',
          action: '제품 주요 기능 시연',
          talkingPoint: `${usp || '이 제품만의 특별한 점'}을 직접 보여드릴게요!`,
        },
        {
          timestamp: '3-5분',
          action: '비교 시연 (전/후 또는 타 제품과)',
          talkingPoint: '다른 제품이랑 비교해볼게요. 차이가 바로 느껴지시죠?',
        },
        {
          timestamp: '5-7분',
          action: '사용 팁 + 활용법 소개',
          talkingPoint: '이렇게 쓰면 효과가 2배! 꿀팁 알려드릴게요!',
        },
      ],
      qnaHandling: [
        {
          commonQuestion: '배송은 얼마나 걸려요?',
          answer: '주문 후 1-2일 안에 출발해요! 대부분 3일 이내에 받으실 수 있어요.',
        },
        {
          commonQuestion: '환불이 가능한가요?',
          answer: '네! 받으시고 7일 이내에 무조건 환불 가능해요. 걱정 마세요!',
        },
        {
          commonQuestion: '다른 제품이랑 뭐가 달라요?',
          answer: `${usp || '우리 제품만의 특별한 차별점'}이 가장 큰 차이예요!`,
        },
      ],
      closing: {
        finalOffer: '마지막으로 한번 더! 오늘 이 가격은 방송 끝나면 없어요!',
        urgencyTactic: '지금 남은 수량이 50개밖에 없어요! 품절되면 다음 방송까지 기다려야 해요!',
        farewell: '오늘도 시청해주셔서 감사해요! 좋은 제품으로 또 만나요!',
      },
      checklist: [
        '조명과 카메라 각도를 미리 확인했나요?',
        '시연용 제품과 비교 제품을 준비했나요?',
        '특별 할인 가격과 수량을 정확히 알고 있나요?',
        '예상 질문 답변을 연습했나요?',
        '마이크 테스트와 인터넷 연결을 확인했나요?',
      ],
    },
    salesLogic: `${productName}의 차별점을 AIDA 공식으로 상세페이지에 담고, 라이브커머스에서는 직접 시연하며 실시간 소통으로 신뢰를 높여요. 두 채널을 함께 활용하면 효과가 2배예요!`,
  };
}
