/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_DEV_MODE: string
  readonly VITE_ENABLE_DEVTOOLS: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_BUILD_TARGET: string
  readonly VITE_MINIFY: string
  readonly VITE_CSP_ENABLED: string
  readonly VITE_SECURE_COOKIES: string
  readonly VITE_DEPLOY_ENV: string
  readonly VITE_CDN_URL: string
  readonly VITE_ASSETS_URL: string
  readonly VITE_BUNDLE_ANALYZER: string
  readonly VITE_PRELOAD_IMAGES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
