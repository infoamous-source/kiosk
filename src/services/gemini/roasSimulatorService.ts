import { generateText, isGeminiEnabled } from './geminiClient';
import type { ROASSimulationInput, ROASSimulationOutput } from '../../types/school';

// ─── JSON 파싱 헬퍼 ───

function extractJSON(text: string): string {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  return text;
}

// ─── 채널별 벤치마크 ───

const CHANNEL_BENCHMARKS: Record<ROASSimulationInput['adChannel'], {
  ctrRange: [number, number];
  cvrRange: [number, number];
  cpcRange: [number, number];
}> = {
  instagram: { ctrRange: [0.8, 2.0], cvrRange: [1.0, 3.0], cpcRange: [200, 500] },
  naver: { ctrRange: [1.0, 3.0], cvrRange: [2.0, 5.0], cpcRange: [150, 400] },
  kakao: { ctrRange: [0.5, 1.5], cvrRange: [1.0, 2.0], cpcRange: [100, 300] },
  youtube: { ctrRange: [0.3, 1.0], cvrRange: [0.5, 2.0], cpcRange: [300, 800] },
};

// ─── ROAS 시뮬레이션 ───

export async function simulateROAS(
  input: ROASSimulationInput,
  contextData?: { usp?: string; brandMood?: string },
): Promise<{ result: ROASSimulationOutput; isMock: boolean }> {
  if (isGeminiEnabled()) {
    try {
      const channelNames: Record<string, string> = {
        instagram: '인스타그램',
        naver: '네이버',
        kakao: '카카오톡',
        youtube: '유튜브',
      };

      const benchmarks = CHANNEL_BENCHMARKS[input.adChannel];

      const prompt = `당신은 한국 디지털 광고 성과 분석 전문가예요.
다음 정보를 바탕으로 광고 성과를 시뮬레이션해주세요.

상품: ${input.productName}
상품 가격: ${input.productPrice.toLocaleString()}원
광고 예산: ${input.adBudget.toLocaleString()}원
광고 채널: ${channelNames[input.adChannel]}
타겟 연령: ${input.targetAge}
광고 기간: ${input.duration}일
${contextData?.usp ? `차별점(USP): ${contextData.usp}` : ''}
${contextData?.brandMood ? `브랜드 무드: ${contextData.brandMood}` : ''}

참고 벤치마크 (${channelNames[input.adChannel]}):
- CTR: ${benchmarks.ctrRange[0]}~${benchmarks.ctrRange[1]}%
- CVR: ${benchmarks.cvrRange[0]}~${benchmarks.cvrRange[1]}%
- CPC: ${benchmarks.cpcRange[0]}~${benchmarks.cpcRange[1]}원

다음 JSON 형식으로 정확히 응답하세요 (다른 텍스트 없이 JSON만):
{
  "estimatedImpressions": 숫자,
  "estimatedClicks": 숫자,
  "estimatedCTR": 숫자(소수점1자리%),
  "estimatedConversions": 숫자,
  "estimatedCVR": 숫자(소수점1자리%),
  "estimatedRevenue": 숫자,
  "estimatedROAS": 숫자(소수점1자리),
  "costPerClick": 숫자,
  "costPerConversion": 숫자,
  "roasGrade": "excellent" 또는 "good" 또는 "average" 또는 "poor",
  "advice": ["조언1", "조언2", "조언3"],
  "channelTip": "이 채널에서 효과적으로 광고하는 팁"
}

규칙:
- 현실적인 한국 시장 기준으로 계산
- ROAS 등급: 3.0+ = excellent, 2.0+ = good, 1.0+ = average, 1.0 미만 = poor
- 조언은 실전에서 바로 적용 가능한 구체적인 팁
- 모든 텍스트는 TOPIK 3급 수준 쉬운 한국어 (~해요 체)
- estimatedRevenue = estimatedConversions × 상품가격
- estimatedROAS = estimatedRevenue / 광고예산`;

      const text = await generateText(prompt);
      if (text) {
        const parsed = JSON.parse(extractJSON(text));
        if (parsed.estimatedROAS !== undefined && parsed.advice) {
          return { result: parsed, isMock: false };
        }
      }
    } catch (err) {
      console.error('[ROASSimulator] AI simulation FAILED, falling back to mock:', err);
    }
  } else {
    console.warn('[ROASSimulator] Gemini not enabled.');
  }

  return { result: getMockROASSimulation(input), isMock: true };
}

// ─── Mock 시뮬레이션 ───

function getMockROASSimulation(input: ROASSimulationInput): ROASSimulationOutput {
  const bench = CHANNEL_BENCHMARKS[input.adChannel];

  // 벤치마크 중간값으로 계산
  const ctr = (bench.ctrRange[0] + bench.ctrRange[1]) / 2;
  const cvr = (bench.cvrRange[0] + bench.cvrRange[1]) / 2;
  const cpc = (bench.cpcRange[0] + bench.cpcRange[1]) / 2;

  const estimatedClicks = Math.round(input.adBudget / cpc);
  const estimatedImpressions = Math.round(estimatedClicks / (ctr / 100));
  const estimatedConversions = Math.round(estimatedClicks * (cvr / 100));
  const estimatedRevenue = estimatedConversions * input.productPrice;
  const estimatedROAS = Number((estimatedRevenue / input.adBudget).toFixed(1));
  const costPerConversion = estimatedConversions > 0
    ? Math.round(input.adBudget / estimatedConversions)
    : 0;

  let roasGrade: ROASSimulationOutput['roasGrade'];
  if (estimatedROAS >= 3.0) roasGrade = 'excellent';
  else if (estimatedROAS >= 2.0) roasGrade = 'good';
  else if (estimatedROAS >= 1.0) roasGrade = 'average';
  else roasGrade = 'poor';

  const channelTips: Record<string, string> = {
    instagram: '인스타그램에서는 사진과 릴스(짧은 영상)가 가장 효과가 좋아요. 해시태그를 10-15개 정도 붙이고, 스토리 광고도 함께 활용해보세요!',
    naver: '네이버에서는 검색 광고가 효과가 좋아요. 핵심 키워드를 잘 선택하고, 파워링크와 쇼핑검색 광고를 함께 사용해보세요!',
    kakao: '카카오톡에서는 타겟 메시지가 중요해요. 고객의 나이, 관심사에 맞는 메시지를 보내고, 쿠폰을 함께 넣으면 효과가 좋아요!',
    youtube: '유튜브에서는 처음 5초가 승부예요! 짧고 강렬한 영상으로 시작하고, 스킵할 수 없는 6초 범퍼 광고도 시도해보세요!',
  };

  const adviceMap: Record<string, string[]> = {
    instagram: [
      '스토리 광고를 추가하면 노출이 더 늘어날 수 있어요',
      '해시태그를 전략적으로 10-15개 사용해보세요',
      '릴스(짧은 영상) 콘텐츠가 요즘 가장 인기가 많아요',
    ],
    naver: [
      '핵심 키워드 외에 연관 키워드도 추가해보세요',
      '쇼핑검색 광고를 함께 사용하면 전환율이 올라갈 수 있어요',
      '블로그 체험단을 병행하면 신뢰도가 높아져요',
    ],
    kakao: [
      '타겟 연령을 더 좁히면 효율이 올라갈 수 있어요',
      '할인 쿠폰을 메시지에 넣으면 클릭률이 올라가요',
      '카카오 비즈보드 광고도 함께 시도해보세요',
    ],
    youtube: [
      '영상 처음 5초에 핵심 메시지를 넣어야 해요',
      '6초 범퍼 광고로 브랜드 인지도를 높여보세요',
      '자막을 꼭 넣어야 소리 없이 보는 사람도 이해할 수 있어요',
    ],
  };

  return {
    estimatedImpressions,
    estimatedClicks,
    estimatedCTR: Number(ctr.toFixed(1)),
    estimatedConversions,
    estimatedCVR: Number(cvr.toFixed(1)),
    estimatedRevenue,
    estimatedROAS,
    costPerClick: Math.round(cpc),
    costPerConversion,
    roasGrade,
    advice: adviceMap[input.adChannel],
    channelTip: channelTips[input.adChannel],
  };
}
