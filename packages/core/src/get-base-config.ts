import { IAppJSON } from './interfaces';

export function getBaseConfig(): IAppJSON {
    return {
        name: '',
        env: {},
        environments: {
            local: {
                env: {}
            }
        }
    };
}
