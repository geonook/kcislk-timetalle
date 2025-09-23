// ===== DOCKER ENVIRONMENT GLOBAL TYPE DECLARATIONS =====
// Comprehensive type definitions for complete Docker compatibility

/// <reference types="node" />
/// <reference types="vite/client" />

// ===== NODE.JS GLOBAL VARIABLES =====
// Complete Node.js runtime environment for Docker containers
declare const process: NodeJS.Process & {
  cwd(): string;
  env: NodeJS.ProcessEnv & Record<string, string>;
  platform: NodeJS.Platform;
  version: string;
  versions: NodeJS.ProcessVersions;
};

declare const global: typeof globalThis;
declare const __dirname: string;
declare const __filename: string;
declare const Buffer: BufferConstructor;

// ===== COMPLETE VITE MODULE DECLARATIONS =====
declare module 'vite' {
  export interface InlineConfig {
    root?: string;
    base?: string;
    mode?: string;
    define?: Record<string, any>;
    plugins?: (Plugin | Plugin[] | false | null | undefined)[];
    publicDir?: string | false;
    cacheDir?: string;
    resolve?: ResolveOptions;
    css?: CSSOptions;
    json?: JsonOptions;
    esbuild?: ESBuildOptions | false;
    assetsInclude?: string | RegExp | (string | RegExp)[];
    logLevel?: LogLevel;
    clearScreen?: boolean;
    envDir?: string;
    envPrefix?: string | string[];
    server?: ServerOptions;
    build?: BuildOptions;
    preview?: PreviewOptions;
    ssr?: SSROptions;
    optimizeDeps?: DepOptimizationOptions;
    worker?: {
      format?: 'es' | 'iife';
      plugins?: (Plugin | Plugin[])[];
      rollupOptions?: RollupOptions;
    };
    appType?: 'spa' | 'mpa' | 'custom';
  }

  export interface UserConfig extends InlineConfig {
    test?: any;
  }

  export interface Plugin {
    name: string;
    [key: string]: any;
  }

  export interface ResolveOptions {
    alias?: AliasOptions;
    dedupe?: string[];
    conditions?: string[];
    mainFields?: string[];
    extensions?: string[];
    preserveSymlinks?: boolean;
  }

  export interface AliasOptions {
    [find: string]: string;
  }

  export interface ServerOptions {
    host?: string | boolean;
    port?: number;
    strictPort?: boolean;
    https?: boolean | any;
    open?: boolean | string;
    proxy?: Record<string, string | ProxyOptions>;
    cors?: boolean | CorsOptions;
    headers?: OutgoingHttpHeaders;
    hmr?: boolean | { port?: number; host?: string };
    watch?: any;
    middlewareMode?: boolean | 'html' | 'ssr';
    fs?: { strict?: boolean; allow?: string[]; deny?: string[] };
    origin?: string;
  }

  export interface ProxyOptions {
    target: string;
    changeOrigin?: boolean;
    ws?: boolean;
    rewrite?: (path: string) => string;
    configure?: (proxy: any, options: any) => void;
  }

  export interface BuildOptions {
    target?: 'modules' | 'es2015' | string | string[];
    outDir?: string;
    assetsDir?: string;
    assetsInlineLimit?: number;
    cssCodeSplit?: boolean;
    cssTarget?: string | string[];
    sourcemap?: boolean | 'inline' | 'hidden';
    rollupOptions?: RollupOptions;
    commonjsOptions?: any;
    dynamicImportVarsOptions?: any;
    lib?: any;
    manifest?: boolean | string;
    ssrManifest?: boolean | string;
    ssr?: boolean | string;
    minify?: boolean | 'terser' | 'esbuild';
    terserOptions?: any;
    write?: boolean;
    emptyOutDir?: boolean | null;
    reportCompressedSize?: boolean;
    chunkSizeWarningLimit?: number;
    watch?: any;
  }

  export interface RollupOptions {
    [key: string]: any;
  }

  export interface CSSOptions {
    [key: string]: any;
  }

  export interface JsonOptions {
    [key: string]: any;
  }

  export interface ESBuildOptions {
    [key: string]: any;
  }

  export interface PreviewOptions {
    [key: string]: any;
  }

  export interface SSROptions {
    [key: string]: any;
  }

  export interface DepOptimizationOptions {
    include?: string[];
    exclude?: string[];
    entries?: string | string[];
    force?: boolean;
  }

  export interface CorsOptions {
    [key: string]: any;
  }

  export interface OutgoingHttpHeaders {
    [key: string]: any;
  }

  export type LogLevel = 'info' | 'warn' | 'error' | 'silent';

  export function defineConfig(config: UserConfig | ((env: any) => UserConfig)): UserConfig;
  export function loadEnv(mode: string, envDir: string, prefixes?: string | string[]): Record<string, string>;
  export function createServer(inlineConfig?: InlineConfig): Promise<any>;
  export function build(inlineConfig?: InlineConfig): Promise<any>;
  export function preview(inlineConfig?: InlineConfig): Promise<any>;
  export const version: string;
}

// ===== VITE PLUGIN REACT =====
declare module '@vitejs/plugin-react' {
  export interface Options {
    include?: string | RegExp | Array<string | RegExp>;
    exclude?: string | RegExp | Array<string | RegExp>;
    jsxImportSource?: string;
    jsxRuntime?: 'classic' | 'automatic';
    babel?: any;
    fastRefresh?: boolean;
  }

  export default function react(options?: Options): import('vite').Plugin;
}

// ===== NODE.JS PATH MODULE =====
declare module 'path' {
  export interface ParsedPath {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
  }

  export function resolve(...paths: string[]): string;
  export function normalize(p: string): string;
  export function isAbsolute(p: string): boolean;
  export function join(...paths: string[]): string;
  export function relative(from: string, to: string): string;
  export function dirname(p: string): string;
  export function basename(p: string, ext?: string): string;
  export function extname(p: string): string;
  export function parse(p: string): ParsedPath;
  export function format(pP: ParsedPath): string;
  export const sep: string;
  export const delimiter: string;
  export const posix: typeof import('path');
  export const win32: typeof import('path');
}

// ===== NODE.JS URL MODULE =====
declare module 'url' {
  export interface UrlObject {
    auth?: string | null;
    hash?: string | null;
    host?: string | null;
    hostname?: string | null;
    href?: string;
    pathname?: string | null;
    port?: string | number | null;
    protocol?: string | null;
    search?: string | null;
    slashes?: boolean | null;
  }

  export interface URLSearchParams {
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    getAll(name: string): string[];
    has(name: string): boolean;
    set(name: string, value: string): void;
    sort(): void;
    toString(): string;
    forEach(callbackfn: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: any): void;
  }

  export class URL {
    constructor(input: string, base?: string | URL);
    hash: string;
    host: string;
    hostname: string;
    href: string;
    readonly origin: string;
    password: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
    readonly searchParams: URLSearchParams;
    username: string;
    toString(): string;
    toJSON(): string;
  }

  export function parse(urlStr: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): UrlObject;
  export function format(URL: URL | UrlObject): string;
  export function resolve(from: string, to: string): string;
  export function domainToASCII(domain: string): string;
  export function domainToUnicode(domain: string): string;
  export function fileURLToPath(url: string | URL): string;
  export function pathToFileURL(path: string): URL;
}

// ===== REACT DOM CLIENT =====
declare module 'react-dom/client' {
  import { ReactNode } from 'react';

  export interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }

  export interface HydrationOptions {
    identifierPrefix?: string;
    onRecoverableError?: (error: any) => void;
  }

  export function createRoot(
    container: Element | DocumentFragment,
    options?: {
      identifierPrefix?: string;
      onRecoverableError?: (error: any) => void;
    }
  ): Root;

  export function hydrateRoot(
    container: Element | DocumentFragment,
    initialChildren: ReactNode,
    options?: HydrationOptions
  ): Root;
}

// ===== ENHANCED IMPORT META ENV =====
interface ImportMetaEnv {
  // Base Vite variables
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;

  // Custom application variables
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_DEV_MODE: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
  readonly VITE_LOG_LEVEL: string;
  readonly VITE_BUILD_TARGET: string;
  readonly VITE_MINIFY: string;
  readonly VITE_CSP_ENABLED: string;
  readonly VITE_SECURE_COOKIES: string;
  readonly VITE_DEPLOY_ENV: string;
  readonly VITE_CDN_URL: string;
  readonly VITE_ASSETS_URL: string;
  readonly VITE_BUNDLE_ANALYZER: string;
  readonly VITE_PRELOAD_IMAGES: string;

  // Allow additional custom variables
  readonly [key: `VITE_${string}`]: string;
}

// ===== ENHANCED IMPORT META =====
interface ImportMeta {
  readonly url: string;
  readonly env: ImportMetaEnv;
  readonly hot?: {
    readonly data: any;
    accept(): void;
    accept(cb: (mod: any) => void): void;
    accept(dep: string, cb: (mod: any) => void): void;
    accept(deps: string[], cb: (mods: any[]) => void): void;
    dispose(cb: (data: any) => void): void;
    decline(): void;
    invalidate(): void;
    on(event: string, cb: (...args: any[]) => void): void;
    send(event: string, data?: any): void;
  };
  glob?(pattern: string, options?: { eager?: boolean; as?: string }): Record<string, any>;
  globEager?(pattern: string): Record<string, any>;
  resolve?(id: string): Promise<string>;
}

// ===== DOCKER CONTAINER GLOBALS =====
// Ensure Docker environment variables are available
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DOCKER_ENV?: 'true' | 'false';
    [key: string]: string | undefined;
  }
}

// ===== ADDITIONAL TYPE SAFETY =====
// Prevent TypeScript errors in Docker builds
declare const __DEV__: boolean;
declare const __PROD__: boolean;
declare const __VERSION__: string;
declare const __BUILD_TIME__: string;

// Module resolution fallbacks
declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.js' {
  const value: any;
  export default value;
}

declare module '*.ts' {
  const value: any;
  export default value;
}