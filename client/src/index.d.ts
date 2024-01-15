export {};

declare global {
  interface Window {
    env: {
      VEDA_SERVER_DOMAIN: string;
      isProd: boolean;
    };
  }
}
