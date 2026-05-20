#!/usr/bin/env node

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const sourceRoot = path.join(packageRoot, "src");
const scaffoldRoot = path.join(packageRoot, "scaffold");

const COPY_DIRS = ["account", "mfa", "socialaccount", "usersessions"];
const EXCLUDED_FILES = new Set([
  "GoogleOneTap.jsx",
  "ProviderList.jsx",
  "WebAuthnLoginButton.jsx",
]);

function usage() {
  console.error(
    "Usage: generate-auth-screens --target <web-app-dir> [--overwrite]"
  );
}

function parseArgs(argv) {
  const options = {
    overwrite: false,
    target: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--target":
        options.target = argv[i + 1];
        i += 1;
        break;
      case "--overwrite":
        options.overwrite = true;
        break;
      case "-h":
      case "--help":
        usage();
        process.exit(0);
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.target) {
    throw new Error("Missing required --target argument.");
  }

  return options;
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
      continue;
    }
    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function transformSource(content) {
  let next = content;

  next = next.replaceAll("../auth/hooks", "openbase-auth-client/auth");
  next = next.replaceAll("../auth", "openbase-auth-client/auth");
  next = next.replaceAll("../lib/allauth", "openbase-auth-client/allauth");
  next = next.replace(
    /import\s+Button\s+from\s*['"][^'"]*components\/Button['"];?/g,
    'import { Button } from "@/components/ui/button";'
  );
  next = next.replace(
    /import\s+FormErrors\s+from\s*['"][^'"]*components\/FormErrors['"];?/g,
    'import { FormErrors } from "openbase-auth-client";'
  );
  next = next.replace(
    /import\s+ProviderList\s+from\s*['"][^'"]*ProviderList['"];?/g,
    'import { ProviderList } from "openbase-auth-client";'
  );
  next = next.replace(
    /import\s+WebAuthnLoginButton\s+from\s*['"][^'"]*WebAuthnLoginButton['"];?/g,
    'import { WebAuthnLoginButton } from "openbase-auth-client";'
  );
  next = next.replace(
    /import\s+useLogin\s+from\s*['"][^'"]*useLogin['"];?/g,
    'import { useLogin } from "openbase-auth-client";'
  );

  return next;
}

async function buildFileMap() {
  const fileMap = new Map();

  const scaffoldFiles = await walkFiles(scaffoldRoot);
  for (const filePath of scaffoldFiles) {
    if (!filePath.endsWith(".jsx")) {
      continue;
    }
    const relativePath = path.relative(scaffoldRoot, filePath);
    fileMap.set(relativePath, filePath);
  }

  for (const dirName of COPY_DIRS) {
    const dirPath = path.join(sourceRoot, dirName);
    const files = await walkFiles(dirPath);
    for (const filePath of files) {
      if (!filePath.endsWith(".jsx")) {
        continue;
      }
      if (EXCLUDED_FILES.has(path.basename(filePath))) {
        continue;
      }
      const relativeSourcePath = path.relative(sourceRoot, filePath);
      const destinationPath = path.join("auth", relativeSourcePath);
      if (!fileMap.has(destinationPath)) {
        fileMap.set(destinationPath, filePath);
      }
    }
  }

  return fileMap;
}

async function writeAuthScreens(targetRoot, overwrite) {
  const targetSrcRoot = path.join(targetRoot, "src");
  const fileMap = await buildFileMap();

  await mkdir(path.join(targetSrcRoot, "auth"), { recursive: true });

  const created = [];
  const skipped = [];
  const overwritten = [];

  for (const [relativePath, sourcePath] of fileMap.entries()) {
    const destinationPath = path.join(targetSrcRoot, relativePath);
    const destinationDir = path.dirname(destinationPath);
    const hasExistingFile = existsSync(destinationPath);

    if (hasExistingFile && !overwrite) {
      skipped.push(path.relative(targetRoot, destinationPath));
      continue;
    }

    await mkdir(destinationDir, { recursive: true });
    const source = await readFile(sourcePath, "utf8");
    const output =
      sourcePath.startsWith(scaffoldRoot) ? source : transformSource(source);
    await writeFile(destinationPath, output);

    const relativeDestinationPath = path.relative(targetRoot, destinationPath);
    if (hasExistingFile) {
      overwritten.push(relativeDestinationPath);
    } else {
      created.push(relativeDestinationPath);
    }
  }

  return { created, skipped, overwritten };
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const targetRoot = path.resolve(process.cwd(), options.target);
    const summary = await writeAuthScreens(targetRoot, options.overwrite);

    console.log(`Generated auth screens into ${targetRoot}`);
    console.log(`Created: ${summary.created.length}`);
    for (const filePath of summary.created) {
      console.log(`  + ${filePath}`);
    }
    console.log(`Skipped existing: ${summary.skipped.length}`);
    for (const filePath of summary.skipped) {
      console.log(`  = ${filePath}`);
    }
    console.log(`Overwritten: ${summary.overwritten.length}`);
    for (const filePath of summary.overwritten) {
      console.log(`  ~ ${filePath}`);
    }
  } catch (error) {
    console.error(error.message);
    usage();
    process.exit(1);
  }
}

await main();
