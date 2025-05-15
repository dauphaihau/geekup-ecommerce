export type AppConfig = {
  nodeEnv: string;
  name: string;
  url: string;
  port: number;
  apiPrefix: string;
  apiVersion: string;
  debug: boolean;
  frontendDomain?: string;
  backendDomain: string;
  // fallbackLanguage: string;
  // logLevel: string;
  // logService: string;
  corsOrigin: boolean | string | RegExp | (string | RegExp)[];
  throttleTTL: number;
  throttleLimit: number;
};
