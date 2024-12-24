/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_apiKey: string;
  readonly VITE_authDomain: string;
  readonly VITE_projectId: string;
  readonly VITE_storageBucket: string;
  readonly VITE_messagingSenderId: string;
  readonly VITE_appId: string;
  readonly VITE_measurementId: string;
  readonly VITE_baseUrl: string;
  readonly VITE_time_delay_announcement: number;
  readonly VITE_RECAPTCHA_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
