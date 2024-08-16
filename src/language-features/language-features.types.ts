import type { Node, NodeType } from "jsonc-parser";
import { RuleContext } from "./linting";

export type RuleHandler = (node: Node, context: RuleContext) => Promise<void>;
export type HandlerMethodName = `on${Capitalize<NodeType>}`;

export type LintRule = Partial<{
    [K in HandlerMethodName]: RuleHandler;
}>;