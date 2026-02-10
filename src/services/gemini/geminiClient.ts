import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY_STORAGE = 'kiosk-gemini-api-key';
const CONNECTED_STORAGE = 'kiosk-gemini-connected';

/**
 * Gemini API 클라이언트
 * localStorage에 저장된 사용자 키를 사용
 */

export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(API_KEY_STORAGE);
  } catch {
    return null;
  }
}

export function isGeminiEnabled(): boolean {
  try {
    return localStorage.getItem(CONNECTED_STORAGE) === 'true' && !!getStoredApiKey();
  } catch {
    return false;
  }
}

export function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = getStoredApiKey();
  if (!apiKey) return null;

  try {
    return new GoogleGenerativeAI(apiKey);
  } catch {
    return null;
  }
}

export function getGeminiModel(modelName: string = 'gemini-2.0-flash') {
  const client = getGeminiClient();
  if (!client) return null;

  try {
    return client.getGenerativeModel({ model: modelName });
  } catch {
    return null;
  }
}

/**
 * Gemini API로 텍스트 생성
 * 실패 시 null 반환 (호출부에서 Mock 폴백 처리)
 */
export async function generateText(prompt: string): Promise<string | null> {
  const model = getGeminiModel();
  if (!model) {
    return null;
  }

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (err) {
    console.error('[Gemini] Text generation FAILED:', err);
    return null;
  }
}
