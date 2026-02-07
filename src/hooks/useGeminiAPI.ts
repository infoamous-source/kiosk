import { useState, useCallback } from 'react';

interface UseGeminiAPIReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Gemini API 호출용 범용 훅
 * 로딩/에러 상태를 자동 관리
 */
export function useGeminiAPI<T>(
  apiFn: (...args: unknown[]) => Promise<T>
): UseGeminiAPIReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: unknown[]): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했어요';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}
