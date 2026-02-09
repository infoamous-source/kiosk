import { useTranslation } from 'react-i18next';
import { CheckSquare } from 'lucide-react';

interface Props {
  items: string[];
}

export default function PreparationChecklist({ items }: Props) {
  const { t } = useTranslation();

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CheckSquare size={20} className="text-green-600" />
        {t('digital.common.preparation', '사전 준비사항')}
      </h2>
      <div className="space-y-3">
        {items.map((itemKey, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
            <div className="w-5 h-5 rounded border-2 border-green-400 bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-xs font-bold">✓</span>
            </div>
            <p className="text-sm text-gray-700">{t(itemKey, `준비물 ${i + 1}`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
