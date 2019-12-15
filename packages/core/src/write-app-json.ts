import { writeFileSync } from 'fs';
import { IAppJSON } from './interfaces';

export function writeAppJson(path: string, appJson: IAppJSON) {
    writeFileSync(path, JSON.stringify(appJson, null, 4), {
        encoding: 'utf-8'
    });
}
