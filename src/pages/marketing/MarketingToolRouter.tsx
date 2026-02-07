import { useParams, useNavigate } from 'react-router-dom';
import { marketingTools } from '../../data/marketing/modules';

// 툴 페이지 import
import GlossaryTool from './tools/GlossaryTool';
import PersonaMakerTool from './tools/PersonaMakerTool';
import USPFinderTool from './tools/USPFinderTool';
import ColorPickerTool from './tools/ColorPickerTool';
import HashtagGeneratorTool from './tools/HashtagGeneratorTool';
import ROICalculatorTool from './tools/ROICalculatorTool';
import KCopywriterTool from './tools/KCopywriterTool';
import SNSAdMakerTool from './tools/SNSAdMakerTool';

const toolComponents: Record<string, React.ComponentType> = {
  'glossary': GlossaryTool,
  'persona-maker': PersonaMakerTool,
  'usp-finder': USPFinderTool,
  'color-picker': ColorPickerTool,
  'hashtag-generator': HashtagGeneratorTool,
  'roi-calculator': ROICalculatorTool,
  'k-copywriter': KCopywriterTool,
  'sns-ad-maker': SNSAdMakerTool,
};

export default function MarketingToolRouter() {
  const { toolId } = useParams<{ toolId: string }>();
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

  const ToolComponent = toolComponents[toolId || ''];
  if (ToolComponent) return <ToolComponent />;

  // 혹시 매핑 안 된 툴이 있을 경우
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <p className="text-gray-500 text-lg">이 도구는 아직 준비 중이에요.</p>
      <button
        onClick={() => navigate('/marketing')}
        className="mt-4 text-blue-600 hover:underline"
      >
        마케팅 홈으로 돌아가기
      </button>
    </div>
  );
}
