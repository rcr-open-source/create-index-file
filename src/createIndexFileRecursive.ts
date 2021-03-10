/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as fs from "fs";
import path from "path";

export const createIndexFileRecursive = (dir: string): void => {
    const p = path.join(dir, "index.ts");

    const files = fs.readdirSync(dir, { withFileTypes: true });
    fs.openSync(p, "w");
    files
        .filter((file) => file.isFile() && (file.name.endsWith(".ts") || file.name.endsWith(".tsx")) && !file.name.endsWith(".test.ts") && file.name !== "index.ts")
        .map((file) => {
            const s = `export * from "./${file.name.substr(0, file.name.lastIndexOf("."))}";\n`;
            fs.appendFileSync(p, s);
            return s;
        });
    files
        .filter((file) => file.isDirectory())
        .map((directory) => {
            const directoryPath = path.join(dir, directory.name, "/");
            createIndexFileRecursive(directoryPath);
            const s = `export * from "./${directory.name}";\n`;
            fs.appendFileSync(p, s);
            return s;
        });

};
