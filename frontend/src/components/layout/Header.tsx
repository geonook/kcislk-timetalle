import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../stores/useAppStore';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, language, setTheme, setLanguage } = useAppStore();

  const navigation = [
    { name: t('navigation.classes'), href: '/classes' },
    { name: t('navigation.students'), href: '/students' },
  ];

  const themeOptions = [
    { key: 'light', icon: SunIcon, label: t('theme.light') },
    { key: 'dark', icon: MoonIcon, label: t('theme.dark') },
    { key: 'system', icon: ComputerDesktopIcon, label: t('theme.system') },
  ];

  const languageOptions = [
    { key: 'zh-TW', label: t('language.zh-TW') },
    { key: 'en-US', label: t('language.en-US') },
  ];

  return (
    <header className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
      {/* Premium background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-50/30 via-transparent to-accent-50/30 dark:from-accent-900/10 dark:via-transparent dark:to-accent-900/10 pointer-events-none"></div>

      <div className="relative container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Premium Logo and title */}
          <Link to="/classes" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="relative w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 overflow-hidden">
                <img src="/kcislk-logo.png" alt="KCISLK Logo" className="w-8 h-8 object-contain" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-accent-700 to-accent-600 dark:from-white dark:via-accent-300 dark:to-accent-200 bg-clip-text text-transparent">
                {/* 響應式標題：極小螢幕顯示短版，中等螢幕顯示中版，大螢幕顯示完整版 */}
                <span className="block sm:hidden">{t('app.titleShort')}</span>
                <span className="hidden sm:block md:hidden">{t('app.titleMedium')}</span>
                <span className="hidden md:block">{t('app.title')}</span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block group-hover:text-accent-500 dark:group-hover:text-accent-400 transition-colors duration-200">
                {t('app.description')}
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Settings */}
          <div className="flex items-center space-x-3">
            {/* Theme selector */}
            <Menu as="div" className="relative">
              <Menu.Button className="p-3 rounded-2xl text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                {theme === 'light' && <SunIcon className="h-5 w-5" />}
                {theme === 'dark' && <MoonIcon className="h-5 w-5" />}
                {theme === 'system' && <ComputerDesktopIcon className="h-5 w-5" />}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-3 w-52 origin-top-right bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none z-[9999] border border-white/20">
                  <div className="p-2">
                    {themeOptions.map((option) => (
                      <Menu.Item key={option.key}>
                        {({ active }) => (
                          <button
                            onClick={() => setTheme(option.key as 'light' | 'dark' | 'system')}
                            className={`${
                              active ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600' : ''
                            } ${
                              theme === option.key ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20' : 'text-gray-900 dark:text-gray-100'
                            } group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200`}
                          >
                            <option.icon className="mr-3 h-4 w-4" />
                            {option.label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Language selector - Premium unified design */}
            <Menu as="div" className="relative">
              <Menu.Button className="p-3 rounded-2xl text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                <LanguageIcon className="h-5 w-5" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-3 w-48 origin-top-right bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none z-[9999] border border-white/20">
                  <div className="p-2">
                    {languageOptions.map((option) => (
                      <Menu.Item key={option.key}>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              setLanguage(option.key as 'zh-TW' | 'en-US');
                              i18n.changeLanguage(option.key);
                            }}
                            className={`${
                              active ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600' : ''
                            } ${
                              language === option.key ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20' : 'text-gray-900 dark:text-gray-100'
                            } group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200`}
                          >
                            <span className="mr-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
                              {option.key === 'zh-TW' ? '中' : 'EN'}
                            </span>
                            {option.label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Mobile navigation toggle - Premium design */}
          <div className="md:hidden">
            <Menu as="div" className="relative">
              <Menu.Button className="p-3 rounded-2xl text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none z-[9999] border border-white/20">
                  <div className="p-2">
                    {navigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            to={item.href}
                            className={`${
                              active ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600' : ''
                            } ${
                              location.pathname === item.href ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20' : 'text-gray-900 dark:text-gray-100'
                            } group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200`}
                          >
                            <span className="mr-3 text-lg">
                              {item.href === '/classes' ? '📚' : '👥'}
                            </span>
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}