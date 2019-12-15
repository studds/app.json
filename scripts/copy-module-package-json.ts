import { existsSync, readFileSync, writeFileSync } from 'fs';
import { sync as glob } from 'globby';
import { sync as mkdirp } from 'mkdirp';
import { dirname, resolve } from 'path';
import { findConfigFile, readConfigFile } from 'typescript';

// tslint:disable-next-line: no-var-requires -- no types
const precinct = require('precinct');

const pack = JSON.parse(readFileSync('./package.json', 'utf-8'));

const scope = pack.name.split('/')[0];

const packagePaths = glob('packages/*/package.json');

packagePaths.forEach(path => {
    copyPackage(path);
});

function copyPackage(packagePath: string) {
    const modulePack = JSON.parse(readFileSync(packagePath, 'utf-8'));
    const moduleDir = dirname(packagePath);
    const dependencies: Record<string, string> = getVersionsForPath(moduleDir);
    modulePack.dependencies = dependencies;
    modulePack.version = pack.version;
    const destDir = findDestDirFromTsConfig(moduleDir);
    mkdirp(destDir);
    writeFileSync(
        resolve(destDir, 'package.json'),
        JSON.stringify(modulePack, null, 2),
        'utf-8'
    );
}

function findDestDirFromTsConfig(moduleDir: string) {
    const configPath = findConfigFile(moduleDir, existsSync);
    if (!configPath) {
        throw new Error(`Did not find tsconfig.json in ${moduleDir}`);
    }
    const tsConfig = readConfigFile(configPath, path =>
        readFileSync(path, 'utf-8')
    );
    const destDir = resolve(moduleDir, tsConfig.config.compilerOptions.outDir);
    return destDir;
}

function getVersionsForPath(modulePath: string) {
    const deps = getDeps(glob(`${modulePath}/**/*.ts`));
    function getDeps(paths: string[]) {
        return paths.reduce<string[]>((acc, path) => {
            // Pass in a file's content or an AST
            const pathDeps: string[] = precinct.paperwork(path, {
                includeCore: false
            });
            pathDeps.forEach(dep => {
                if (!dep.startsWith('.') && acc.indexOf(dep) === -1) {
                    acc.push(dep);
                }
            });
            return acc;
        }, []);
    }
    const versions: Record<string, string> = {};
    deps.forEach(dep => {
        const version = findVersionForDep(dep, pack.dependencies);
        if (dep.startsWith(scope)) {
            versions[dep] = pack.version;
        } else if (version) {
            versions[dep] = version;
        } else if (findVersionForDep(dep, pack.devDependencies)) {
            console.log(`Ignoring dev dep ${dep}`);
        } else {
            console.warn('Missing dep for ' + dep);
        }
    });
    return versions;
}

function findVersionForDep(
    dep: string,
    dependencies: Record<string, string> = {}
) {
    if (dependencies[dep]) {
        return dependencies[dep];
    }
    const parts = dep.split('/');
    while (parts.pop() && !dependencies[dep]) {
        dep = parts.join('/');
    }
    return dependencies[dep];
}
