import { getBaseConfig } from './get-base-config';
import { writeAppJson } from './write-app-json';

export function init(path: string) {
    const appJson = getBaseConfig();
    writeAppJson(path, appJson);
}
