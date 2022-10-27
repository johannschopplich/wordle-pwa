/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />
/// <reference types="unplugin-icons/types/vue" />

interface ImportMetaEnv {
  readonly VITE_STARTS_AT?: string;
  readonly VITE_ANSWERS?: string;
  readonly VITE_GOOGLE_API_KEY?: string;
  readonly VITE_SPREADSHEET_ID?: string;
  readonly VITE_SPREADSHEET_SHEET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
