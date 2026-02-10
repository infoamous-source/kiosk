import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import SchoolBottomNav from '../../../components/school/SchoolBottomNav';
import KkakdugiMascot from '../../../components/brand/KkakdugiMascot';
import AptitudeTestTool from './tools/AptitudeTestTool';
import MarketScannerTool from './tools/MarketScannerTool';
import EdgeMakerTool from './tools/EdgeMakerTool';
import ViralCardMakerTool from './tools/ViralCardMakerTool';
import PerfectPlannerTool from './tools/PerfectPlannerTool';
import ROASSimulatorTool from './tools/ROASSimulatorTool';

const toolComponents: Record<string, React.ComponentType> = {
  'aptitude-test': AptitudeTestTool,
  'market-scanner': MarketScannerTool,
  'edge-maker': EdgeMakerTool,
  'viral-card-maker': ViralCardMakerTool,
  'perfect-planner': PerfectPlannerTool,
  'roas-simulator': ROASSimulatorTool,
};

export default function SchoolToolRouter() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kk-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-kk-red" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-kk-bg flex flex-col items-center justify-center p-6">
        <KkakdugiMascot size={48} />
        <p className="mt-4 text-kk-brown font-semibold text-lg">로그인이 필요합니다</p>
        <p className="text-kk-brown/60 text-sm mt-1 mb-6">마케팅 학교는 학생 등록 후 이용할 수 있어요</p>
        <button
          onClick={() => navigate('/login', { state: { redirectTo: '/marketing/hub' } })}
          className="px-6 py-3 bg-kk-red text-white font-bold rounded-xl hover:bg-kk-red-deep transition-colors"
        >
          로그인하기
        </button>
      </div>
    );
  }

  if (!toolId || !toolComponents[toolId]) {
    return <Navigate to="/marketing/school/lab" replace />;
  }

  const ToolComponent = toolComponents[toolId];
  return (
    <div className="pb-20">
      <ToolComponent />
      <SchoolBottomNav />
    </div>
  );
}
