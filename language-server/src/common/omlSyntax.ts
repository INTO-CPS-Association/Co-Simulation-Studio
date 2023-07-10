/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-empty-function */

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

import Big from 'big.js';
import { childForFieldName, childrenForFieldName, SyntaxNode } from "./parser";

export enum OMLRangeRestrictionKind {
    ALL = 0,
    SOME = 1
}

export enum OMLCardinalityRestrictionKind {
    EXACTLY = 0,
    MIN = 1,
    MAX = 2
}

export abstract class OMLSyntaxNode {

    #parsed = false;
    #syntaxNode?: SyntaxNode | null;

    constructor(syntaxNode?: SyntaxNode | null) {
        this.#syntaxNode = syntaxNode;
    }

    abstract accept(visitor: OMLSyntaxVisitor, ...args: any[]): any;

    get children(): IterableIterator<OMLSyntaxNode> {
        this.parse();
        return function* () { }();
    }

    static new(syntaxNode?: SyntaxNode | null): OMLSyntaxNode | undefined {

        switch (syntaxNode?.type) {

            case "Ontology":
                return OMLOntologySyntax.new(syntaxNode);

            case "VocabularyBox":
                return OMLVocabularyBoxSyntax.new(syntaxNode);

            case "Vocabulary":
                return OMLVocabularySyntax.new(syntaxNode);

            case "VocabularyBundle":
                return OMLVocabularyBundleSyntax.new(syntaxNode);

            case "DescriptionBox":
                return OMLDescriptionBoxSyntax.new(syntaxNode);

            case "Description":
                return OMLDescriptionSyntax.new(syntaxNode);

            case "DescriptionBundle":
                return OMLDescriptionBundleSyntax.new(syntaxNode);

            case "VocabularyImport":
                return OMLVocabularyImportSyntax.new(syntaxNode);

            case "VocabularyExtension":
                return OMLVocabularyExtensionSyntax.new(syntaxNode);

            case "VocabularyUsage":
                return OMLVocabularyUsageSyntax.new(syntaxNode);

            case "VocabularyBundleImport":
                return OMLVocabularyBundleImportSyntax.new(syntaxNode);

            case "VocabularyBundleInclusion":
                return OMLVocabularyBundleInclusionSyntax.new(syntaxNode);

            case "VocabularyBundleExtension":
                return OMLVocabularyBundleExtensionSyntax.new(syntaxNode);

            case "DescriptionImport":
                return OMLDescriptionImportSyntax.new(syntaxNode);

            case "DescriptionUsage":
                return OMLDescriptionUsageSyntax.new(syntaxNode);

            case "DescriptionExtension":
                return OMLDescriptionExtensionSyntax.new(syntaxNode);

            case "DescriptionBundleImport":
                return OMLDescriptionBundleImportSyntax.new(syntaxNode);

            case "DescriptionBundleInclusion":
                return OMLDescriptionBundleInclusionSyntax.new(syntaxNode);

            case "DescriptionBundleExtension":
                return OMLDescriptionBundleExtensionSyntax.new(syntaxNode);

            case "DescriptionBundleUsage":
                return OMLDescriptionBundleUsageSyntax.new(syntaxNode);

            case "VocabularyStatement":
                return OMLVocabularyStatementSyntax.new(syntaxNode);

            case "SpecializableTerm":
                return OMLSpecializableTermSyntax.new(syntaxNode);

            case "Type":
                return OMLTypeSyntax.new(syntaxNode);

            case "Classifier":
                return OMLClassifierSyntax.new(syntaxNode);

            case "Entity":
                return OMLEntitySyntax.new(syntaxNode);

            case "Aspect":
                return OMLAspectSyntax.new(syntaxNode);

            case "Concept":
                return OMLConceptSyntax.new(syntaxNode);

            case "RelationEntity":
                return OMLRelationEntitySyntax.new(syntaxNode);

            case "ForwardRelation":
                return OMLForwardRelationSyntax.new(syntaxNode);

            case "ReverseRelation":
                return OMLReverseRelationSyntax.new(syntaxNode);

            case "Structure":
                return OMLStructureSyntax.new(syntaxNode);

            case "Scalar":
                return OMLScalarSyntax.new(syntaxNode);

            case "FacetedScalar":
                return OMLFacetedScalarSyntax.new(syntaxNode);

            case "EnumeratedScalar":
                return OMLEnumeratedScalarSyntax.new(syntaxNode);

            case "AnnotationProperty":
                return OMLAnnotationPropertySyntax.new(syntaxNode);

            case "SemanticProperty":
                return OMLSemanticPropertySyntax.new(syntaxNode);

            case "ScalarProperty":
                return OMLScalarPropertySyntax.new(syntaxNode);

            case "StructuredProperty":
                return OMLStructuredPropertySyntax.new(syntaxNode);

            case "Rule":
                return OMLRuleSyntax.new(syntaxNode);

            case "Predicate":
                return OMLPredicateSyntax.new(syntaxNode);

            case "UnaryPredicate":
                return OMLUnaryPredicateSyntax.new(syntaxNode);

            case "TypePredicate":
                return OMLTypePredicateSyntax.new(syntaxNode);

            case "BinaryPredicate":
                return OMLBinaryPredicateSyntax.new(syntaxNode);

            case "RelationEntityPredicate":
                return OMLRelationEntityPredicateSyntax.new(syntaxNode);

            case "FeaturePredicate":
                return OMLFeaturePredicateSyntax.new(syntaxNode);

            case "SameAsPredicate":
                return OMLSameAsPredicateSyntax.new(syntaxNode);

            case "DifferentFromPredicate":
                return OMLDifferentFromPredicateSyntax.new(syntaxNode);

            case "DescriptionStatement":
                return OMLDescriptionStatementSyntax.new(syntaxNode);

            case "NamedInstance":
                return OMLNamedInstanceSyntax.new(syntaxNode);

            case "ConceptInstance":
                return OMLConceptInstanceSyntax.new(syntaxNode);

            case "RelationInstance":
                return OMLRelationInstanceSyntax.new(syntaxNode);

            case "StructureInstance":
                return OMLStructureInstanceSyntax.new(syntaxNode);

            case "SpecializableTermReference":
                return OMLSpecializableTermReferenceSyntax.new(syntaxNode);

            case "ClassifierReference":
                return OMLClassifierReferenceSyntax.new(syntaxNode);

            case "EntityReference":
                return OMLEntityReferenceSyntax.new(syntaxNode);

            case "AspectReference":
                return OMLAspectReferenceSyntax.new(syntaxNode);

            case "ConceptReference":
                return OMLConceptReferenceSyntax.new(syntaxNode);

            case "RelationEntityReference":
                return OMLRelationEntityReferenceSyntax.new(syntaxNode);

            case "StructureReference":
                return OMLStructureReferenceSyntax.new(syntaxNode);

            case "AnnotationPropertyReference":
                return OMLAnnotationPropertyReferenceSyntax.new(syntaxNode);

            case "ScalarPropertyReference":
                return OMLScalarPropertyReferenceSyntax.new(syntaxNode);

            case "StructuredPropertyReference":
                return OMLStructuredPropertyReferenceSyntax.new(syntaxNode);

            case "FacetedScalarReference":
                return OMLFacetedScalarReferenceSyntax.new(syntaxNode);

            case "EnumeratedScalarReference":
                return OMLEnumeratedScalarReferenceSyntax.new(syntaxNode);

            case "RelationReference":
                return OMLRelationReferenceSyntax.new(syntaxNode);

            case "RuleReference":
                return OMLRuleReferenceSyntax.new(syntaxNode);

            case "NamedInstanceReference":
                return OMLNamedInstanceReferenceSyntax.new(syntaxNode);

            case "ConceptInstanceReference":
                return OMLConceptInstanceReferenceSyntax.new(syntaxNode);

            case "RelationInstanceReference":
                return OMLRelationInstanceReferenceSyntax.new(syntaxNode);

            case "SpecializationAxiom":
                return OMLSpecializationAxiomSyntax.new(syntaxNode);

            case "RestrictionAxiom":
                return OMLRestrictionAxiomSyntax.new(syntaxNode);

            case "PropertyRestrictionAxiom":
                return OMLPropertyRestrictionAxiomSyntax.new(syntaxNode);

            case "ScalarPropertyRestrictionAxiom":
                return OMLScalarPropertyRestrictionAxiomSyntax.new(syntaxNode);

            case "ScalarPropertyRangeRestrictionAxiom":
                return OMLScalarPropertyRangeRestrictionAxiomSyntax.new(syntaxNode);

            case "ScalarPropertyCardinalityRestrictionAxiom":
                return OMLScalarPropertyCardinalityRestrictionAxiomSyntax.new(syntaxNode);

            case "ScalarPropertyValueRestrictionAxiom":
                return OMLScalarPropertyValueRestrictionAxiomSyntax.new(syntaxNode);

            case "StructuredPropertyRestrictionAxiom":
                return OMLStructuredPropertyRestrictionAxiomSyntax.new(syntaxNode);

            case "StructuredPropertyRangeRestrictionAxiom":
                return OMLStructuredPropertyRangeRestrictionAxiomSyntax.new(syntaxNode);

            case "StructuredPropertyCardinalityRestrictionAxiom":
                return OMLStructuredPropertyCardinalityRestrictionAxiomSyntax.new(syntaxNode);

            case "StructuredPropertyValueRestrictionAxiom":
                return OMLStructuredPropertyValueRestrictionAxiomSyntax.new(syntaxNode);

            case "RelationRestrictionAxiom":
                return OMLRelationRestrictionAxiomSyntax.new(syntaxNode);

            case "RelationRangeRestrictionAxiom":
                return OMLRelationRangeRestrictionAxiomSyntax.new(syntaxNode);

            case "RelationCardinalityRestrictionAxiom":
                return OMLRelationCardinalityRestrictionAxiomSyntax.new(syntaxNode);

            case "RelationTargetRestrictionAxiom":
                return OMLRelationTargetRestrictionAxiomSyntax.new(syntaxNode);

            case "KeyAxiom":
                return OMLKeyAxiomSyntax.new(syntaxNode);

            case "ConceptTypeAssertion":
                return OMLConceptTypeAssertionSyntax.new(syntaxNode);

            case "RelationTypeAssertion":
                return OMLRelationTypeAssertionSyntax.new(syntaxNode);

            case "PropertyValueAssertion":
                return OMLPropertyValueAssertionSyntax.new(syntaxNode);

            case "ScalarPropertyValueAssertion":
                return OMLScalarPropertyValueAssertionSyntax.new(syntaxNode);

            case "StructuredPropertyValueAssertion":
                return OMLStructuredPropertyValueAssertionSyntax.new(syntaxNode);

            case "LinkAssertion":
                return OMLLinkAssertionSyntax.new(syntaxNode);

            case "Annotation":
                return OMLAnnotationSyntax.new(syntaxNode);

            case "Literal":
                return OMLLiteralSyntax.new(syntaxNode);

            case "IntegerLiteral":
                return OMLIntegerLiteralSyntax.new(syntaxNode);

            case "DecimalLiteral":
                return OMLDecimalLiteralSyntax.new(syntaxNode);

            case "DoubleLiteral":
                return OMLDoubleLiteralSyntax.new(syntaxNode);

            case "BooleanLiteral":
                return OMLBooleanLiteralSyntax.new(syntaxNode);

            case "QuotedLiteral":
                return OMLQuotedLiteralSyntax.new(syntaxNode);

            default:
                return undefined;

        }

    }

    abstract parse(): void;

    protected get parsed(): boolean {
        return this.#parsed;
    }

    protected set parsed(parsed: boolean) {
        this.#parsed = parsed;
    }

    get syntaxRange(): {
        startColumn: number,
        startLineNumber: number,
        endColumn: number,
        endLineNumber: number
    } | undefined {

        if (this.#syntaxNode == null)
            return undefined;

        const startPosition = this.#syntaxNode.startPosition;
        const endPosition = this.#syntaxNode.endPosition;

        return {
            startColumn: startPosition.column + 1,
            startLineNumber: startPosition.row + 1,
            endColumn: endPosition.column + 1,
            endLineNumber: endPosition.row + 1
        };

    }

    get syntaxNode(): SyntaxNode | null | undefined {
        return this.#syntaxNode;
    }

    get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        return undefined;
    }

    getOwnedAnnotation(namespace: string, name: string): OMLAnnotationSyntax | undefined {

        for (const ownedAnnotation of this.ownedAnnotations ?? [])
            if (ownedAnnotation.property?.name == name)
                return ownedAnnotation;

        return undefined;

    }

    getOwnedAnnotations(namespace: string, name: string): OMLAnnotationSyntax[] {

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const ownedAnnotation of this.ownedAnnotations ?? [])
            if (ownedAnnotation.property?.name == name)
                ownedAnnotations.push(ownedAnnotation);

        return ownedAnnotations;

    }

}


export abstract class OMLElementSyntax extends OMLSyntaxNode {

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

}

// DONE
export class OMLAnnotationSyntax extends OMLElementSyntax {

    #property?: OMLRefSyntax;
    #referenceValue?: OMLRefSyntax;
    #value?: OMLLiteralSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitAnnotation(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.property != null)
                yield node.property;

            if (node.referenceValue != null)
                yield node.referenceValue;

            if (node.value != null)
                yield node.value;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLAnnotationSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "Annotation")
            return undefined;

        return new OMLAnnotationSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "Annotation")
            throw new Error(`Expected Annotation, got ${this.syntaxNode?.type}`);

        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));
        this.#referenceValue = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "referenceValue"));
        this.#value = OMLLiteralSyntax.new(childForFieldName(this.syntaxNode, "value"));

        this.parsed = true;

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    get referenceValue(): OMLRefSyntax | undefined {
        this.parse();
        return this.#referenceValue;
    }

    get value(): OMLLiteralSyntax | undefined {
        this.parse();
        return this.#value;
    }

    override toString(): string {
        return this.property?.toString() ?? "<null>";
    }

}

export abstract class OMLAnnotatedElementSyntax extends OMLElementSyntax { }

export abstract class OMLIdentifiedElementSyntax extends OMLAnnotatedElementSyntax { }

export abstract class OMLMemberSyntax extends OMLIdentifiedElementSyntax {
    abstract get name(): OMLLocalNameSyntax | undefined;
}

export abstract class OMLTermSyntax extends OMLMemberSyntax { }

export abstract class OMLFeatureSyntax extends OMLTermSyntax { }

export abstract class OMLPropertySyntax extends OMLFeatureSyntax { }

export abstract class OMLSemanticPropertySyntax extends OMLPropertySyntax { }

export abstract class OMLRelationSyntax extends OMLFeatureSyntax {

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

}

// DONE
export class OMLForwardRelationSyntax extends OMLRelationSyntax {

    #name?: OMLLocalNameSyntax;
    #ownedAnnotations?: OMLAnnotationSyntax[];

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitForwardRelation(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.name != null)
                yield node.name;

            if (node.ownedAnnotations != null)
                yield* node.ownedAnnotations;

        }();

    }

    get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLForwardRelationSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ForwardRelation")
            return undefined;

        return new OMLForwardRelationSyntax(syntaxNode);

    }

    override get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        this.parse();
        return this.#ownedAnnotations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ForwardRelation")
            throw new Error(`Expected ForwardRelation, got ${this.syntaxNode?.type}`);

        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedAnnotations")) {

            const annotation = OMLAnnotationSyntax.new(child);

            if (annotation != null)
                ownedAnnotations.push(annotation);

        }

        this.parsed = true;

    }

}

// DONE
export class OMLReverseRelationSyntax extends OMLRelationSyntax {

    #name?: OMLLocalNameSyntax;
    #ownedAnnotations?: OMLAnnotationSyntax[];

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitReverseRelation(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.name != null)
                yield node.name;

            if (node.ownedAnnotations != null)
                yield* node.ownedAnnotations;

        }();

    }

    get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLReverseRelationSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ReverseRelation")
            return undefined;

        return new OMLReverseRelationSyntax(syntaxNode);

    }

    override get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        this.parse();
        return this.#ownedAnnotations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ReverseRelation")
            throw new Error(`Expected ReverseRelation, got ${this.syntaxNode?.type}`);

        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedAnnotations")) {

            const annotation = OMLAnnotationSyntax.new(child);

            if (annotation != null)
                ownedAnnotations.push(annotation);

        }

        this.parsed = true;

    }

}


export abstract class OMLOntologySyntax extends OMLIdentifiedElementSyntax {

    #prefixes?: Map<string, string>;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    abstract get namespace(): OMLNamespaceSyntax | undefined;

    static override new(syntaxNode?: SyntaxNode | null): OMLOntologySyntax | undefined {

        const Ontology = childForFieldName(syntaxNode, "Ontology");

        switch (Ontology?.type) {

            case "VocabularyBox":
                return OMLVocabularyBoxSyntax.new(Ontology);

            case "DescriptionBox":
                return OMLDescriptionBoxSyntax.new(Ontology);

            default:
                return undefined;

        }

    }

    abstract get ownedImports(): OMLImportSyntax[] | undefined;

    abstract get ownedStatements(): OMLStatementSyntax[] | undefined;

    abstract get prefix(): OMLLocalNameSyntax | undefined;

    get prefixes(): Map<string, string> {

        if (this.#prefixes != null)
            return this.#prefixes;

        this.#prefixes = new Map<string, string>();

        for (const ownedImport of this.ownedImports ?? []) {
            const prefix = ownedImport.prefix?.name;
            const namespace = ownedImport.namespace?.value;
            if (prefix != null && namespace != null)
                this.#prefixes.set(prefix, namespace);
        }

        return this.#prefixes;

    }

}


export abstract class OMLDescriptionBoxSyntax extends OMLOntologySyntax {

    #ownedAnnotations?: OMLAnnotationSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode);
        this.#ownedAnnotations = ownedAnnotations;
    }

    abstract override get namespace(): OMLNamespaceSyntax | undefined;

    static override new(syntaxNode?: SyntaxNode | null): OMLDescriptionBoxSyntax | undefined {

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const child of childrenForFieldName(syntaxNode, "ownedAnnotations")) {

            const annotation = OMLAnnotationSyntax.new(child);

            if (annotation != null)
                ownedAnnotations.push(annotation);

        }

        const DescriptionBox = childForFieldName(syntaxNode, "DescriptionBox");

        switch (DescriptionBox?.type) {

            case "Description":
                return OMLDescriptionSyntax.new(DescriptionBox, ownedAnnotations);

            case "DescriptionBundle":
                return OMLDescriptionBundleSyntax.new(DescriptionBox, ownedAnnotations);

            default:
                return undefined;

        }

    }

    override get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        this.parse();
        return this.#ownedAnnotations;
    }

    abstract override get ownedImports(): OMLDescriptionImportSyntax[] | undefined;

    abstract override get ownedStatements(): OMLDescriptionStatementSyntax[] | undefined;

    abstract override get prefix(): OMLLocalNameSyntax | undefined;

    abstract override toString(): string;

}

// DONE
export class OMLDescriptionSyntax extends OMLDescriptionBoxSyntax {

    #namespace?: OMLNamespaceSyntax;
    #ownedImports?: OMLDescriptionImportSyntax[];
    #ownedStatements?: OMLDescriptionStatementSyntax[];
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDescription(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.ownedImports != null)
                yield* node.ownedImports;

            if (node.ownedStatements != null)
                yield* node.ownedStatements;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLDescriptionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "Description")
            return undefined;

        return new OMLDescriptionSyntax(syntaxNode, ownedAnnotations);

    }

    override get ownedImports(): OMLDescriptionImportSyntax[] | undefined {
        this.parse();
        return this.#ownedImports;
    }

    get ownedStatements(): OMLDescriptionStatementSyntax[] | undefined {
        this.parse();
        return this.#ownedStatements;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "Description")
            throw new Error(`Expected Description, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));

        this.#ownedImports = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedImports")) {

            const ownedImport = OMLDescriptionImportSyntax.new(child);

            if (ownedImport != null)
                this.#ownedImports.push(ownedImport);

        }

        this.#ownedStatements = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedStatements")) {

            const ownedStatement = OMLDescriptionStatementSyntax.new(child);

            if (ownedStatement != null)
                this.#ownedStatements.push(ownedStatement);

        }

        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

    override toString(): string {
        return this.namespace?.value ?? "<null>";
    }

}

// DONE
export class OMLDescriptionBundleSyntax extends OMLDescriptionBoxSyntax {

    #namespace?: OMLNamespaceSyntax;
    #ownedImports?: OMLDescriptionImportSyntax[];
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDescriptionBundle(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.ownedImports != null)
                yield* node.ownedImports;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLDescriptionBundleSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "DescriptionBundle")
            return undefined;

        return new OMLDescriptionBundleSyntax(syntaxNode, ownedAnnotations);

    }

    override get ownedImports(): OMLDescriptionImportSyntax[] | undefined {
        this.parse();
        return this.#ownedImports;
    }

    get ownedStatements(): OMLDescriptionStatementSyntax[] | undefined {
        return undefined;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "DescriptionBundle")
            throw new Error(`Expected DescriptionBundle, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));

        this.#ownedImports = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedImports")) {

            const ownedImport = OMLDescriptionImportSyntax.new(child);

            if (ownedImport != null)
                this.#ownedImports.push(ownedImport);

        }

        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

    override toString(): string {
        return this.namespace?.value ?? "<null>";
    }

}


export abstract class OMLVocabularyBoxSyntax extends OMLOntologySyntax {

    #ownedAnnotations?: OMLAnnotationSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode);
        this.#ownedAnnotations = ownedAnnotations;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedAnnotations != null)
                yield* node.ownedAnnotations;

        }();

    }

    abstract override get namespace(): OMLNamespaceSyntax | undefined;

    static override new(syntaxNode?: SyntaxNode | null): OMLVocabularyBoxSyntax | undefined {

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const child of childrenForFieldName(syntaxNode, "ownedAnnotations")) {

            const annotation = OMLAnnotationSyntax.new(child);

            if (annotation != null)
                ownedAnnotations.push(annotation);

        }

        const VocabularyBox = childForFieldName(syntaxNode, "VocabularyBox");

        switch (VocabularyBox?.type) {

            case "Vocabulary":
                return OMLVocabularySyntax.new(VocabularyBox, ownedAnnotations);

            case "VocabularyBundle":
                return OMLVocabularyBundleSyntax.new(VocabularyBox, ownedAnnotations);

            default:
                return undefined;

        }

    }

    override get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        this.parse();
        return this.#ownedAnnotations;
    }

    abstract override get ownedImports(): OMLVocabularyImportSyntax[] | undefined;

    abstract override get ownedStatements(): OMLVocabularyStatementSyntax[] | undefined;

    abstract override get prefix(): OMLLocalNameSyntax | undefined;

    abstract override toString(): string;

}

// DONE
export class OMLVocabularySyntax extends OMLVocabularyBoxSyntax {

    #namespace?: OMLNamespaceSyntax;
    #ownedImports?: OMLVocabularyImportSyntax[];
    #ownedStatements?: OMLVocabularyStatementSyntax[];
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitVocabulary(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.ownedImports != null)
                yield* node.ownedImports;

            if (node.ownedStatements != null)
                yield* node.ownedStatements;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLVocabularySyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "Vocabulary")
            return undefined;

        return new OMLVocabularySyntax(syntaxNode, ownedAnnotations);

    }

    override get ownedImports(): OMLVocabularyImportSyntax[] | undefined {
        this.parse();
        return this.#ownedImports;
    }

    get ownedStatements(): OMLVocabularyStatementSyntax[] | undefined {
        this.parse();
        return this.#ownedStatements;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "Vocabulary")
            throw new Error(`Expected Vocabulary, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));

        this.#ownedImports = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedImports")) {

            const ownedImport = OMLVocabularyImportSyntax.new(child);

            if (ownedImport != null)
                this.#ownedImports.push(ownedImport);

        }

        this.#ownedStatements = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedStatements")) {

            const ownedStatement = OMLVocabularyStatementSyntax.new(child);

            if (ownedStatement != null)
                this.#ownedStatements.push(ownedStatement);

        }

        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

    override toString(): string {
        return this.namespace?.value ?? "<null>";
    }

}

// DONE
export class OMLVocabularyBundleSyntax extends OMLVocabularyBoxSyntax {

    #namespace?: OMLNamespaceSyntax;
    #ownedImports?: OMLVocabularyImportSyntax[];
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitVocabularyBundle(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.ownedImports != null)
                yield* node.ownedImports;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLVocabularyBundleSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "VocabularyBundle")
            return undefined;

        return new OMLVocabularyBundleSyntax(syntaxNode, ownedAnnotations);

    }

    override get ownedImports(): OMLVocabularyImportSyntax[] | undefined {
        this.parse();
        return this.#ownedImports;
    }

    get ownedStatements(): OMLVocabularyStatementSyntax[] | undefined {
        return undefined;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "VocabularyBundle")
            throw new Error(`Expected VocabularyBundle, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));

        this.#ownedImports = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedImports")) {

            const ownedImport = OMLVocabularyImportSyntax.new(child);

            if (ownedImport != null)
                this.#ownedImports.push(ownedImport);

        }

        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

    override toString(): string {
        return this.namespace?.value ?? "<null>";
    }

}

export abstract class OMLImportSyntax extends OMLAnnotatedElementSyntax {

    abstract get namespace(): OMLNamespaceSyntax | undefined;

    abstract get prefix(): OMLLocalNameSyntax | undefined;

}


export abstract class OMLDescriptionImportSyntax extends OMLImportSyntax {

    #ownedAnnotations?: OMLAnnotationSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode);
        this.#ownedAnnotations = ownedAnnotations;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedAnnotations != null)
                yield* node.ownedAnnotations;

        }();

    }

    abstract override get namespace(): OMLNamespaceSyntax | undefined;

    static override new(syntaxNode?: SyntaxNode | null): OMLDescriptionImportSyntax | undefined {

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const child of childrenForFieldName(syntaxNode, "ownedAnnotations")) {

            const annotation = OMLAnnotationSyntax.new(child);

            if (annotation != null)
                ownedAnnotations.push(annotation);

        }

        const DescriptionImport = childForFieldName(syntaxNode, "DescriptionImport");

        switch (DescriptionImport?.type) {

            case "DescriptionExtension":
                return OMLDescriptionExtensionSyntax.new(DescriptionImport, ownedAnnotations);

            case "DescriptionUsage":
                return OMLDescriptionUsageSyntax.new(DescriptionImport, ownedAnnotations);

            default:
                return undefined;

        }

    }

    override get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        this.parse();
        return this.#ownedAnnotations;
    }

    abstract override get prefix(): OMLLocalNameSyntax | undefined;

}

// DONE
export class OMLDescriptionExtensionSyntax extends OMLDescriptionImportSyntax {

    #namespace?: OMLNamespaceSyntax;
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDescriptionExtension(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    override get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLDescriptionExtensionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "DescriptionExtension")
            return undefined;

        return new OMLDescriptionExtensionSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "DescriptionExtension")
            throw new Error(`Expected DescriptionExtension, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));
        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    override get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

}

// DONE
export class OMLDescriptionUsageSyntax extends OMLDescriptionImportSyntax {

    #namespace?: OMLNamespaceSyntax;
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDescriptionUsage(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    override get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLDescriptionUsageSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "DescriptionUsage")
            return undefined;

        return new OMLDescriptionUsageSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "DescriptionUsage")
            throw new Error(`Expected DescriptionUsage, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));
        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    override get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

}


export abstract class OMLDescriptionBundleImportSyntax extends OMLImportSyntax {

    #ownedAnnotations?: OMLAnnotationSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode);
        this.#ownedAnnotations = ownedAnnotations;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedAnnotations != null)
                yield* node.ownedAnnotations;

        }();

    }

    abstract override get namespace(): OMLNamespaceSyntax | undefined;

    static override new(syntaxNode?: SyntaxNode | null): OMLDescriptionBundleImportSyntax | undefined {

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const child of childrenForFieldName(syntaxNode, "ownedAnnotations")) {

            const annotation = OMLAnnotationSyntax.new(child);

            if (annotation != null)
                ownedAnnotations.push(annotation);

        }

        const DescriptionBundleImport = childForFieldName(syntaxNode, "DescriptionBundleImport");

        switch (DescriptionBundleImport?.type) {

            case "DescriptionBundleExtension":
                return OMLDescriptionBundleExtensionSyntax.new(DescriptionBundleImport, ownedAnnotations);

            case "DescriptionBundleInclusion":
                return OMLDescriptionBundleInclusionSyntax.new(DescriptionBundleImport, ownedAnnotations);

            case "DescriptionBundleUsage":
                return OMLDescriptionBundleUsageSyntax.new(DescriptionBundleImport, ownedAnnotations);

            default:
                return undefined;

        }

    }

    override get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        this.parse();
        return this.#ownedAnnotations;
    }

    abstract override get prefix(): OMLLocalNameSyntax | undefined;

}

// DONE
export class OMLDescriptionBundleInclusionSyntax extends OMLDescriptionBundleImportSyntax {

    #namespace?: OMLNamespaceSyntax;
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDescriptionBundleInclusion(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    override get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLDescriptionBundleInclusionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "DescriptionBundleInclusion")
            return undefined;

        return new OMLDescriptionBundleInclusionSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "DescriptionBundleInclusion")
            throw new Error(`Expected DescriptionBundleInclusion, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));
        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    override get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

}

// DONE
export class OMLDescriptionBundleExtensionSyntax extends OMLDescriptionBundleImportSyntax {

    #namespace?: OMLNamespaceSyntax;
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDescriptionBundleExtension(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    override get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLDescriptionBundleExtensionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "DescriptionBundleExtension")
            return undefined;

        return new OMLDescriptionBundleExtensionSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "DescriptionBundleExtension")
            throw new Error(`Expected DescriptionBundleExtension, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));
        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    override get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

}

// DONE
export class OMLDescriptionBundleUsageSyntax extends OMLDescriptionBundleImportSyntax {

    #namespace?: OMLNamespaceSyntax;
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDescriptionBundleUsage(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    override get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLDescriptionBundleUsageSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "DescriptionBundleUsage")
            return undefined;

        return new OMLDescriptionBundleUsageSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "DescriptionBundleUsage")
            throw new Error(`Expected DescriptionBundleUsage, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));
        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    override get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

}


export abstract class OMLVocabularyImportSyntax extends OMLImportSyntax {

    #ownedAnnotations?: OMLAnnotationSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode);
        this.#ownedAnnotations = ownedAnnotations;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedAnnotations != null)
                yield* node.ownedAnnotations;

        }();

    }

    abstract override get namespace(): OMLNamespaceSyntax | undefined;

    static override new(syntaxNode?: SyntaxNode | null): OMLVocabularyImportSyntax | undefined {

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const child of childrenForFieldName(syntaxNode, "ownedAnnotations")) {

            const annotation = OMLAnnotationSyntax.new(child);

            if (annotation != null)
                ownedAnnotations.push(annotation);

        }

        const VocabularyImport = childForFieldName(syntaxNode, "VocabularyImport");

        switch (VocabularyImport?.type) {

            case "VocabularyExtension":
                return OMLVocabularyExtensionSyntax.new(VocabularyImport, ownedAnnotations);

            case "VocabularyUsage":
                return OMLVocabularyUsageSyntax.new(VocabularyImport, ownedAnnotations);

            default:
                return undefined;

        }

    }

    override get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        this.parse();
        return this.#ownedAnnotations;
    }

    abstract override get prefix(): OMLLocalNameSyntax | undefined;

    abstract override toString(): string;

}

// DONE
export class OMLVocabularyExtensionSyntax extends OMLVocabularyImportSyntax {

    #namespace?: OMLNamespaceSyntax;
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitVocabularyExtension(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    override get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLVocabularyExtensionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "VocabularyExtension")
            return undefined;

        return new OMLVocabularyExtensionSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "VocabularyExtension")
            throw new Error(`Expected VocabularyExtension, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));
        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;
    }

    override get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

    override toString(): string {
        return this.namespace?.value ?? "<null>";
    }

}

// DONE
export class OMLVocabularyUsageSyntax extends OMLVocabularyImportSyntax {

    #namespace?: OMLNamespaceSyntax;
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitVocabularyUsage(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    override get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLVocabularyUsageSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "VocabularyUsage")
            return undefined;

        return new OMLVocabularyUsageSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "VocabularyUsage")
            throw new Error(`Expected VocabularyUsage, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));
        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;
    }

    override get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

    override toString(): string {
        return this.namespace?.value ?? "<null>";
    }

}


export abstract class OMLVocabularyBundleImportSyntax extends OMLImportSyntax {

    #ownedAnnotations?: OMLAnnotationSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode);
        this.#ownedAnnotations = ownedAnnotations;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedAnnotations != null)
                yield* node.ownedAnnotations;

        }();

    }

    abstract override get namespace(): OMLNamespaceSyntax | undefined;

    static override new(syntaxNode?: SyntaxNode | null): OMLVocabularyBundleImportSyntax | undefined {

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const child of childrenForFieldName(syntaxNode, "ownedAnnotations")) {

            const annotation = OMLAnnotationSyntax.new(child);

            if (annotation != null)
                ownedAnnotations.push(annotation);

        }

        const VocabularyBundleImport = childForFieldName(syntaxNode, "VocabularyBundleImport");

        switch (VocabularyBundleImport?.type) {

            case "VocabularyBundleExtension":
                return OMLVocabularyBundleExtensionSyntax.new(VocabularyBundleImport, ownedAnnotations);

            case "VocabularyBundleInclusion":
                return OMLVocabularyBundleInclusionSyntax.new(VocabularyBundleImport, ownedAnnotations);

            default:
                return undefined;

        }

    }

    override get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        this.parse();
        return this.#ownedAnnotations;
    }

    abstract override get prefix(): OMLLocalNameSyntax | undefined;

}

// DONE
export class OMLVocabularyBundleExtensionSyntax extends OMLVocabularyBundleImportSyntax {

    #namespace?: OMLNamespaceSyntax;
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitVocabularyBundleExtension(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    override get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLVocabularyBundleExtensionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "VocabularyBundleExtension")
            return undefined;

        return new OMLVocabularyBundleExtensionSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "VocabularyBundleExtension")
            throw new Error(`Expected VocabularyBundleExtension, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));
        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    override get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

}

// DONE
export class OMLVocabularyBundleInclusionSyntax extends OMLVocabularyBundleImportSyntax {

    #namespace?: OMLNamespaceSyntax;
    #prefix?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitVocabularyBundleInclusion(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.namespace != null)
                yield node.namespace;

            if (node.prefix != null)
                yield node.prefix;

        }();

    }

    override get namespace(): OMLNamespaceSyntax | undefined {
        this.parse();
        return this.#namespace;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLVocabularyBundleInclusionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "VocabularyBundleInclusion")
            return undefined;

        return new OMLVocabularyBundleInclusionSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "VocabularyBundleInclusion")
            throw new Error(`Expected VocabularyBundleInclusion, got ${this.syntaxNode?.type}`);

        this.#namespace = OMLNamespaceSyntax.new(childForFieldName(this.syntaxNode, "namespace"));
        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));

        this.parsed = true;

    }

    override get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

}

export abstract class OMLAssertionSyntax extends OMLElementSyntax { }

// DONE
export class OMLLinkAssertionSyntax extends OMLAssertionSyntax {

    #relation?: OMLRefSyntax;
    #target?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitLinkAssertion(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.relation != null)
                yield node.relation;

            if (node.target != null)
                yield node.target;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLLinkAssertionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "LinkAssertion")
            return undefined;

        return new OMLLinkAssertionSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "LinkAssertion")
            throw new Error(`Expected LinkAssertion, got ${this.syntaxNode?.type}`);

        this.#relation = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "relation"));
        this.#target = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "target"));


        this.parsed = true;

    }

    get relation(): OMLRefSyntax | undefined {
        this.parse();
        return this.#relation;
    }

    get target(): OMLRefSyntax | undefined {
        this.parse();
        return this.#target;
    }

}


export abstract class OMLPropertyValueAssertionSyntax extends OMLAssertionSyntax {

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLPropertyValueAssertionSyntax | undefined {

        switch (syntaxNode?.type) {

            case "ScalarPropertyValueAssertion":
                return OMLScalarPropertyValueAssertionSyntax.new(syntaxNode);

            case "StructuredPropertyValueAssertion":
                return OMLStructuredPropertyValueAssertionSyntax.new(syntaxNode);

            default:
                return undefined;

        }

    }


    abstract get property(): OMLRefSyntax | undefined;

    abstract get value(): OMLLiteralSyntax | OMLStructureInstanceSyntax | undefined;

}

// DONE
export class OMLScalarPropertyValueAssertionSyntax extends OMLPropertyValueAssertionSyntax {

    #property?: OMLRefSyntax;
    #value?: OMLLiteralSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitScalarPropertyValueAssertion(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.property != null)
                yield node.property;

            if (node.value != null)
                yield node.value;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLScalarPropertyValueAssertionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ScalarPropertyValueAssertion")
            return undefined;

        return new OMLScalarPropertyValueAssertionSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ScalarPropertyValueAssertion")
            throw new Error(`Expected ScalarPropertyValueAssertion, got ${this.syntaxNode?.type}`);

        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));
        this.#value = OMLLiteralSyntax.new(childForFieldName(this.syntaxNode, "value"));

        this.parsed = true;

    }

    override get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    override get value(): OMLLiteralSyntax | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export class OMLStructuredPropertyValueAssertionSyntax extends OMLPropertyValueAssertionSyntax {

    #property?: OMLRefSyntax;
    #value?: OMLStructureInstanceSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStructuredPropertyValueAssertion(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.property != null)
                yield node.property;

            if (node.value != null)
                yield node.value;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLStructuredPropertyValueAssertionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "StructuredPropertyValueAssertion")
            return undefined;

        return new OMLStructuredPropertyValueAssertionSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "StructuredPropertyValueAssertion")
            throw new Error(`Expected StructuredPropertyValueAssertion, got ${this.syntaxNode?.type}`);

        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));
        this.#value = OMLStructureInstanceSyntax.new(childForFieldName(this.syntaxNode, "value"));

        this.parsed = true;

    }

    override get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    override get value(): OMLStructureInstanceSyntax | undefined {
        this.parse();
        return this.#value;
    }

}


export abstract class OMLTypeAssertionSyntax extends OMLAssertionSyntax {

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLTypeAssertionSyntax | undefined {

        switch (syntaxNode?.type) {

            case "ConceptTypeAssertion":
                return OMLConceptTypeAssertionSyntax.new(syntaxNode);

            case "RelationTypeAssertion":
                return OMLRelationTypeAssertionSyntax.new(syntaxNode);

            default:
                return undefined;

        }

    }

}

// DONE
export class OMLConceptTypeAssertionSyntax extends OMLTypeAssertionSyntax {

    #type?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitConceptTypeAssertion(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.type != null)
                yield node.type;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLConceptTypeAssertionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ConceptTypeAssertion")
            return undefined;

        return new OMLConceptTypeAssertionSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ConceptTypeAssertion")
            throw new Error(`Expected ConceptTypeAssertion, got ${this.syntaxNode?.type}`);

        this.#type = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "type"));

        this.parsed = true;

    }

    get type(): OMLRefSyntax | undefined {
        this.parse();
        return this.#type;
    }

}

// DONE
export class OMLRelationTypeAssertionSyntax extends OMLTypeAssertionSyntax {

    #type?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRelationTypeAssertion(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.type != null)
                yield node.type;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLRelationTypeAssertionSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RelationTypeAssertion")
            return undefined;

        return new OMLRelationTypeAssertionSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RelationTypeAssertion")
            throw new Error(`Expected RelationTypeAssertion, got ${this.syntaxNode?.type}`);

        this.#type = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "type"));

        this.parsed = true;

    }

    get type(): OMLRefSyntax | undefined {
        this.parse();
        return this.#type;
    }

}

export abstract class OMLAxiomSyntax extends OMLElementSyntax { }

// DONE
export class OMLKeyAxiomSyntax extends OMLAxiomSyntax {

    #properties?: OMLRefSyntax[];

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitKeyAxiom(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.properties != null)
                yield* node.properties;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLKeyAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "KeyAxiom")
            return undefined;

        return new OMLKeyAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "KeyAxiom")
            throw new Error(`Expected KeyAxiom, got ${this.syntaxNode?.type}`);

        this.#properties = [];

        for (const child of childrenForFieldName(this.syntaxNode, "properties")) {

            const property = OMLRefSyntax.new(child);

            if (property != null)
                this.#properties.push(property);

        }

        this.parsed = true;

    }

    get properties(): OMLRefSyntax[] | undefined {
        this.parse();
        return this.#properties;
    }

}

export abstract class OMLRestrictionAxiomSyntax extends OMLAxiomSyntax { }

export abstract class OMLPropertyRestrictionAxiomSyntax extends OMLRestrictionAxiomSyntax { }

export abstract class OMLScalarPropertyRestrictionAxiomSyntax extends OMLPropertyRestrictionAxiomSyntax { }

// DONE
export class OMLScalarPropertyCardinalityRestrictionAxiomSyntax extends OMLScalarPropertyRestrictionAxiomSyntax {

    #cardinality?: SyntaxNode;
    #kind?: SyntaxNode;
    #property?: OMLRefSyntax;
    #range?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitScalarPropertyCardinalityRestrictionAxiom(this, ...args);
    }

    get cardinality(): SyntaxNode | undefined {
        this.parse();
        return this.#cardinality;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.property != null)
                yield node.property;

            if (node.range != null)
                yield node.range;

        }();

    }

    get kind(): SyntaxNode | undefined {
        this.parse();
        return this.#kind;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLScalarPropertyCardinalityRestrictionAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ScalarPropertyCardinalityRestrictionAxiom")
            return undefined;

        return new OMLScalarPropertyCardinalityRestrictionAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ScalarPropertyCardinalityRestrictionAxiom")
            throw new Error(`Expected ScalarPropertyCardinalityRestrictionAxiom, got ${this.syntaxNode?.type}`);

        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));
        this.#range = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "range"));

        this.parsed = true;

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    get range(): OMLRefSyntax | undefined {
        this.parse();
        return this.#range;
    }

}

// DONE
export class OMLScalarPropertyRangeRestrictionAxiomSyntax extends OMLScalarPropertyRestrictionAxiomSyntax {

    #kind?: SyntaxNode;
    #property?: OMLRefSyntax;
    #range?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitScalarPropertyRangeRestrictionAxiom(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.property != null)
                yield node.property;

            if (node.range != null)
                yield node.range;

        }();

    }

    get kind(): SyntaxNode | undefined {
        this.parse();
        return this.#kind;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLScalarPropertyRangeRestrictionAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ScalarPropertyRangeRestrictionAxiom")
            return undefined;

        return new OMLScalarPropertyRangeRestrictionAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ScalarPropertyRangeRestrictionAxiom")
            throw new Error(`Expected ScalarPropertyRangeRestrictionAxiom, got ${this.syntaxNode?.type}`);

        this.#kind = childForFieldName(this.syntaxNode, "kind");
        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));
        this.#range = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "range"));

        this.parsed = true;

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    get range(): OMLRefSyntax | undefined {
        this.parse();
        return this.#range;
    }

}

// DONE
export class OMLScalarPropertyValueRestrictionAxiomSyntax extends OMLScalarPropertyRestrictionAxiomSyntax {

    #property?: OMLRefSyntax;
    #value?: OMLLiteralSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitScalarPropertyValueRestrictionAxiom(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.property != null)
                yield node.property;

            if (node.value != null)
                yield node.value;

        }();

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLScalarPropertyValueRestrictionAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ScalarPropertyValueRestrictionAxiom")
            return undefined;

        return new OMLScalarPropertyValueRestrictionAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ScalarPropertyValueRestrictionAxiom")
            throw new Error(`Expected ScalarPropertyValueRestrictionAxiom, got ${this.syntaxNode?.type}`);

        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));
        this.#value = OMLLiteralSyntax.new(childForFieldName(this.syntaxNode, "value"));

        this.parsed = true;

    }

    get value(): OMLLiteralSyntax | undefined {
        this.parse();
        return this.#value;
    }

}

export abstract class OMLStructuredPropertyRestrictionAxiomSyntax extends OMLPropertyRestrictionAxiomSyntax { }

// DONE
export class OMLStructuredPropertyCardinalityRestrictionAxiomSyntax extends OMLStructuredPropertyRestrictionAxiomSyntax {

    #cardinality?: SyntaxNode;
    #kind?: SyntaxNode;
    #property?: OMLRefSyntax;
    #range?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStructuredPropertyCardinalityRestrictionAxiom(this, ...args);
    }

    get cardinality(): SyntaxNode | undefined {
        this.parse();
        return this.#cardinality;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.property != null)
                yield node.property;

            if (node.range != null)
                yield node.range;

        }();

    }

    get kind(): SyntaxNode | undefined {
        this.parse();
        return this.#kind;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLStructuredPropertyCardinalityRestrictionAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "StructuredPropertyCardinalityRestrictionAxiom")
            return undefined;

        return new OMLStructuredPropertyCardinalityRestrictionAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "StructuredPropertyCardinalityRestrictionAxiom")
            throw new Error(`Expected StructuredPropertyCardinalityRestrictionAxiom, got ${this.syntaxNode?.type}`);

        this.#cardinality = childForFieldName(this.syntaxNode, "cardinality");
        this.#kind = childForFieldName(this.syntaxNode, "kind");
        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));
        this.#range = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "range"));

        this.parsed = true;

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    get range(): OMLRefSyntax | undefined {
        this.parse();
        return this.#range;
    }

}

// DONE
export class OMLStructuredPropertyRangeRestrictionAxiomSyntax extends OMLStructuredPropertyRestrictionAxiomSyntax {

    #kind?: SyntaxNode;
    #property?: OMLRefSyntax;
    #range?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStructuredPropertyRangeRestrictionAxiom(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.property != null)
                yield node.property;

            if (node.range != null)
                yield node.range;

        }();

    }

    get kind(): SyntaxNode | undefined {
        this.parse();
        return this.#kind;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLStructuredPropertyRangeRestrictionAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "StructuredPropertyRangeRestrictionAxiom")
            return undefined;

        return new OMLStructuredPropertyRangeRestrictionAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "StructuredPropertyRangeRestrictionAxiom")
            throw new Error(`Expected StructuredPropertyRangeRestrictionAxiom, got ${this.syntaxNode?.type}`);

        this.#kind = childForFieldName(this.syntaxNode, "kind");
        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));
        this.#range = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "range"));

        this.parsed = true;

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    get range(): OMLRefSyntax | undefined {
        this.parse();
        return this.#range;
    }

}

// DONE
export class OMLStructuredPropertyValueRestrictionAxiomSyntax extends OMLStructuredPropertyRestrictionAxiomSyntax {

    #property?: OMLRefSyntax;
    #value?: OMLStructureInstanceSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStructuredPropertyValueRestrictionAxiom(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.property != null)
                yield node.property;

            if (node.value != null)
                yield node.value;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLStructuredPropertyValueRestrictionAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "StructuredPropertyValueRestrictionAxiom")
            return undefined;

        return new OMLStructuredPropertyValueRestrictionAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "StructuredPropertyValueRestrictionAxiom")
            throw new Error(`Expected StructuredPropertyValueRestrictionAxiom, got ${this.syntaxNode?.type}`);

        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));
        this.#value = OMLStructureInstanceSyntax.new(childForFieldName(this.syntaxNode, "value"));

        this.parsed = true;

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    get value(): OMLStructureInstanceSyntax | undefined {
        this.parse();
        return this.#value;
    }

}

export abstract class OMLRelationRestrictionAxiomSyntax extends OMLRestrictionAxiomSyntax { }

// DONE
export class OMLRelationCardinalityRestrictionAxiomSyntax extends OMLRelationRestrictionAxiomSyntax {

    #cardinality?: SyntaxNode;
    #kind?: SyntaxNode;
    #range?: OMLRefSyntax;
    #relation?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRelationCardinalityRestrictionAxiom(this, ...args);
    }

    get cardinality(): SyntaxNode | undefined {
        this.parse();
        return this.#cardinality;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.range != null)
                yield node.range;

            if (node.relation != null)
                yield node.relation;

        }();

    }


    get kind(): SyntaxNode | undefined {
        this.parse();
        return this.#kind;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLRelationCardinalityRestrictionAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RelationCardinalityRestrictionAxiom")
            return undefined;

        return new OMLRelationCardinalityRestrictionAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RelationCardinalityRestrictionAxiom")
            throw new Error(`Expected RelationCardinalityRestrictionAxiom, got ${this.syntaxNode?.type}`);

        this.#cardinality = childForFieldName(this.syntaxNode, "cardinality");
        this.#kind = childForFieldName(this.syntaxNode, "kind");
        this.#range = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "range"));
        this.#relation = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "relation"));

        this.parsed = true;

    }

    get range(): OMLRefSyntax | undefined {
        this.parse();
        return this.#range;
    }

    get relation(): OMLRefSyntax | undefined {
        this.parse();
        return this.#relation;
    }

}

// DONE
export class OMLRelationRangeRestrictionAxiomSyntax extends OMLRelationRestrictionAxiomSyntax {

    #kind?: SyntaxNode;
    #range?: OMLRefSyntax;
    #relation?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRelationRangeRestrictionAxiom(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.range != null)
                yield node.range;

            if (node.relation != null)
                yield node.relation;

        }();

    }

    get kind(): SyntaxNode | undefined {
        this.parse();
        return this.#kind;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLRelationRangeRestrictionAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RelationRangeRestrictionAxiom")
            return undefined;

        return new OMLRelationRangeRestrictionAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RelationRangeRestrictionAxiom")
            throw new Error(`Expected RelationRangeRestrictionAxiom, got ${this.syntaxNode?.type}`);

        this.#kind = childForFieldName(this.syntaxNode, "kind");
        this.#range = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "range"));
        this.#relation = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "relation"));

        this.parsed = true;

    }

    get range(): OMLRefSyntax | undefined {
        this.parse();
        return this.#range;
    }

    get relation(): OMLRefSyntax | undefined {
        this.parse();
        return this.#relation;
    }

}

// DONE
export class OMLRelationTargetRestrictionAxiomSyntax extends OMLRelationRestrictionAxiomSyntax {

    #relation?: OMLRefSyntax;
    #target?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRelationTargetRestrictionAxiom(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.relation != null)
                yield node.relation;

            if (node.target != null)
                yield node.target;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLRelationTargetRestrictionAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RelationTargetRestrictionAxiom")
            return undefined;

        return new OMLRelationTargetRestrictionAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RelationTargetRestrictionAxiom")
            throw new Error(`Expected RelationTargetRestrictionAxiom, got ${this.syntaxNode?.type}`);

        this.#relation = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "relation"));
        this.#target = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "target"));

        this.parsed = true;

    }

    get relation(): OMLRefSyntax | undefined {
        this.parse();
        return this.#relation;
    }

    get target(): OMLRefSyntax | undefined {
        this.parse();
        return this.#target;
    }

}

// DONE
export class OMLSpecializationAxiomSyntax extends OMLAxiomSyntax {

    #specializedTerm?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitSpecializationAxiom(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.specializedTerm != null)
                yield node.specializedTerm;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLSpecializationAxiomSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "SpecializationAxiom")
            return undefined;

        return new OMLSpecializationAxiomSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "SpecializationAxiom")
            throw new Error(`Expected SpecializationAxiom, got ${this.syntaxNode?.type}`);

        this.#specializedTerm = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "specializedTerm"));

        this.parsed = true;

    }

    get specializedTerm(): OMLRefSyntax | undefined {
        this.parse();
        return this.#specializedTerm;
    }

}

export abstract class OMLInstanceSyntax extends OMLElementSyntax { }

// DONE
export class OMLStructureInstanceSyntax extends OMLInstanceSyntax {

    #ownedPropertyValues?: OMLPropertyValueAssertionSyntax[];
    #type?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStructureInstance(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedPropertyValues != null)
                yield* node.ownedPropertyValues;

            if (node.type != null)
                yield node.type;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLStructureInstanceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "StructureInstance")
            return undefined;

        return new OMLStructureInstanceSyntax(syntaxNode);

    }

    get ownedPropertyValues(): OMLPropertyValueAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyValues;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "StructureInstance")
            throw new Error(`Expected StructureInstance, got ${this.syntaxNode?.type}`);

        this.#ownedPropertyValues = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyValues")) {

            const ownedPropertyValue = OMLPropertyValueAssertionSyntax.new(child);

            if (ownedPropertyValue != null)
                this.#ownedPropertyValues.push(ownedPropertyValue);

        }

        this.#type = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "type"));

        this.parsed = true;

    }

    get type(): OMLRefSyntax | undefined {
        this.parse();
        return this.#type;
    }

}


export abstract class OMLLiteralSyntax extends OMLElementSyntax {

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLLiteralSyntax | undefined {

        switch (syntaxNode?.type) {

            case "IntegerLiteral":
                return OMLIntegerLiteralSyntax.new(syntaxNode);

            case "DecimalLiteral":
                return OMLDecimalLiteralSyntax.new(syntaxNode);

            case "DoubleLiteral":
                return OMLDoubleLiteralSyntax.new(syntaxNode);

            case "BooleanLiteral":
                return OMLBooleanLiteralSyntax.new(syntaxNode);

            case "QuotedLiteral":
                return OMLQuotedLiteralSyntax.new(syntaxNode);

            default:
                return undefined;

        }

    }

    abstract get value(): any | undefined;

}

// DONE
export class OMLBooleanLiteralSyntax extends OMLLiteralSyntax {

    #value?: boolean;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitBooleanLiteral(this, ...args);
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLBooleanLiteralSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "BooleanLiteral")
            return undefined;

        return new OMLBooleanLiteralSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "BooleanLiteral")
            throw new Error(`Expected BooleanLiteral, got ${this.syntaxNode?.type}`);

        this.#value = this.syntaxNode?.text == "true";

        this.parsed = true;

    }

    override get value(): boolean | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export class OMLDecimalLiteralSyntax extends OMLLiteralSyntax {

    #value?: Big;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDecimalLiteral(this, ...args);
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLDecimalLiteralSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "DecimalLiteral")
            return undefined;

        return new OMLDecimalLiteralSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "DecimalLiteral")
            throw new Error(`Expected DecimalLiteral, got ${this.syntaxNode?.type}`);

        this.#value = Big(this.syntaxNode.text);

        this.parsed = true;

    }

    override get value(): Big | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export class OMLDoubleLiteralSyntax extends OMLLiteralSyntax {

    #value?: number;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDoubleLiteral(this, ...args);
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLDoubleLiteralSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "DoubleLiteral")
            return undefined;

        return new OMLDoubleLiteralSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "DoubleLiteral")
            throw new Error(`Expected DoubleLiteral, got ${this.syntaxNode?.type}`);

        this.#value = parseFloat(this.syntaxNode.text);

        this.parsed = true;

    }

    override get value(): number | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export class OMLIntegerLiteralSyntax extends OMLLiteralSyntax {

    #value?: number;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitIntegerLiteral(this, ...args);
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLIntegerLiteralSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "IntegerLiteral")
            return undefined;

        return new OMLIntegerLiteralSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "IntegerLiteral")
            throw new Error(`Expected IntegerLiteral, got ${this.syntaxNode?.type}`);

        this.#value = parseInt(this.syntaxNode.text);

        this.parsed = true;

    }

    override get value(): number | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export class OMLQuotedLiteralSyntax extends OMLLiteralSyntax {

    #langTag?: OMLLocalNameSyntax;
    #type?: OMLRefSyntax;
    #value?: string;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitQuotedLiteral(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.langTag != null)
                yield node.langTag;

            if (node.type != null)
                yield node.type;

        }();

    }

    get langTag(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#langTag;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLQuotedLiteralSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "QuotedLiteral")
            return undefined;

        return new OMLQuotedLiteralSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "QuotedLiteral")
            throw new Error(`Expected QuotedLiteral, got ${this.syntaxNode?.type}`);

        this.#langTag = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "langTag"));
        this.#type = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "type"));
        this.#value = childForFieldName(this.syntaxNode, "value")?.text;

        if (this.#value != null) {
            if (this.#value.startsWith("\"\"\""))
                this.#value = this.#value.substring(3, this.#value.length - 3);
            else if (this.#value.startsWith("'''"))
                this.#value = this.#value.substring(3, this.#value.length - 3);
            else
                this.#value = this.#value.substring(1, this.#value.length - 1);
        }

        this.parsed = true;

    }

    get type(): OMLRefSyntax | undefined {
        this.parse();
        return this.#type;
    }

    override get value(): string | undefined {
        this.parse();
        return this.#value;
    }

}

export abstract class OMLPredicateSyntax extends OMLElementSyntax { }

export abstract class OMLBinaryPredicateSyntax extends OMLPredicateSyntax { }

// DONE
export class OMLFeaturePredicateSyntax extends OMLBinaryPredicateSyntax {

    #feature?: OMLRefSyntax;
    #instance2?: OMLCrossRefSyntax;
    #literal2?: OMLLiteralSyntax;
    #variable1?: OMLLocalNameSyntax;
    #variable2?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitFeaturePredicate(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.feature != null)
                yield node.feature;

            if (node.instance2 != null)
                yield node.instance2;

            if (node.literal2 != null)
                yield node.literal2;

            if (node.variable1 != null)
                yield node.variable1;

            if (node.variable2 != null)
                yield node.variable2;

        }();

    }

    get feature(): OMLRefSyntax | undefined {
        this.parse();
        return this.#feature;
    }

    get instance2(): OMLCrossRefSyntax | undefined {
        this.parse();
        return this.#instance2;
    }

    get literal2(): OMLLiteralSyntax | undefined {
        this.parse();
        return this.#literal2;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLFeaturePredicateSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "FeaturePredicate")
            return undefined;

        return new OMLFeaturePredicateSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "FeaturePredicate")
            throw new Error(`Expected FeaturePredicate, got ${this.syntaxNode?.type}`);

        this.#feature = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "feature"));
        this.#instance2 = OMLCrossRefSyntax.new(childForFieldName(this.syntaxNode, "instance2"));
        this.#literal2 = OMLLiteralSyntax.new(childForFieldName(this.syntaxNode, "literal2"));
        this.#variable1 = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "variable1"));
        this.#variable2 = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "variable2"));

        this.parsed = true;

    }

    get variable1(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#variable1;
    }

    get variable2(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#variable2;
    }

}

// DONE
export class OMLDifferentFromPredicateSyntax extends OMLBinaryPredicateSyntax {

    #instance2?: OMLCrossRefSyntax;
    #variable1?: OMLLocalNameSyntax;
    #variable2?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitDifferentFromPredicate(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.variable1 != null)
                yield node.variable1;

            if (node.variable2 != null)
                yield node.variable2;

            if (node.instance2 != null)
                yield node.instance2;

        }();

    }

    get instance2(): OMLCrossRefSyntax | undefined {
        this.parse();
        return this.#instance2;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLDifferentFromPredicateSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "DifferentFromPredicate")
            return undefined;

        return new OMLDifferentFromPredicateSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "DifferentFromPredicate")
            throw new Error(`Expected DifferentFromPredicate, got ${this.syntaxNode?.type}`);

        this.#variable1 = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "variable1"));
        this.#variable2 = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "variable2"));
        this.#instance2 = OMLCrossRefSyntax.new(childForFieldName(this.syntaxNode, "instance2"));

        this.parsed = true;

    }

    get variable1(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#variable1;
    }

    get variable2(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#variable2;
    }

}

// DONE
export class OMLRelationEntityPredicateSyntax extends OMLBinaryPredicateSyntax {

    #entity?: OMLRefSyntax;
    #entityVariable?: OMLLocalNameSyntax;
    #instance2?: OMLCrossRefSyntax;
    #variable1?: OMLLocalNameSyntax;
    #variable2?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRelationEntityPredicate(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.entity != null)
                yield node.entity;

            if (node.entityVariable != null)
                yield node.entityVariable;

            if (node.instance2 != null)
                yield node.instance2;

            if (node.variable1 != null)
                yield node.variable1;

            if (node.variable2 != null)
                yield node.variable2;

        }();

    }

    get entity(): OMLRefSyntax | undefined {
        this.parse();
        return this.#entity;
    }

    get entityVariable(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#entityVariable;
    }

    get instance2(): OMLCrossRefSyntax | undefined {
        this.parse();
        return this.#instance2;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLRelationEntityPredicateSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RelationEntityPredicate")
            return undefined;

        return new OMLRelationEntityPredicateSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RelationEntityPredicate")
            throw new Error(`Expected RelationEntityPredicate, got ${this.syntaxNode?.type}`);

        this.#entity = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "entity"));
        this.#entityVariable = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "entityVariable"));
        this.#instance2 = OMLCrossRefSyntax.new(childForFieldName(this.syntaxNode, "instance2"));
        this.#variable1 = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "variable1"));
        this.#variable2 = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "variable2"));

        this.parsed = true;

    }

    get variable1(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#variable1;
    }

    get variable2(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#variable2;
    }

}

// DONE
export class OMLSameAsPredicateSyntax extends OMLBinaryPredicateSyntax {

    #instance2?: OMLCrossRefSyntax;
    #variable1?: OMLLocalNameSyntax;
    #variable2?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitSameAsPredicate(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.variable1 != null)
                yield node.variable1;

            if (node.variable2 != null)
                yield node.variable2;

            if (node.instance2 != null)
                yield node.instance2;

        }();

    }

    get instance2(): OMLCrossRefSyntax | undefined {
        this.parse();
        return this.#instance2;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLSameAsPredicateSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "SameAsPredicate")
            return undefined;

        return new OMLSameAsPredicateSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "SameAsPredicate")
            throw new Error(`Expected SameAsPredicate, got ${this.syntaxNode?.type}`);

        this.#variable1 = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "variable1"));
        this.#variable2 = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "variable2"));
        this.#instance2 = OMLCrossRefSyntax.new(childForFieldName(this.syntaxNode, "instance2"));

        this.parsed = true;

    }

    get variable1(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#variable1;
    }

    get variable2(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#variable2;
    }

}

export abstract class OMLUnaryPredicateSyntax extends OMLPredicateSyntax { }

// DONE
export class OMLTypePredicateSyntax extends OMLUnaryPredicateSyntax {

    #type?: OMLRefSyntax;
    #variable?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitTypePredicate(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.type != null)
                yield node.type;

            if (node.variable != null)
                yield node.variable;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLTypePredicateSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "TypePredicate")
            return undefined;

        return new OMLTypePredicateSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "TypePredicate")
            throw new Error(`Expected TypePredicate, got ${this.syntaxNode?.type}`);

        this.#type = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "type"));

        this.#variable = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "variable"));

        this.parsed = true;

    }

    get type(): OMLRefSyntax | undefined {
        this.parse();
        return this.#type;
    }

    get variable(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#variable;
    }

}

export abstract class OMLReferenceSyntax extends OMLElementSyntax { }

export abstract class OMLStatementSyntax extends OMLElementSyntax {

    abstract override toString(): string;

}


export abstract class OMLDescriptionStatementSyntax extends OMLStatementSyntax {

    #ownedAnnotations?: OMLAnnotationSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode);
        this.#ownedAnnotations = ownedAnnotations;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedAnnotations != null)
                yield* node.ownedAnnotations;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLDescriptionStatementSyntax | undefined {

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const child of childrenForFieldName(syntaxNode, "ownedAnnotations")) {

            const annotation = OMLAnnotationSyntax.new(child);

            if (annotation != null)
                ownedAnnotations.push(annotation);

        }

        const DescriptionStatement = childForFieldName(syntaxNode, "DescriptionStatement");

        switch (DescriptionStatement?.type) {

            case "ConceptInstance":
                return OMLConceptInstanceSyntax.new(DescriptionStatement, ownedAnnotations);

            case "RelationInstance":
                return OMLRelationInstanceSyntax.new(DescriptionStatement, ownedAnnotations);

            case "ConceptInstanceReference":
                return OMLConceptInstanceReferenceSyntax.new(DescriptionStatement, ownedAnnotations);

            case "RelationInstanceReference":
                return OMLRelationInstanceReferenceSyntax.new(DescriptionStatement, ownedAnnotations);

            default:
                return undefined;

        }

    }

    override get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        this.parse();
        return this.#ownedAnnotations;
    }

}

export abstract class OMLNamedInstanceSyntax extends OMLDescriptionStatementSyntax implements OMLMemberSyntax, OMLInstanceSyntax {
    abstract get name(): OMLLocalNameSyntax | undefined;
}

// DONE
export class OMLConceptInstanceSyntax extends OMLNamedInstanceSyntax {

    #name?: OMLLocalNameSyntax;
    #ownedLinks?: OMLLinkAssertionSyntax[];
    #ownedPropertyValues?: OMLPropertyValueAssertionSyntax[];
    #ownedTypes?: OMLConceptTypeAssertionSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitConceptInstance(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.name != null)
                yield node.name;

            if (node.ownedLinks != null)
                yield* node.ownedLinks;

            if (node.ownedPropertyValues != null)
                yield* node.ownedPropertyValues;

            if (node.ownedTypes != null)
                yield* node.ownedTypes;

        }();

    }

    override get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLConceptInstanceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ConceptInstance")
            return undefined;

        return new OMLConceptInstanceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedLinks(): OMLLinkAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedLinks;
    }

    get ownedPropertyValues(): OMLPropertyValueAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyValues;
    }

    get ownedTypes(): OMLConceptTypeAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedTypes;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ConceptInstance")
            throw new Error(`Expected ConceptInstance, got ${this.syntaxNode?.type}`);

        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedLinks = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedLinks")) {

            const ownedLink = OMLLinkAssertionSyntax.new(child);

            if (ownedLink != null)
                this.#ownedLinks.push(ownedLink);

        }

        this.#ownedPropertyValues = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyValues")) {

            const ownedPropertyValue = OMLPropertyValueAssertionSyntax.new(child);

            if (ownedPropertyValue != null)
                this.#ownedPropertyValues.push(ownedPropertyValue);

        }

        this.#ownedTypes = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedTypes")) {

            const ownedType = OMLConceptTypeAssertionSyntax.new(child);

            if (ownedType != null)
                this.#ownedTypes.push(ownedType);

        }

        this.parsed = true;

    }

    override toString(): string {
        return "<todo>";
    }

}

// DONE
export class OMLRelationInstanceSyntax extends OMLNamedInstanceSyntax {

    #name?: OMLLocalNameSyntax;
    #ownedLinks?: OMLLinkAssertionSyntax[];
    #ownedPropertyValues?: OMLPropertyValueAssertionSyntax[];
    #ownedTypes?: OMLRelationTypeAssertionSyntax[];
    #sources?: OMLRefSyntax[];
    #targets?: OMLRefSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRelationInstance(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.name != null)
                yield node.name;

            if (node.ownedLinks != null)
                yield* node.ownedLinks;

            if (node.ownedPropertyValues != null)
                yield* node.ownedPropertyValues;

            if (node.ownedTypes != null)
                yield* node.ownedTypes;

            if (node.sources != null)
                yield* node.sources;

            if (node.targets != null)
                yield* node.targets;

        }();

    }

    override get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLRelationInstanceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RelationInstance")
            return undefined;

        return new OMLRelationInstanceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedLinks(): OMLLinkAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedLinks;
    }

    get ownedPropertyValues(): OMLPropertyValueAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyValues;
    }

    get ownedTypes(): OMLRelationTypeAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedTypes;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RelationInstance")
            throw new Error(`Expected RelationInstance, got ${this.syntaxNode?.type}`);

        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedLinks = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedLinks")) {

            const ownedLink = OMLLinkAssertionSyntax.new(child);

            if (ownedLink != null)
                this.#ownedLinks.push(ownedLink);

        }

        this.#ownedPropertyValues = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyValues")) {

            const ownedPropertyValue = OMLPropertyValueAssertionSyntax.new(child);

            if (ownedPropertyValue != null)
                this.#ownedPropertyValues.push(ownedPropertyValue);

        }

        this.#ownedTypes = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedTypes")) {

            const ownedType = OMLRelationTypeAssertionSyntax.new(child);

            if (ownedType != null)
                this.#ownedTypes.push(ownedType);

        }

        this.#sources = [];

        for (const child of childrenForFieldName(this.syntaxNode, "sources")) {

            const source = OMLRefSyntax.new(child);

            if (source != null)
                this.#sources.push(source);

        }

        this.#targets = [];

        for (const child of childrenForFieldName(this.syntaxNode, "targets")) {

            const target = OMLRefSyntax.new(child);

            if (target != null)
                this.#targets.push(target);

        }

        this.parsed = true;

    }

    get sources(): OMLRefSyntax[] | undefined {
        this.parse();
        return this.#sources;
    }

    get targets(): OMLRefSyntax[] | undefined {
        this.parse();
        return this.#targets;
    }

    override toString(): string {
        return "<todo>";
    }

}

export abstract class OMLNamedInstanceReferenceSyntax extends OMLDescriptionStatementSyntax implements OMLReferenceSyntax {

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    abstract get instance(): OMLRefSyntax | undefined;

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLNamedInstanceReferenceSyntax | undefined {

        switch (syntaxNode?.type) {

            case "ConceptInstanceReference":
                return OMLConceptInstanceReferenceSyntax.new(syntaxNode, ownedAnnotations);

            case "RelationInstanceReference":
                return OMLRelationInstanceReferenceSyntax.new(syntaxNode, ownedAnnotations);

            default:
                return undefined;

        }

    }

}

// DONE
export class OMLConceptInstanceReferenceSyntax extends OMLNamedInstanceReferenceSyntax {

    #instance?: OMLRefSyntax;
    #ownedLinks?: OMLLinkAssertionSyntax[];
    #ownedPropertyValues?: OMLPropertyValueAssertionSyntax[];
    #ownedTypes?: OMLConceptTypeAssertionSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitConceptInstanceReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.instance != null)
                yield node.instance;

            if (node.ownedLinks != null)
                yield* node.ownedLinks;

            if (node.ownedPropertyValues != null)
                yield* node.ownedPropertyValues;

            if (node.ownedTypes != null)
                yield* node.ownedTypes;

        }();

    }

    override get instance(): OMLRefSyntax | undefined {
        this.parse();
        return this.#instance;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLConceptInstanceReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ConceptInstanceReference")
            return undefined;

        return new OMLConceptInstanceReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedLinks(): OMLLinkAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedLinks;
    }

    get ownedPropertyValues(): OMLPropertyValueAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyValues;
    }

    get ownedTypes(): OMLConceptTypeAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedTypes;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ConceptInstanceReference")
            throw new Error(`Expected ConceptInstanceReference, got ${this.syntaxNode?.type}`);

        this.#instance = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "instance"));

        this.#ownedLinks = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedLinks")) {

            const ownedLink = OMLLinkAssertionSyntax.new(child);

            if (ownedLink != null)
                this.#ownedLinks.push(ownedLink);

        }

        this.#ownedPropertyValues = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyValues")) {

            const ownedPropertyValue = OMLPropertyValueAssertionSyntax.new(child);

            if (ownedPropertyValue != null)
                this.#ownedPropertyValues.push(ownedPropertyValue);

        }

        this.#ownedTypes = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedTypes")) {

            const ownedType = OMLConceptTypeAssertionSyntax.new(child);

            if (ownedType != null)
                this.#ownedTypes.push(ownedType);

        }

        this.parsed = true;

    }

    override toString(): string {
        return this.instance?.toString() ?? "<null>";
    }

}

// DONE
export class OMLRelationInstanceReferenceSyntax extends OMLNamedInstanceReferenceSyntax {

    #instance?: OMLRefSyntax;
    #ownedLinks?: OMLLinkAssertionSyntax[];
    #ownedPropertyValues?: OMLPropertyValueAssertionSyntax[];
    #ownedTypes?: OMLRelationTypeAssertionSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRelationInstanceReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.instance != null)
                yield node.instance;

            if (node.ownedLinks != null)
                yield* node.ownedLinks;

            if (node.ownedPropertyValues != null)
                yield* node.ownedPropertyValues;

            if (node.ownedTypes != null)
                yield* node.ownedTypes;

        }();

    }

    override get instance(): OMLRefSyntax | undefined {
        this.parse();
        return this.#instance;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLRelationInstanceReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RelationInstanceReference")
            return undefined;

        return new OMLRelationInstanceReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedLinks(): OMLLinkAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedLinks;
    }

    get ownedPropertyValues(): OMLPropertyValueAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyValues;
    }

    get ownedTypes(): OMLRelationTypeAssertionSyntax[] | undefined {
        this.parse();
        return this.#ownedTypes;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RelationInstanceReference")
            throw new Error(`Expected RelationInstanceReference, got ${this.syntaxNode?.type}`);

        this.#instance = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "instance"));

        this.#ownedLinks = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedLinks")) {

            const ownedLink = OMLLinkAssertionSyntax.new(child);

            if (ownedLink != null)
                this.#ownedLinks.push(ownedLink);

        }

        this.#ownedPropertyValues = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyValues")) {

            const ownedPropertyValue = OMLPropertyValueAssertionSyntax.new(child);

            if (ownedPropertyValue != null)
                this.#ownedPropertyValues.push(ownedPropertyValue);

        }

        this.#ownedTypes = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedTypes")) {

            const ownedType = OMLRelationTypeAssertionSyntax.new(child);

            if (ownedType != null)
                this.#ownedTypes.push(ownedType);

        }

        this.parsed = true;

    }

    override toString(): string {
        return this.#instance?.toString() ?? "<null>";
    }

}


export abstract class OMLVocabularyStatementSyntax extends OMLStatementSyntax {

    #ownedAnnotations?: OMLAnnotationSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode);
        this.#ownedAnnotations = ownedAnnotations;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedAnnotations != null)
                yield* node.ownedAnnotations;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null): OMLVocabularyStatementSyntax | undefined {

        const ownedAnnotations: OMLAnnotationSyntax[] = [];

        for (const child of childrenForFieldName(syntaxNode, "ownedAnnotations")) {

            const annotation = OMLAnnotationSyntax.new(child);

            if (annotation != null)
                ownedAnnotations.push(annotation);

        }

        const VocabularyStatement = childForFieldName(syntaxNode, "VocabularyStatement");

        switch (VocabularyStatement?.type) {

            case "Aspect":
                return OMLAspectSyntax.new(VocabularyStatement, ownedAnnotations);

            case "Concept":
                return OMLConceptSyntax.new(VocabularyStatement, ownedAnnotations);

            case "RelationEntity":
                return OMLRelationEntitySyntax.new(VocabularyStatement, ownedAnnotations);

            case "Structure":
                return OMLStructureSyntax.new(VocabularyStatement, ownedAnnotations);

            case "FacetedScalar":
                return OMLFacetedScalarSyntax.new(VocabularyStatement, ownedAnnotations);

            case "EnumeratedScalar":
                return OMLEnumeratedScalarSyntax.new(VocabularyStatement, ownedAnnotations);

            case "AnnotationProperty":
                return OMLAnnotationPropertySyntax.new(VocabularyStatement, ownedAnnotations);

            case "ScalarProperty":
                return OMLScalarPropertySyntax.new(VocabularyStatement, ownedAnnotations);

            case "StructuredProperty":
                return OMLStructuredPropertySyntax.new(VocabularyStatement, ownedAnnotations);

            case "AspectReference":
                return OMLAspectReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            case "ConceptReference":
                return OMLConceptReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            case "RelationEntityReference":
                return OMLRelationEntityReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            case "StructureReference":
                return OMLStructureReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            case "FacetedScalarReference":
                return OMLFacetedScalarReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            case "EnumeratedScalarReference":
                return OMLEnumeratedScalarReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            case "AnnotationPropertyReference":
                return OMLAnnotationPropertyReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            case "ScalarPropertyReference":
                return OMLScalarPropertyReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            case "StructuredPropertyReference":
                return OMLStructuredPropertyReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            case "Rule":
                return OMLRuleSyntax.new(VocabularyStatement, ownedAnnotations);

            case "RuleReference":
                return OMLRuleReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            case "RelationReference":
                return OMLRelationReferenceSyntax.new(VocabularyStatement, ownedAnnotations);

            default:
                return undefined;

        }

    }

    override get ownedAnnotations(): OMLAnnotationSyntax[] | undefined {
        this.parse();
        return this.#ownedAnnotations;
    }

}

// DONE
export class OMLRelationReferenceSyntax extends OMLVocabularyStatementSyntax implements OMLReferenceSyntax {

    #relation?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRelationReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.relation != null)
                yield node.relation;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLRelationReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RelationReference")
            return undefined;

        return new OMLRelationReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RelationReference")
            throw new Error(`Expected RelationReference, got ${this.syntaxNode?.type}`);

        this.#relation = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "relation"));

        this.parsed = true;

    }

    get relation(): OMLRefSyntax | undefined {
        this.parse();
        return this.#relation;
    }

    override toString(): string {
        return this.relation?.toString() ?? "<null>";
    }

}

// DONE
export class OMLRuleSyntax extends OMLVocabularyStatementSyntax implements OMLMemberSyntax {

    #antecedents?: OMLPredicateSyntax[];
    #consequents?: OMLPredicateSyntax[];
    #name?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRule(this, ...args);
    }

    get antecedents(): OMLPredicateSyntax[] | undefined {
        this.parse();
        return this.#antecedents;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.antecedents != null)
                yield* node.antecedents;

            if (node.consequents != null)
                yield* node.consequents;

            if (node.name != null)
                yield node.name;


        }();

    }

    get consequents(): OMLPredicateSyntax[] | undefined {
        this.parse();
        return this.#consequents;
    }

    get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLRuleSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "Rule")
            return undefined;

        return new OMLRuleSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "Rule")
            throw new Error(`Expected Rule, got ${this.syntaxNode?.type}`);


        this.#antecedents = [];

        for (const child of childrenForFieldName(this.syntaxNode, "antecedents")) {

            const antecedent = OMLPredicateSyntax.new(child);

            if (antecedent != null)
                this.#antecedents.push(antecedent);

        }

        this.#consequents = [];

        for (const child of childrenForFieldName(this.syntaxNode, "consequents")) {

            const consequent = OMLPredicateSyntax.new(child);

            if (consequent != null)
                this.#consequents.push(consequent);

        }

        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.parsed = true;

    }

    override toString(): string {
        return this.name?.toString() ?? "<null>";
    }

}

// DONE
export class OMLRuleReferenceSyntax extends OMLVocabularyStatementSyntax implements OMLReferenceSyntax {

    #rule?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRuleReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.rule != null)
                yield node.rule;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLRuleReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RuleReference")
            return undefined;

        return new OMLRuleReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RuleReference")
            throw new Error(`Expected RuleReference, got ${this.syntaxNode?.type}`);

        this.#rule = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "rule"));

        this.parsed = true;

    }

    get rule(): OMLRefSyntax | undefined {
        this.parse();
        return this.#rule;
    }

    override toString(): string {
        return this.rule?.toString() ?? "<null>";
    }

}

export abstract class OMLSpecializableTermSyntax extends OMLVocabularyStatementSyntax implements OMLTermSyntax {

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    abstract get name(): OMLLocalNameSyntax | undefined;

}

// DONE
export class OMLAnnotationPropertySyntax extends OMLSpecializableTermSyntax implements OMLPropertySyntax {

    #name?: OMLLocalNameSyntax;
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitAnnotationProperty(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.name != null)
                yield node.name;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

        }();

    }

    get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLAnnotationPropertySyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "AnnotationProperty")
            return undefined;

        return new OMLAnnotationPropertySyntax(syntaxNode, ownedAnnotations);

    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "AnnotationProperty")
            throw new Error(`Expected AnnotationProperty, got ${this.syntaxNode?.type}`);


        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.parsed = true;

    }

    override toString(): string {
        return this.name?.toString() ?? "<null>";
    }

}

// DONE
export class OMLScalarPropertySyntax extends OMLSpecializableTermSyntax implements OMLSemanticPropertySyntax {

    #domain?: OMLRefSyntax;
    #functional?: SyntaxNode;
    #name?: OMLLocalNameSyntax;
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];
    #range?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitScalarProperty(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.domain != null)
                yield node.domain;

            if (node.name != null)
                yield node.name;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

            if (node.range != null)
                yield node.range;

        }();

    }

    get domain(): OMLRefSyntax | undefined {
        this.parse();
        return this.#domain;
    }

    get functional(): SyntaxNode | undefined {
        this.parse();
        return this.#functional;
    }

    get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLScalarPropertySyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ScalarProperty")
            return undefined;

        return new OMLScalarPropertySyntax(syntaxNode, ownedAnnotations);

    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ScalarProperty")
            throw new Error(`Expected ScalarProperty, got ${this.syntaxNode?.type}`);

        this.#domain = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "domain"));
        this.#functional = childForFieldName(this.syntaxNode, "functional");
        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.#range = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "range"));

        this.parsed = true;

    }

    get range(): OMLRefSyntax | undefined {
        this.parse();
        return this.#range;
    }

    override toString(): string {
        return this.name?.toString() ?? "<null>";
    }

}

// DONE
export class OMLStructuredPropertySyntax extends OMLSpecializableTermSyntax implements OMLSemanticPropertySyntax {

    #domain?: OMLRefSyntax;
    #functional?: SyntaxNode;
    #name?: OMLLocalNameSyntax;
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];
    #range?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStructuredProperty(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.domain != null)
                yield node.domain;

            if (node.name != null)
                yield node.name;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

            if (node.range != null)
                yield node.range;

        }();

    }

    get domain(): OMLRefSyntax | undefined {
        this.parse();
        return this.#domain;
    }

    get functional(): SyntaxNode | undefined {
        this.parse();
        return this.#functional;
    }

    get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLStructuredPropertySyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "StructuredProperty")
            return undefined;

        return new OMLStructuredPropertySyntax(syntaxNode, ownedAnnotations);

    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "StructuredProperty")
            throw new Error(`Expected StructuredProperty, got ${this.syntaxNode?.type}`);

        this.#domain = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "domain"));
        this.#functional = childForFieldName(this.syntaxNode, "functional");
        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.#range = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "range"));

        this.parsed = true;

    }

    get range(): OMLRefSyntax | undefined {
        this.parse();
        return this.#range;
    }

    override toString(): string {
        return this.name?.toString() ?? "<null>";
    }

}

export abstract class OMLTypeSyntax extends OMLSpecializableTermSyntax { }

export abstract class OMLClassifierSyntax extends OMLTypeSyntax { }

export abstract class OMLEntitySyntax extends OMLClassifierSyntax {

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

}

// DONE
export class OMLAspectSyntax extends OMLEntitySyntax {

    #name?: OMLLocalNameSyntax;
    #ownedKeys?: OMLKeyAxiomSyntax[];
    #ownedPropertyRestrictions?: OMLPropertyRestrictionAxiomSyntax[];
    #ownedRelationRestrictions?: OMLRelationRestrictionAxiomSyntax[];
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitAspect(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.name != null)
                yield node.name;

            if (node.ownedKeys != null)
                yield* node.ownedKeys;

            if (node.ownedPropertyRestrictions != null)
                yield* node.ownedPropertyRestrictions;

            if (node.ownedRelationRestrictions != null)
                yield* node.ownedRelationRestrictions;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

        }();

    }

    override get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLAspectSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "Aspect")
            return undefined;

        return new OMLAspectSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedKeys(): OMLKeyAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedKeys;
    }

    get ownedPropertyRestrictions(): OMLPropertyRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyRestrictions;
    }

    get ownedRelationRestrictions(): OMLRelationRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedRelationRestrictions;
    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "Aspect")
            throw new Error(`Expected Aspect, got ${this.syntaxNode?.type}`);

        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedKeys = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedKeys")) {

            const ownedKey = OMLKeyAxiomSyntax.new(child);

            if (ownedKey != null)
                this.#ownedKeys.push(ownedKey);

        }

        this.#ownedPropertyRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyRestrictions")) {

            const ownedPropertyRestriction = OMLPropertyRestrictionAxiomSyntax.new(child);

            if (ownedPropertyRestriction != null)
                this.#ownedPropertyRestrictions.push(ownedPropertyRestriction);

        }

        this.#ownedRelationRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedRelationRestrictions")) {

            const ownedRelationRestriction = OMLRelationRestrictionAxiomSyntax.new(child);

            if (ownedRelationRestriction != null)
                this.#ownedRelationRestrictions.push(ownedRelationRestriction);

        }

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.parsed = true;

    }

    override toString(): string {
        return this.name?.toString() ?? "<null>";
    }

}

// DONE
export class OMLConceptSyntax extends OMLEntitySyntax {

    #enumeratedInstances?: OMLConceptInstanceSyntax[];
    #name?: OMLLocalNameSyntax;
    #ownedKeys?: OMLKeyAxiomSyntax[];
    #ownedPropertyRestrictions?: OMLPropertyRestrictionAxiomSyntax[];
    #ownedRelationRestrictions?: OMLRelationRestrictionAxiomSyntax[];
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitConcept(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.enumeratedInstances != null)
                yield* node.enumeratedInstances;

            if (node.name != null)
                yield node.name;

            if (node.ownedKeys != null)
                yield* node.ownedKeys;

            if (node.ownedPropertyRestrictions != null)
                yield* node.ownedPropertyRestrictions;

            if (node.ownedRelationRestrictions != null)
                yield* node.ownedRelationRestrictions;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

        }();

    }

    get enumeratedInstances(): OMLConceptInstanceSyntax[] | undefined {
        this.parse();
        return this.#enumeratedInstances;
    }

    override get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLConceptSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "Concept")
            return undefined;

        return new OMLConceptSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedKeys(): OMLKeyAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedKeys;
    }

    get ownedPropertyRestrictions(): OMLPropertyRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyRestrictions;
    }

    get ownedRelationRestrictions(): OMLRelationRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedRelationRestrictions;
    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "Concept")
            throw new Error(`Expected Concept, got ${this.syntaxNode?.type}`);

        this.#enumeratedInstances = [];

        for (const child of childrenForFieldName(this.syntaxNode, "enumeratedInstances")) {

            const enumeratedInstance = OMLConceptInstanceSyntax.new(child);

            if (enumeratedInstance != null)
                this.#enumeratedInstances.push(enumeratedInstance);

        }

        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedKeys = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedKeys")) {

            const ownedKey = OMLKeyAxiomSyntax.new(child);

            if (ownedKey != null)
                this.#ownedKeys.push(ownedKey);

        }

        this.#ownedPropertyRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyRestrictions")) {

            const ownedPropertyRestriction = OMLPropertyRestrictionAxiomSyntax.new(child);

            if (ownedPropertyRestriction != null)
                this.#ownedPropertyRestrictions.push(ownedPropertyRestriction);

        }

        this.#ownedRelationRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedRelationRestrictions")) {

            const ownedRelationRestriction = OMLRelationRestrictionAxiomSyntax.new(child);

            if (ownedRelationRestriction != null)
                this.#ownedRelationRestrictions.push(ownedRelationRestriction);

        }

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.parsed = true;

    }

    override toString(): string {
        return this.name?.toString() ?? "<null>";
    }

}

// DONE
export class OMLRelationEntitySyntax extends OMLEntitySyntax {

    #asymmetric?: SyntaxNode;
    #forwardRelation?: OMLForwardRelationSyntax;
    #functional?: SyntaxNode;
    #inverseFunctional?: SyntaxNode;
    #irreflexive?: SyntaxNode;
    #name?: OMLLocalNameSyntax;
    #ownedKeys?: OMLKeyAxiomSyntax[];
    #ownedPropertyRestrictions?: OMLPropertyRestrictionAxiomSyntax[];
    #ownedRelationRestrictions?: OMLRelationRestrictionAxiomSyntax[];
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];
    #reflexive?: SyntaxNode;
    #reverseRelation?: OMLReverseRelationSyntax;
    #source?: OMLRefSyntax;
    #symmetric?: SyntaxNode;
    #target?: OMLRefSyntax;
    #transitive?: SyntaxNode;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRelationEntity(this, ...args);
    }

    get asymmetric(): SyntaxNode | undefined {
        this.parse();
        return this.#asymmetric;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.forwardRelation != null)
                yield node.forwardRelation;

            if (node.name != null)
                yield node.name;

            if (node.ownedKeys != null)
                yield* node.ownedKeys;

            if (node.ownedPropertyRestrictions != null)
                yield* node.ownedPropertyRestrictions;

            if (node.ownedRelationRestrictions != null)
                yield* node.ownedRelationRestrictions;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

            if (node.reverseRelation != null)
                yield node.reverseRelation;

            if (node.source != null)
                yield node.source;

            if (node.target != null)
                yield node.target;

        }();

    }

    get forwardRelation(): OMLForwardRelationSyntax | undefined {
        this.parse();
        return this.#forwardRelation;
    }

    get functional(): SyntaxNode | undefined {
        this.parse();
        return this.#functional;
    }

    get inverseFunctional(): SyntaxNode | undefined {
        this.parse();
        return this.#inverseFunctional;
    }

    get irreflexive(): SyntaxNode | undefined {
        this.parse();
        return this.#irreflexive;
    }

    override get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLRelationEntitySyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RelationEntity")
            return undefined;

        return new OMLRelationEntitySyntax(syntaxNode, ownedAnnotations);

    }

    get ownedKeys(): OMLKeyAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedKeys;
    }

    get ownedPropertyRestrictions(): OMLPropertyRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyRestrictions;
    }

    get ownedRelationRestrictions(): OMLRelationRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedRelationRestrictions;
    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RelationEntity")
            throw new Error(`Expected RelationEntity, got ${this.syntaxNode?.type}`);

        this.#asymmetric = childForFieldName(this.syntaxNode, "asymmetric");
        this.#forwardRelation = OMLForwardRelationSyntax.new(childForFieldName(this.syntaxNode, "forwardRelation"));
        this.#functional = childForFieldName(this.syntaxNode, "functional");
        this.#inverseFunctional = childForFieldName(this.syntaxNode, "inverseFunctional");
        this.#irreflexive = childForFieldName(this.syntaxNode, "irreflexive");
        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedKeys = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedKeys")) {

            const ownedKey = OMLKeyAxiomSyntax.new(child);

            if (ownedKey != null)
                this.#ownedKeys.push(ownedKey);

        }

        this.#ownedPropertyRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyRestrictions")) {

            const ownedPropertyRestriction = OMLPropertyRestrictionAxiomSyntax.new(child);

            if (ownedPropertyRestriction != null)
                this.#ownedPropertyRestrictions.push(ownedPropertyRestriction);

        }

        this.#ownedRelationRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedRelationRestrictions")) {

            const ownedRelationRestriction = OMLRelationRestrictionAxiomSyntax.new(child);

            if (ownedRelationRestriction != null)
                this.#ownedRelationRestrictions.push(ownedRelationRestriction);

        }

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.#reflexive = childForFieldName(this.syntaxNode, "reflexive");
        this.#reverseRelation = OMLReverseRelationSyntax.new(childForFieldName(this.syntaxNode, "reverseRelation"));
        this.#source = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "source"));
        this.#symmetric = childForFieldName(this.syntaxNode, "symmetric");
        this.#target = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "target"));
        this.#transitive = childForFieldName(this.syntaxNode, "transitive");

        this.parsed = true;

    }

    get reflexive(): SyntaxNode | undefined {
        this.parse();
        return this.#reflexive;
    }

    get reverseRelation(): OMLReverseRelationSyntax | undefined {
        this.parse();
        return this.#reverseRelation;
    }

    get source(): OMLRefSyntax | undefined {
        this.parse();
        return this.#source;
    }

    get symmetric(): SyntaxNode | undefined {
        this.parse();
        return this.#symmetric;
    }

    get target(): OMLRefSyntax | undefined {
        this.parse();
        return this.#target;
    }

    get transitive(): SyntaxNode | undefined {
        this.parse();
        return this.#transitive;
    }

    override toString(): string {
        return this.name?.toString() ?? "<null>";
    }

}

// DONE
export class OMLStructureSyntax extends OMLClassifierSyntax {

    #name?: OMLLocalNameSyntax;
    #ownedPropertyRestrictions?: OMLPropertyRestrictionAxiomSyntax[];
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStructure(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.name != null)
                yield node.name;

            if (node.ownedPropertyRestrictions != null)
                yield* node.ownedPropertyRestrictions;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

        }();

    }

    override get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLStructureSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "Structure")
            return undefined;

        return new OMLStructureSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedPropertyRestrictions(): OMLPropertyRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyRestrictions;
    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "Structure")
            throw new Error(`Expected Structure, got ${this.syntaxNode?.type}`);

        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedPropertyRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyRestrictions")) {

            const ownedPropertyRestriction = OMLPropertyRestrictionAxiomSyntax.new(child);

            if (ownedPropertyRestriction != null)
                this.#ownedPropertyRestrictions.push(ownedPropertyRestriction);

        }

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.parsed = true;

    }

    override toString(): string {
        return this.name?.toString() ?? "<null>";
    }

}

export abstract class OMLScalarSyntax extends OMLTypeSyntax { }

// DONE
export class OMLEnumeratedScalarSyntax extends OMLScalarSyntax {

    #literals?: OMLLiteralSyntax[];
    #name?: OMLLocalNameSyntax;
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitEnumeratedScalar(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.literals != null)
                yield* node.literals;

            if (node.name != null)
                yield node.name;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

        }();

    }

    get literals(): OMLLiteralSyntax[] | undefined {
        this.parse();
        return this.#literals;
    }

    override get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLEnumeratedScalarSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "EnumeratedScalar")
            return undefined;

        return new OMLEnumeratedScalarSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "EnumeratedScalar")
            throw new Error(`Expected EnumeratedScalar, got ${this.syntaxNode?.type}`);

        this.#literals = [];

        for (const child of childrenForFieldName(this.syntaxNode, "literals")) {

            const literal = OMLLiteralSyntax.new(child);

            if (literal != null)
                this.#literals.push(literal);

        }

        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.parsed = true;

    }

    override toString(): string {
        return this.name?.toString() ?? "<null>";
    }

}

// DONE
export class OMLFacetedScalarSyntax extends OMLScalarSyntax {

    #language?: OMLLocalNameSyntax;
    #length?: SyntaxNode;
    #maxExclusive?: OMLLiteralSyntax;
    #maxInclusive?: OMLLiteralSyntax;
    #maxLength?: SyntaxNode;
    #minExclusive?: OMLLiteralSyntax;
    #minInclusive?: OMLLiteralSyntax;
    #minLength?: SyntaxNode;
    #name?: OMLLocalNameSyntax;
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];
    #pattern?: SyntaxNode;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitFacetedScalar(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.language != null)
                yield node.language;

            if (node.maxExclusive != null)
                yield node.maxExclusive;

            if (node.maxInclusive != null)
                yield node.maxInclusive;

            if (node.minExclusive != null)
                yield node.minExclusive;

            if (node.minInclusive != null)
                yield node.minInclusive;

            if (node.name != null)
                yield node.name;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

        }();

    }

    get language(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#language;
    }

    get length(): SyntaxNode | undefined {
        this.parse();
        return this.#length;
    }

    get maxExclusive(): OMLLiteralSyntax | undefined {
        this.parse();
        return this.#maxExclusive;
    }

    get maxInclusive(): OMLLiteralSyntax | undefined {
        this.parse();
        return this.#maxInclusive;
    }

    get maxLength(): SyntaxNode | undefined {
        this.parse();
        return this.#maxLength;
    }

    get minExclusive(): OMLLiteralSyntax | undefined {
        this.parse();
        return this.#minExclusive;
    }

    get minInclusive(): OMLLiteralSyntax | undefined {
        this.parse();
        return this.#minInclusive;
    }

    get minLength(): SyntaxNode | undefined {
        this.parse();
        return this.#minLength;
    }

    override get name(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#name;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLFacetedScalarSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "FacetedScalar")
            return undefined;

        return new OMLFacetedScalarSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "FacetedScalar")
            throw new Error(`Expected FacetedScalar, got ${this.syntaxNode?.type}`);

        this.#language = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "language"));
        this.#length = childForFieldName(this.syntaxNode, "length");
        this.#maxExclusive = OMLLiteralSyntax.new(childForFieldName(this.syntaxNode, "maxExclusive"));
        this.#maxInclusive = OMLLiteralSyntax.new(childForFieldName(this.syntaxNode, "maxInclusive"));
        this.#maxLength = childForFieldName(this.syntaxNode, "maxLength");
        this.#minExclusive = OMLLiteralSyntax.new(childForFieldName(this.syntaxNode, "minExclusive"));
        this.#minInclusive = OMLLiteralSyntax.new(childForFieldName(this.syntaxNode, "minInclusive"));
        this.#minLength = childForFieldName(this.syntaxNode, "minLength");
        this.#name = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "name"));

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.#pattern = childForFieldName(this.syntaxNode, "pattern");

        this.parsed = true;

    }

    get pattern(): SyntaxNode | undefined {
        this.parse();
        return this.#pattern;
    }

    override toString(): string {
        return this.name?.toString() ?? "<null>";
    }

}

export abstract class OMLSpecializableTermReferenceSyntax extends OMLVocabularyStatementSyntax implements OMLReferenceSyntax { }

// DONE
export class OMLAnnotationPropertyReferenceSyntax extends OMLSpecializableTermReferenceSyntax {

    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];
    #property?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitAnnotationPropertyReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

            if (node.property != null)
                yield node.property;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLAnnotationPropertyReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "AnnotationPropertyReference")
            return undefined;

        return new OMLAnnotationPropertyReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "AnnotationPropertyReference")
            throw new Error(`Expected AnnotationPropertyReference, got ${this.syntaxNode?.type}`);

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));

        this.parsed = true;

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    override toString(): string {
        return this.property?.toString() ?? "<null>";
    }

}

export abstract class OMLClassifierReferenceSyntax extends OMLSpecializableTermReferenceSyntax { }

export abstract class OMLEntityReferenceSyntax extends OMLClassifierReferenceSyntax { }

// DONE
export class OMLAspectReferenceSyntax extends OMLEntityReferenceSyntax {

    #aspect?: OMLRefSyntax;
    #ownedKeys?: OMLKeyAxiomSyntax[];
    #ownedPropertyRestrictions?: OMLPropertyRestrictionAxiomSyntax[];
    #ownedRelationRestrictions?: OMLRelationRestrictionAxiomSyntax[];
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitAspectReference(this, ...args);
    }

    get aspect(): OMLRefSyntax | undefined {
        this.parse();
        return this.#aspect;
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.aspect != null)
                yield node.aspect;

            if (node.ownedKeys != null)
                yield* node.ownedKeys;

            if (node.ownedPropertyRestrictions != null)
                yield* node.ownedPropertyRestrictions;

            if (node.ownedRelationRestrictions != null)
                yield* node.ownedRelationRestrictions;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLAspectReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "AspectReference")
            return undefined;

        return new OMLAspectReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedKeys(): OMLKeyAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedKeys;
    }

    get ownedPropertyRestrictions(): OMLPropertyRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyRestrictions;
    }

    get ownedRelationRestrictions(): OMLRelationRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedRelationRestrictions;
    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "AspectReference")
            throw new Error(`Expected AspectReference, got ${this.syntaxNode?.type}`);

        this.#aspect = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "aspect"));

        this.#ownedKeys = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedKeys")) {

            const ownedKey = OMLKeyAxiomSyntax.new(child);

            if (ownedKey != null)
                this.#ownedKeys.push(ownedKey);

        }

        this.#ownedPropertyRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyRestrictions")) {

            const ownedPropertyRestriction = OMLPropertyRestrictionAxiomSyntax.new(child);

            if (ownedPropertyRestriction != null)
                this.#ownedPropertyRestrictions.push(ownedPropertyRestriction);

        }

        this.#ownedRelationRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedRelationRestrictions")) {

            const ownedRelationRestriction = OMLRelationRestrictionAxiomSyntax.new(child);

            if (ownedRelationRestriction != null)
                this.#ownedRelationRestrictions.push(ownedRelationRestriction);

        }

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.parsed = true;

    }

    override toString(): string {
        return this.aspect?.toString() ?? "<null>";
    }

}

// DONE
export class OMLConceptReferenceSyntax extends OMLEntityReferenceSyntax {

    #concept?: OMLRefSyntax;
    #ownedKeys?: OMLKeyAxiomSyntax[];
    #ownedPropertyRestrictions?: OMLPropertyRestrictionAxiomSyntax[];
    #ownedRelationRestrictions?: OMLRelationRestrictionAxiomSyntax[];
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitConceptReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.concept != null)
                yield node.concept;

            if (node.ownedKeys != null)
                yield* node.ownedKeys;

            if (node.ownedPropertyRestrictions != null)
                yield* node.ownedPropertyRestrictions;

            if (node.ownedRelationRestrictions != null)
                yield* node.ownedRelationRestrictions;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

        }();

    }

    get concept(): OMLRefSyntax | undefined {
        this.parse();
        return this.#concept;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLConceptReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ConceptReference")
            return undefined;

        return new OMLConceptReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedKeys(): OMLKeyAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedKeys;
    }

    get ownedPropertyRestrictions(): OMLPropertyRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyRestrictions;
    }

    get ownedRelationRestrictions(): OMLRelationRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedRelationRestrictions;
    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ConceptReference")
            throw new Error(`Expected ConceptReference, got ${this.syntaxNode?.type}`);

        this.#concept = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "concept"));

        this.#ownedKeys = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedKeys")) {

            const ownedKey = OMLKeyAxiomSyntax.new(child);

            if (ownedKey != null)
                this.#ownedKeys.push(ownedKey);

        }

        this.#ownedPropertyRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyRestrictions")) {

            const ownedPropertyRestriction = OMLPropertyRestrictionAxiomSyntax.new(child);

            if (ownedPropertyRestriction != null)
                this.#ownedPropertyRestrictions.push(ownedPropertyRestriction);

        }

        this.#ownedRelationRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedRelationRestrictions")) {

            const ownedRelationRestriction = OMLRelationRestrictionAxiomSyntax.new(child);

            if (ownedRelationRestriction != null)
                this.#ownedRelationRestrictions.push(ownedRelationRestriction);

        }

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.parsed = true;

    }

    override toString(): string {
        return this.concept?.toString() ?? "<null>";
    }

}

// DONE
export class OMLRelationEntityReferenceSyntax extends OMLEntityReferenceSyntax {

    #entity?: OMLRefSyntax;
    #ownedKeys?: OMLKeyAxiomSyntax[];
    #ownedPropertyRestrictions?: OMLPropertyRestrictionAxiomSyntax[];
    #ownedRelationRestrictions?: OMLRelationRestrictionAxiomSyntax[];
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitRelationEntityReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.entity != null)
                yield node.entity;

            if (node.ownedKeys != null)
                yield* node.ownedKeys;

            if (node.ownedPropertyRestrictions != null)
                yield* node.ownedPropertyRestrictions;

            if (node.ownedRelationRestrictions != null)
                yield* node.ownedRelationRestrictions;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

        }();

    }

    get entity(): OMLRefSyntax | undefined {
        this.parse();
        return this.#entity;
    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLRelationEntityReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "RelationEntityReference")
            return undefined;

        return new OMLRelationEntityReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedKeys(): OMLKeyAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedKeys;
    }

    get ownedPropertyRestrictions(): OMLPropertyRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyRestrictions;
    }

    get ownedRelationRestrictions(): OMLRelationRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedRelationRestrictions;
    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "RelationEntityReference")
            throw new Error(`Expected RelationEntityReference, got ${this.syntaxNode?.type}`);

        this.#entity = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "entity"));

        this.#ownedKeys = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedKeys")) {

            const ownedKey = OMLKeyAxiomSyntax.new(child);

            if (ownedKey != null)
                this.#ownedKeys.push(ownedKey);

        }

        this.#ownedPropertyRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyRestrictions")) {

            const ownedPropertyRestriction = OMLPropertyRestrictionAxiomSyntax.new(child);

            if (ownedPropertyRestriction != null)
                this.#ownedPropertyRestrictions.push(ownedPropertyRestriction);

        }

        this.#ownedRelationRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedRelationRestrictions")) {

            const ownedRelationRestriction = OMLRelationRestrictionAxiomSyntax.new(child);

            if (ownedRelationRestriction != null)
                this.#ownedRelationRestrictions.push(ownedRelationRestriction);

        }

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.parsed = true;

    }

    override toString(): string {
        return this.entity?.toString() ?? "<null>";
    }

}

// DONE
export class OMLStructureReferenceSyntax extends OMLClassifierReferenceSyntax {

    #ownedPropertyRestrictions?: OMLPropertyRestrictionAxiomSyntax[];
    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];
    #structure?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStructureReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedPropertyRestrictions != null)
                yield* node.ownedPropertyRestrictions;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

            if (node.structure != null)
                yield node.structure;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLStructureReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "StructureReference")
            return undefined;

        return new OMLStructureReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedPropertyRestrictions(): OMLPropertyRestrictionAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedPropertyRestrictions;
    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "StructureReference")
            throw new Error(`Expected StructureReference, got ${this.syntaxNode?.type}`);

        this.#ownedPropertyRestrictions = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedPropertyRestrictions")) {

            const ownedPropertyRestriction = OMLPropertyRestrictionAxiomSyntax.new(child);

            if (ownedPropertyRestriction != null)
                this.#ownedPropertyRestrictions.push(ownedPropertyRestriction);

        }

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.#structure = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "structure"));

        this.parsed = true;

    }

    get structure(): OMLRefSyntax | undefined {
        this.parse();
        return this.#structure;
    }

    override toString(): string {
        return this.structure?.toString() ?? "<null>";
    }

}

// DONE
export class OMLEnumeratedScalarReferenceSyntax extends OMLSpecializableTermReferenceSyntax {

    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];
    #property?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitEnumeratedScalarReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

            if (node.property != null)
                yield node.property;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLEnumeratedScalarReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "EnumeratedScalarReference")
            return undefined;

        return new OMLEnumeratedScalarReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "EnumeratedScalarReference")
            throw new Error(`Expected EnumeratedScalarReference, got ${this.syntaxNode?.type}`);

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));

        this.parsed = true;

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    override toString(): string {
        return this.property?.toString() ?? "<null>";
    }

}

// DONE
export class OMLFacetedScalarReferenceSyntax extends OMLSpecializableTermReferenceSyntax {

    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];
    #scalar?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitFacetedScalarReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

            if (node.scalar != null)
                yield node.scalar;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLFacetedScalarReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "FacetedScalarReference")
            return undefined;

        return new OMLFacetedScalarReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "FacetedScalarReference")
            throw new Error(`Expected FacetedScalarReference, got ${this.syntaxNode?.type}`);

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.#scalar = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "scalar"));

        this.parsed = true;

    }

    get scalar(): OMLRefSyntax | undefined {
        this.parse();
        return this.#scalar;
    }

    override toString(): string {
        return this.scalar?.toString() ?? "<null>";
    }

}

// DONE
export class OMLScalarPropertyReferenceSyntax extends OMLSpecializableTermReferenceSyntax {

    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];
    #property?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitScalarPropertyReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

            if (node.property != null)
                yield node.property;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLScalarPropertyReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ScalarPropertyReference")
            return undefined;

        return new OMLScalarPropertyReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ScalarPropertyReference")
            throw new Error(`Expected ScalarPropertyReference, got ${this.syntaxNode?.type}`);

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));

        this.parsed = true;

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    override toString(): string {
        return this.property?.toString() ?? "<null>";
    }

}

// DONE
export class OMLStructuredPropertyReferenceSyntax extends OMLSpecializableTermReferenceSyntax {

    #ownedSpecializations?: OMLSpecializationAxiomSyntax[];
    #property?: OMLRefSyntax;

    constructor(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]) {
        super(syntaxNode, ownedAnnotations);
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitStructuredPropertyReference(this, ...args);
    }

    override get children(): IterableIterator<OMLSyntaxNode> {

        const node = this;
        const superChildren = super.children;

        return function* () {

            yield* superChildren;

            if (node.ownedSpecializations != null)
                yield* node.ownedSpecializations;

            if (node.property != null)
                yield node.property;

        }();

    }

    static override new(syntaxNode?: SyntaxNode | null, ownedAnnotations?: OMLAnnotationSyntax[]): OMLStructuredPropertyReferenceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "StructuredPropertyReference")
            return undefined;

        return new OMLStructuredPropertyReferenceSyntax(syntaxNode, ownedAnnotations);

    }

    get ownedSpecializations(): OMLSpecializationAxiomSyntax[] | undefined {
        this.parse();
        return this.#ownedSpecializations;
    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "StructuredPropertyReference")
            throw new Error(`Expected StructuredPropertyReference, got ${this.syntaxNode?.type}`);

        this.#ownedSpecializations = [];

        for (const child of childrenForFieldName(this.syntaxNode, "ownedSpecializations")) {

            const ownedSpecialization = OMLSpecializationAxiomSyntax.new(child);

            if (ownedSpecialization != null)
                this.#ownedSpecializations.push(ownedSpecialization);

        }

        this.#property = OMLRefSyntax.new(childForFieldName(this.syntaxNode, "property"));

        this.parsed = true;

    }

    get property(): OMLRefSyntax | undefined {
        this.parse();
        return this.#property;
    }

    override toString(): string {
        return this.property?.toString() ?? "<null>";
    }

}


export abstract class OMLRefSyntax extends OMLSyntaxNode {

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    abstract get name(): string | undefined;

    static override new(syntaxNode?: SyntaxNode | null): OMLRefSyntax | undefined {

        switch (syntaxNode?.type) {

            case "LocalName":
                return OMLLocalNameSyntax.new(syntaxNode);

            case "QualifiedName":
                return OMLQualifiedNameSyntax.new(syntaxNode);

            case "ResyntaxNodeIdentifier":
                return OMLResyntaxNodeIdentifierSyntax.new(syntaxNode);

            default:
                return undefined;

        }

    }

    abstract override toString(): string;

}


export abstract class OMLCrossRefSyntax extends OMLSyntaxNode {

    constructor(syntaxNode?: SyntaxNode | null) {
        super(syntaxNode);
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLCrossRefSyntax | undefined {

        switch (syntaxNode?.type) {

            case "QualifiedName":
                return OMLQualifiedNameSyntax.new(syntaxNode);

            case "ResyntaxNodeIdentifier":
                return OMLResyntaxNodeIdentifierSyntax.new(syntaxNode);

            default:
                return undefined;

        }

    }

}

// DONE
export class OMLLocalNameSyntax extends OMLSyntaxNode implements OMLRefSyntax {

    #value?: string;

    constructor(syntaxNode?: SyntaxNode | null, value?: string) {
        super(syntaxNode);
        this.#value = value;
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitLocalName(this, ...args);
    }

    get name(): string | undefined {
        return this.value;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLLocalNameSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "LocalName")
            return undefined;

        return new OMLLocalNameSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "LocalName")
            throw new Error(`Expected LocalName, got ${this.syntaxNode?.type}`);

        this.#value = this.syntaxNode.text;

        this.parsed = true;

    }

    get value(): string | undefined {
        this.parse();
        return this.#value;
    }

    override toString(): string {
        return this.value ?? "<null>";
    }

}

// DONE
export class OMLQualifiedNameSyntax extends OMLSyntaxNode implements OMLRefSyntax {

    #prefix?: OMLLocalNameSyntax;
    #localName?: OMLLocalNameSyntax;

    constructor(syntaxNode?: SyntaxNode | null, prefix?: OMLLocalNameSyntax, localName?: OMLLocalNameSyntax,) {
        super(syntaxNode);
        this.#prefix = prefix;
        this.#localName = localName;
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitQualifiedName(this, ...args);
    }

    get localName(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#localName;
    }

    get name(): string | undefined {
        return this.localName?.value;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLQualifiedNameSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "QualifiedName")
            return undefined;

        return new OMLQualifiedNameSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "QualifiedName")
            throw new Error(`Expected QualifiedName, got ${this.syntaxNode?.type}`);

        this.#prefix = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "prefix"));
        this.#localName = OMLLocalNameSyntax.new(childForFieldName(this.syntaxNode, "localName"));

        this.parsed = true;

    }

    get prefix(): OMLLocalNameSyntax | undefined {
        this.parse();
        return this.#prefix;
    }

    override toString(): string {
        return (this.prefix ?? "") + ":" + (this.localName ?? "<null>");
    }

}

// DONE
export class OMLResyntaxNodeIdentifierSyntax extends OMLSyntaxNode implements OMLRefSyntax, OMLCrossRefSyntax {

    #value?: string;

    constructor(syntaxNode?: SyntaxNode | null, value?: string) {
        super(syntaxNode);
        this.#value = value;
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitResyntaxNodeIdentifier(this, ...args);
    }

    get name(): string | undefined {
        return undefined;
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLResyntaxNodeIdentifierSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "ResyntaxNodeIdentifier")
            return undefined;

        return new OMLResyntaxNodeIdentifierSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "ResyntaxNodeIdentifier")
            throw new Error(`Expected ResyntaxNodeIdentifier, got ${this.syntaxNode?.type}`);

        this.#value = this.syntaxNode.text.slice(1, this.syntaxNode.text.length - 1);

        this.parsed = true;

    }

    get value(): string | undefined {
        this.parse();
        return this.#value;
    }

    override toString(): string {
        return this.value ?? "<null>";
    }

}

// DONE
export class OMLNamespaceSyntax extends OMLSyntaxNode {

    #value?: string;

    constructor(syntaxNode?: SyntaxNode | null, value?: string) {
        super(syntaxNode);
        this.#value = value;
    }

    override accept(visitor: OMLSyntaxVisitor, ...args: any[]): any {
        return visitor.visitNamespace(this, ...args);
    }

    static override new(syntaxNode?: SyntaxNode | null): OMLNamespaceSyntax | undefined {

        if (syntaxNode == null || syntaxNode.type != "Namespace")
            return undefined;

        return new OMLNamespaceSyntax(syntaxNode);

    }

    override parse(): void {

        if (this.parsed == true)
            return;

        if (this.syntaxNode == null || this.syntaxNode.type != "Namespace")
            throw new Error(`Expected Namespace, got ${this.syntaxNode?.type}`);

        this.#value = this.syntaxNode.text.slice(1, this.syntaxNode.text.length - 1);

        this.parsed = true;

    }

    get value(): string | undefined {
        this.parse();
        return this.#value;
    }

}

// DONE
export abstract class OMLSyntaxVisitor {

    visitAnnotation(node: OMLAnnotationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitForwardRelation(node: OMLForwardRelationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitReverseRelation(node: OMLReverseRelationSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDescription(node: OMLDescriptionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDescriptionBundle(node: OMLDescriptionBundleSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitVocabulary(node: OMLVocabularySyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitVocabularyBundle(node: OMLVocabularyBundleSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDescriptionExtension(node: OMLDescriptionExtensionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDescriptionUsage(node: OMLDescriptionUsageSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDescriptionBundleInclusion(node: OMLDescriptionBundleInclusionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDescriptionBundleExtension(node: OMLDescriptionBundleExtensionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDescriptionBundleUsage(node: OMLDescriptionBundleUsageSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitVocabularyExtension(node: OMLVocabularyExtensionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitVocabularyUsage(node: OMLVocabularyUsageSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitVocabularyBundleExtension(node: OMLVocabularyBundleExtensionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitVocabularyBundleInclusion(node: OMLVocabularyBundleInclusionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitLinkAssertion(node: OMLLinkAssertionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitScalarPropertyValueAssertion(node: OMLScalarPropertyValueAssertionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStructuredPropertyValueAssertion(node: OMLStructuredPropertyValueAssertionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitConceptTypeAssertion(node: OMLConceptTypeAssertionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRelationTypeAssertion(node: OMLRelationTypeAssertionSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitKeyAxiom(node: OMLKeyAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitScalarPropertyCardinalityRestrictionAxiom(node: OMLScalarPropertyCardinalityRestrictionAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitScalarPropertyRangeRestrictionAxiom(node: OMLScalarPropertyRangeRestrictionAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitScalarPropertyValueRestrictionAxiom(node: OMLScalarPropertyValueRestrictionAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStructuredPropertyCardinalityRestrictionAxiom(node: OMLStructuredPropertyCardinalityRestrictionAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStructuredPropertyRangeRestrictionAxiom(node: OMLStructuredPropertyRangeRestrictionAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStructuredPropertyValueRestrictionAxiom(node: OMLStructuredPropertyValueRestrictionAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRelationCardinalityRestrictionAxiom(node: OMLRelationCardinalityRestrictionAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRelationRangeRestrictionAxiom(node: OMLRelationRangeRestrictionAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRelationTargetRestrictionAxiom(node: OMLRelationTargetRestrictionAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitSpecializationAxiom(node: OMLSpecializationAxiomSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStructureInstance(node: OMLStructureInstanceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitBooleanLiteral(node: OMLBooleanLiteralSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDecimalLiteral(node: OMLDecimalLiteralSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDoubleLiteral(node: OMLDoubleLiteralSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitIntegerLiteral(node: OMLIntegerLiteralSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitQuotedLiteral(node: OMLQuotedLiteralSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitFeaturePredicate(node: OMLFeaturePredicateSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitDifferentFromPredicate(node: OMLDifferentFromPredicateSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRelationEntityPredicate(node: OMLRelationEntityPredicateSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitSameAsPredicate(node: OMLSameAsPredicateSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitTypePredicate(node: OMLTypePredicateSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitConceptInstance(node: OMLConceptInstanceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRelationInstance(node: OMLRelationInstanceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitConceptInstanceReference(node: OMLConceptInstanceReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRelationInstanceReference(node: OMLRelationInstanceReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRelationReference(node: OMLRelationReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRule(node: OMLRuleSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRuleReference(node: OMLRuleReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitAnnotationProperty(node: OMLAnnotationPropertySyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitScalarProperty(node: OMLScalarPropertySyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStructuredProperty(node: OMLStructuredPropertySyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitAspect(node: OMLAspectSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitConcept(node: OMLConceptSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRelationEntity(node: OMLRelationEntitySyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStructure(node: OMLStructureSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitEnumeratedScalar(node: OMLEnumeratedScalarSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitFacetedScalar(node: OMLFacetedScalarSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitAnnotationPropertyReference(node: OMLAnnotationPropertyReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitAspectReference(node: OMLAspectReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitConceptReference(node: OMLConceptReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitRelationEntityReference(node: OMLRelationEntityReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStructureReference(node: OMLStructureReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitEnumeratedScalarReference(node: OMLEnumeratedScalarReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitFacetedScalarReference(node: OMLFacetedScalarReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitScalarPropertyReference(node: OMLScalarPropertyReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitStructuredPropertyReference(node: OMLStructuredPropertyReferenceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitLocalName(node: OMLLocalNameSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitQualifiedName(node: OMLQualifiedNameSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitResyntaxNodeIdentifier(node: OMLResyntaxNodeIdentifierSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

    visitNamespace(node: OMLNamespaceSyntax, ...args: any[]): any {
        throw new Error("Method not implemented.");
    }

}