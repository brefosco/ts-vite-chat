import { defineConfig } from "vitest/config";
import { mergeConfig } from "vite";
import type { UserConfig as VitestUserConfigInterface } from "vitest/config";
import viteConfig from "./vite.config";

const vitestConfig: VitestUserConfigInterface = {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/vitest.setup.ts"],
  },
};

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: vitestConfig.test,
  })
);
