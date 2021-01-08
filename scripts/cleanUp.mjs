import { promises as fs } from "fs";

import tsconfig from "../tsconfig.json";

const OUT_DIR = tsconfig.compilerOptions.outDir;

await fs.rmdir(`./${OUT_DIR}`, { recursive: true });
