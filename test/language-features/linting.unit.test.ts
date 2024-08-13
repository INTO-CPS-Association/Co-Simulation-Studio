import { RuleRegistry, SimulationConfigLinter, registerRule } from "../../src/language-features/linting"
import vscode from "vscode";

describe("Linting language feature", () => {
    describe("registerRule", () => {
        test("registering a rule without any handlers should leave registry unchanged", () => {
            const mockRuleRegistry: RuleRegistry = new Map();

            registerRule({}, mockRuleRegistry);

            expect(mockRuleRegistry.size).toBe(0);
        })

        test("registering a rule with a single handler should add the handler to the registry", () => {
            const mockRuleRegistry: RuleRegistry = new Map();

            registerRule({
                "onArray": jest.fn()
            }, mockRuleRegistry);

            const arrayHandlers = mockRuleRegistry.get("array");

            expect(mockRuleRegistry.size).toBe(1);
            expect(arrayHandlers).toHaveLength(1);
        })
    })

    describe("SimulationConfigLinter", () => {
        test("instantiating an instance of the linter registers three event listeners", () => {
            new SimulationConfigLinter();

            expect(vscode.workspace.onDidChangeTextDocument).toHaveBeenCalled();
            expect(vscode.workspace.onDidCloseTextDocument).toHaveBeenCalled();
            expect(vscode.workspace.onDidOpenTextDocument).toHaveBeenCalled();
        })
    })
})