import { access, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

import ts from "typescript";

const projectRoot = process.cwd();

async function exists(candidate) {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function resolveAlias(specifier) {
  const stripped = specifier.slice(2);
  const basePath = path.join(projectRoot, stripped);
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.jsx`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.js"),
    path.join(basePath, "index.jsx"),
  ];

  for (const candidate of candidates) {
    if (await exists(candidate)) {
      return pathToFileURL(candidate).href;
    }
  }

  throw new Error(`Cannot resolve alias import: ${specifier}`);
}

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith("@/")) {
    return {
      url: await resolveAlias(specifier),
      shortCircuit: true,
    };
  }

  if (specifier.startsWith("next/") && !specifier.endsWith(".js")) {
    try {
      return await defaultResolve(`${specifier}.js`, context, defaultResolve);
    } catch {
      // Fall through to the default resolver for any special Next subpath that
      // does not use a .js entrypoint.
    }
  }

  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (url.endsWith(".ts") || url.endsWith(".tsx")) {
    const filename = fileURLToPath(url);
    const fileSource = await readFile(filename, "utf8");
    const transpiled = ts.transpileModule(fileSource, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        resolveJsonModule: true,
      },
      fileName: filename,
    });

    return {
      format: "module",
      source: transpiled.outputText,
      shortCircuit: true,
    };
  }

  return defaultLoad(url, context, defaultLoad);
}
