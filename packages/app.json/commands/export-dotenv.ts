import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { IAppJSON, IEnvVarDefinition } from '../interfaces';
import { loadAppJson } from './load-app-json';

export function exportDotenv(environmentName?: string) {
    // read existing dotenv config, if any
    config();
    const env = getEnv(environmentName);
    const dotenv = createDotEnv(env);
    writeFileSync('.env', dotenv, { encoding: 'utf-8' });
}
function createDotEnv(env: { [x: string]: string | IEnvVarDefinition }) {
    return Object.keys(env)
        .map(key => {
            const definition = env[key];
            const existingValue = process.env[key];
            const newValue =
                typeof definition === 'string'
                    ? definition
                    : definition.value || '';
            const value = existingValue || newValue;
            return `${key}=${value}`;
        })
        .join('\n');
}

function getEnv(environmentName: string | undefined) {
    const appJson = loadAppJson();
    const baseEnv = appJson.env || {};
    const environmentEnv = getEnvironmentEnv(environmentName, appJson);
    const env = { ...baseEnv, ...environmentEnv };
    return env;
}

function getEnvironmentEnv(
    environmentName: string | undefined,
    appJson: IAppJSON
) {
    const environment =
        environmentName &&
        appJson.environments &&
        appJson.environments[environmentName];
    const environmentEnv = (environment && environment.env) || {};
    return environmentEnv;
}
