import { useTranslation } from 'react-i18next';
import { GraduationCap, Award } from 'lucide-react';
import type { User } from '../../types/auth';
import type { PersonaId } from '../../types/school';
import { PERSONAS } from '../../data/aptitudeQuestions';

interface StudentCardProps {
  user: User;
  isGraduated: boolean;
  personaId?: PersonaId | null;
}

export default function StudentCard({ user, isGraduated, personaId }: StudentCardProps) {
  const { t } = useTranslation('common');

  return (
    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-2 w-24 h-24 border-2 border-white rounded-full" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white rounded-full" />
      </div>

      {/* 상단: 학교 이름 */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          <span className="text-sm font-bold tracking-wide">{t('school.studentCard.schoolName')}</span>
        </div>
        {isGraduated && (
          <div className="flex items-center gap-1 bg-yellow-400/20 px-2 py-0.5 rounded-full">
            <Award className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-xs font-bold text-yellow-200">{t('school.studentCard.alumni')}</span>
          </div>
        )}
      </div>

      {/* 학생 정보 */}
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-2xl font-bold">
            {user.name[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-white/70 text-sm">{user.email}</p>
            {user.organization && (
              <p className="text-white/60 text-xs mt-0.5">{user.organization}</p>
            )}
          </div>
        </div>
      </div>

      {/* 페르소나 배지 */}
      {personaId && PERSONAS[personaId] && (
        <div className="relative mt-3 flex items-center gap-2">
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
            {PERSONAS[personaId].emoji} {t(PERSONAS[personaId].nameKey)}
          </span>
        </div>
      )}

      {/* 하단 */}
      <div className="relative mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
        <span className="text-xs text-white/60">{t('school.studentCard.id')}: {user.id.slice(0, 8).toUpperCase()}</span>
        <span className="text-xs text-white/60">
          {isGraduated ? '🎓' : '📚'} {isGraduated ? t('school.studentCard.statusGraduated') : t('school.studentCard.statusEnrolled')}
        </span>
      </div>
    </div>
  );
}
