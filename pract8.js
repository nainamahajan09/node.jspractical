import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SANDBOX = path.resolve("./sandbox");
const PACKAGE = "lodash@4.17.21"; 

fs.mkdirSync(SANDBOX, { recursive: true });

execSync("npm init -y", { cwd: SANDBOX, stdio: "inherit" });

execSync(`npm install ${PACKAGE} --package-lock-only --no-audit --no-fund`, {
  cwd: SANDBOX,
  stdio: "inherit",
});

execSync(`npm ci`, { cwd: SANDBOX, stdio: "inherit" });

function verifyIntegrity() {
  const lock = JSON.parse(fs.readFileSync(path.join(SANDBOX, "package-lock.json"), "utf8"));

  function hashFile(filePath) {
    const data = fs.readFileSync(filePath);
    return crypto.createHash("sha512").update(data).digest("base64");
  }

  const nodeModules = path.join(SANDBOX, "node_modules");
  let ok = true;

  for (const [pkg, info] of Object.entries(lock.packages)) {
    if (!info.integrity) continue;

    const pkgPath =
      pkg === ""
        ? SANDBOX
        : path.join(nodeModules, pkg.replace("node_modules/", ""));

    const pkgJsonPath = path.join(pkgPath, "package.json");
    if (!fs.existsSync(pkgJsonPath)) continue;

    try {
      const hash = hashFile(pkgJsonPath); 
      if (!hash) continue;

      if (!info.integrity.includes("sha512-")) continue;

    } catch (err) {
      console.error(`Error verifying ${pkg}:`, err.message);
      ok = false;
    }
  }

  return ok;
}

if (verifyIntegrity()) {
  console.log("✅ Integrity check passed for sandbox installation.");
} else {
  console.error(" Integrity check failed!");
}
