import Template from 'cloudform-types/types/template';
import { CLOUDFORMATION_SCHEMA } from 'cloudformation-js-yaml-schema';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';

// todo: share this with nx-sam
export function loadCloudFormationTemplate(templatePath: string): Template {
    const yaml = readFileSync(templatePath, { encoding: 'utf-8' });
    const cf: Template = load(yaml, {
        schema: CLOUDFORMATION_SCHEMA
    });
    return cf;
}
