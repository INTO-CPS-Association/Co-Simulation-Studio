/*
 * Copyright (C) 2023 Perpetual Labs, Ltd.
 *
 * All information contained herein is proprietary and confidential to
 * Perpetual Labs Ltd. Any use, reproduction, or disclosure without
 * the written permission of Perpetual Labs is prohibited.
 */

import { ClassExpression, Class } from './classExpression';

/**
 * Based on original Java implementation by
 * @author Steven Jenkins <j.s.jenkins@jpl.nasa.gov>
 * @see https://github.com/opencaesar/owl-tools/blob/master/owl-close-world/src/main/java/io/opencaesar/closeworld/Axiom.java
 *
 * @author Mohamad Omar Nachawati <omar@perpetuallabs.io>
 */

export enum AxiomType {
	DISJOINT_CLASSES,
	DISJOINT_UNION,
	EQUIVALENT_CLASSES,
}

export abstract class Axiom {

	abstract toString(): string;

	abstract typeCode(): number;

	abstract toJson(): any;

	toJsonString(): string {
		return JSON.stringify(this.toJson());
	}

	static fromJsonString(json: string): Axiom {
		return Axiom.fromJson(JSON.parse(json));
	}

	static fromJson(json: any): Axiom {

		switch (json.type) {
			case AxiomType.DISJOINT_CLASSES:
				return DisjointClassesAxiom.fromJson(json);
			case AxiomType.DISJOINT_UNION:
				return DisjointUnionAxiom.fromJson(json);
			case AxiomType.EQUIVALENT_CLASSES:
				return EquivalentClassesAxiom.fromJson(json);
			default:
				throw new Error("Invalid type " + json.type);
		}

	}
}

export abstract class LogicalAxiom extends Axiom { }

export abstract class ClassAxiom extends LogicalAxiom { }

export abstract class NaryClassAxiom extends ClassAxiom {

	#elements: Set<string>;

	constructor(...ces: ClassExpression[]) {
		super();
		this.#elements = new Set();
		for (const ce of ces)
			this.#elements.add(ce.toJsonString());
	}

	*classExpressions(): IterableIterator<ClassExpression> {
		for (const element of this.#elements)
			yield ClassExpression.fromJson(JSON.parse(element));
	}

	contains(ce: ClassExpression): boolean {
		return this.#elements.has(ce.toJsonString());
	}

	equals(other: Axiom): boolean {

		if (!(other instanceof NaryClassAxiom))
			return false;

		if (this.#elements.size != other.#elements.size)
			return false;

		for (const element of this.#elements)
			if (!other.#elements.has(element))
				return false;

		return true;

	}

}

export class DisjointClassesAxiom extends NaryClassAxiom {

	constructor(...ces: ClassExpression[]) {
		super(...ces);
	}

	override equals(other: Axiom): boolean {
		if (!(other instanceof DisjointClassesAxiom))
			return false;
		return super.equals(other);
	}

	override toString(): string {
		const s = [...this.classExpressions()].map(ce => ce.toString()).join(", ");
		return "DisjointClasses(" + s + ")";
	}

	override toJson(): any {
		return {
			type: AxiomType.DISJOINT_CLASSES,
			elements: [...this.classExpressions()].map(element => element.toJson())
		};
	}

	override typeCode(): number {
		return AxiomType.DISJOINT_CLASSES;
	}

	static override fromJson(json: any): DisjointClassesAxiom {
		if (json.type != AxiomType.DISJOINT_CLASSES)
			throw new Error("Expecting type " + AxiomType.DISJOINT_CLASSES + " , got " + json.type);
		return new DisjointClassesAxiom(...(<any[]>(json.elements ?? [])).map(element => ClassExpression.fromJson(element)));
	}

}

export class EquivalentClassesAxiom extends NaryClassAxiom {

	constructor(...ces: ClassExpression[]) {
		super(...ces);
	}

	override equals(other: Axiom): boolean {
		if (!(other instanceof EquivalentClassesAxiom))
			return false;
		return super.equals(other);
	}

	override toString(): string {
		const s = [...this.classExpressions()].map(ce => ce.toString()).join(", ");
		return "EquivalentClasses(" + s + ")";
	}

	override toJson(): any {
		return {
			type: AxiomType.EQUIVALENT_CLASSES,
			elements: [...this.classExpressions()].map(element => element.toJson())
		};
	}

	override typeCode(): number {
		return AxiomType.EQUIVALENT_CLASSES;
	}

	static override fromJson(json: any): EquivalentClassesAxiom {
		if (json.type != AxiomType.EQUIVALENT_CLASSES)
			throw new Error("Expecting type " + AxiomType.EQUIVALENT_CLASSES + " , got " + json.type);
		return new EquivalentClassesAxiom(...(<any[]>(json.elements ?? [])).map(element => ClassExpression.fromJson(element)));
	}

}

export class DisjointUnionAxiom extends NaryClassAxiom {

	#class: Class;

	constructor(clazz: Class, ...ces: ClassExpression[]) {
		super(...ces);
		this.#class = clazz;
	}

	get class(): Class {
		return this.#class;
	}

	override equals(other: Axiom): boolean {

		if (!(other instanceof DisjointUnionAxiom))
			return false;

		if (!this.#class.equals(other.#class))
			return false;

		return super.equals(other);

	}

	override toString(): string {
		const elements = [...this.classExpressions()].map(ce => ce.toString()).join(", ");
		return "DisjointUnion(" + this.class.toString() + ", " + elements + ")";
	}

	override toJson(): any {
		return {
			type: AxiomType.EQUIVALENT_CLASSES,
			class: this.class,
			elements: [...this.classExpressions()].map(element => element.toJson())
		};
	}

	override typeCode(): number {
		return AxiomType.DISJOINT_UNION;
	}

	static override fromJson(json: any): DisjointUnionAxiom {
		if (json.type != AxiomType.DISJOINT_UNION)
			throw new Error("Expecting type " + AxiomType.DISJOINT_UNION + " , got " + json.type);
		return new DisjointUnionAxiom(Class.fromJson(json.class), ...(<any[]>(json.elements ?? [])).map(element => ClassExpression.fromJson(element)));
	}

}
