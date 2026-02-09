import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Copy, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  getAptitudeResult, getMarketScannerResult, getEdgeMakerResult,
  getViralCardResult, getPerfectPlannerResult,
  loadSchoolProgress, canGraduate, isGraduated as checkGraduated,
  hasAllStamps,
} from '../../../utils/schoolStorage';
import GraduationModal from '../../../components/school/GraduationModal';

interface SectionData {
  period: number;
  titleKey: string;
  guideKey: string;
  completed: boolean;
  summary: string | null;
  toolRoute: string;
}

export default function GraduationProjectPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [copiedAll, setCopiedAll] = useState(false);
  const [showGraduationModal, setShowGraduationModal] = useState(false);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
  if (!user) return null;

  const graduated = checkGraduated(user.id);
  const canGrad = canGraduate(user.id);
  const allStamps = hasAllStamps(user.id);

  // Collect data from all periods
  const aptitude = getAptitudeResult(user.id);
  const scanner = getMarketScannerResult(user.id);
  const edge = getEdgeMakerResult(user.id);
  const viral = getViralCardResult(user.id);
  const planner = getPerfectPlannerResult(user.id);
  const progress = loadSchoolProgress(user.id);
  const simulation = progress.simulationResult;

  const sections: SectionData[] = [
    {
      period: 1,
      titleKey: 'school.graduationProject.section1.title',
      guideKey: 'school.graduationProject.section1.guide',
      completed: !!aptitude,
      summary: aptitude ? `${t(`school.aptitude.personas.${aptitude.resultType}.name`)}` : null,
      toolRoute: '/marketing/school/tools/aptitude-test',
    },
    {
      period: 2,
      titleKey: 'school.graduationProject.section2.title',
      guideKey: 'school.graduationProject.section2.guide',
      completed: !!scanner,
      summary: scanner ? `${scanner.input.itemKeyword} / ${scanner.output.painPoints?.slice(0, 2).join(', ')}` : null,
      toolRoute: '/marketing/school/tools/market-scanner',
    },
    {
      period: 3,
      titleKey: 'school.graduationProject.section3.title',
      guideKey: 'school.graduationProject.section3.guide',
      completed: !!edge,
      summary: edge ? `USP: ${edge.output.usp} / ${edge.output.brandNames?.[0]?.name || ''} / "${edge.output.slogan}"` : null,
      toolRoute: '/marketing/school/tools/edge-maker',
    },
    {
      period: 4,
      titleKey: 'school.graduationProject.section4.title',
      guideKey: 'school.graduationProject.section4.guide',
      completed: !!viral,
      summary: viral ? `${t(`school.viralCardMaker.tone.${viral.input.tone}`)} / ${viral.output.slides?.map(s => s.stepLabel).join(' → ')}` : null,
      toolRoute: '/marketing/school/tools/viral-card-maker',
    },
    {
      period: 5,
      titleKey: 'school.graduationProject.section5.title',
      guideKey: 'school.graduationProject.section5.guide',
      completed: !!planner,
      summary: planner ? `${planner.input.productName} / ${planner.output.landingPage?.headline?.slice(0, 30)}...` : null,
      toolRoute: '/marketing/school/tools/perfect-planner',
    },
    {
      period: 6,
      titleKey: 'school.graduationProject.section6.title',
      guideKey: 'school.graduationProject.section6.guide',
      completed: !!simulation,
      summary: simulation?.output ? `ROAS ${simulation.output.estimatedROAS}x / ${t(`school.roasSimulator.grade.${simulation.output.roasGrade}`)}` : null,
      toolRoute: '/marketing/school/tools/roas-simulator',
    },
  ];

  const completedCount = sections.filter(s => s.completed).length;

  // Copy all results
  const handleCopyAll = async () => {
    const lines: string[] = [
      `=== ${t('school.graduationProject.title')} ===`,
      '',
    ];

    sections.forEach((section) => {
      lines.push(`[${section.period}${t('school.curriculum.period')}] ${t(section.titleKey)}`);
      if (section.summary) {
        lines.push(section.summary);
      } else {
        lines.push(t('school.graduationProject.notCompleted'));
      }
      lines.push('');
    });

    // Add detailed data if available
    if (edge) {
      lines.push('--- USP ---');
      lines.push(edge.output.usp);
      lines.push('');
      lines.push('--- Brand Names ---');
      edge.output.brandNames?.forEach(b => lines.push(`${b.name} (${b.type}): ${b.reasoning}`));
      lines.push('');
      lines.push(`--- Slogan: "${edge.output.slogan}" ---`);
      lines.push('');
    }

    if (viral) {
      lines.push('--- Card News Copy ---');
      viral.output.slides?.forEach((slide, i) => {
        lines.push(`[${i + 1}/4] ${slide.stepLabel}: ${slide.copyText}`);
      });
      lines.push('');
    }

    if (planner) {
      lines.push('--- Landing Page Headline ---');
      lines.push(planner.output.landingPage?.headline || '');
      lines.push('');
    }

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            <h1 className="font-bold text-gray-800">{t('school.graduationProject.title')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Description */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-2">{t('school.graduationProject.description')}</h2>
          <p className="text-sm text-gray-600 mb-2">{t('school.graduationProject.offlineNote')}</p>
          <p className="text-sm text-gray-600">{t('school.graduationProject.presentNote')}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="text-xs font-bold text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full">
              {completedCount}/6 {t('school.graduationProject.completed')}
            </div>
          </div>
        </div>

        {/* Section Guide */}
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.period}
              className={`bg-white rounded-2xl border p-4 ${
                section.completed ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    section.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {section.period}{t('school.curriculum.period')}
                  </span>
                  <span className="text-sm font-bold text-gray-700">{t(section.titleKey)}</span>
                </div>
                {section.completed && <span className="text-green-500 text-sm">&#10003;</span>}
              </div>
              <p className="text-xs text-gray-500 mb-2">{t(section.guideKey)}</p>
              {section.summary ? (
                <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                  {section.summary}
                </div>
              ) : (
                <button
                  onClick={() => navigate(section.toolRoute)}
                  className="text-xs text-purple-600 font-medium hover:underline"
                >
                  {t('school.graduationProject.goToTool')} &rarr;
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Copy All Button */}
        <button
          onClick={handleCopyAll}
          className="w-full flex items-center justify-center gap-2 py-3 bg-purple-100 text-purple-700 font-bold rounded-xl hover:bg-purple-200 transition-colors"
        >
          {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedAll ? t('school.graduationProject.copiedAll') : t('school.graduationProject.copyAll')}
        </button>

        {/* Writing Tips */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3">{t('school.graduationProject.tipsTitle')}</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-purple-400 mt-0.5">&#8226;</span>
                <span>{t(`school.graduationProject.tip${i}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Graduation Button */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          {graduated ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">&#127891;</div>
              <p className="text-green-600 font-bold text-lg">{t('school.attendance.alreadyGraduated')}</p>
            </div>
          ) : canGrad ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">{t('school.attendance.readyToGraduate')}</p>
              <button
                onClick={() => setShowGraduationModal(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                {t('school.attendance.graduateButton')}
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">{t('school.graduationProject.notReady')}</p>
              {!allStamps && (
                <p className="text-xs text-gray-400 mt-1">{t('school.graduationProject.completeAll')}</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Graduation Modal */}
      {showGraduationModal && (
        <GraduationModal
          userId={user.id}
          onClose={() => setShowGraduationModal(false)}
          onComplete={() => {
            setShowGraduationModal(false);
            navigate('/marketing/school/attendance');
          }}
        />
      )}
    </div>
  );
}
