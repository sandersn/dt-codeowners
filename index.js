const { AllPackages, getDefinitelyTyped, logUncaughtErrors, loggerWithErrors,
        parseDefinitions, parseNProcesses, clean } = require("types-publisher");
const { writeFile } = require("fs-extra");

logUncaughtErrors(main());

async function main() {
    const options = { definitelyTypedPath: "../DefinitelyTyped", progress: false, parseInParallel: true };
    const log = loggerWithErrors()[0];

    clean();
    const dt = await getDefinitelyTyped(options, log);
    await parseDefinitions(dt, { nProcesses: parseNProcesses(), definitelyTypedPath: "../DefinitelyTyped" }, log);
    const allPackages = await AllPackages.read(dt);
    const typings = allPackages.allTypings();
    const maxPathLen = Math.max(...typings.map(t => t.subDirectoryPath.length));
    const entries = mapDefined(typings, t => getEntry(t, maxPathLen));
    await writeFile([options.definitelyTypedPath, ".github", "CODEOWNERS"].join("/"), `${header}\n\n${entries.join("\n")}\n`, { encoding: "utf-8" });
}

const header =
`# This file is generated.
# Add yourself to the "Definitions by:" list instead.
# See https://github.com/DefinitelyTyped/DefinitelyTyped#edit-an-existing-package`;

/**
 * @param { { contributors: ReadonlyArray<{githubUsername?: string }>, subDirectoryPath: string} } pkg
 * @param {number} maxPathLen
 * @return {string | undefined}
 */
function getEntry(pkg, maxPathLen) {
    const users = mapDefined(pkg.contributors, c => c.githubUsername);
    if (!users.length) {
        return undefined;
    }

    const path = `${pkg.subDirectoryPath}/`.padEnd(maxPathLen);
    return `/types/${path} ${users.map(u => `@${u}`).join(" ")}`;
}

/**
 * @template T,U
 * @param {ReadonlyArray<T>} arr
 * @param {(t: T) => U | undefined} mapper
 * @return U[]
 */
function mapDefined(arr, mapper) {
    const out = [];
    for (const a of arr) {
        const res = mapper(a);
        if (res !== undefined) {
            out.push(res);
        }
    }
    return out;
}

