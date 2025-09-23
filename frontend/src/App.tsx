import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from './stores/useAppStore';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { applyTheme } from './utils/theme';

function App() {
  const { i18n } = useTranslation();
  const { theme, language } = useAppStore();

  // Apply theme and language on mount and changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
