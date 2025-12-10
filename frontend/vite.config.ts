import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon-192x192.png", "icon-512x512.png"],
      manifest: {
        name: "FineStock AI",
        short_name: "FineStock AI",
        description:
          "FineStock AI is an AI-powered system that predicts purchase needs, streamlines purchase order workflows, automates approvals, reduces delays, and ensures accurate, real-time inventory management.",
        theme_color: "#1B3182",
        background_color: "#fcfcfc",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
