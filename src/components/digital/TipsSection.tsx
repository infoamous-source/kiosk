import { useTranslation } from 'react-i18next';
import { Lightbulb } from 'lucide-react';

interface Props {
  tips: string[];
}

export default function TipsSection({ tips }: Props) {
  const { t } = useTranslation();

  if (tips.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Lightbulb size={20} className="text-yellow-500" />
        {t('digital.common.tips', '이용 Tip')}
      </h2>
      <div className="space-y-3">
        {tips.map((tipKey, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <span className="text-blue-500 flex-shrink-0 mt-0.5">💡</span>
            <p className="text-sm text-blue-800 leading-relaxed">{t(tipKey, `Tip ${i + 1}`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
