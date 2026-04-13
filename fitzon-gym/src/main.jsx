import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { initStorage } from './utils/localStorage';
import { Toaster } from 'react-hot-toast';

// Initialize mock data in localStorage on app load
initStorage();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111111',
            color: '#fff',
            border: '1px solid #1f1f1f',
          },
          success: {
            iconTheme: {
              primary: '#CCFF00',
              secondary: '#000',
            },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
);
