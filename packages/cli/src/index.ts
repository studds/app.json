#!/usr/bin/env node

import { generateFromCf } from '@app.json/cloudformation';
import { init } from '@app.json/core';
import * as yargs from 'yargs';
import { exportDotenv } from './commands/export-dotenv';
import { exportTs } from './commands/export-ts';

yargs
    .scriptName('@app.json/cli')
    .usage('$0 <cmd> [args]')
    .command(
        'init',
        'Create an empty app.json file',
        args => {
            return args.option('path', { required: true, string: true });
        },
        argv => {
            init(argv.path);
        }
    )
    .command(
        'dotenv',
        'Export a dotenv file based on an app.json',
        args => {
            return args.option('path', { required: true, string: true });
        },
        argv => {
            exportDotenv(argv.path);
        }
    )
    .command(
        'generate',
        'Generate an app.json based on a cloudformation template',
        args => {
            return args.option('template', { required: true, string: true });
        },
        argv => {
            generateFromCf(argv.template);
        }
    )
    .command(
        'ts',
        'Generate a config.ts based on an app.json file',
        args => {
            return args.option('path', { required: true, string: true });
        },
        argv => {
            exportTs(argv.path);
        }
    )
    .help()
    .parse();
