// Configuration file to handle environment variables

// Type for Vite environment variables
interface ViteEnv {
  VITE_API_BASE_URL?: string;
  VITE_APP_NAME?: string;
  VITE_APP_VERSION?: string;
}

interface Config {
  API_BASE_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
}

// Type assertion for import.meta.env
const env = (import.meta as any).env as ViteEnv;

const config: Config = {
  API_BASE_URL: env.VITE_API_BASE_URL || 'http://localhost:9090',
  APP_NAME: env.VITE_APP_NAME || 'POSWeb',
  APP_VERSION: env.VITE_APP_VERSION || '1.0.0'
};

export default config;
export type { Config };
