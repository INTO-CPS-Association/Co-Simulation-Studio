import fs from "fs/promises";
import path from "path";

const root = path.join(__dirname, "../");

export interface PackageJson {
    name?: string;
    description?: string;
    version?: string;
    contributes?: Contributes;
}

interface Contributes {
    menus?: Menus;
    commands?: CommandItem[];
}

type MenuTypes = 'editor/context' | 'commandPalette' | 'view/item/context';

type Menus = {
    [key in MenuTypes]?: MenuItem[];
};

interface MenuItem {
    command: string;
    when?: string;
    group?: string;
}

interface CommandItem {
    command: string;
    category?: string;
    title?: string;
}

export async function readExtensionPackage(): Promise<PackageJson> {
    const pkgContents = await fs.readFile(path.join(root, "package.json"), "utf8");
    return JSON.parse(pkgContents);
}

export function isDefined<T>(t: T | undefined | null): t is T {
    return t !== undefined && t !== null;
}

export function mustBeDefined<T>(t: T | undefined | null): T {
    if (isDefined(t)) return t;
    throw new Error('Value must be defined.')
}