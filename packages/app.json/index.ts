#!/usr/bin/env node

import { exportDotenv } from './commands/export-dotenv';
import { init } from './commands/init';

init();
exportDotenv();
