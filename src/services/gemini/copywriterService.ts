import { generateText, isGeminiEnabled } from './geminiClient';
import { getMockCopyOptions } from '../../data/marketing/mockCopyOptions';
import type { CopywriterInput, CopywriterOutput } from '../../types/marketing';

/**
 * AI 카피라이터 서비스
 * Gemini API 사용 가능하면 AI 생성, 아니면 Mock 데이터 반환
 */
export async function generateCopy(input: CopywriterInput): Promise<CopywriterOutput> {
  // API 키가 있으면 Gemini 시도
  if (isGeminiEnabled()) {
    try {
      const toneMap = {
        emotional: '감성적이고 따뜻한',
        fun: '재미있고 위트있는',
        serious: '전문적이고 신뢰감 있는',
      };

      const prompt = `당신은 한국 마케팅 카피라이터입니다.
다음 조건에 맞는 광고 카피를 정확히 3개 만들어주세요.

상품/서비스: ${input.productName}
타겟 고객: ${input.target}
분위기: ${toneMap[input.tone]}

조건:
- 한국어로 작성
- 각 카피는 1~2문장
- 한국 문화와 트렌드를 반영
- TOPIK 3급 수준의 쉬운 한국어
- 각 카피를 줄바꿈으로 구분

카피 3개를 번호 없이 줄바꿈으로만 구분하여 출력하세요:`;

      const result = await generateText(prompt);
      if (result) {
        const copies = result
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 5)
          .slice(0, 3);

        if (copies.length >= 2) {
          return { copies, isMockData: false };
        }
      }
    } catch (err) {
      console.warn('[CopywriterService] AI generation failed, using mock:', err);
    }
  }

  // Mock 데이터 폴백
  const mockCopies = getMockCopyOptions(input.tone, input.productName);
  return { copies: mockCopies, isMockData: true };
}
