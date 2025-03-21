import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';

import { store } from '@/store';

import './plugins/assets';
import App from './App.tsx';
import FallbackRender from './components/ErrorBoundary.tsx';
import { setupI18n } from './locales';
import { setupAppVersionNotification, setupDayjs, setupIconifyOffline, setupNProgress } from './plugins';

function setupApp() {
  setupI18n();

  const container = document.getElementById('root');

  if (!container) return;

  const root = createRoot(container);

  root.render(
    <ErrorBoundary fallbackRender={FallbackRender}>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  );

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  setupAppVersionNotification();
}

setupApp();
