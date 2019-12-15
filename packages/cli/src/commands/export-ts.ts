import { camelize, IAppJSON, IComponent, loadAppJson } from '@app.json/core';
import { writeFileSync } from 'fs';
import { parse, resolve } from 'path';
import { format } from 'prettier';

export function exportTs(appJsonPath: string) {
    const appJson = loadAppJson(appJsonPath);
    const code = [
        `function getEnvSafe(name: string): string {
        const value = process.env[name];
        if (!value) {
            throw new Error(\`Environment variable \${name} was undefined\`)
        }
        return value;
    }`
    ];
    code.push(...generateConfigTs(appJson));
    const configPath = resolve(parse(appJsonPath).dir, 'config.ts');
    writeFileSync(
        configPath,
        format(code.join('\n'), {
            singleQuote: true,
            tabWidth: 4,
            filepath: 'config.ts'
        })
    );
}

function generateConfigTs(appJson: IAppJSON): string[] {
    const env = appJson.env;
    if (!env) {
        return [];
    }
    const code = ['export const config = {'];
    Object.keys(env).forEach(key => {
        code.push(generateEnvGetter(key));
    });
    code.push(...generateComponentsTs(appJson));
    code.push('};');
    return code;
}

function generateComponentsTs(appJson: IAppJSON): string[] {
    const components = appJson.components;
    if (!components) {
        return [];
    }
    const code = [`components: {`];
    components.forEach(component => {
        code.push(...generateComponentTs(component));
    });
    code.push('},');
    return code;
}

function generateComponentTs(component: IComponent): string[] {
    const code = [`get ${camelize(component.name)}() {`];
    code.push('return {');
    component.variables.forEach(key => {
        code.push(`${camelize(key.toLowerCase())}: getEnvSafe('${key}'),`);
    });
    code.push('}},');
    return code;
}

function generateEnvGetter(key: string): string {
    return `get ${camelize(
        key.toLowerCase()
    )}(): string {return getEnvSafe('${key}')},`;
}
