import { readFileSync } from 'fs';
import { Convert } from '../interfaces';

export function loadAppJson() {
    const json = readFileSync('app.json', { encoding: 'utf-8' });
    const appJson = Convert.toIAppJSON(json);
    return appJson;
}
