import { defineConfig } from "@vscode/test-cli";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    tests: [
        {
            files: "dist/test/**/*.spec.js",
            extensionDevelopmentPath: __dirname,
            srcDir: "dist/ext"
        }
    ],
    coverage: {
        includeAll: true,
        exclude: [join(__dirname, "dist/test")]
    },
});
