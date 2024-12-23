import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    zod: "src/exports/zod.ts",
    yup: "src/exports/yup.ts",
    valibot: "src/exports/valibot.ts",
    typebox: "src/exports/typebox.ts",
    superstruct: "src/exports/superstruct.ts",
    runtypes: "src/exports/runtypes.ts",
    joi: "src/exports/joi.ts",
  },
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist",
  sourcemap: false,
  treeshake: "recommended",
});
