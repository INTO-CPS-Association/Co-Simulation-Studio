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

export class IRI {

	#iri: string;

	private constructor(iri: string) {
		this.#iri = iri;
	}

	getIRIString(): string {
		return this.#iri;
	}

	equals(other: IRI) {
		return this.#iri == other.#iri;
	}

	isAbsolute(): boolean {
		return this.#iri.match(/^([^:]*:)?\/\//) != null;
	}

	isNothing(): boolean {
		return this.#iri == "http://www.w3.org/2002/07/owl#Nothing";
	}

	isThing(): boolean {
		return this.#iri == "http://www.w3.org/2002/07/owl#Thing";
	}

	length(): number {
		return this.#iri.length;
	}

	toString() {
		return this.#iri;
	}

	static fromString(iri: string) {
		return new IRI(iri);
	}

}