import { writeFileSync } from 'fs';
import { IAppJSON } from '../interfaces';

export function writeAppJson(appJson: IAppJSON) {
    writeFileSync('app.json', JSON.stringify(appJson, null, 4), {
        encoding: 'utf-8'
    });
}
