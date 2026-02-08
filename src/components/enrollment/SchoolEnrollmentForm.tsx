import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, CheckCircle } from 'lucide-react';
import { SCHOOL_ADDITIONAL_FIELDS } from '../../data/schoolFields';
import { SCHOOL_NAMES, type SchoolId, type SchoolField } from '../../types/enrollment';

interface SchoolEnrollmentFormProps {
  schoolId: SchoolId;
  onSubmit: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel?: () => void;
}

export default function SchoolEnrollmentForm({ schoolId, onSubmit, onCancel }: SchoolEnrollmentFormProps) {
  const { t } = useTranslation('common');
  const fields = SCHOOL_ADDITIONAL_FIELDS[schoolId] || [];
  const schoolName = SCHOOL_NAMES[schoolId];

  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleMultiSelect = (fieldId: string, optionValue: string) => {
    setFormData((prev) => {
      const current = (prev[fieldId] as string[]) || [];
      if (current.includes(optionValue)) {
        return { ...prev, [fieldId]: current.filter((v) => v !== optionValue) };
      }
      return { ...prev, [fieldId]: [...current, optionValue] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 필수 필드 검증
    for (const field of fields) {
      if (field.required) {
        const val = formData[field.id];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          setError(`${t(field.labelKey)} 항목을 입력해주세요.`);
          return;
        }
      }
    }

    setIsLoading(true);
    const success = await onSubmit(formData);
    setIsLoading(false);

    if (!success) {
      setError('제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const renderField = (field: SchoolField) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            value={(formData[field.id] as string) || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="">선택하세요</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.labelKey.startsWith('enrollment.') ? t(opt.labelKey) : opt.labelKey}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((opt) => {
              const selected = ((formData[field.id] as string[]) || []).includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleMultiSelect(field.id, opt.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    selected
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {selected && <CheckCircle className="w-3.5 h-3.5 inline mr-1" />}
                  {opt.labelKey.startsWith('enrollment.') ? t(opt.labelKey) : opt.labelKey}
                </button>
              );
            })}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={(formData[field.id] as string) || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholderKey ? t(field.placeholderKey) : ''}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={(formData[field.id] as number) || ''}
            onChange={(e) => handleChange(field.id, Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        );

      default: // text
        return (
          <input
            type="text"
            value={(formData[field.id] as string) || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholderKey ? t(field.placeholderKey) : ''}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {schoolName?.ko} 입학 정보
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          학교 수강에 필요한 추가 정보를 입력해주세요.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(field.labelKey)}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            나중에
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            '입학 정보 제출'
          )}
        </button>
      </div>
    </form>
  );
}
