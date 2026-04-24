import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Shim global for libraries that expect it
if (typeof window !== 'undefined') {
  if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
  }
}

// Fix for environments where window.fetch is a read-only getter
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    if (originalFetch) {
      // Use defineProperty to establish a configurable property if possible
      try {
        Object.defineProperty(window, 'fetch', {
          value: originalFetch,
          writable: true,
          configurable: true,
          enumerable: true
        });
      } catch (err) {
        // If it fails, it might be because it's already non-configurable.
        // We've done our best.
      }
    }
  } catch (e) {
    // Ignore
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
