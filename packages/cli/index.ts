#!/usr/bin/env node

import { exportDotenv } from './commands/export-dotenv';
import { exportTs } from './commands/export-ts';
import { generateFromCf } from './commands/generate';
import { init } from './commands/init';

const command = process.argv[2];

if (command === 'init') {
    init();
} else if (command === 'dotenv') {
    exportDotenv();
} else if (command === 'generate') {
    generateFromCf();
} else if (command === 'ts') {
    exportTs();
} else {
    console.error('Incorrect usage: ajx init|dotenv|generate|ts');
    process.exit(1);
}