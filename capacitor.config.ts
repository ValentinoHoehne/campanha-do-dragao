import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.ae592",
  appName: "Campanha do Dragão",
  // O app web roda com renderização no servidor, então o APK carrega o site
  // publicado dentro da WebView nativa em vez de arquivos estáticos locais.
  webDir: "dist",
  server: {
    url: "https://id-preview--ae5929a3-73f1-4aa6-a3b8-9c3ebeaf4e77.lovable.app",
    cleartext: false,
  },
  android: {
    backgroundColor: "#111a2e",
  },
};

export default config;
