import { useRegisterSW } from 'virtual:pwa-register/react';

export default function ReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs">
      <p className="text-sm text-gray-700 mb-3">
        New version available. Reload to update.
      </p>
      <button
        onClick={() => updateServiceWorker(true)}
        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Reload
      </button>
    </div>
  );
}
