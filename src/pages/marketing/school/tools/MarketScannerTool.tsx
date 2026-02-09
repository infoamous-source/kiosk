import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Radar, Search, Copy, Check, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { earnStamp, hasStamp, getMarketScannerResult, saveMarketScannerResult } from '../../../../utils/schoolStorage';
import { generateMarketAnalysis } from '../../../../services/gemini/marketCompassService';
import type { MarketScannerResult } from '../../../../types/school';

type Phase = 'input' | 'loading' | 'result';

const AGE_OPTIONS = ['10s', '20s', '30s', '40s', '50plus'] as const;
const GENDER_OPTIONS = ['female', 'male', 'all'] as const;

export default function MarketScannerTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user } = useAuth();
  const completed = user ? hasStamp(user.id, 'market-scanner') : false;

  const [phase, setPhase] = useState<Phase>('input');
  const [keyword, setKeyword] = useState('');
  const [targetAge, setTargetAge] = useState<string>('20s');
  const [targetGender, setTargetGender] = useState<string>('all');
  const [result, setResult] = useState<MarketScannerResult | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedCompetitor, setExpandedCompetitor] = useState<number | null>(0);
  const [hasPreviousResult, setHasPreviousResult] = useState(false);

  // 이전 결과 확인
  useEffect(() => {
    if (user) {
      const prev = getMarketScannerResult(user.id);
      if (prev) {
        setHasPreviousResult(true);
      }
    }
  }, [user]);

  const loadPreviousResult = useCallback(() => {
    if (!user) return;
    const prev = getMarketScannerResult(user.id);
    if (prev) {
      setResult(prev);
      setKeyword(prev.input.itemKeyword);
      setTargetAge(prev.input.targetAge);
      setTargetGender(prev.input.targetGender);
      setPhase('result');
    }
  }, [user]);

  const handleAnalyze = async () => {
    if (!keyword.trim()) return;

    setPhase('loading');
    setLoadingStep(0);

    // 로딩 스텝 애니메이션
    const timer1 = setTimeout(() => setLoadingStep(1), 1200);
    const timer2 = setTimeout(() => setLoadingStep(2), 2400);

    try {
      const { result: output, isMock: mock } = await generateMarketAnalysis(keyword, targetAge, targetGender);

      // 최소 3초 대기
      await new Promise((resolve) => setTimeout(resolve, 3500));

      const scannerResult: MarketScannerResult = {
        completedAt: new Date().toISOString(),
        input: { itemKeyword: keyword, targetAge, targetGender },
        output,
      };

      setResult(scannerResult);
      setIsMock(mock);

      // 저장
      if (user) {
        saveMarketScannerResult(user.id, scannerResult);
      }

      setPhase('result');
    } catch {
      setPhase('input');
    }

    clearTimeout(timer1);
    clearTimeout(timer2);
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // 복사 실패 무시
    }
  };

  const handleComplete = () => {
    if (user && !completed) {
      earnStamp(user.id, 'market-scanner');
    }
    navigate('/marketing/school/tools/edge-maker');
  };

  const handleReanalyze = () => {
    setResult(null);
    setPhase('input');
    setHasPreviousResult(false);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => handleCopy(text, field)}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
    >
      {copiedField === field ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-500">{t('school.marketCompass.scanner.result.copied')}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{t('school.marketCompass.scanner.result.copy')}</span>
        </>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {t('school.marketCompass.scanner.headerBadge')}
            </span>
            <h1 className="font-bold text-gray-800">{t('school.marketCompass.scanner.title')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Hero */}
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-3 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Radar className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t('school.marketCompass.scanner.hero')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('school.marketCompass.scanner.heroSub')}</p>
        </div>

        {/* ─── INPUT PHASE ─── */}
        {phase === 'input' && (
          <div className="space-y-4">
            {/* 이전 결과 배너 */}
            {hasPreviousResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700 font-medium">{t('school.marketCompass.scanner.previousResult')}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={loadPreviousResult}
                    className="flex-1 py-2 text-sm bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    {t('school.marketCompass.scanner.viewPrevious')}
                  </button>
                  <button
                    onClick={() => setHasPreviousResult(false)}
                    className="flex-1 py-2 text-sm bg-white text-blue-600 border border-blue-300 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    {t('school.marketCompass.scanner.startNew')}
                  </button>
                </div>
              </div>
            )}

            {/* 입력 폼 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <h3 className="font-semibold text-gray-800">{t('school.marketCompass.scanner.inputTitle')}</h3>

              {/* 키워드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('school.marketCompass.scanner.keyword')}
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={t('school.marketCompass.scanner.keywordPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={50}
                />
              </div>

              {/* 타겟 연령 + 성별 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('school.marketCompass.scanner.targetAge')}
                  </label>
                  <select
                    value={targetAge}
                    onChange={(e) => setTargetAge(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {AGE_OPTIONS.map((age) => (
                      <option key={age} value={age}>
                        {t(`school.marketCompass.scanner.ages.${age}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('school.marketCompass.scanner.targetGender')}
                  </label>
                  <select
                    value={targetGender}
                    onChange={(e) => setTargetGender(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {t(`school.marketCompass.scanner.genders.${g}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 분석 버튼 */}
              <button
                onClick={handleAnalyze}
                disabled={!keyword.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                {t('school.marketCompass.scanner.analyzeButton')}
              </button>
            </div>
          </div>
        )}

        {/* ─── LOADING PHASE ─── */}
        {phase === 'loading' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <Radar className="w-16 h-16 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="space-y-3">
              {[0, 1, 2].map((step) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-500 ${
                    loadingStep >= step ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors ${loadingStep >= step ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <span className="text-sm font-medium">
                    {t(`school.marketCompass.scanner.loading.step${step + 1}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── RESULT PHASE ─── */}
        {phase === 'result' && result && (
          <div className="space-y-4">
            {/* 데이터 유형 배지 */}
            <div className="flex justify-center">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${isMock ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                {isMock ? t('school.marketCompass.scanner.result.mockBadge') : t('school.marketCompass.scanner.result.aiBadge')}
              </span>
            </div>

            {/* 연관 검색어 TOP 5 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-lg">🔍</span>
                  {t('school.marketCompass.scanner.result.keywordsTitle')}
                </h3>
                <CopyButton
                  text={result.output.relatedKeywords.map((k) => `#${k}`).join(' ')}
                  field="keywords"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {result.output.relatedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* 경쟁사 분석 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <span className="text-lg">🏢</span>
                {t('school.marketCompass.scanner.result.competitorsTitle')}
              </h3>
              <div className="space-y-2">
                {result.output.competitors.map((comp, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedCompetitor(expandedCompetitor === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-left">
                        <span className="font-medium text-gray-800">{comp.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{comp.description}</span>
                      </div>
                      {expandedCompetitor === i ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {expandedCompetitor === i && (
                      <div className="px-4 pb-3 space-y-2">
                        <div>
                          <span className="text-xs font-bold text-green-600">
                            ✅ {t('school.marketCompass.scanner.result.strengths')}
                          </span>
                          <ul className="mt-1 space-y-0.5">
                            {comp.strengths.map((s, j) => (
                              <li key={j} className="text-sm text-gray-600 pl-4">• {s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-red-500">
                            ❌ {t('school.marketCompass.scanner.result.weaknesses')}
                          </span>
                          <ul className="mt-1 space-y-0.5">
                            {comp.weaknesses.map((w, j) => (
                              <li key={j} className="text-sm text-gray-600 pl-4">• {w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 고객의 소리 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  {t('school.marketCompass.scanner.result.painPointsTitle')}
                </h3>
                <CopyButton
                  text={result.output.painPoints.join('\n')}
                  field="painPoints"
                />
              </div>
              <div className="space-y-2">
                {result.output.painPoints.map((pain, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-red-50 rounded-xl px-4 py-3"
                  >
                    <span className="text-red-400 text-sm mt-0.5">★</span>
                    <p className="text-sm text-gray-700 leading-relaxed">"{pain}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 다음 단계 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-5">
              <h3 className="font-semibold text-gray-800 text-center mb-3">
                {t('school.marketCompass.scanner.next.title')}
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleComplete}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  {t('school.marketCompass.scanner.next.edgeMakerButton')}
                </button>
                <button
                  onClick={handleReanalyze}
                  className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t('school.marketCompass.scanner.reanalyzeButton')}
                </button>
                <button
                  onClick={() => navigate('/marketing/school/attendance')}
                  className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {t('school.marketCompass.scanner.next.attendanceButton')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
