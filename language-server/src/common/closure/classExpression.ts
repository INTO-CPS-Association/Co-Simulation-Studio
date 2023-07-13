/*
 * Copyright (C) 2023 Perpetual Labs, Ltd.
 *
 * All information contained herein is proprietary and confidential to
 * Perpetual Labs Ltd. Any use, reproduction, or disclosure without
 * the written permission of Perpetual Labs is prohibited.
 */

import { IRI } from './iri';

/**
 * Based on original Java implementation by
 * @author Steven Jenkins <j.s.jenkins@jpl.nasa.gov>
 * @see https://github.com/opencaesar/owl-tools/blob/master/owl-close-world/src/main/java/io/opencaesar/closeworld/ClassExpression.java
 *
 * Theorems to simplify expressions:
 * 
 * Theorem 1: For any class A, (A′)′ = A.
 * Theorem 2: For any class A, A ∩ A = A.
 * Theorem 3: For any classes A and B, A ∩ B = B ∩ A.
 * Theorem 4: For any classes A, B, and C, (A ∩ B) ∩ C = A ∩ (B ∩ C).
 * Theorem 5: For any class A, A ∪ A = A.
 * Theorem 6: For any classes A and B, A ∪ B = B ∪ A.
 * Theorem 7: For any classes A, B, and C, (A ∪ B) ∪ C = A ∪ (B ∪ C).
 * Theorem 8: For any classes A, B, and C, (A\B)\C = A\(B ∪ C).
 * Theorem 9: For any class A and empty set ∅, ∅ ∩ A = ∅.
 * Theorem 10: For any class A, ∅ ∪ A = A.
 * Theorem 11: For any class A, A\∅ = A.
 * Theorem 12: For any class A, ∅\A = ∅.
 * Theorem 13: For any class A, A\A = ∅.
 * Theorem 14: For any class A and universal set U, U ∩ A = A.
 * Theorem 15: For any class A, U ∪ A = U.
 * Theorem 16: For any class A, A\U = ∅.
 * Theorem 17: ∅′ = U.
 * Theorem 18: For any classes A and B, A ∪ (B\A) = A ∪ B.
 * Theorem 19: For any classes A and B, A ∩ (B\A) = ∅.
 * 
 * @author Mohamad Omar Nachawati <omar@perpetuallabs.io>
 */

export enum ClassExpressionType {
	CLASS,
	OBJECT_COMPLEMENT_OF,
	OBJECT_DIFFERENCE_OF,
	OBJECT_INTERSECTION_OF,
	OBJECT_UNION_OF
}

export abstract class ClassExpression {

	and(ce: ClassExpression): ClassExpression {
		if (this.equals(ce))
			// Theorem 2
			return this;
		else if (ce instanceof ObjectIntersectionOf || ce.isNothing() || ce.isThing())
			// Theorem 3
			return ce.and(this);
		else if (ce instanceof ObjectDifferenceOf && ce.b.equals(this))
			// Theorem 19
			return Class.NOTHING;
		else
			return new ObjectIntersectionOf(this, ce);
	}

	abstract equals(other: ClassExpression): boolean;

	isNothing(): boolean {
		return false;
	}

	isThing(): boolean {
		return false;
	}

	minus(ce: ClassExpression): ClassExpression {
		if (ce.isNothing())
			// Theorem 11
			return this;
		else if (ce.isThing() || this.equals(ce))
			// Theorem 13, Theorem 16
			return Class.NOTHING;
		else
			return new ObjectDifferenceOf(this, ce);
	}

	not(): ClassExpression {
		return new ObjectComplementOf(this);
	}

	or(ce: ClassExpression): ClassExpression {
		if (this.equals(ce))
			// Theorem 5
			return this;
		else if (ce instanceof ObjectUnionOf || ce.isNothing() || ce.isThing())
			// Theorem 6
			return ce.or(this);
		else if (ce instanceof ObjectDifferenceOf && ce.b.equals(this))
			// Theorem  18
			return new ObjectUnionOf(this, ce.a);
		else
			return new ObjectUnionOf(this, ce);
	}

	toAtom(): string {
		return "(" + this.toString() + ")";
	}

	abstract toJson(): any;

	toJsonString(): string {
		return JSON.stringify(this.toJson());
	}

	abstract toString(): string;

	abstract typeCode(): number;

	static fromJsonString(json: string): ClassExpression {
		return ClassExpression.fromJson(JSON.parse(json));
	}

	static fromJson(json: any): ClassExpression {

		switch (json.type) {
			case ClassExpressionType.CLASS:
				return Class.fromJson(json);
			case ClassExpressionType.OBJECT_COMPLEMENT_OF:
				return ObjectComplementOf.fromJson(json);
			case ClassExpressionType.OBJECT_DIFFERENCE_OF:
				return ObjectDifferenceOf.fromJson(json);
			case ClassExpressionType.OBJECT_INTERSECTION_OF:
				return ObjectIntersectionOf.fromJson(json);
			case ClassExpressionType.OBJECT_UNION_OF:
				return ObjectUnionOf.fromJson(json);
			default:
				throw new Error("Invalid type " + json.type);
		}

	}

}

export class Class extends ClassExpression {

	static NOTHING = new Class(IRI.fromString("http://www.w3.org/2002/07/owl#Nothing"));
	static THING = new Class(IRI.fromString("http://www.w3.org/2002/07/owl#Thing"));

	#iri: IRI;

	constructor(iri: IRI) {
		super();
		this.#iri = iri;
	}

	override and(ce: ClassExpression): ClassExpression {
		if (this.isNothing())
			// Theorem 9
			return this;
		else if (this.isThing())
			// Theorem 14
			return ce;
		else
			return super.and(ce);
	}

	override equals(ce: ClassExpression): boolean {
		if (!(ce instanceof Class))
			return false;
		else
			return this.#iri.equals(ce.#iri);
	}

	override isNothing(): boolean {
		return this.#iri.isNothing();
	}

	override isThing(): boolean {
		return this.#iri.isThing();
	}

	override minus(ce: ClassExpression): ClassExpression {
		if (this.isNothing())
			// Theorem 12
			return this;
		return super.minus(ce);
	}

	override not(): ClassExpression {
		if (this.isNothing())
			// Theorem 17
			return Class.THING;
		else if (this.isThing())
			// Theorems 1, 17
			return Class.NOTHING;
		else
			return super.not();
	}

	override or(ce: ClassExpression): ClassExpression {
		if (this.isNothing())
			// Theorem 10
			return ce;
		else if (this.isThing())
			// Theorem 15
			return this;
		else
			return super.and(ce);
	}

	override toAtom() {
		return this.toString();
	}

	override toString(): string {
		return this.#iri.toString();
	}

	override typeCode(): number {
		return ClassExpressionType.CLASS;
	}

	override toJson(): any {
		return {
			type: ClassExpressionType.CLASS,
			iri: this.#iri
		};
	}

	static override fromJson(json: any): Class {
		if (json.type != ClassExpressionType.CLASS)
			throw new Error("Expecting type " + ClassExpressionType.CLASS + " , got " + json.type);
		return new Class(json.iri);
	}

}

export abstract class AnonymousClassExpression extends ClassExpression {
}

export abstract class BooleanClassExpression extends ClassExpression {
}

export class ObjectComplementOf extends BooleanClassExpression {

	#ce: ClassExpression;

	constructor(ce: ClassExpression) {
		super();
		this.#ce = ce;
	}

	get ce(): ClassExpression {
		return this.#ce;
	}

	override not(): ClassExpression {
		// Theorem 1
		return this;
	}

	override equals(other: ClassExpression) {
		if (!(other instanceof ObjectComplementOf))
			return false;
		return this.ce.equals(other.ce);
	}

	override toAtom(): string {
		return this.toString();
	}

	override toString(): string {
		return this.#ce.toAtom() + "\u2032";
	}

	override typeCode(): number {
		return ClassExpressionType.OBJECT_COMPLEMENT_OF;
	}

	override toJson(): any {
		return {
			type: ClassExpressionType.OBJECT_COMPLEMENT_OF,
			ce: this.#ce.toJson()
		};
	}

	static override fromJson(json: any): ObjectComplementOf {
		if (json.type != ClassExpressionType.OBJECT_COMPLEMENT_OF)
			throw new Error("Expecting type " + ClassExpressionType.OBJECT_COMPLEMENT_OF + " , got " + json.type);
		return new ObjectComplementOf(ClassExpression.fromJson(json.ce));
	}

}

export abstract class BinaryBooleanClassExpression extends BooleanClassExpression {

	#a: ClassExpression;
	#b: ClassExpression;

	constructor(a: ClassExpression, b: ClassExpression) {
		super();
		this.#a = a;
		this.#b = b;
	}

	get a(): ClassExpression {
		return this.#a;
	}

	get b(): ClassExpression {
		return this.#b;
	}

}

export class ObjectDifferenceOf extends BinaryBooleanClassExpression {

	constructor(minuend: ClassExpression, subtrahend: ClassExpression) {
		super(minuend, subtrahend);
	}

	override equals(other: ClassExpression) {
		if (!(other instanceof ObjectDifferenceOf))
			return false;
		return this.a.equals(other.a) && this.b.equals(other.b);
	}

	override minus(ce: ClassExpression): ClassExpression {

		const s = super.minus(ce);

		if (s.isNothing() || s.equals(this))
			return s;
		else
			// Theorem 8
			return this.a.minus(this.b.or(ce));

	}

	toString(): string {
		return this.a.toAtom() + "\\" + this.b.toAtom();
	}

	override typeCode(): number {
		return ClassExpressionType.OBJECT_DIFFERENCE_OF;
	}

	override toJson(): any {
		return {
			type: ClassExpressionType.OBJECT_DIFFERENCE_OF,
			a: this.a.toJson(),
			b: this.b.toJson()
		};
	}

	static override fromJson(json: any): ObjectDifferenceOf {
		if (json.type != ClassExpressionType.OBJECT_DIFFERENCE_OF)
			throw new Error("Expecting type " + ClassExpressionType.OBJECT_DIFFERENCE_OF + " , got " + json.type);
		return new ObjectDifferenceOf(ClassExpression.fromJson(json.a), ClassExpression.fromJson(json.b));
	}

}

export abstract class NaryBooleanClassExpression extends BooleanClassExpression {

	#operands: ClassExpression[];

	constructor(...operands: ClassExpression[]) {
		super();
		this.#operands = operands;
	}

	override equals(other: ClassExpression): boolean {

		if (!(other instanceof NaryBooleanClassExpression))
			return false;

		const otherOperands = (<NaryBooleanClassExpression>other).#operands;

		if (this.#operands.length != otherOperands.length)
			return false;

		for (let i = 0; i < this.#operands.length; i++)
			if (!this.#operands[i].equals(otherOperands[i]))
				return false;

		return true;

	}

	*operands(): IterableIterator<ClassExpression> {
		yield* this.#operands;
	}

	override toAtom(): string {
		if (this.#operands.length <= 1)
			return this.toString();
		else
			return super.toAtom();
	}

}

export class ObjectIntersectionOf extends NaryBooleanClassExpression {

	constructor(...operands: ClassExpression[]) {
		super(...operands);
	}

	override and(ce: ClassExpression): ClassExpression {

		const newSet = new Set(this.operands());

		// Theorem 4
		if (ce instanceof ObjectIntersectionOf)
			for (const operand of ce.operands())
				newSet.add(operand);
		else {
			const sp = super.and(ce);
			if (sp instanceof ObjectIntersectionOf)
				if (ce.isThing())
					return this;
				else {
					newSet.add(ce);
				}
			else
				return sp;
		}

		return new ObjectIntersectionOf(...newSet);

	}

	override equals(other: ClassExpression): boolean {
		if (!(other instanceof ObjectIntersectionOf))
			return false;
		return super.equals(other);
	}

	override toString(): string {
		return [...this.operands()].join("∩");
	}

	override typeCode(): number {
		return ClassExpressionType.OBJECT_INTERSECTION_OF;
	}

	override toJson(): any {
		return {
			type: ClassExpressionType.OBJECT_INTERSECTION_OF,
			operands: [...this.operands()].map(operand => operand.toJson())
		};
	}

	static override fromJson(json: any): ObjectIntersectionOf {
		if (json.type != ClassExpressionType.OBJECT_INTERSECTION_OF)
			throw new Error("Expecting type " + ClassExpressionType.OBJECT_INTERSECTION_OF + " , got " + json.type);
		return new ObjectIntersectionOf(...(<any[]>(json.operands ?? [])).map(operand => ClassExpression.fromJson(operand)));
	}

}

export class ObjectUnionOf extends NaryBooleanClassExpression {

	constructor(...operands: ClassExpression[]) {
		super(...operands);
	}

	override equals(other: ClassExpression): boolean {
		if (!(other instanceof ObjectUnionOf))
			return false;
		return super.equals(other);
	}

	override or(ce: ClassExpression): ClassExpression {

		const newSet = new Set(this.operands());

		// Theorem 7
		if (ce instanceof ObjectUnionOf)
			for (const operand of ce.operands())
				newSet.add(operand);
		else {
			const sp = super.or(ce);
			if (sp instanceof ObjectUnionOf)
				if (ce.isNothing())
					return this;
				else
					newSet.add(ce);
			else
				return sp;
		}

		return new ObjectUnionOf(...newSet);

	}

	override toString(): string {
		return [...this.operands()].join("∪");
	}

	override typeCode(): number {
		return ClassExpressionType.OBJECT_UNION_OF;
	}

	override toJson(): any {
		return {
			type: ClassExpressionType.OBJECT_UNION_OF,
			operands: [...this.operands()].map(operand => operand.toJson())
		};
	}

	static override fromJson(json: any): ObjectUnionOf {
		if (json.type != ClassExpressionType.OBJECT_UNION_OF)
			throw new Error("Expecting type " + ClassExpressionType.OBJECT_UNION_OF + " , got " + json.type);
		return new ObjectUnionOf(...(<any[]>(json.operands ?? [])).map(operand => ClassExpression.fromJson(operand)));
	}

}
