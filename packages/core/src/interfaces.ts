// To parse this data:
//
//   import { Convert, IAppJSON } from "./file";
//
//   const iAppJSON = Convert.toIAppJSON(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface IAppJSON {
    /**
     * List of components for this app
     */
    components?: IComponent[];
    /**
     * List of dependencies for this app
     */
    dependencies?: IDependency[];
    /**
     * A key-value object for config variables to add to the app’s runtime environment. Keys are
     * the names of the config variables. Values can be strings or objects. If the value is a
     * string, it will be used. If the value is an object, it defines specific requirements for
     * that variable.
     */
    env?: { [key: string]: IEnvVarDefinition | string };
    /**
     * A key-value object holding environment-specific overrides for app.json keys.
     * Each key in the object is the name of an environment.
     * This can include runtime environments, but can also include 'local' for local development
     * or 'ci'
     * for CI.
     */
    environments?: { [key: string]: IEnvironment };
    /**
     * Unique name for this app. This is used to resolve dependencies.
     */
    name: string;
    /**
     * Outputs that are available once this app is deployed
     */
    output?: { [key: string]: IOutputDefinition };
}

/**
 * List of components for this app
 */
export interface IComponent {
    /**
     * The name of this component
     */
    name: string;
    /**
     * The environment variables for this component (must be defined in the env section)
     */
    variables: string[];
}

/**
 * List of dependencies for this app
 */
export interface IDependency {
    /**
     * The environment variables to import from this dependency (must much those defined in
     * app.json)
     */
    imports: string[];
    /**
     * The name of the app we're dependent on (as defined in another app.json)
     */
    name: string;
}

export interface IEnvVarDefinition {
    /**
     * a human-friendly blurb about what the value is for and how to determine what it should be
     */
    description: string;
    /**
     * The type of parameter, can be used to indicate the source for example
     */
    type?: string[];
    /**
     * a default value to use. This should always be a string.
     */
    value?: string;
}

export interface IEnvironment {
    /**
     * A key-value object for config variables to add to the app’s runtime environment. Keys are
     * the names of the config variables. Values can be strings or objects. If the value is a
     * string, it will be used. If the value is an object, it defines specific requirements for
     * that variable.
     */
    env?: { [key: string]: IEnvVarDefinition | string };
}

export interface IOutputDefinition {
    /**
     * a human-friendly blurb about what this output is and what you can do with it
     */
    description: string;
    /**
     * the environment variable this output should be mapped to when used elsewhere
     */
    mapTo?: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toIAppJSON(json: string): IAppJSON {
        return cast(JSON.parse(json), r("IAppJSON"));
    }

    public static iAppJSONToJson(value: IAppJSON): string {
        return JSON.stringify(uncast(value, r("IAppJSON")), null, 2);
    }
}

function invalidValue(typ: any, val: any): never {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        var l = typs.length;
        for (var i = 0; i < l; i++) {
            var typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(typ: any, val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        var result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(typ, val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "IAppJSON": o([
        { json: "components", js: "components", typ: u(undefined, a(r("IComponent"))) },
        { json: "dependencies", js: "dependencies", typ: u(undefined, a(r("IDependency"))) },
        { json: "env", js: "env", typ: u(undefined, m(u(r("IEnvVarDefinition"), ""))) },
        { json: "environments", js: "environments", typ: u(undefined, m(r("IEnvironment"))) },
        { json: "name", js: "name", typ: "" },
        { json: "output", js: "output", typ: u(undefined, m(r("IOutputDefinition"))) },
    ], "any"),
    "IComponent": o([
        { json: "name", js: "name", typ: "" },
        { json: "variables", js: "variables", typ: a("") },
    ], "any"),
    "IDependency": o([
        { json: "imports", js: "imports", typ: a("") },
        { json: "name", js: "name", typ: "" },
    ], "any"),
    "IEnvVarDefinition": o([
        { json: "description", js: "description", typ: "" },
        { json: "type", js: "type", typ: u(undefined, a("")) },
        { json: "value", js: "value", typ: u(undefined, "") },
    ], "any"),
    "IEnvironment": o([
        { json: "env", js: "env", typ: u(undefined, m(u(r("IEnvVarDefinition"), ""))) },
    ], "any"),
    "IOutputDefinition": o([
        { json: "description", js: "description", typ: "" },
        { json: "mapTo", js: "mapTo", typ: u(undefined, "") },
    ], "any"),
};
