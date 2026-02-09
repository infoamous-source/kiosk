import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { loadSchoolProgress, canGraduate, getAptitudeResult } from '../../../utils/schoolStorage';
import { isGraduated as checkGraduated } from '../../../utils/schoolStorage';
import StudentCard from '../../../components/school/StudentCard';
import StampBoard from '../../../components/school/StampBoard';
import GraduationModal from '../../../components/school/GraduationModal';
import { GraduationCap } from 'lucide-react';

export default function AttendanceTab() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const [showGraduationModal, setShowGraduationModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) return null;

  const progress = loadSchoolProgress(user.id);
  const graduated = checkGraduated(user.id);
  const canGrad = canGraduate(user.id);
  const aptitudeResult = getAptitudeResult(user.id);
  const personaId = aptitudeResult?.resultType ?? null;

  const handleGraduationComplete = () => {
    setShowGraduationModal(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-5" key={refreshKey}>
      {/* 학생증 */}
      <StudentCard user={user} isGraduated={graduated} personaId={personaId} />

      {/* 도장판 */}
      <StampBoard stamps={progress.stamps} />

      {/* 졸업 버튼 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-500" />
          {t('school.attendance.graduationSection')}
        </h3>

        {graduated ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🎓</div>
            <p className="text-green-600 font-bold text-lg">{t('school.attendance.alreadyGraduated')}</p>
            <p className="text-sm text-gray-500 mt-1">{t('school.attendance.congratulations')}</p>
          </div>
        ) : canGrad ? (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">{t('school.attendance.readyToGraduate')}</p>
            <button
              onClick={() => setShowGraduationModal(true)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              🎓 {t('school.attendance.graduateButton')}
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">{t('school.attendance.notReady')}</p>
            <p className="text-xs text-gray-400 mt-1">{t('school.attendance.notReadyHint')}</p>
          </div>
        )}
      </div>

      {/* 졸업 모달 */}
      {showGraduationModal && (
        <GraduationModal
          userId={user.id}
          onClose={() => setShowGraduationModal(false)}
          onComplete={handleGraduationComplete}
        />
      )}
    </div>
  );
}
