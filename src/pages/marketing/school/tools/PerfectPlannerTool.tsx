import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CalendarCheck, Loader2, Sparkles, Copy, Check,
  RefreshCw, ChevronDown, ChevronUp, FileText, Mic, Gem, Key,
} from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  autoStamp, hasStamp, getEdgeMakerResult,
  savePerfectPlannerResult, getPerfectPlannerResult,
} from '../../../../utils/schoolStorage';
import { generateSalesPlan } from '../../../../services/gemini/perfectPlannerService';
import { isGeminiEnabled } from '../../../../services/gemini/geminiClient';
import type { PerfectPlannerResult, PlannerMode } from '../../../../types/school';
import { getMyTeam, addTeamIdea } from '../../../../services/teamService';
import { SimpleMarkdown } from '@/components/common/SimpleMarkdown';

type Phase = 'input' | 'loading' | 'result';

export default function PerfectPlannerTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user } = useAuth();
  const completed = user ? hasStamp(user.id, 'perfect-planner') : false;

  // Phase
  const [phase, setPhase] = useState<Phase>('input');

  // Input
  const [productName, setProductName] = useState('');
  const [coreTarget, setCoreTarget] = useState('');
  const [usp, setUsp] = useState('');
  const [strongOffer, setStrongOffer] = useState('');
  const [showFormula, setShowFormula] = useState(false);
  const [edgeDataLoaded, setEdgeDataLoaded] = useState(false);

  // Loading
  const [loadingStep, setLoadingStep] = useState(0);

  // Result
  const [result, setResult] = useState<PerfectPlannerResult['output'] | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [activeMode, setActiveMode] = useState<PlannerMode>('landing');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [myTeamId, setMyTeamId] = useState<string | null>(null);
  const [savedToTeamBox, setSavedToTeamBox] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiEnabled = isGeminiEnabled();

  // Load team info
  useEffect(() => {
    if (!user) return;
    getMyTeam(user.id).then(info => {
      if (info) setMyTeamId(info.team.id);
    });
  }, [user]);

  // Load previous result or Edge Maker data
  useEffect(() => {
    if (!user) return;

    const prevResult = getPerfectPlannerResult(user.id);
    if (prevResult) {
      setResult(prevResult.output);
      setProductName(prevResult.input.productName);
      setCoreTarget(prevResult.input.coreTarget);
      setUsp(prevResult.input.usp);
      setStrongOffer(prevResult.input.strongOffer);
      setPhase('result');
      return;
    }

    const edgeResult = getEdgeMakerResult(user.id);
    if (edgeResult) {
      const brandName = edgeResult.output.brandNames?.[0]?.name || '';
      if (brandName) setProductName(brandName);
      if (edgeResult.output.usp) setUsp(edgeResult.output.usp);
      setEdgeDataLoaded(true);
    }
  }, [user]);

  // Copy helper
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch { /* noop */ }
  };

  // Generate
  const handleGenerate = async () => {
    if (!productName.trim() || !coreTarget.trim()) return;

    setPhase('loading');
    setLoadingStep(0);
    setAiError(null);

    const steps = [
      { delay: 0 },
      { delay: 1200 },
      { delay: 2400 },
    ];
    steps.forEach(({ delay }, i) => {
      if (i > 0) setTimeout(() => setLoadingStep(i), delay);
    });

    try {
      const { result: planResult, isMock: mock } = await generateSalesPlan(
        productName.trim(),
        coreTarget.trim(),
        usp.trim(),
        strongOffer.trim(),
      );

      await new Promise((r) => setTimeout(r, 3500));

      setResult(planResult);
      setIsMock(mock);
      setPhase('result');
      setCheckedItems({});

      if (mock && aiEnabled) {
        setAiError('AI 응답을 처리하지 못했어요. 예시 데이터를 보여드릴게요.');
      }

      if (user) {
        savePerfectPlannerResult(user.id, {
          completedAt: new Date().toISOString(),
          input: { productName: productName.trim(), coreTarget: coreTarget.trim(), usp: usp.trim(), strongOffer: strongOffer.trim() },
          output: planResult,
        });
        autoStamp(user.id, 'perfect-planner');
      }
    } catch (err) {
      console.error('[PerfectPlanner] Generation failed:', err);
      setPhase('input');
      setAiError('판매 기획서 생성에 실패했어요. 다시 시도해주세요.');
    }
  };

  // Copy all for current mode
  const handleCopyAll = () => {
    if (!result) return;

    if (activeMode === 'landing') {
      const lp = result.landingPage;
      const text = [
        `=== ${t('school.perfectPlanner.landing.title')} ===`,
        '',
        `[${t('school.perfectPlanner.landing.headline')}]`,
        lp.headline,
        lp.subheadline,
        '',
        `[${t('school.perfectPlanner.landing.problem')}]`,
        lp.problemSection.title,
        ...lp.problemSection.painPoints.map((p, i) => `${i + 1}. ${p}`),
        '',
        `[${t('school.perfectPlanner.landing.features')}]`,
        ...lp.features.map((f, i) => `${i + 1}. ${f.title}: ${f.description} → ${f.benefit}`),
        '',
        `[${t('school.perfectPlanner.landing.trust')}]`,
        ...lp.trustSignals.map((ts) => `- ${ts.content}`),
        '',
        `[${t('school.perfectPlanner.landing.cta')}]`,
        lp.closingCTA.mainCopy,
        `${t('school.perfectPlanner.landing.button')}: ${lp.closingCTA.buttonText}`,
        lp.closingCTA.urgency,
      ].join('\n');
      copyToClipboard(text, 'all');
    } else {
      const lc = result.liveCommerce;
      const text = [
        `=== ${t('school.perfectPlanner.live.title')} ===`,
        '',
        `[${t('school.perfectPlanner.live.opening')}]`,
        lc.opening.greeting,
        lc.opening.hook,
        lc.opening.todaysOffer,
        '',
        `[${t('school.perfectPlanner.live.demo')}]`,
        ...lc.demoPoints.map((d) => `[${d.timestamp}] ${d.action} - "${d.talkingPoint}"`),
        '',
        `[${t('school.perfectPlanner.live.qna')}]`,
        ...lc.qnaHandling.map((q) => `Q: ${q.commonQuestion}\nA: ${q.answer}`),
        '',
        `[${t('school.perfectPlanner.live.closing')}]`,
        lc.closing.finalOffer,
        lc.closing.urgencyTactic,
        lc.closing.farewell,
      ].join('\n');
      copyToClipboard(text, 'all');
    }
  };

  const handleSaveToTeamBox = async () => {
    if (!user || !result || !myTeamId) return;
    const title = `📋 ${productName}`;
    const content = [
      `헤드라인: ${result.landingPage.headline}`,
      `서브: ${result.landingPage.subheadline}`,
      `CTA: ${result.landingPage.closingCTA.mainCopy}`,
    ].join('\n');
    await addTeamIdea(myTeamId, user.id, user.name, '📋', 'perfect-planner', title, content);
    setSavedToTeamBox(true);
    setTimeout(() => setSavedToTeamBox(false), 2000);
  };

  const isInputValid = productName.trim().length > 0 && coreTarget.trim().length > 0;

  const loadingSteps = [
    t('school.perfectPlanner.loading.step1'),
    t('school.perfectPlanner.loading.step2'),
    t('school.perfectPlanner.loading.step3'),
  ];

  return (
    <div className="min-h-screen bg-kk-bg">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="뒤로 가기" className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-kk-brown bg-kk-cream px-2 py-0.5 rounded">5{t('school.curriculum.period')}</span>
            <h1 className="font-bold text-kk-brown">{t('school.periods.perfectPlanner.name')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* ─── AI 미연결 안내 ─── */}
        {!aiEnabled && phase !== 'loading' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 text-sm mb-1">AI 비서가 연결되지 않았어요</h3>
                <p className="text-xs text-amber-700 mb-3">API 키를 연결하면 AI가 나만의 판매 기획서를 만들어줘요. 지금은 예시 데이터로 체험할 수 있어요.</p>
                <button onClick={() => navigate('/ai-welcome')} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors">
                  <Key className="w-3.5 h-3.5" /> API 키 연결하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════ INPUT PHASE ══════ */}
        {phase === 'input' && (
          <>
            {/* Hero */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-kk-cream rounded-2xl flex items-center justify-center">
                <CalendarCheck className="w-7 h-7 text-kk-red" />
              </div>
              <h2 className="text-lg font-bold text-kk-brown mb-1">{t('school.perfectPlanner.title')}</h2>
              <p className="text-sm text-gray-500">{t('school.perfectPlanner.subtitle')}</p>
            </div>

            {/* Formula Education */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowFormula(!showFormula)}
                className="w-full px-5 py-3 flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-kk-brown">{t('school.perfectPlanner.formulaTitle')}</span>
                {showFormula ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {showFormula && (
                <div className="px-5 pb-4 space-y-4">
                  {/* AIDA */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-kk-red" />
                      <span className="text-sm font-bold text-gray-700">{t('school.perfectPlanner.formula.aidaTitle')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {['A', 'I', 'D', 'A'].map((letter, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span className="bg-kk-cream text-kk-red font-bold px-1.5 py-0.5 rounded">{letter}</span>
                          {i < 3 && <span className="text-gray-300">&rarr;</span>}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{t('school.perfectPlanner.formula.aidaDesc')}</p>
                  </div>
                  {/* Live */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="w-4 h-4 text-kk-red" />
                      <span className="text-sm font-bold text-gray-700">{t('school.perfectPlanner.formula.liveTitle')}</span>
                    </div>
                    <p className="text-xs text-gray-500">{t('school.perfectPlanner.formula.liveDesc')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Edge Maker Badge */}
            {edgeDataLoaded && (
              <div className="bg-kk-cream border border-kk-warm rounded-xl px-4 py-2 text-xs text-kk-brown font-medium">
                {t('school.perfectPlanner.edgeDataLoaded')}
              </div>
            )}

            {/* Input Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('school.perfectPlanner.input.productName')}</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value.slice(0, 30))}
                  placeholder={t('school.perfectPlanner.input.productNamePlaceholder')}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kk-red"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('school.perfectPlanner.input.coreTarget')}</label>
                <input
                  type="text"
                  value={coreTarget}
                  onChange={(e) => setCoreTarget(e.target.value.slice(0, 80))}
                  placeholder={t('school.perfectPlanner.input.coreTargetPlaceholder')}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kk-red"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('school.perfectPlanner.input.usp')}</label>
                <input
                  type="text"
                  value={usp}
                  onChange={(e) => setUsp(e.target.value.slice(0, 100))}
                  placeholder={t('school.perfectPlanner.input.uspPlaceholder')}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kk-red"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('school.perfectPlanner.input.strongOffer')}</label>
                <input
                  type="text"
                  value={strongOffer}
                  onChange={(e) => setStrongOffer(e.target.value.slice(0, 100))}
                  placeholder={t('school.perfectPlanner.input.strongOfferPlaceholder')}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kk-red"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!isInputValid}
              className="w-full py-3.5 bg-kk-red hover:bg-kk-red-deep text-white font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {t('school.perfectPlanner.generateButton')}
            </button>
          </>
        )}

        {/* ══════ LOADING PHASE ══════ */}
        {phase === 'loading' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-kk-cream rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-kk-red animate-spin" />
            </div>
            <p className="text-sm font-medium text-gray-600">{loadingSteps[loadingStep]}</p>
            <div className="flex justify-center gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i <= loadingStep ? 'bg-kk-red' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        )}

        {/* ══════ RESULT PHASE ══════ */}
        {phase === 'result' && result && (
          <>
            {/* AI/Mock Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isMock ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>
              <Sparkles className="w-3 h-3" />
              {isMock ? t('school.perfectPlanner.mockBadge') : t('school.perfectPlanner.aiBadge')}
            </div>

            {/* AI 실패 안내 + 재시도 */}
            {isMock && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-xs text-amber-700 mb-2">
                  {aiError || (aiEnabled ? 'AI 응답을 가져오지 못해서 예시 데이터를 보여드리고 있어요.' : 'API 키가 연결되지 않아 예시 데이터를 보여드리고 있어요.')}
                </p>
                <div className="flex gap-2">
                  {aiEnabled ? (
                    <button onClick={() => { setResult(null); setPhase('input'); setCheckedItems({}); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors">
                      <RefreshCw className="w-3 h-3" /> AI로 다시 생성하기
                    </button>
                  ) : (
                    <button onClick={() => navigate('/ai-welcome')} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors">
                      <Key className="w-3 h-3" /> API 키 연결하기
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Sales Logic */}
            <div className="bg-kk-cream border border-kk-warm rounded-xl p-4">
              <SimpleMarkdown content={result.salesLogic} className="text-sm text-kk-brown font-medium" />
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMode('landing')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeMode === 'landing'
                    ? 'bg-kk-red text-white'
                    : 'bg-kk-cream text-kk-brown hover:bg-kk-warm'
                }`}
              >
                <FileText className="w-4 h-4" />
                {t('school.perfectPlanner.landing.tab')}
              </button>
              <button
                onClick={() => setActiveMode('liveCommerce')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeMode === 'liveCommerce'
                    ? 'bg-kk-navy text-white'
                    : 'bg-kk-cream text-kk-brown hover:bg-kk-warm'
                }`}
              >
                <Mic className="w-4 h-4" />
                {t('school.perfectPlanner.live.tab')}
              </button>
            </div>

            {/* ─── Landing Page Mode ─── */}
            {activeMode === 'landing' && (
              <div className="space-y-3">
                {/* Headline */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{t('school.perfectPlanner.landing.headline')}</span>
                    <button onClick={() => copyToClipboard(`${result.landingPage.headline}\n${result.landingPage.subheadline}`, 'headline')} className="p-1 hover:bg-gray-100 rounded">
                      {copiedField === 'headline' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{result.landingPage.headline}</p>
                  <p className="text-sm text-gray-500 mt-1">{result.landingPage.subheadline}</p>
                </div>

                {/* Problem */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{t('school.perfectPlanner.landing.problem')}</span>
                    <button onClick={() => copyToClipboard(result.landingPage.problemSection.painPoints.join('\n'), 'problem')} className="p-1 hover:bg-gray-100 rounded">
                      {copiedField === 'problem' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-sm font-medium text-kk-red mb-2">{result.landingPage.problemSection.title}</p>
                  <div className="space-y-1.5">
                    {result.landingPage.problemSection.painPoints.map((pain, i) => (
                      <div key={pain} className="flex items-start gap-2 text-sm text-kk-red bg-kk-cream p-2 rounded-lg">
                        <span className="text-kk-coral mt-0.5">!</span>
                        <span>{pain}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-700">{t('school.perfectPlanner.landing.features')}</span>
                  </div>
                  <div className="space-y-3">
                    {result.landingPage.features.map((feat, i) => (
                      <div key={feat.title} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm font-bold text-gray-800">{feat.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{feat.description}</p>
                        <p className="text-xs text-kk-red font-medium mt-1">&rarr; {feat.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <span className="text-sm font-bold text-gray-700 block mb-3">{t('school.perfectPlanner.landing.trust')}</span>
                  <div className="space-y-2">
                    {result.landingPage.trustSignals.map((ts, i) => (
                      <div key={ts.content} className="flex items-start gap-2 text-sm bg-kk-cream p-2.5 rounded-lg">
                        <span className="text-kk-navy">
                          {ts.type === 'review' ? '\u2B50' : ts.type === 'stats' ? '\uD83D\uDCCA' : '\uD83C\uDFC6'}
                        </span>
                        <span className="text-kk-navy">{ts.content}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{t('school.perfectPlanner.landing.cta')}</span>
                    <button onClick={() => copyToClipboard(`${result.landingPage.closingCTA.mainCopy}\n${result.landingPage.closingCTA.buttonText}\n${result.landingPage.closingCTA.urgency}`, 'cta')} className="p-1 hover:bg-gray-100 rounded">
                      {copiedField === 'cta' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                  </div>
                  <div className="bg-kk-cream border border-kk-warm rounded-xl p-4 text-center">
                    <p className="font-bold text-kk-brown">{result.landingPage.closingCTA.mainCopy}</p>
                    <div className="mt-2 inline-block bg-kk-red text-white font-bold text-sm px-6 py-2 rounded-full">
                      {result.landingPage.closingCTA.buttonText}
                    </div>
                    <p className="text-xs text-kk-red mt-2 font-medium">{result.landingPage.closingCTA.urgency}</p>
                  </div>
                </div>

                {/* Checklist */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <span className="text-sm font-bold text-gray-700 block mb-3">{t('school.perfectPlanner.landing.checklist')}</span>
                  <div className="space-y-2">
                    {result.landingPage.checklist.map((item, i) => (
                      <label key={item} className="flex items-start gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkedItems[`l-${i}`] || false}
                          onChange={(e) => setCheckedItems({ ...checkedItems, [`l-${i}`]: e.target.checked })}
                          className="mt-0.5 rounded"
                        />
                        <span className={checkedItems[`l-${i}`] ? 'text-gray-400 line-through' : 'text-gray-600'}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Live Commerce Mode ─── */}
            {activeMode === 'liveCommerce' && (
              <div className="space-y-3">
                {/* Opening */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{t('school.perfectPlanner.live.opening')}</span>
                    <button onClick={() => copyToClipboard(`${result.liveCommerce.opening.greeting}\n${result.liveCommerce.opening.hook}\n${result.liveCommerce.opening.todaysOffer}`, 'opening')} className="p-1 hover:bg-gray-100 rounded">
                      {copiedField === 'opening' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{result.liveCommerce.opening.greeting}</p>
                    <p className="text-sm font-bold text-kk-red">{result.liveCommerce.opening.hook}</p>
                    <p className="text-sm text-kk-brown bg-kk-cream p-2 rounded-lg">{result.liveCommerce.opening.todaysOffer}</p>
                  </div>
                </div>

                {/* Demo Timeline */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <span className="text-sm font-bold text-gray-700 block mb-3">{t('school.perfectPlanner.live.demo')}</span>
                  <div className="relative pl-6 space-y-4">
                    <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-kk-peach" />
                    {result.liveCommerce.demoPoints.map((demo, i) => (
                      <div key={demo.timestamp} className="relative">
                        <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-kk-red border-2 border-white" />
                        <div className="bg-gray-50 rounded-xl p-3">
                          <span className="text-[10px] font-bold text-kk-red bg-kk-cream px-2 py-0.5 rounded">{demo.timestamp}</span>
                          <p className="text-xs font-medium text-gray-700 mt-1">{demo.action}</p>
                          <p className="text-xs text-gray-500 mt-0.5 italic">"{demo.talkingPoint}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q&A */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <span className="text-sm font-bold text-gray-700 block mb-3">{t('school.perfectPlanner.live.qna')}</span>
                  <div className="space-y-2">
                    {result.liveCommerce.qnaHandling.map((qa, i) => (
                      <div key={qa.commonQuestion} className="bg-gray-50 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedTip(expandedTip === `qa-${i}` ? null : `qa-${i}`)}
                          className="w-full flex items-center justify-between p-3 text-left"
                        >
                          <span className="text-sm font-medium text-gray-700">Q: {qa.commonQuestion}</span>
                          {expandedTip === `qa-${i}` ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                        </button>
                        {expandedTip === `qa-${i}` && (
                          <div className="px-3 pb-3">
                            <p className="text-sm text-kk-brown bg-kk-cream p-2 rounded-lg">A: {qa.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Closing */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{t('school.perfectPlanner.live.closing')}</span>
                    <button onClick={() => copyToClipboard(`${result.liveCommerce.closing.finalOffer}\n${result.liveCommerce.closing.urgencyTactic}\n${result.liveCommerce.closing.farewell}`, 'closing')} className="p-1 hover:bg-gray-100 rounded">
                      {copiedField === 'closing' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-kk-red">{result.liveCommerce.closing.finalOffer}</p>
                    <p className="text-sm text-kk-red bg-kk-cream p-2 rounded-lg">{result.liveCommerce.closing.urgencyTactic}</p>
                    <p className="text-sm text-gray-600">{result.liveCommerce.closing.farewell}</p>
                  </div>
                </div>

                {/* Checklist */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <span className="text-sm font-bold text-gray-700 block mb-3">{t('school.perfectPlanner.live.checklist')}</span>
                  <div className="space-y-2">
                    {result.liveCommerce.checklist.map((item, i) => (
                      <label key={item} className="flex items-start gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkedItems[`c-${i}`] || false}
                          onChange={(e) => setCheckedItems({ ...checkedItems, [`c-${i}`]: e.target.checked })}
                          className="mt-0.5 rounded"
                        />
                        <span className={checkedItems[`c-${i}`] ? 'text-gray-400 line-through' : 'text-gray-600'}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex gap-2">
              <button
                onClick={handleCopyAll}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-kk-cream text-kk-brown font-bold rounded-xl hover:bg-kk-warm transition-colors"
              >
                {copiedField === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedField === 'all' ? t('school.perfectPlanner.copied') : t('school.perfectPlanner.copyAll')}
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setPhase('input');
                  setCheckedItems({});
                }}
                aria-label="다시 생성"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* 보석함에 넣기 */}
            {myTeamId && (
              <button
                onClick={handleSaveToTeamBox}
                className="w-full py-3 bg-kk-cream hover:bg-kk-warm text-kk-brown font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Gem className="w-4 h-4" />
                {savedToTeamBox ? '보석함에 저장 완료!' : '💎 보석함에 넣기'}
              </button>
            )}

            {/* Completion */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              {completed && (
                <div className="py-3 bg-green-50 text-green-600 font-bold rounded-xl text-center">
                  {t('school.tools.alreadyCompleted')}
                </div>
              )}
              <button
                onClick={() => navigate('/marketing/school/curriculum')}
                className="w-full mt-2 py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                {t('school.tools.goToAttendance')}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
