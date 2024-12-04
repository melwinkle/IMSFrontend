/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly API_URL_AUTH: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }