/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_WATCH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot?: {
    accept(): void;
    accept(cb: (modules: any[]) => void): void;
    accept(dep: string, cb: (mod: any) => void): void;
  };
}
