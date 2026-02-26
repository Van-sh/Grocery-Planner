// https://vite.dev/guide/env-and-mode#intellisense-for-typescript

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

// This does not cause parsing, avoid using non-string types
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_LOGIN_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
