import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { SessionTimerProvider } from './contexts/SessionTimerContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <SessionTimerProvider>
          <App />
        </SessionTimerProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);