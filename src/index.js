import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Debug logs to verify rendering
console.log('%c[React] Starting...', 'color: green; font-weight: bold;');

try {
   const rootElement = document.getElementById('root');
   console.log('[React] Root element:', rootElement);

   const root = ReactDOM.createRoot(rootElement);

   root.render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );

   console.log('%c[React] App rendered successfully', 'color: green; font-weight: bold;');

} catch (err) {
   console.error('[React ERROR]', err);
}

