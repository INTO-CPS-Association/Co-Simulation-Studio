import { commandHandlers } from "commands";
import { mustBeDefined, readExtensionPackage } from "./helpers";

describe("Commands", () => {
    test("commandHandlers should cover commands", async () => {
        const pkg = await readExtensionPackage();
        const commands = mustBeDefined(pkg.contributes?.commands).map(
            (cmd) => cmd.command
        );
        const implemented = new Set([...Object.keys(commandHandlers)]);
        const found = commands.filter((cmd) => implemented.has(cmd));
        expect(found).toEqual(commands);
    });
});
