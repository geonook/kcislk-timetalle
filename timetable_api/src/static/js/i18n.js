/**
 * Internationalization (i18n) Module for KCISLK Timetable System
 * Supports Chinese (zh-TW) and English (en-US) languages
 */

class I18n {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'zh-TW';
        this.translations = {};
        this.isLoaded = false;
        this.loadPromise = null;
    }

    /**
     * Get stored language preference from localStorage
     */
    getStoredLanguage() {
        return localStorage.getItem('language');
    }

    /**
     * Store language preference to localStorage
     */
    setStoredLanguage(language) {
        localStorage.setItem('language', language);
    }

    /**
     * Initialize i18n system and load language files
     */
    async init() {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.loadLanguages();
        await this.loadPromise;
        this.updatePageLanguage();
        this.setupLanguageSwitcher();
        return this.loadPromise;
    }

    /**
     * Load all language files
     */
    async loadLanguages() {
        try {
            const languages = ['zh-TW', 'en-US'];
            const promises = languages.map(lang => this.loadLanguage(lang));
            await Promise.all(promises);
            this.isLoaded = true;
        } catch (error) {
            console.error('Failed to load language files:', error);
            this.isLoaded = false;
        }
    }

    /**
     * Load a specific language file
     */
    async loadLanguage(language) {
        try {
            const response = await fetch(`/static/locales/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${language}.json`);
            }
            const translations = await response.json();
            this.translations[language] = translations;
        } catch (error) {
            console.error(`Error loading language ${language}:`, error);
            throw error;
        }
    }

    /**
     * Get translation for a key path
     * @param {string} keyPath - Dot-separated key path (e.g., 'site.title')
     * @param {object} replacements - Object with replacement values for placeholders
     * @returns {string} Translated text
     */
    t(keyPath, replacements = {}) {
        if (!this.isLoaded || !this.translations[this.currentLanguage]) {
            return keyPath;
        }

        const keys = keyPath.split('.');
        let translation = this.translations[this.currentLanguage];

        for (const key of keys) {
            if (translation && typeof translation === 'object' && key in translation) {
                translation = translation[key];
            } else {
                console.warn(`Translation key not found: ${keyPath}`);
                return keyPath;
            }
        }

        if (typeof translation !== 'string') {
            console.warn(`Translation value is not a string: ${keyPath}`);
            return keyPath;
        }

        // Replace placeholders like {0}, {1}, etc.
        return translation.replace(/\{(\d+)\}/g, (match, index) => {
            return replacements[index] || match;
        });
    }

    /**
     * Change the current language
     */
    async changeLanguage(language) {
        if (language === this.currentLanguage) {
            return;
        }

        if (!this.translations[language]) {
            console.error(`Language ${language} not loaded`);
            return;
        }

        this.currentLanguage = language;
        this.setStoredLanguage(language);
        this.updatePageLanguage();
        this.updateLanguageSwitcher();

        // Trigger language change event
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: language }
        }));
    }

    /**
     * Update all translatable elements on the page
     */
    updatePageLanguage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update page title
        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.hasAttribute('data-i18n')) {
            const key = titleElement.getAttribute('data-i18n');
            titleElement.textContent = this.t(key);
        }

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    /**
     * Setup language switcher functionality
     */
    setupLanguageSwitcher() {
        const switcher = document.getElementById('language-toggle');
        if (switcher) {
            switcher.addEventListener('click', () => {
                const newLanguage = this.currentLanguage === 'zh-TW' ? 'en-US' : 'zh-TW';
                this.changeLanguage(newLanguage);
            });
        }
    }

    /**
     * Update language switcher display
     */
    updateLanguageSwitcher() {
        const switcher = document.getElementById('language-toggle');
        const zhIcon = document.getElementById('lang-zh-icon');
        const enIcon = document.getElementById('lang-en-icon');

        if (switcher && zhIcon && enIcon) {
            if (this.currentLanguage === 'zh-TW') {
                zhIcon.classList.remove('hidden');
                enIcon.classList.add('hidden');
            } else {
                zhIcon.classList.add('hidden');
                enIcon.classList.remove('hidden');
            }
        }
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Check if i18n is loaded
     */
    isReady() {
        return this.isLoaded;
    }
}

// Create global i18n instance
window.i18n = new I18n();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.i18n.init();
        console.log('I18n system initialized successfully');
    } catch (error) {
        console.error('Failed to initialize i18n system:', error);
    }
});

// Utility function for quick access
window.t = (key, replacements) => window.i18n.t(key, replacements);