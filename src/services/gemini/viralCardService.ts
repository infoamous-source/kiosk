import { generateText, isGeminiEnabled, getStoredApiKey } from './geminiClient';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ViralCardSlide, ViralCardResult, ViralTone, ImageStyle } from '../../types/school';

// ─── JSON 파싱 헬퍼 ───

function extractJSON(text: string): string {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  return text;
}

// ─── 이미지 스타일 프리픽스 ───

const IMAGE_STYLE_PREFIX: Record<ImageStyle, string> = {
  illustration: 'cute colorful digital illustration, kawaii style, soft gradients, pastel colors',
  realistic: 'professional product photography, high quality, studio lighting, clean background',
  minimal: 'clean minimalist design, flat colors, simple shapes, white space, geometric',
  popart: 'bold pop art style, bright saturated colors, comic-like, retro halftone dots',
};

// ─── Step 1: 카피 생성 ───

export async function generateViralCards(
  productName: string,
  targetPersona: string,
  usp: string,
  tone: ViralTone,
  imageStyle: ImageStyle,
): Promise<{ result: ViralCardResult['output']; isMock: boolean }> {
  if (isGeminiEnabled()) {
    try {
      const toneGuide: Record<ViralTone, string> = {
        spicy: '반말 + 도발적인 문체. "이거 모르면 손해!", "아직도 이렇게 해?" 같은 자극적인 표현을 써요.',
        emotional: '존댓말 + 따뜻한 공감. "당신을 위해 만들었어요", "힘들었죠?" 같은 감성적인 표현을 써요.',
        informative: '존댓말 + 객관적인 데이터. "3가지 선택 기준", "전문가가 추천하는" 같은 정보성 표현을 써요.',
      };

      const prompt = `당신은 한국 SNS 마케팅 전문가예요. 인스타그램 카드뉴스를 만들어주세요.

상품/브랜드: ${productName}
타겟 고객: ${targetPersona}
차별점(USP): ${usp}
톤: ${toneGuide[tone]}

바이럴 카드뉴스 4단 공식으로 만들어주세요:
1. HOOK (관심 끌기) - 스크롤을 멈추게 하는 첫 문장
2. EMPATHY (공감하기) - 고객의 고민/문제에 공감
3. SOLUTION (해결책) - 우리 제품이 해결할 수 있는 방법
4. ACTION (행동 유도) - 지금 바로 하라는 마무리

다음 JSON 형식으로 정확히 응답하세요 (다른 텍스트 없이 JSON만):
{
  "slides": [
    {
      "step": "hook",
      "stepLabel": "HOOK",
      "copyText": "카드뉴스 카피 (2-3줄, 짧고 임팩트 있게)",
      "imagePrompt": "영어 이미지 프롬프트 (제품 관련 시각적 장면, 텍스트 없이)",
      "colorScheme": { "primary": "#HEX", "secondary": "#HEX", "gradient": "linear-gradient(135deg, #HEX 0%, #HEX 100%)" },
      "designTip": "이 카드를 디자인할 때 팁"
    },
    {
      "step": "empathy",
      "stepLabel": "EMPATHY",
      "copyText": "...",
      "imagePrompt": "...",
      "colorScheme": { "primary": "#HEX", "secondary": "#HEX", "gradient": "..." },
      "designTip": "..."
    },
    {
      "step": "solution",
      "stepLabel": "SOLUTION",
      "copyText": "...",
      "imagePrompt": "...",
      "colorScheme": { "primary": "#HEX", "secondary": "#HEX", "gradient": "..." },
      "designTip": "..."
    },
    {
      "step": "action",
      "stepLabel": "ACTION",
      "copyText": "...",
      "imagePrompt": "...",
      "colorScheme": { "primary": "#HEX", "secondary": "#HEX", "gradient": "..." },
      "designTip": "..."
    }
  ],
  "overallStrategy": "이 카드뉴스가 효과적인 이유를 1-2문장으로 설명"
}

규칙:
- copyText는 TOPIK 3급 수준 쉬운 한국어
- imagePrompt는 영어로 작성. ${IMAGE_STYLE_PREFIX[imageStyle]} 스타일에 맞게
- imagePrompt에 "NO text, NO letters, NO words" 규칙 포함
- colorScheme은 각 단계 분위기에 맞는 색상
- designTip은 쉬운 한국어로 디자인 조언`;

      const text = await generateText(prompt);
      if (text) {
        const parsed = JSON.parse(extractJSON(text));
        if (parsed.slides && parsed.slides.length === 4 && parsed.overallStrategy) {
          return { result: parsed, isMock: false };
        }
      }
    } catch (err) {
      console.warn('[ViralCard] AI copy generation failed, using mock:', err);
    }
  }

  return { result: getMockViralCards(productName, usp, tone), isMock: true };
}

// ─── Step 2: 이미지 생성 ───

export async function generateSlideImage(
  imagePrompt: string,
  imageStyle: ImageStyle,
): Promise<string | null> {
  const apiKey = getStoredApiKey();
  if (!apiKey) return null;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        // @ts-expect-error Gemini image generation requires responseModalities
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    const fullPrompt = `${IMAGE_STYLE_PREFIX[imageStyle]}, ${imagePrompt}. NO text, NO letters, NO words, NO logos in the image. Leave space in center for text overlay. Square 1:1 aspect ratio.`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (err) {
    console.warn('[ViralCard] Image generation failed:', err);
    return null;
  }
}

export async function generateAllSlideImages(
  slides: ViralCardSlide[],
  imageStyle: ImageStyle,
  onImageReady?: (index: number, base64: string | null) => void,
): Promise<(string | null)[]> {
  const results = await Promise.allSettled(
    slides.map(async (slide, index) => {
      const base64 = await generateSlideImage(slide.imagePrompt, imageStyle);
      onImageReady?.(index, base64);
      return base64;
    }),
  );

  return results.map((r) => (r.status === 'fulfilled' ? r.value : null));
}

// ─── Mock 데이터 ───

function getMockViralCards(
  productName: string,
  usp: string,
  tone: ViralTone,
): ViralCardResult['output'] {
  const toneMap: Record<ViralTone, { slides: Omit<ViralCardSlide, 'imageBase64'>[]; strategy: string }> = {
    spicy: {
      slides: [
        {
          step: 'hook',
          stepLabel: 'HOOK',
          copyText: `아직도 ${productName} 안 써봤어?\n이거 모르면 진짜 손해야!`,
          imagePrompt: `eye-catching product showcase of ${productName}, dramatic lighting, attention-grabbing`,
          colorScheme: { primary: '#FF4757', secondary: '#FF6B81', gradient: 'linear-gradient(135deg, #FF4757 0%, #FF6B81 100%)' },
          designTip: '강렬한 빨간색 배경에 큰 글씨로 시선을 확 끌어요',
        },
        {
          step: 'empathy',
          stepLabel: 'EMPATHY',
          copyText: '맨날 비싼 돈 주고 사놓고\n효과도 없고 후회만 했지?',
          imagePrompt: `frustrated person looking at disappointing products, emotional scene`,
          colorScheme: { primary: '#5F27CD', secondary: '#A55EEA', gradient: 'linear-gradient(135deg, #5F27CD 0%, #A55EEA 100%)' },
          designTip: '보라색 톤으로 공감가는 감정을 표현해요',
        },
        {
          step: 'solution',
          stepLabel: 'SOLUTION',
          copyText: `${usp || '다른 제품과는 차원이 다른'}\n이게 진짜 답이야!`,
          imagePrompt: `amazing product transformation, before and after, impressive results`,
          colorScheme: { primary: '#0ABF53', secondary: '#2ECC71', gradient: 'linear-gradient(135deg, #0ABF53 0%, #2ECC71 100%)' },
          designTip: '초록색으로 해결 느낌을 주고 제품 사진을 넣어요',
        },
        {
          step: 'action',
          stepLabel: 'ACTION',
          copyText: '지금 안 사면 후회할 걸?\n링크 눌러서 바로 확인해!',
          imagePrompt: `call to action, pointing arrow, exciting offer, urgency`,
          colorScheme: { primary: '#FF9F43', secondary: '#FECA57', gradient: 'linear-gradient(135deg, #FF9F43 0%, #FECA57 100%)' },
          designTip: '주황색+노란색으로 긴급한 느낌을 줘요',
        },
      ],
      strategy: `자극적인 톤으로 호기심을 유발하고, "${productName}"의 차별점을 강하게 어필하는 전략이에요.`,
    },
    emotional: {
      slides: [
        {
          step: 'hook',
          stepLabel: 'HOOK',
          copyText: `매일 열심히 사는 당신을 위해\n${productName}을 준비했어요`,
          imagePrompt: `warm cozy scene, soft lighting, comforting atmosphere, gentle mood`,
          colorScheme: { primary: '#E84393', secondary: '#FD79A8', gradient: 'linear-gradient(135deg, #E84393 0%, #FD79A8 100%)' },
          designTip: '따뜻한 핑크톤으로 부드러운 첫인상을 줘요',
        },
        {
          step: 'empathy',
          stepLabel: 'EMPATHY',
          copyText: '좋은 제품을 찾느라\n고민 많으셨죠?\n그 마음 잘 알아요',
          imagePrompt: `person thoughtfully choosing products, gentle expression, relatable moment`,
          colorScheme: { primary: '#6C5CE7', secondary: '#A29BFE', gradient: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)' },
          designTip: '부드러운 보라색으로 이해하는 마음을 표현해요',
        },
        {
          step: 'solution',
          stepLabel: 'SOLUTION',
          copyText: `${usp || '정성을 담아 만든'}\n당신의 고민을\n이제 해결해드릴게요`,
          imagePrompt: `heartwarming product presentation, gift-like, caring atmosphere`,
          colorScheme: { primary: '#00B894', secondary: '#55EFC4', gradient: 'linear-gradient(135deg, #00B894 0%, #55EFC4 100%)' },
          designTip: '민트색으로 안심과 신뢰 느낌을 줘요',
        },
        {
          step: 'action',
          stepLabel: 'ACTION',
          copyText: '오늘부터 시작해보세요\n당신은 이런 좋은 것을\n받을 자격이 있어요',
          imagePrompt: `person smiling with product, happy satisfied moment, warm ending`,
          colorScheme: { primary: '#FDCB6E', secondary: '#F9CA24', gradient: 'linear-gradient(135deg, #FDCB6E 0%, #F9CA24 100%)' },
          designTip: '따뜻한 노란색으로 긍정적인 마무리를 해요',
        },
      ],
      strategy: `감성적인 톤으로 고객의 마음을 움직이고, "${productName}"이 당신을 위한 선물 같은 존재라는 느낌을 줘요.`,
    },
    informative: {
      slides: [
        {
          step: 'hook',
          stepLabel: 'HOOK',
          copyText: `${productName} 선택 전\n꼭 알아야 할 3가지`,
          imagePrompt: `professional infographic style, data chart, clean information layout`,
          colorScheme: { primary: '#0984E3', secondary: '#74B9FF', gradient: 'linear-gradient(135deg, #0984E3 0%, #74B9FF 100%)' },
          designTip: '파란색으로 신뢰감 있는 정보 느낌을 줘요',
        },
        {
          step: 'empathy',
          stepLabel: 'EMPATHY',
          copyText: '전문가 조사 결과\n소비자 78%가\n같은 고민을 하고 있어요',
          imagePrompt: `survey results, statistics visualization, research data, professional`,
          colorScheme: { primary: '#636E72', secondary: '#B2BEC3', gradient: 'linear-gradient(135deg, #636E72 0%, #B2BEC3 100%)' },
          designTip: '차분한 회색으로 객관적인 데이터 느낌을 줘요',
        },
        {
          step: 'solution',
          stepLabel: 'SOLUTION',
          copyText: `${usp || '검증된 품질과 합리적 가격'}\n만족도 95% 이상\n재구매율 Top 3`,
          imagePrompt: `product comparison chart, quality certification, award badge`,
          colorScheme: { primary: '#00CEC9', secondary: '#81ECEC', gradient: 'linear-gradient(135deg, #00CEC9 0%, #81ECEC 100%)' },
          designTip: '청록색으로 데이터 기반 신뢰감을 줘요',
        },
        {
          step: 'action',
          stepLabel: 'ACTION',
          copyText: '지금 프로필 링크에서\n상세 정보를 확인하세요\n첫 구매 혜택도 있어요',
          imagePrompt: `clean call to action, professional button design, special offer badge`,
          colorScheme: { primary: '#6C5CE7', secondary: '#A29BFE', gradient: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)' },
          designTip: '보라색 포인트로 깔끔한 CTA를 만들어요',
        },
      ],
      strategy: `객관적인 데이터와 정보로 "${productName}"의 신뢰도를 높이는 전략이에요.`,
    },
  };

  return {
    slides: toneMap[tone].slides,
    overallStrategy: toneMap[tone].strategy,
  };
}
