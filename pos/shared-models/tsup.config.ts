import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"], // ✅ dual output
  dts: true, // ✅ emit .d.ts files
  sourcemap: true,
  clean: true,
  splitting: false,
  target: "es2020",
});
