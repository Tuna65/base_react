import svgr from "@svgr/rollup";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// const isProduction = process.env.NODE_ENV === 'production';
// const env = dotenv.config({ path: isProduction ? '.env.production' : '.env.development' }).parsed;
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
