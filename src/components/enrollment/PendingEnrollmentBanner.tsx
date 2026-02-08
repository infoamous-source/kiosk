import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useEnrollments } from '../../contexts/EnrollmentContext';
import { SCHOOL_NAMES } from '../../types/enrollment';
import SchoolEnrollmentModal from './SchoolEnrollmentModal';

export default function PendingEnrollmentBanner() {
  const { pendingEnrollments } = useEnrollments();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (pendingEnrollments.length === 0 || dismissed) return null;

  const first = pendingEnrollments[0];
  const schoolName = SCHOOL_NAMES[first.school_id]?.ko || first.school_id;

  return (
    <>
      <div className="bg-orange-50 border-b border-orange-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-orange-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>{schoolName}</strong>에 등록되었습니다. 추가 정보를 입력해주세요.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              입력하기
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 text-orange-600 hover:bg-orange-100 text-xs font-medium rounded-lg transition-colors"
            >
              나중에
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <SchoolEnrollmentModal
          enrollment={first}
          onComplete={() => setShowModal(false)}
          onSkip={() => setShowModal(false)}
        />
      )}
    </>
  );
}
