import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = path.join(process.cwd(), "src");
const EXT = ["", ".ts", ".tsx", ".js", ".mjs"];

function tryFile(base) {
  for (const ext of EXT) {
    const candidate = base + ext;
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate;
    }
  }
  const indexTs = path.join(base, "index.ts");
  if (existsSync(indexTs)) return indexTs;
  const indexTsx = path.join(base, "index.tsx");
  if (existsSync(indexTsx)) return indexTsx;
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const file = tryFile(path.join(SRC, specifier.slice(2)));
    if (!file) throw new Error(`Cannot resolve ${specifier}`);
    return { shortCircuit: true, url: pathToFileURL(file).href };
  }

  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !path.extname(specifier.split("?")[0])
  ) {
    const parent = fileURLToPath(context.parentURL);
    const file = tryFile(path.resolve(path.dirname(parent), specifier));
    if (file) {
      return { shortCircuit: true, url: pathToFileURL(file).href };
    }
  }

  return nextResolve(specifier, context);
}
