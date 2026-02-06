import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import type { TrackId } from '../../types/track';

export default function MainLayout() {
  const { trackId } = useParams<{ trackId: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentTrack={trackId as TrackId} />

      <div className="ml-64 transition-all duration-300">
        <TopHeader />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
