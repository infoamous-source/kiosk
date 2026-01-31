import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/i18n';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>}>
      <App />
    </Suspense>
  </StrictMode>,
);
