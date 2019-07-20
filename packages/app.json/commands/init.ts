import { getBaseConfig } from './get-base-config';
import { writeAppJson } from './write-app-json';

export function init() {
    const appJson = getBaseConfig();
    writeAppJson(appJson);
}
