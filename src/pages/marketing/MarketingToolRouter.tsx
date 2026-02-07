import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Construction } from 'lucide-react';
import { marketingTools } from '../../data/marketing/modules';

// 툴 페이지 import (Phase 4에서 하나씩 구현)
// import GlossaryTool from './tools/GlossaryTool';
// import PersonaMakerTool from './tools/PersonaMakerTool';
// import USPFinderTool from './tools/USPFinderTool';
// import ColorPickerTool from './tools/ColorPickerTool';
// import HashtagGeneratorTool from './tools/HashtagGeneratorTool';
// import ROICalculatorTool from './tools/ROICalculatorTool';
// import KCopywriterTool from './tools/KCopywriterTool';
// import SNSAdMakerTool from './tools/SNSAdMakerTool';

export default function MarketingToolRouter() {
  const { toolId } = useParams<{ toolId: string }>();
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const tool = marketingTools.find((tl) => tl.id === toolId);

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">도구를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate('/marketing')}
          className="mt-4 text-blue-600 hover:underline"
        >
          마케팅 홈으로 돌아가기
        </button>
      </div>
    );
  }

  // 툴별 라우팅 (Phase 4, 6에서 구현 후 주석 해제)
  // const toolComponents: Record<string, React.ComponentType> = {
  //   'glossary': GlossaryTool,
  //   'persona-maker': PersonaMakerTool,
  //   'usp-finder': USPFinderTool,
  //   'color-picker': ColorPickerTool,
  //   'hashtag-generator': HashtagGeneratorTool,
  //   'roi-calculator': ROICalculatorTool,
  //   'k-copywriter': KCopywriterTool,
  //   'sns-ad-maker': SNSAdMakerTool,
  // };
  // const ToolComponent = toolComponents[toolId || ''];
  // if (ToolComponent) return <ToolComponent />;

  // 임시 Coming Soon 페이지
  return (
    <div className="max-w-3xl mx-auto px-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mt-6 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('marketing.tools.back', '뒤로 가기')}</span>
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <Construction className="w-16 h-16 text-blue-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t(tool.nameKey, tool.id)}
        </h2>
        <p className="text-gray-500 mb-2">
          {t(tool.descriptionKey, '')}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
          <Construction className="w-4 h-4" />
          곧 완성됩니다! (Coming Soon)
        </div>
      </div>
    </div>
  );
}
