import { commandHandlers } from "../src/commands";
import { mustBeDefined, readExtensionPackage } from "./helpers";

jest.mock("../src/logging.ts");


describe("Commands", () => {
    test("commandHandlers should cover commands", async () => {
        const pkg = await readExtensionPackage();
        const commands = mustBeDefined(pkg.contributes?.commands).map((cmd) => cmd.command)
        const implemented = new Set([...Object.keys(commandHandlers)]);
        const found = commands.filter((cmd) => implemented.has(cmd));
        expect(found).toEqual(commands);
    })
})