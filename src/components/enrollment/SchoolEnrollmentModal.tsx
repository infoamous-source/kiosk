import { X } from 'lucide-react';
import { useEnrollments } from '../../contexts/EnrollmentContext';
import type { Enrollment } from '../../types/enrollment';
import SchoolEnrollmentForm from './SchoolEnrollmentForm';

interface SchoolEnrollmentModalProps {
  enrollment: Enrollment;
  onComplete: () => void;
  onSkip?: () => void;
}

export default function SchoolEnrollmentModal({ enrollment, onComplete, onSkip }: SchoolEnrollmentModalProps) {
  const { submitSchoolInfo } = useEnrollments();

  const handleSubmit = async (data: Record<string, unknown>) => {
    const success = await submitSchoolInfo(enrollment.id, enrollment.school_id, data);
    if (success) {
      onComplete();
    }
    return success;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
        {onSkip && (
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}

        <SchoolEnrollmentForm
          schoolId={enrollment.school_id}
          onSubmit={handleSubmit}
          onCancel={onSkip}
        />
      </div>
    </div>
  );
}
