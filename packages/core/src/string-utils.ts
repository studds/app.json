const STRING_CAMELIZE_REGEXP = /(-|_|\.|\s)+(.)?/g;
const STRING_UNDERSCORE_REGEXP_1 = /([a-z\d])([A-Z]+)/g;
const STRING_UNDERSCORE_REGEXP_2 = /-|\s+/g;

export function camelize(str: string): string {
    return str
        .replace(
            STRING_CAMELIZE_REGEXP,
            (_match: string, _separator: string, chr: string) => {
                return chr ? chr.toUpperCase() : '';
            }
        )
        .replace(/^([A-Z])/, (match: string) => match.toLowerCase());
}

export function underscore(str: string): string {
    return str
        .replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2')
        .replace(STRING_UNDERSCORE_REGEXP_2, '_')
        .toLowerCase();
}
