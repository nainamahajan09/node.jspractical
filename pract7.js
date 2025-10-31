import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function dynamicImport(file) {
  try {
    const module = await import(file);
    return module.default || module;
  } catch (err) {
    console.error(` Failed to dynamically import ${file}:`, err.message);
    return null;
  }
}

(async () => {
  const jsModule = await dynamicImport("./test.mjs");
  console.log("Loaded JS module:", jsModule);

  try {
    const jsonPath = path.join(__dirname, "config.json");
    const jsonText = fs.readFileSync(jsonPath, "utf8");
    const jsonData = JSON.parse(jsonText);
    console.log("Loaded JSON data:", jsonData);
  } catch (err) {
    console.error(" Failed to load JSON:", err.message);
  }
})();
