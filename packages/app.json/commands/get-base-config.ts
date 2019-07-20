import { IAppJSON } from '../interfaces';

export function getBaseConfig(): IAppJSON {
    return {
        uri: '',
        env: {},
        environments: {
            local: {
                env: {}
            }
        }
    };
}
