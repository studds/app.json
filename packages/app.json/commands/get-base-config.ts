import { IAppJSON } from '../interfaces';

export function getBaseConfig(): IAppJSON {
    return {
        id: '',
        env: {},
        environments: {
            local: {
                env: {}
            }
        }
    };
}
