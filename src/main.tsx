import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

/*
 * Nessuna libreria di routing: il sito è una pagina sola, e la dashboard è
 * l'unica altra "pagina" che serve. Basta guardare il percorso e caricare il
 * pezzo giusto — l'Admin resta un chunk a parte, mai scaricato da chi visita
 * solo il sito pubblico.
 */
const isAdmin = window.location.pathname.replace(/\/$/, '').endsWith('/admin');

const Root = isAdmin
  ? lazy(() => import('./admin/Admin'))
  : lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <Root />
    </Suspense>
  </React.StrictMode>
);
