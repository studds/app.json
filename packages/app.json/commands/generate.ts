import { underscore } from '@angular-devkit/core/src/utils/strings';
import Template from 'cloudform-types/types/template';
import merge from 'lodash.merge';
import { IAppJSON } from '../interfaces';
import { getBaseConfig } from './get-base-config';
import { loadCloudFormationTemplate } from './load-cloud-formation-template';
import { writeAppJson } from './write-app-json';

// todo: extract this to a separate package, which means also extracting the interfaces
export function generateFromCf() {
    const template = loadCloudFormationTemplate('template.yaml');
    const baseJson = getBaseConfig();
    const outJson: Partial<IAppJSON> = {
        env: getEnv(template),
        output: getOutputs(template)
    };
    const appJson = merge(baseJson, outJson);
    writeAppJson(appJson);
}

function getEnv(template: Template): IAppJSON['env'] {
    const cfParameters = template.Parameters || {};
    const env: IAppJSON['env'] = {};
    Object.keys(cfParameters).forEach(key => {
        const param = cfParameters[key];
        const envKey = underscore(key).toUpperCase();
        env[envKey] = {
            description:
                param.Description || `CloudFormation parameter: ${key}`,
            required: !!param.Default,
            value: param.Default
        };
    });
    return env;
}

function getOutputs(template: Template): IAppJSON['output'] {
    const cfOutputs = template.Outputs || {};
    const output: IAppJSON['output'] = {};
    Object.keys(cfOutputs).forEach(key => {
        const cfOutput = cfOutputs[key];
        const envKey = underscore(key).toUpperCase();
        output[key] = {
            description:
                (cfOutput.Description as string) ||
                `CloudFormation output: ${key}`,
            mapTo: envKey
        };
    });
    return output;
}
