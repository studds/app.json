import { readFileSync } from 'fs';
import { Convert } from './interfaces';

export function loadAppJson(path: string) {
    const json = readFileSync(path, { encoding: 'utf-8' });
    const appJson = Convert.toIAppJSON(json);
    return appJson;
}
