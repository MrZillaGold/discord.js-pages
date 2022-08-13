import { promises as fs } from 'fs';

import tsconfig from '../tsconfig.json' assert { type: 'json' };

const OUT_DIR = tsconfig.compilerOptions.outDir;

await fs.rm(`./${OUT_DIR}`, {
    recursive: true
});
