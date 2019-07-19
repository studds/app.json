import { IAppJSON } from '../interfaces';
import { writeFileSync } from 'fs';

export function init() {
    const appJson: IAppJSON = {
        uri: '',
        env: {},
        environments: {
            local: {
                env: {}
            }
        }
    };
    writeFileSync('app.json', JSON.stringify(appJson, null, 4), {
        encoding: 'utf-8'
    });
}
