import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import DiscGolfPresentation from './components/DiscGolfPresentation.tsx';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname.replace(/\/$/, '') === '/calvin-disc-golf' ? <DiscGolfPresentation /> : <App />}
  </StrictMode>,
);
