import { useTranslation } from 'react-i18next';
import { Award } from 'lucide-react';
import type { User } from '../../types/auth';
import type { PersonaId } from '../../types/school';
import { PERSONAS } from '../../data/aptitudeQuestions';
import KkakdugiMascot from '../brand/KkakdugiMascot';

interface StudentCardProps {
  user: User;
  isGraduated: boolean;
  personaId?: PersonaId | null;
}

export default function StudentCard({ user, isGraduated, personaId }: StudentCardProps) {
  const { t } = useTranslation('common');

  return (
    <div className="relative bg-gradient-to-br from-kk-cream via-kk-warm to-kk-peach rounded-2xl p-5 shadow-lg overflow-hidden border border-kk-warm">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-2 w-24 h-24 border-2 border-kk-brown rounded-full" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-kk-brown rounded-full" />
      </div>

      {/* 상단: 학교 이름 */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <KkakdugiMascot size={20} />
          <span className="text-sm font-bold tracking-wide text-kk-brown">{t('school.studentCard.schoolName')}</span>
        </div>
        {isGraduated && (
          <div className="flex items-center gap-1 bg-kk-gold/20 px-2 py-0.5 rounded-full">
            <Award className="w-3.5 h-3.5 text-kk-gold" />
            <span className="text-xs font-bold text-kk-brown">{t('school.studentCard.alumni')}</span>
          </div>
        )}
      </div>

      {/* 학생 정보 */}
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/60 rounded-full flex items-center justify-center backdrop-blur-sm text-2xl font-bold text-kk-brown border border-kk-warm">
            {user.name[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-kk-brown">{user.name}</h3>
            <p className="text-kk-brown/50 text-sm">{user.email}</p>
            {user.organization && (
              <p className="text-kk-brown/40 text-xs mt-0.5">{user.organization}</p>
            )}
          </div>
        </div>
      </div>

      {/* 페르소나 배지 */}
      {personaId && PERSONAS[personaId] && (
        <div className="relative mt-3 flex items-center gap-2">
          <span className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-kk-brown border border-kk-warm">
            {PERSONAS[personaId].emoji} {t(PERSONAS[personaId].nameKey)}
          </span>
        </div>
      )}

      {/* 하단 */}
      <div className="relative mt-4 pt-3 border-t border-kk-brown/10 flex items-center justify-between">
        <span className="text-xs text-kk-brown/40">{t('school.studentCard.id')}: {user.id.slice(0, 8).toUpperCase()}</span>
        <span className="text-xs text-kk-brown/40">
          {isGraduated ? '🎓' : '📚'} {isGraduated ? t('school.studentCard.statusGraduated') : t('school.studentCard.statusEnrolled')}
        </span>
      </div>
    </div>
  );
}
