import { underscore } from '@angular-devkit/core/src/utils/strings';
import Template from 'cloudform-types/types/template';
import merge from 'lodash.merge';
import { IAppJSON, IEnvVarDefinition } from '../interfaces';
import { getBaseConfig } from './get-base-config';
import { loadCloudFormationTemplate } from './load-cloud-formation-template';
import { writeAppJson } from './write-app-json';

type IEnvVar = IEnvVarDefinition | string;

// todo: extract this to a separate package, which means also extracting the interfaces
export function generateFromCf() {
    const template = loadCloudFormationTemplate('template.yaml');
    const baseJson = getBaseConfig();
    const components = getComponents(template);
    const outJson: Partial<IAppJSON> = {
        env: getEnv(template, components),
        output: getOutputs(template),
        components
    };
    const appJson = merge(baseJson, outJson);
    writeAppJson(appJson);
}

function getEnv(
    template: Template,
    components: IAppJSON['components']
): IAppJSON['env'] {
    const cfParameters = template.Parameters || {};
    const env: IAppJSON['env'] = {};
    Object.keys(cfParameters).forEach(key => {
        const param = cfParameters[key];
        const envKey = underscore(key).toUpperCase();
        env[envKey] = {
            description:
                param.Description || `CloudFormation parameter: ${key}`,
            value: param.Default,
            type: ['cf::param']
        };
    });
    if (components) {
        components.forEach(component => {
            component.variables.forEach(name => {
                const definition: IEnvVar = (env[name] = env[name] || {
                    description: '',
                    value: '',
                    type: []
                });
                if (typeof definition === 'object') {
                    definition.type = definition.type || [];
                    if (
                        definition.type.indexOf('cf::function-env-var') === -1
                    ) {
                        definition.type.push('cf::function-env-var');
                    }
                } else {
                    throw new Error(
                        `Unsupported case, trying to extend string def for env var ${name}, should not happen when generating from cf template`
                    );
                }
            });
        });
    }

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

function getComponents(template: Template): IAppJSON['components'] {
    const resources = template.Resources;
    const components: IAppJSON['components'] = [];
    if (!resources) {
        return;
    }
    Object.keys(resources).forEach(key => {
        const resource = resources[key];
        const properties = resource.Properties;
        if (properties && typeof properties.Environment === 'object') {
            components.push({
                name: properties.FunctionName || key,
                variables: Object.keys(properties.Environment.Variables)
            });
        }
    });
    return components;
}
