/*
 * Copyright (C) 2023 Perpetual Labs, Ltd.
 *
 * All information contained herein is proprietary and confidential to
 * Perpetual Labs Ltd. Any use, reproduction, or disclosure without
 * the written permission of Perpetual Labs is prohibited.
 */

/**
 * @author Mohamad Omar Nachawati <omar@perpetuallabs.io>
 */

export type Edit = {
    startIndex: number;
    oldEndIndex: number;
    newEndIndex: number;
    startPosition: Point;
    oldEndPosition: Point;
    newEndPosition: Point;
};

export type InputReader = (index: any, position?: Point) => string;

export interface Parser {
    parse(input: string | InputReader, previousTree?: Tree): Tree;
}

export type Point = {
    row: number;
    column: number;
};

export type Range = {
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;
};

export interface SyntaxNode {

    childCount: number;
    children: Array<SyntaxNode>;
    endIndex: number;
    endPosition: Point;
    firstChild: SyntaxNode | null;
    firstNamedChild: SyntaxNode | null;
    lastChild: SyntaxNode | null;
    lastNamedChild: SyntaxNode | null;
    namedChildCount: number;
    namedChildren: Array<SyntaxNode>;
    nextNamedSibling: SyntaxNode | null;
    nextSibling: SyntaxNode | null;
    parent: SyntaxNode | null;
    previousNamedSibling: SyntaxNode | null;
    previousSibling: SyntaxNode | null;
    startIndex: number;
    startPosition: Point;
    text: string;
    tree: Tree;
    type: string;

    hasChanges(): boolean;
    hasError(): boolean;
    isMissing(): boolean;
    toString(): string;
    walk(): TreeCursor;

}

export interface Tree {

    readonly rootNode: SyntaxNode;

    edit(delta: Edit): Tree;
    getChangedRanges(other: Tree): Range[];
    getEditedRange(other: Tree): Range;

}

export interface TreeCursor {

    nodeType: string;
    nodeText: string;
    nodeIsNamed: boolean;
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;

    reset(node: SyntaxNode): void
    gotoParent(): boolean;
    gotoFirstChild(): boolean;
    gotoFirstChildForIndex(index: number): boolean;
    gotoNextSibling(): boolean;

}

export function currentFieldName(cursor: TreeCursor): string {

    const currentFieldName = (<any>cursor).currentFieldName;

    if (typeof currentFieldName === "function")
        return currentFieldName.bind(cursor)();

    else
        return currentFieldName;

}

export function currentNode(cursor: TreeCursor): SyntaxNode {

    const currentNode = (<any>cursor).currentNode;

    if (typeof currentNode === "function")
        return currentNode.bind(cursor)();

    else
        return currentNode;

}

export function childForFieldName(syntaxNode: SyntaxNode | null | undefined, ...fieldNames: string[]): SyntaxNode | undefined {

    if (syntaxNode == null)
        return undefined;

    for (const child of childrenForFieldName(syntaxNode, ...fieldNames))
        return child;

    return undefined;

}

export function* childrenForFieldName(syntaxNode: SyntaxNode | null | undefined, ...fieldNames: string[]): IterableIterator<SyntaxNode> {

    const cursor = syntaxNode?.walk();

    if (cursor == null || !cursor.gotoFirstChild())
        return;

    do {

        if (!fieldNames.includes(currentFieldName(cursor)))
            continue;

        yield currentNode(cursor);

    } while (cursor.gotoNextSibling());

}

/*

export function nodeForPosition(syntaxNode: SyntaxNode | null | undefined, position: Point): SyntaxNode | undefined {

    let cursor = syntaxNode?.walk();

    if (cursor == null || !cursor.gotoFirstChild())
        return;

    do {

        if (pointInRange(cursor, position))
            return currentNode(cursor);

    } while (cursor.gotoNextSibling());

}

*/

function pointInRange(range: Range, point: Point): boolean {

    if (range.startPosition.row > point.row || range.endPosition.row < point.row)
        return false;

    if (range.startPosition.row == range.endPosition.row && (range.startPosition.column > point.column || range.endPosition.column < point.column))
        return false;

    if (range.startPosition.row == point.row && range.startPosition.column > point.column)
        return false;

    if (range.endPosition.row == point.row && range.endPosition.column < point.column)
        return false;

    return true;

}
