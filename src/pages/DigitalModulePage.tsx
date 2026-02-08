import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, BookOpen, CheckCircle2, Smartphone } from 'lucide-react';
import { tracks } from '../data/tracks';

export default function DigitalModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 디지털 기초 트랙 찾기
  const digitalTrack = tracks.find(track => track.id === 'digital-basics');

  // 현재 모듈 찾기
  const currentModule = digitalTrack?.modules.find(m => m.id === moduleId);

  // 현재 모듈의 인덱스 찾기
  const currentIndex = digitalTrack?.modules.findIndex(m => m.id === moduleId) ?? -1;

  // 다음 모듈
  const nextModule = digitalTrack?.modules[currentIndex + 1];

  if (!currentModule || !digitalTrack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">모듈을 찾을 수 없습니다</h1>
          <button
            onClick={() => navigate('/track/digital-basics')}
            className="text-blue-600 hover:text-blue-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/track/digital-basics')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>디지털 기초로 돌아가기</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t(currentModule.titleKey)}
              </h1>
              {currentModule.session && (
                <p className="text-sm text-gray-600">{currentModule.session}</p>
              )}
            </div>
          </div>

          <p className="text-gray-600 mt-2">
            {t(currentModule.descriptionKey)}
          </p>

          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{currentModule.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>{currentModule.lessons}개 학습 목표</span>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 학습 목표 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-blue-600" />
            학습 목표
          </h2>
          <div className="space-y-3">
            {[...Array(currentModule.lessons)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  {t(`${currentModule.titleKey.replace('.title', '')}.goals.${i}`, `학습 목표 ${i + 1}`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 준비사항 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            ✅ 사전 준비사항
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">본인 명의 스마트폰 준비</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">외국인 등록증 준비</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">인터넷 연결 확인</p>
            </div>
          </div>
        </section>

        {/* 학습 내용 (임시) */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            📖 학습 내용
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-2">상세 학습 콘텐츠는 곧 추가될 예정입니다</p>
            <p className="text-sm text-gray-500">교안 기반의 단계별 가이드를 준비 중입니다</p>
          </div>
        </section>

        {/* 1번 모듈에만 앱 다운로드 링크 표시 */}
        {moduleId === 'db-01' && (
          <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              📱 필수 앱 다운로드
            </h2>
            <p className="text-gray-600 mb-4">
              학습에 필요한 앱을 먼저 다운로드하세요
            </p>
            <button
              onClick={() => navigate('/track/digital-basics/korea-apps')}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Smartphone size={20} />
              <span>앱 다운로드 페이지로 이동</span>
            </button>
          </section>
        )}

        {/* 다음 모듈 버튼 */}
        {nextModule && (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate(`/track/digital-basics/module/${nextModule.id}`)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              다음 모듈: {t(nextModule.titleKey)} →
            </button>
          </div>
        )}

        {!nextModule && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-green-900 mb-2">🎉 모든 모듈 완료!</h3>
            <p className="text-green-700 mb-4">디지털 기초 과정을 모두 마쳤습니다</p>
            <button
              onClick={() => navigate('/track/digital-basics')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              트랙 페이지로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
