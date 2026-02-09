import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, LoaderCircle, Share2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../../../contexts/AuthContext';
import { earnStamp, saveAptitudeResult, hasStamp, getAptitudeResult } from '../../../../utils/schoolStorage';
import { PERSONAS, calculateResult, getQuestionSet } from '../../../../data/aptitudeQuestions';
import type { AptitudeQuestion, QuestionSetId } from '../../../../data/aptitudeQuestions';
import type { PersonaId, AptitudeResult } from '../../../../types/school';

type Phase = 'intro' | 'test' | 'loading' | 'result';

const PERSONA_COLORS: Record<PersonaId, { gradient: string; bg: string; text: string; bar: string }> = {
  CEO: {
    gradient: 'from-amber-400 to-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
  },
  PM: {
    gradient: 'from-violet-400 to-violet-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    bar: 'bg-violet-500',
  },
  CPO: {
    gradient: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    bar: 'bg-blue-500',
  },
  CMO: {
    gradient: 'from-pink-400 to-pink-600',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    bar: 'bg-pink-500',
  },
  CSL: {
    gradient: 'from-emerald-400 to-emerald-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    bar: 'bg-emerald-500',
  },
};

const LOADING_MESSAGES = [
  'school.aptitude.loading.step1',
  'school.aptitude.loading.step2',
  'school.aptitude.loading.step3',
];

export default function AptitudeTestTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ resultType: PersonaId; scores: Record<PersonaId, number> } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [previousResult, setPreviousResult] = useState<AptitudeResult | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<AptitudeQuestion[]>([]);
  const [activeSetId, setActiveSetId] = useState<QuestionSetId>('set1');

  const completed = user ? hasStamp(user.id, 'aptitude-test') : false;

  // Check for previous result on mount
  useEffect(() => {
    if (user && completed) {
      const prev = getAptitudeResult(user.id);
      if (prev) {
        setPreviousResult(prev);
      }
    }
  }, [user, completed]);

  // Loading phase timer
  useEffect(() => {
    if (phase !== 'loading') return;

    setLoadingStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setLoadingStep(1), 1000));
    timers.push(setTimeout(() => setLoadingStep(2), 2000));
    timers.push(
      setTimeout(() => {
        const computed = calculateResult(answers, activeQuestions);
        setResult(computed);
        setPhase('result');
      }, 3000),
    );

    return () => timers.forEach(clearTimeout);
  }, [phase, answers, activeQuestions]);

  // Confetti on result phase
  useEffect(() => {
    if (phase !== 'result') return;

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981'],
    });
  }, [phase]);

  const handleStartTest = useCallback(() => {
    const selectedSet = getQuestionSet(previousResult?.questionSetId);
    setActiveQuestions(selectedSet.questions);
    setActiveSetId(selectedSet.id);
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setPhase('test');
  }, [previousResult]);

  const handleSelectOption = useCallback(
    (choice: 'A' | 'B') => {
      if (isTransitioning) return;

      const question = activeQuestions[currentQuestion];
      const newAnswers = { ...answers, [question.id]: choice };
      setAnswers(newAnswers);

      setIsTransitioning(true);

      setTimeout(() => {
        if (currentQuestion + 1 < activeQuestions.length) {
          setCurrentQuestion((prev) => prev + 1);
        } else {
          setPhase('loading');
        }
        setIsTransitioning(false);
      }, 400);
    },
    [currentQuestion, answers, isTransitioning, activeQuestions],
  );

  const handleSaveBadge = useCallback(() => {
    if (!user || !result) return;

    const aptitudeResult: AptitudeResult = {
      completedAt: new Date().toISOString(),
      answers,
      resultType: result.resultType,
      scores: result.scores,
      questionSetId: activeSetId,
    };

    saveAptitudeResult(user.id, aptitudeResult);
    earnStamp(user.id, 'aptitude-test');
    navigate('/marketing/school/attendance');
  }, [user, result, answers, navigate, activeSetId]);

  const handleShare = useCallback(async () => {
    if (!result) return;

    const persona = PERSONAS[result.resultType];
    const shareText = `${persona.emoji} ${t(persona.nameKey)} - ${t(persona.titleKey)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t('school.aptitude.shareTitle'),
          text: shareText,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {
        // Clipboard write failed
      }
    }
  }, [result, t]);

  const handleRestart = useCallback(() => {
    setPhase('intro');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setLoadingStep(0);
  }, []);

  const progressPercent = activeQuestions.length > 0
    ? Math.round(((currentQuestion + 1) / activeQuestions.length) * 100)
    : 0;

  // Find max score for chart scaling
  const maxScore = result
    ? Math.max(...Object.values(result.scores), 1)
    : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => (phase === 'test' || phase === 'loading' ? undefined : navigate(-1))}
            className={`p-1.5 rounded-lg ${
              phase === 'test' || phase === 'loading'
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`}
            disabled={phase === 'test' || phase === 'loading'}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              1{t('school.curriculum.period')}
            </span>
            <h1 className="font-bold text-gray-800">{t('school.periods.aptitudeTest.name')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* ── Phase 1: Intro ── */}
        {phase === 'intro' && (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-8 text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">{t('school.aptitude.intro.title')}</h2>
              <p className="text-sm text-white/80">{t('school.aptitude.intro.subtitle')}</p>
            </div>

            {/* Previous Result Card */}
            {completed && previousResult && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <p className="text-xs text-gray-400 mb-3">{t('school.aptitude.intro.previousResult')}</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{PERSONAS[previousResult.resultType].emoji}</span>
                  <div>
                    <p className="font-bold text-gray-800">
                      {t(PERSONAS[previousResult.resultType].nameKey)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t(PERSONAS[previousResult.resultType].titleKey)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleStartTest}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-lg"
            >
              {completed
                ? t('school.aptitude.intro.retakeButton')
                : t('school.aptitude.intro.startButton')}
            </button>
          </div>
        )}

        {/* ── Phase 2: Test ── */}
        {phase === 'test' && activeQuestions.length > 0 && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700">
                  {currentQuestion + 1}/{activeQuestions.length}
                </span>
                <span className="text-gray-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div
              className="transition-all duration-300 ease-out"
              style={{
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(16px)' : 'translateY(0)',
              }}
            >
              {/* Situation */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
                <p className="text-xs text-rose-500 font-bold mb-2">
                  Q{currentQuestion + 1}.
                </p>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {t(activeQuestions[currentQuestion].situationKey)}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <button
                  onClick={() => handleSelectOption('A')}
                  disabled={isTransitioning}
                  className="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 hover:border-rose-300 hover:bg-rose-50/50 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 bg-rose-100 text-rose-600 font-bold text-sm rounded-lg flex items-center justify-center">
                      A
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed pt-0.5">
                      {t(activeQuestions[currentQuestion].optionAKey)}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectOption('B')}
                  disabled={isTransitioning}
                  className="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 hover:border-pink-300 hover:bg-pink-50/50 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 bg-pink-100 text-pink-600 font-bold text-sm rounded-lg flex items-center justify-center">
                      B
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed pt-0.5">
                      {t(activeQuestions[currentQuestion].optionBKey)}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Phase 3: Loading ── */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="animate-spin">
              <LoaderCircle className="w-12 h-12 text-rose-500" />
            </div>
            <div className="text-center space-y-2">
              {LOADING_MESSAGES.map((msgKey, idx) => (
                <p
                  key={msgKey}
                  className={`text-sm transition-all duration-500 ${
                    idx <= loadingStep
                      ? 'opacity-100 text-gray-700'
                      : 'opacity-0 text-gray-400'
                  } ${idx === loadingStep ? 'font-bold' : ''}`}
                >
                  {t(msgKey)}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ── Phase 4: Result ── */}
        {phase === 'result' && result && (
          <div className="space-y-6">
            {/* Persona Hero Card */}
            <div
              className={`bg-gradient-to-br ${PERSONA_COLORS[result.resultType].gradient} rounded-2xl p-8 text-center text-white`}
            >
              <span className="text-5xl block mb-4">{PERSONAS[result.resultType].emoji}</span>
              <h2 className="text-2xl font-bold mb-1">
                {t(PERSONAS[result.resultType].nameKey)}
              </h2>
              <p className="text-white/80 text-sm">
                {t(PERSONAS[result.resultType].titleKey)}
              </p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-line">
                {t(PERSONAS[result.resultType].descriptionKey)}
              </p>
              <div className="space-y-2">
                {PERSONAS[result.resultType].strengths.map((strengthKey, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full ${PERSONA_COLORS[result.resultType].bg} ${PERSONA_COLORS[result.resultType].text} text-xs font-bold flex items-center justify-center`}>
                      {idx + 1}
                    </span>
                    <p className="text-sm text-gray-600">{t(strengthKey)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 text-sm mb-4">
                {t('school.aptitude.result.scoreChart')}
              </h3>
              <div className="space-y-3">
                {(Object.keys(PERSONAS) as PersonaId[]).map((pid) => {
                  const score = result.scores[pid];
                  const widthPercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
                  const isTop = pid === result.resultType;

                  return (
                    <div key={pid} className="flex items-center gap-3">
                      <span className="text-lg w-7 text-center">{PERSONAS[pid].emoji}</span>
                      <span className={`text-xs w-10 shrink-0 ${isTop ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                        {t(PERSONAS[pid].nameKey)}
                      </span>
                      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${PERSONA_COLORS[pid].bar}`}
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                      <span className={`text-xs w-6 text-right ${isTop ? 'font-bold text-gray-800' : 'text-gray-400'}`}>
                        {score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Save Badge */}
              <button
                onClick={handleSaveBadge}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-base"
              >
                {t('school.aptitude.result.saveBadge')}
              </button>

              {/* Restart + Share Row */}
              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('school.aptitude.result.retake')}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {t('school.aptitude.result.share')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
