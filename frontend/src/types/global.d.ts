// Global type declarations for Docker environment compatibility

// Node.js globals for Vite config
declare const process: {
  cwd(): string;
  env: Record<string, string>;
};

declare const __dirname: string;
declare const __filename: string;

// React DOM Client types
declare module 'react-dom/client' {
  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
  export function hydrateRoot(container: Element | DocumentFragment, initialChildren: React.ReactNode): Root;
}

// Vite plugin types
declare module '@vitejs/plugin-react' {
  export interface PluginOptions {
    include?: string | RegExp | (string | RegExp)[];
    exclude?: string | RegExp | (string | RegExp)[];
    jsxImportSource?: string;
    jsxRuntime?: 'classic' | 'automatic';
    babel?: any;
  }

  export default function react(options?: PluginOptions): any;
}

// Vite core types
declare module 'vite' {
  export interface UserConfig {
    plugins?: any[];
    resolve?: {
      alias?: Record<string, string>;
    };
    server?: {
      port?: number;
      proxy?: Record<string, any>;
    };
    build?: any;
    define?: Record<string, string>;
    esbuild?: any;
    optimizeDeps?: any;
  }

  export function defineConfig(config: UserConfig | ((env: any) => UserConfig)): UserConfig;
  export function loadEnv(mode: string, envDir: string, prefixes?: string | string[]): Record<string, string>;
}

// Path module types
declare module 'path' {
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
  export function join(...paths: string[]): string;
  export const sep: string;
}

// URL module types
declare module 'url' {
  export function fileURLToPath(url: string | URL): string;
  export class URL {
    constructor(input: string, base?: string | URL);
    href: string;
    pathname: string;
  }
}

// Additional Vite environment variables
interface ImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

// Extend the existing ImportMeta interface
interface ImportMeta {
  readonly url: string;
  readonly hot?: {
    accept(): void;
    accept(cb: (mod: any) => void): void;
    accept(dep: string, cb: (mod: any) => void): void;
    accept(deps: string[], cb: (mods: any[]) => void): void;
    dispose(cb: (data: any) => void): void;
    decline(): void;
    invalidate(): void;
    on(event: string, cb: (...args: any[]) => void): void;
  };
}