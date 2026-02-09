import { generateText, isGeminiEnabled } from './geminiClient';
import type { MarketScannerResult, EdgeMakerResult } from '../../types/school';

// ─── JSON 파싱 헬퍼 ───

function extractJSON(text: string): string {
  // ```json ... ``` 블록 제거
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();
  // 순수 JSON인 경우
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  return text;
}

// ─── Market Scanner ───

export async function generateMarketAnalysis(
  keyword: string,
  targetAge: string,
  targetGender: string,
): Promise<{ result: MarketScannerResult['output']; isMock: boolean }> {
  if (isGeminiEnabled()) {
    try {
      const prompt = `당신은 한국 시장 분석 전문가입니다.
다음 정보를 바탕으로 시장 분석을 수행하세요.

상품/키워드: ${keyword}
타겟 연령: ${targetAge}
타겟 성별: ${targetGender}

다음 JSON 형식으로 정확히 응답하세요 (다른 텍스트 없이 JSON만):
{
  "relatedKeywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "competitors": [
    {
      "name": "경쟁사 이름",
      "description": "한 줄 설명",
      "strengths": ["강점1", "강점2"],
      "weaknesses": ["약점1", "약점2"]
    }
  ],
  "painPoints": ["고객 불만1", "고객 불만2", "고객 불만3"]
}

규칙:
- relatedKeywords: 해당 키워드와 연관된 인기 검색어 5개
- competitors: 한국 시장의 실제 또는 가상의 경쟁사 3곳 (각각 강점 2개, 약점 2개)
- painPoints: 해당 상품 카테고리에서 고객들이 자주 하는 불만/리뷰 3개
- 모든 텍스트는 TOPIK 3급 수준의 쉬운 한국어
- 한국 시장 맥락에 맞는 현실적인 분석`;

      const text = await generateText(prompt);
      if (text) {
        const parsed = JSON.parse(extractJSON(text));
        if (parsed.relatedKeywords && parsed.competitors && parsed.painPoints) {
          return { result: parsed, isMock: false };
        }
      }
    } catch (err) {
      console.warn('[MarketCompass] AI market analysis failed, using mock:', err);
    }
  }

  return { result: getMockMarketAnalysis(keyword), isMock: true };
}

// ─── Edge Maker ───

export async function generateBrandingStrategy(
  painPoints: string[],
  myStrengths: string[],
): Promise<{ result: EdgeMakerResult['output']; isMock: boolean }> {
  if (isGeminiEnabled()) {
    try {
      const prompt = `당신은 한국 브랜딩 전략 전문가입니다.
경쟁사의 약점과 나의 강점을 바탕으로 브랜딩 전략을 수립하세요.

경쟁사 약점 (고객 불만):
${painPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

나의 강점:
${myStrengths.length > 0 ? myStrengths.map((s, i) => `${i + 1}. ${s}`).join('\n') : '(미입력 - 일반적 강점으로 추론)'}

다음 JSON 형식으로 정확히 응답하세요 (다른 텍스트 없이 JSON만):
{
  "usp": "핵심 가치 제안 (1~2문장)",
  "brandNames": [
    { "name": "감성적 브랜드명", "type": "emotional", "reasoning": "이유" },
    { "name": "직관적 브랜드명", "type": "intuitive", "reasoning": "이유" },
    { "name": "재미있는 브랜드명", "type": "fun", "reasoning": "이유" }
  ],
  "slogan": "브랜드 슬로건 (한 줄)",
  "brandMood": {
    "primaryColor": "#HEX코드",
    "secondaryColor": "#HEX코드",
    "tone": "톤 & 매너 설명",
    "keywords": ["키워드1", "키워드2", "키워드3"]
  }
}

규칙:
- USP는 경쟁사 약점을 해결하는 나의 차별점을 한 문장으로
- 브랜드명은 한국어로, 감성형/직관형/재미형 각 1개씩
- 슬로건은 기억에 남는 짧은 문장
- 브랜드 무드는 상품 컨셉에 맞는 컬러와 톤
- TOPIK 3급 수준의 쉬운 한국어`;

      const text = await generateText(prompt);
      if (text) {
        const parsed = JSON.parse(extractJSON(text));
        if (parsed.usp && parsed.brandNames && parsed.slogan && parsed.brandMood) {
          return { result: parsed, isMock: false };
        }
      }
    } catch (err) {
      console.warn('[MarketCompass] AI branding failed, using mock:', err);
    }
  }

  return { result: getMockBrandingStrategy(painPoints), isMock: true };
}

// ─── Mock 데이터 ───

function getMockMarketAnalysis(keyword: string): MarketScannerResult['output'] {
  const lower = keyword.toLowerCase();

  // 카테고리별 Mock 데이터
  if (lower.includes('만두') || lower.includes('음식') || lower.includes('식품') || lower.includes('비건')) {
    return {
      relatedKeywords: ['건강식', '다이어트 식품', '비건 간식', '냉동식품', '한끼 대용'],
      competitors: [
        {
          name: '비비고',
          description: '한국 대표 냉동 만두 브랜드',
          strengths: ['높은 브랜드 인지도', '전국 유통망'],
          weaknesses: ['비건 라인업 부족', '프리미엄 가격대'],
        },
        {
          name: '풀무원',
          description: '건강식 전문 식품 기업',
          strengths: ['건강한 이미지', '다양한 제품 라인업'],
          weaknesses: ['맛에 대한 불만 많음', '가격 대비 양 부족'],
        },
        {
          name: '마켓컬리 PB',
          description: '프리미엄 식품 PB 브랜드',
          strengths: ['새벽배송 서비스', '트렌디한 이미지'],
          weaknesses: ['접근성 낮음', '재구매율 불안정'],
        },
      ],
      painPoints: [
        '맛이 밍밍하고 식감이 별로예요',
        '가격이 너무 비싸서 자주 못 사요',
        '성분표를 보면 첨가물이 많아 걱정돼요',
      ],
    };
  }

  if (lower.includes('화장품') || lower.includes('뷰티') || lower.includes('스킨') || lower.includes('비누')) {
    return {
      relatedKeywords: ['자연주의 화장품', '비건 뷰티', '민감 피부', '수제 비누', '클린 뷰티'],
      competitors: [
        {
          name: '이니스프리',
          description: '자연주의 화장품 브랜드',
          strengths: ['자연 원료 이미지', '합리적 가격'],
          weaknesses: ['차별화 약화', '해외 브랜드에 밀림'],
        },
        {
          name: '아로마티카',
          description: '비건 뷰티 전문 브랜드',
          strengths: ['비건 인증', '친환경 패키지'],
          weaknesses: ['높은 가격대', '오프라인 매장 부족'],
        },
        {
          name: '올리브영 PB',
          description: '올리브영 자체 브랜드',
          strengths: ['접근성 좋음', '트렌드 반영 빠름'],
          weaknesses: ['브랜드 정체성 약함', '품질 편차 있음'],
        },
      ],
      painPoints: [
        '피부가 예민한데 자극이 심해요',
        '천연 성분이라고 했는데 화학 성분이 많아요',
        '향이 너무 강해서 두통이 와요',
      ],
    };
  }

  // 기본 범용 데이터
  return {
    relatedKeywords: ['트렌드 상품', '인기 아이템', '가성비', 'MZ세대', '온라인 쇼핑'],
    competitors: [
      {
        name: '업계 선두 A사',
        description: '시장 점유율 1위 기업',
        strengths: ['높은 인지도', '안정적인 품질'],
        weaknesses: ['혁신 부족', '고객 소통 부족'],
      },
      {
        name: '신흥 강자 B사',
        description: 'SNS 마케팅으로 급성장한 브랜드',
        strengths: ['트렌디한 이미지', '활발한 SNS 마케팅'],
        weaknesses: ['품질 불안정', '고객 서비스 미흡'],
      },
      {
        name: '가성비 C사',
        description: '저가 전략으로 시장 공략',
        strengths: ['저렴한 가격', '빠른 배송'],
        weaknesses: ['낮은 품질 인식', '브랜드 충성도 낮음'],
      },
    ],
    painPoints: [
      '품질 대비 가격이 너무 비싸요',
      '고객 응대가 느리고 불친절해요',
      '제품 설명과 실물이 달라요',
    ],
  };
}

function getMockBrandingStrategy(painPoints: string[]): EdgeMakerResult['output'] {
  return {
    usp: painPoints.length > 0
      ? `고객이 불만족한 "${painPoints[0]}" 문제를 완벽히 해결하는 유일한 브랜드`
      : '고객의 숨겨진 니즈를 발견하고 최고의 경험을 제공하는 브랜드',
    brandNames: [
      {
        name: '따스한하루',
        type: 'emotional',
        reasoning: '따뜻하고 정성스러운 느낌을 전달하여 고객의 마음을 사로잡는 이름',
      },
      {
        name: '진심담아',
        type: 'intuitive',
        reasoning: '진심을 담은 제품이라는 브랜드 철학을 직관적으로 전달',
      },
      {
        name: '헬로굿즈',
        type: 'fun',
        reasoning: '친근하고 기분 좋은 첫인상을 주는 밝은 느낌의 이름',
      },
    ],
    slogan: '당신의 일상에 작은 행복을 더합니다',
    brandMood: {
      primaryColor: '#FF6B35',
      secondaryColor: '#4ECDC4',
      tone: '밝고 따뜻하며 친근한',
      keywords: ['따뜻함', '신뢰', '신선함'],
    },
  };
}
