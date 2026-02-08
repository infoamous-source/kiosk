import { useParams, Navigate } from 'react-router-dom';
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

  if (!toolId || !toolComponents[toolId]) {
    return <Navigate to="/marketing/school/lab" replace />;
  }

  const ToolComponent = toolComponents[toolId];
  return <ToolComponent />;
}
