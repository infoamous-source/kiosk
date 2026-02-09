import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import KkakdugiCharacter from '../components/brand/KkakdugiCharacter';
import KkakdugiMascot from '../components/brand/KkakdugiMascot';
import {
  SchoolPatternBg,
  DigitalDeptIcon,
  MarketingDeptIcon,
  CareerDeptIcon,
  StarIcon,
  PencilIcon,
  DiplomaIcon,
  SchoolBellIcon,
  NotebookIcon,
} from '../components/brand/SchoolIllustrations';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-kk-bg relative overflow-hidden">
      <SchoolPatternBg className="opacity-30" />

      {/* 헤더 */}
      <header className="relative py-4 px-4 sm:py-6 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-kk-brown/60 hover:text-kk-brown transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <KkakdugiMascot size={20} />
            <span className="text-sm font-medium">학교 현관으로 돌아가기</span>
          </button>
        </div>
      </header>

      {/* 히어로: 브랜드 스토리 */}
      <section className="relative px-4 sm:px-8 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* 캐릭터 */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <KkakdugiCharacter size="half" animated />
              <div className="absolute -left-8 top-4">
                <StarIcon size={24} className="opacity-30 animate-[floatBounce_3s_ease-in-out_infinite]" />
              </div>
              <div className="absolute -right-8 bottom-8">
                <PencilIcon size={20} className="opacity-30 animate-[floatBounce_3.5s_ease-in-out_infinite_0.5s]" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-kk-brown mb-4">
            한국의 다정한 문화, <span className="text-kk-red">'깍두기'</span>
          </h1>
          <p className="text-kk-brown/60 text-base leading-relaxed max-w-2xl mx-auto mb-4">
            한국에서는 어떤 팀이나 모임에서 한 명이 남았을 때, 그 사람을 따뜻하게 받아들이며 <strong className="text-kk-brown">'깍두기'</strong>라고 부릅니다.
          </p>
          <p className="text-kk-brown/60 text-base leading-relaxed max-w-2xl mx-auto mb-4">
            이것은 누군가를 소외시키지 않고, 함께하려는 한국의 아름다운 배려 문화입니다.
          </p>
          <p className="text-kk-brown/60 text-base leading-relaxed max-w-2xl mx-auto">
            <strong className="text-kk-red">깍두기 학교</strong>는 바로 이 정신에서 출발했습니다.
            한국에 온 이주민과 유학생이 어디서든 환영받고, 필요한 것을 배울 수 있도록 — 누구도 혼자 남지 않도록 함께하는 교육 학교입니다.
          </p>
        </div>
      </section>

      {/* 학과 소개 */}
      <section className="relative px-4 sm:px-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-kk-cream rounded-full text-kk-brown text-sm font-semibold mb-3 border border-kk-warm">
              <SchoolBellIcon size={16} />
              <span>우리 학교의 전공 학과를 소개합니다</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 디지털 학과 */}
            <div className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden">
              <div className="h-2 bg-blue-500" />
              <div className="p-6">
                <div className="mb-4">
                  <DigitalDeptIcon size={48} />
                </div>
                <h3 className="text-lg font-bold text-kk-brown mb-2">디지털 학과</h3>
                <p className="text-sm text-kk-brown/60 leading-relaxed">
                  스마트폰 사용법부터 한국 앱(카카오톡, 네이버 등) 활용, 키오스크 연습까지 — 한국 생활의 디지털 기초를 배웁니다.
                </p>
              </div>
            </div>

            {/* 마케팅 학과 */}
            <div className="bg-white rounded-2xl border-2 border-purple-200 overflow-hidden">
              <div className="h-2 bg-purple-500" />
              <div className="p-6">
                <div className="mb-4">
                  <MarketingDeptIcon size={48} />
                </div>
                <h3 className="text-lg font-bold text-kk-brown mb-2">마케팅 학과</h3>
                <p className="text-sm text-kk-brown/60 leading-relaxed">
                  마케팅 기초 이론부터 AI 실습까지. 한국에서 비즈니스를 시작하거나, 마케팅 역량을 키우고 싶은 분을 위한 학과입니다.
                </p>
              </div>
            </div>

            {/* 커리어 학과 */}
            <div className="bg-white rounded-2xl border-2 border-emerald-200 overflow-hidden">
              <div className="h-2 bg-emerald-500" />
              <div className="p-6">
                <div className="mb-4">
                  <CareerDeptIcon size={48} />
                </div>
                <h3 className="text-lg font-bold text-kk-brown mb-2">커리어 학과</h3>
                <p className="text-sm text-kk-brown/60 leading-relaxed">
                  이력서 작성, 면접 준비, 구직 전략까지. 한국에서의 취업을 목표로 하는 분을 위한 커리어 전문 학과입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 교실 시스템 설명 */}
      <section className="relative px-4 sm:px-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-kk-cream rounded-full text-kk-brown text-sm font-semibold mb-3 border border-kk-warm">
              <DiplomaIcon size={16} />
              <span>깍두기 학교만의 '교실' 시스템</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-kk-warm p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-kk-cream rounded-lg flex items-center justify-center shrink-0">
                <NotebookIcon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-kk-brown mb-1">맞춤형 수강 신청</h4>
                <p className="text-sm text-kk-brown/60 leading-relaxed">
                  원하는 학과에 수강 신청하고, 자신만의 학습 속도로 교실을 들어보세요. 기초부터 고급까지, 단계별로 준비되어 있습니다.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-kk-warm p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-kk-cream rounded-lg flex items-center justify-center shrink-0">
                <SchoolBellIcon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-kk-brown mb-1">새로운 교실 업데이트</h4>
                <p className="text-sm text-kk-brown/60 leading-relaxed">
                  더 많은 교실과 학과가 계속 추가됩니다. 깍두기 학교는 여러분의 성장에 맞춰 함께 성장합니다.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-kk-warm p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-kk-cream rounded-lg flex items-center justify-center shrink-0">
                <DiplomaIcon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-kk-brown mb-1">함께 졸업해요</h4>
                <p className="text-sm text-kk-brown/60 leading-relaxed">
                  모든 교실을 완료하면 졸업! 졸업 후에는 프로 교실이 열리며, 더 심화된 학습이 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 sm:px-8 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-kk-cream to-kk-warm rounded-2xl p-8 border border-kk-warm">
            <div className="flex justify-center mb-4">
              <KkakdugiCharacter size="icon" animated={false} />
            </div>
            <h2 className="text-2xl font-extrabold text-kk-brown mb-3">
              지금 바로 교실을 찾아보세요!
            </h2>
            <p className="text-kk-brown/60 text-sm mb-6">
              깍두기 학교의 문은 항상 열려 있습니다.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-kk-red hover:bg-kk-red-deep text-white font-bold rounded-xl transition-colors shadow-md"
            >
              <span>학교 현관으로 가기</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 운영 정보 */}
      <section className="relative px-4 sm:px-8 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white/60 rounded-xl p-6 border border-kk-warm">
            <p className="text-xs text-kk-brown/40 mb-1">운영</p>
            <p className="text-sm font-bold text-kk-brown mb-1">amousedu</p>
            <p className="text-xs text-kk-brown/40">All Moments Of Unique Story</p>
          </div>
        </div>
      </section>
    </div>
  );
}
