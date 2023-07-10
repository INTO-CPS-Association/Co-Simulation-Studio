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

import FactPlusPlus from 'factplusplus/FaCTPlusPlus.mjs';

export class FactPlusPlusReasoner {

	#pointer: number;

	constructor() {
		this.#pointer = FactPlusPlusReasoner.#fact_reasoning_kernel_new();
	}

	*#flatten2d(actor: number): IterableIterator<string> {
		const elements = FactPlusPlusReasoner.#fact_get_elements_2d(actor);
		let element, name;
		for (let i = 0; (element = FactPlusPlusReasoner.#wasm.HEAP32.at((elements / 4) + i)) != 0; i++)
			for (let j = 0; (name = FactPlusPlusReasoner.#wasm.HEAP32.at((element / 4) + j)) != 0; j++)
				yield FactPlusPlusReasoner.#wasm.UTF8ToString(name);
	}

	*#flatten1d(actor: number): IterableIterator<string> {
		const elements = FactPlusPlusReasoner.#fact_get_elements_1d(actor);
		let name;
		for (let i = 0; (name = FactPlusPlusReasoner.#wasm.HEAP32.at((elements / 4) + i)) != 0; i++)
			yield FactPlusPlusReasoner.#wasm.UTF8ToString(name);
	}

	dispose(): void {
		FactPlusPlusReasoner.#fact_reasoning_kernel_free(this.#pointer);
	}

	isKBPreprocessed(): number {
		return FactPlusPlusReasoner.#fact_is_kb_preprocessed(this.#pointer);
	}

	isKBClassified(): number {
		return FactPlusPlusReasoner.#fact_is_kb_classified(this.#pointer);
	}

	isKBRealised(): number {
		return FactPlusPlusReasoner.#fact_is_kb_realised(this.#pointer);
	}

	//fact_set_progress_monitor(progressMonitor: FactPlusPlusProgressMonitor): void { }

	setVerboseOutput(value: number): void {
		FactPlusPlusReasoner.#fact_set_verbose_output(this.#pointer, value);
	}

	setTopBottomRoleNames(topBRoleName: string, botBRoleName: string, topDRoleName: string, botDRoleName: string): void {
		FactPlusPlusReasoner.#fact_set_top_bottom_role_names(this.#pointer, topBRoleName, botBRoleName, topDRoleName, botDRoleName);
	}

	setOperationTimeout(timeout: number): void {
		FactPlusPlusReasoner.#fact_set_operation_timeout(this.#pointer, timeout);
	}

	declare(c: FactPlusPlusExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_declare(this.#pointer, c.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	impliesConcepts(c: FactPlusPlusConceptExpression, d: FactPlusPlusConceptExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_implies_concepts(this.#pointer, c.pointer, d.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	equalConcepts(...cs: FactPlusPlusConceptExpression[]): FactPlusPlusAxiom {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const c of cs)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, c.pointer);
		const pointer = FactPlusPlusReasoner.#fact_equal_concepts(this.#pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	disjointConcepts(...cs: FactPlusPlusConceptExpression[]): FactPlusPlusAxiom {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const c of cs)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, c.pointer);
		const pointer = FactPlusPlusReasoner.#fact_disjoint_concepts(this.#pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	disjointUnion(c: FactPlusPlusConceptExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_disjoint_union(this.#pointer, c.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setInverseRoles(r: FactPlusPlusObjectRoleExpression, s: FactPlusPlusObjectRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_inverse_roles(this.#pointer, r.pointer, s.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	impliesObjectRoles(r: FactPlusPlusObjectRoleComplexExpression, s: FactPlusPlusObjectRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_implies_o_roles(this.#pointer, r.pointer, s.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	impliesDataRoles(r: FactPlusPlusDataRoleExpression, s: FactPlusPlusDataRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_implies_d_roles(this.#pointer, r.pointer, s.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	equalObjectRoles(...es: FactPlusPlusObjectRoleExpression[]): FactPlusPlusAxiom {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const e of es)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, e.pointer);
		const pointer = FactPlusPlusReasoner.#fact_equal_o_roles(this.#pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	equalDataRoles(...es: FactPlusPlusDataRoleExpression[]): FactPlusPlusAxiom {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const e of es)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, e.pointer);
		const pointer = FactPlusPlusReasoner.#fact_equal_d_roles(this.#pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	disjointObjectRoles(...es: FactPlusPlusObjectRoleExpression[]): FactPlusPlusAxiom {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const e of es)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, e.pointer);
		const pointer = FactPlusPlusReasoner.#fact_disjoint_o_roles(this.#pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	disjointDataRoles(...es: FactPlusPlusDataRoleExpression[]): FactPlusPlusAxiom {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const e of es)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, e.pointer);
		const pointer = FactPlusPlusReasoner.#fact_disjoint_d_roles(this.#pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setObjectDomain(r: FactPlusPlusObjectRoleExpression, c: FactPlusPlusConceptExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_o_domain(this.#pointer, r.pointer, c.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setDataDomain(r: FactPlusPlusDataRoleExpression, c: FactPlusPlusConceptExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_d_domain(this.#pointer, r.pointer, c.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setObjectRange(r: FactPlusPlusObjectRoleExpression, c: FactPlusPlusConceptExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_o_range(this.#pointer, r.pointer, c.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setDataRange(r: FactPlusPlusDataRoleExpression, e: FactPlusPlusDataExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_d_range(this.#pointer, r.pointer, e.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setTransitive(r: FactPlusPlusObjectRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_transitive(this.#pointer, r.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setReflexive(r: FactPlusPlusObjectRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_reflexive(this.#pointer, r.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setIrreflexive(r: FactPlusPlusObjectRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_irreflexive(this.#pointer, r.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setSymmetric(r: FactPlusPlusObjectRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_symmetric(this.#pointer, r.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setAsymmetric(r: FactPlusPlusObjectRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_asymmetric(this.#pointer, r.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setObjectFunctional(r: FactPlusPlusObjectRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_o_functional(this.#pointer, r.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setDataFunctional(r: FactPlusPlusDataRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_d_functional(this.#pointer, r.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setInverseFunctional(r: FactPlusPlusObjectRoleExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_inverse_functional(this.#pointer, r.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	instanceOf(i: FactPlusPlusIndividualExpression, c: FactPlusPlusConceptExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_instance_of(this.#pointer, i.pointer, c.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	relatedTo(i: FactPlusPlusIndividualExpression, r: FactPlusPlusObjectRoleExpression, j: FactPlusPlusIndividualExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_related_to(this.#pointer, i.pointer, r.pointer, j.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	relatedToNot(i: FactPlusPlusIndividualExpression, r: FactPlusPlusObjectRoleExpression, j: FactPlusPlusIndividualExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_related_to_not(this.#pointer, i.pointer, r.pointer, j.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	valueOf(i: FactPlusPlusIndividualExpression, a: FactPlusPlusDataRoleExpression, v: FactPlusPlusDataValueExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_value_of(this.#pointer, i.pointer, a.pointer, v.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	valueOfNot(i: FactPlusPlusIndividualExpression, a: FactPlusPlusDataRoleExpression, v: FactPlusPlusDataValueExpression): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_value_of_not(this.#pointer, i.pointer, a.pointer, v.pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	processSame(): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_process_same(this.#pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	processDifferent(): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_process_different(this.#pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	setFairnessConstraint(): FactPlusPlusAxiom {
		const pointer = FactPlusPlusReasoner.#fact_set_fairness_constraint(this.#pointer);
		return new FactPlusPlusAxiom(this, pointer);
	}

	retract(axiom: FactPlusPlusAxiom): void {
		FactPlusPlusReasoner.#fact_retract(this.#pointer, axiom.pointer);
	}

	isKBConsistent(): boolean {
		return FactPlusPlusReasoner.#fact_is_kb_consistent(this.#pointer) != 0;
	}

	preprocessKB(): void {
		FactPlusPlusReasoner.#fact_preprocess_kb(this.#pointer);
	}

	classifyKB(): void {
		FactPlusPlusReasoner.#fact_classify_kb(this.#pointer);
	}

	realiseKB(): void {
		FactPlusPlusReasoner.#fact_realise_kb(this.#pointer);
	}

	isObjectFunctional(r: FactPlusPlusObjectRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_o_functional(this.#pointer, r.pointer) != 0;
	}

	isDataFunctional(r: FactPlusPlusDataRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_d_functional(this.#pointer, r.pointer) != 0;
	}

	isInverseFunctional(r: FactPlusPlusObjectRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_inverse_functional(this.#pointer, r.pointer) != 0;
	}

	isTransitive(r: FactPlusPlusObjectRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_transitive(this.#pointer, r.pointer) != 0;
	}

	isSymmetric(r: FactPlusPlusObjectRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_symmetric(this.#pointer, r.pointer) != 0;
	}

	isAsymmetric(r: FactPlusPlusObjectRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_asymmetric(this.#pointer, r.pointer) != 0;
	}

	isReflexive(r: FactPlusPlusObjectRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_reflexive(this.#pointer, r.pointer) != 0;
	}

	isIrreflexive(r: FactPlusPlusObjectRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_irreflexive(this.#pointer, r.pointer) != 0;
	}

	isSubObjectRoles(r: FactPlusPlusObjectRoleExpression, s: FactPlusPlusObjectRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_sub_o_roles(this.#pointer, r.pointer, s.pointer) != 0;
	}

	isSubDataRoles(r: FactPlusPlusDataRoleExpression, s: FactPlusPlusDataRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_sub_d_roles(this.#pointer, r.pointer, s.pointer) != 0;
	}

	isDisjointObjectRoles(r: FactPlusPlusObjectRoleExpression, s: FactPlusPlusObjectRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_disjoint_o_roles(this.#pointer, r.pointer, s.pointer) != 0;
	}

	isDisjointDataRoles(r: FactPlusPlusDataRoleExpression, s: FactPlusPlusDataRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_disjoint_d_roles(this.#pointer, r.pointer, s.pointer) != 0;
	}

	isDisjointRoles(): boolean {
		return FactPlusPlusReasoner.#fact_is_disjoint_roles(this.#pointer) != 0;
	}

	isSubChain(r: FactPlusPlusObjectRoleExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_sub_chain(this.#pointer, r.pointer) != 0;
	}

	isSatisfiable(c: FactPlusPlusConceptExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_satisfiable(this.#pointer, c.pointer) != 0;
	}

	isSubsumedBy(c: FactPlusPlusConceptExpression, d: FactPlusPlusConceptExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_subsumed_by(this.#pointer, c.pointer, d.pointer) != 0;
	}

	isDisjoint(c: FactPlusPlusConceptExpression, d: FactPlusPlusConceptExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_disjoint(this.#pointer, c.pointer, d.pointer) != 0;
	}

	isEquivalent(c: FactPlusPlusConceptExpression, d: FactPlusPlusConceptExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_equivalent(this.#pointer, c.pointer, d.pointer) != 0;
	}

	*getSupConcepts(c: FactPlusPlusConceptExpression, direct = false): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_concept_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_sup_concepts(this.#pointer, c.pointer, direct, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getSubConcepts(c: FactPlusPlusConceptExpression, direct = false): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_concept_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_sub_concepts(this.#pointer, c.pointer, direct, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getEquivalentConcepts(c: FactPlusPlusConceptExpression): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_concept_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_equivalent_concepts(this.#pointer, c.pointer, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getDisjointConcepts(c: FactPlusPlusConceptExpression): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_concept_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_disjoint_concepts(this.#pointer, c.pointer, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getSupRoles(r: FactPlusPlusRoleExpression, direct = false): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_concept_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_sup_roles(this.#pointer, r.pointer, direct, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getSubRoles(r: FactPlusPlusRoleExpression, direct = false): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_concept_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_sub_roles(this.#pointer, r.pointer, direct, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getEquivalentRoles(r: FactPlusPlusRoleExpression): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_concept_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_equivalent_roles(this.#pointer, r.pointer, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getObjectRoleDomain(r: FactPlusPlusObjectRoleExpression, direct = false): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_concept_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_o_role_domain(this.#pointer, r.pointer, direct, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getDataRoleDomain(r: FactPlusPlusDataRoleExpression, direct = false): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_concept_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_d_role_domain(this.#pointer, r.pointer, direct, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getRoleRange(r: FactPlusPlusObjectRoleExpression, direct = false): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_o_role_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_role_range(this.#pointer, r.pointer, direct, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getDirectInstances(c: FactPlusPlusConceptExpression): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_individual_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_direct_instances(this.#pointer, c.pointer, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getInstances(c: FactPlusPlusConceptExpression): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_individual_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_instances(this.#pointer, c.pointer, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getTypes(i: FactPlusPlusIndividualExpression, direct = false): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_concept_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_types(this.#pointer, i.pointer, direct, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	*getSameAs(i: FactPlusPlusIndividualExpression): IterableIterator<string> {
		const actor = FactPlusPlusReasoner.#fact_individual_actor_new();
		const actor_ptr = FactPlusPlusReasoner.#wasm._malloc(4);
		FactPlusPlusReasoner.#wasm.HEAP32.set([actor], actor_ptr / 4);
		FactPlusPlusReasoner.#fact_get_same_as(this.#pointer, i.pointer, actor_ptr);
		yield* this.#flatten2d(actor);
		FactPlusPlusReasoner.#fact_actor_free(actor);
	}

	isSameIndividuals(i: FactPlusPlusIndividualExpression, j: FactPlusPlusIndividualExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_same_individuals(this.#pointer, i.pointer, j.pointer) != 0;
	}

	isInstance(i: FactPlusPlusIndividualExpression, c: FactPlusPlusConceptExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_instance(this.#pointer, i.pointer, c.pointer) != 0;
	}

	isRelated(i: FactPlusPlusIndividualExpression, r: FactPlusPlusObjectRoleExpression, j: FactPlusPlusIndividualExpression): boolean {
		return FactPlusPlusReasoner.#fact_is_related(this.#pointer, i.pointer, r.pointer, j.pointer) != 0;
	}

	top(): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_top(this.#pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	bottom(): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_bottom(this.#pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	concept(name: string): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_concept(this.#pointer, name);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	not(c: FactPlusPlusConceptExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_not(this.#pointer, c.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	and(...cs: FactPlusPlusConceptExpression[]): FactPlusPlusConceptExpression {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const c of cs)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, c.pointer);
		const pointer = FactPlusPlusReasoner.#fact_and(this.#pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	or(...cs: FactPlusPlusConceptExpression[]): FactPlusPlusConceptExpression {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const c of cs)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, c.pointer);
		const pointer = FactPlusPlusReasoner.#fact_or(this.#pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	oneOf(...es: FactPlusPlusIndividualExpression[]): FactPlusPlusConceptExpression {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const e of es)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, e.pointer);
		const pointer = FactPlusPlusReasoner.#fact_one_of(this.#pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	selfReferenceRestriction(r: FactPlusPlusObjectRoleExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_self_reference(this.#pointer, r.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	objectValueRestriction(r: FactPlusPlusObjectRoleExpression, i: FactPlusPlusIndividualExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_o_value(this.#pointer, r.pointer, i.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	objectExistsRestriction(r: FactPlusPlusObjectRoleExpression, c: FactPlusPlusConceptExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_o_exists(this.#pointer, r.pointer, c.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	objectForallRestriction(r: FactPlusPlusObjectRoleExpression, c: FactPlusPlusConceptExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_o_forall(this.#pointer, r.pointer, c.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	objectMinCardinalityRestriction(n: number, r: FactPlusPlusObjectRoleExpression, c: FactPlusPlusConceptExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_o_min_cardinality(this.#pointer, n, r.pointer, c.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	objectMaxCardinalityRestriction(n: number, r: FactPlusPlusObjectRoleExpression, c: FactPlusPlusConceptExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_o_max_cardinality(this.#pointer, n, r.pointer, c.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	objectCardinalityRestriction(n: number, r: FactPlusPlusObjectRoleExpression, c: FactPlusPlusConceptExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_o_cardinality(this.#pointer, n, r.pointer, c.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	dataValueRestriction(r: FactPlusPlusDataRoleExpression, v: FactPlusPlusDataValueExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_d_value(this.#pointer, r.pointer, v.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	dataExistsRestriction(r: FactPlusPlusDataRoleExpression, e: FactPlusPlusDataExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_d_exists(this.#pointer, r.pointer, e.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	dataForallRestriction(r: FactPlusPlusDataRoleExpression, e: FactPlusPlusDataExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_d_forall(this.#pointer, r.pointer, e.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	dataMinCardinalityRestriction(n: number, r: FactPlusPlusDataRoleExpression, e: FactPlusPlusDataExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_d_min_cardinality(this.#pointer, n, r.pointer, e.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	dataMaxCardinalityRestriction(n: number, r: FactPlusPlusDataRoleExpression, e: FactPlusPlusDataExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_d_max_cardinality(this.#pointer, n, r.pointer, e.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	dataCardinalityRestriction(n: number, r: FactPlusPlusDataRoleExpression, e: FactPlusPlusDataExpression): FactPlusPlusConceptExpression {
		const pointer = FactPlusPlusReasoner.#fact_d_cardinality(this.#pointer, n, r.pointer, e.pointer);
		return new FactPlusPlusConceptExpression(this, pointer);
	}

	individual(name: string): FactPlusPlusIndividualExpression {
		const pointer = FactPlusPlusReasoner.#fact_individual(this.#pointer, name);
		return new FactPlusPlusIndividualExpression(this, pointer);
	}

	objectRoleTop(): FactPlusPlusObjectRoleExpression {
		const pointer = FactPlusPlusReasoner.#fact_object_role_top(this.#pointer);
		return new FactPlusPlusObjectRoleExpression(this, pointer);
	}

	objectRoleBottom(): FactPlusPlusObjectRoleExpression {
		const pointer = FactPlusPlusReasoner.#fact_object_role_bottom(this.#pointer);
		return new FactPlusPlusObjectRoleExpression(this, pointer);
	}

	objectRole(name: string): FactPlusPlusObjectRoleExpression {
		const pointer = FactPlusPlusReasoner.#fact_object_role(this.#pointer, name);
		return new FactPlusPlusObjectRoleExpression(this, pointer);
	}

	inverse(r: FactPlusPlusObjectRoleExpression): FactPlusPlusObjectRoleExpression {
		const pointer = FactPlusPlusReasoner.#fact_inverse(this.#pointer, r.pointer);
		return new FactPlusPlusObjectRoleExpression(this, pointer);
	}

	compose(...es: FactPlusPlusObjectRoleExpression[]): FactPlusPlusObjectRoleComplexExpression {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const e of es)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, e.pointer);
		const pointer = FactPlusPlusReasoner.#fact_compose(this.#pointer);
		return new FactPlusPlusObjectRoleComplexExpression(this, pointer);
	}

	projectFrom(r: FactPlusPlusObjectRoleExpression, c: FactPlusPlusConceptExpression): FactPlusPlusObjectRoleComplexExpression {
		const pointer = FactPlusPlusReasoner.#fact_project_from(this.#pointer, r.pointer, c.pointer);
		return new FactPlusPlusObjectRoleComplexExpression(this, pointer);
	}

	projectInto(r: FactPlusPlusObjectRoleExpression, c: FactPlusPlusConceptExpression): FactPlusPlusObjectRoleComplexExpression {
		const pointer = FactPlusPlusReasoner.#fact_project_into(this.#pointer, r.pointer, c.pointer);
		return new FactPlusPlusObjectRoleComplexExpression(this, pointer);
	}

	dataRoleTop(): FactPlusPlusDataRoleExpression {
		const pointer = FactPlusPlusReasoner.#fact_data_role_top(this.#pointer);
		return new FactPlusPlusDataRoleExpression(this, pointer);
	}

	dataRoleBottom(): FactPlusPlusDataRoleExpression {
		const pointer = FactPlusPlusReasoner.#fact_data_role_bottom(this.#pointer);
		return new FactPlusPlusDataRoleExpression(this, pointer);
	}

	dataRole(name: string): FactPlusPlusDataRoleExpression {
		const pointer = FactPlusPlusReasoner.#fact_data_role(this.#pointer, name);
		return new FactPlusPlusDataRoleExpression(this, pointer);
	}

	dataTop(): FactPlusPlusDataExpression {
		const pointer = FactPlusPlusReasoner.#fact_data_top(this.#pointer);
		return new FactPlusPlusDataExpression(this, pointer);
	}

	dataBottom(): FactPlusPlusDataExpression {
		const pointer = FactPlusPlusReasoner.#fact_data_bottom(this.#pointer);
		return new FactPlusPlusDataExpression(this, pointer);
	}

	dataType(name: string): FactPlusPlusDataTypeExpression {
		const pointer = FactPlusPlusReasoner.#fact_data_type(this.#pointer, name);
		return new FactPlusPlusDataTypeExpression(this, pointer);
	}

	getStrDataType(): FactPlusPlusDataTypeExpression {
		const pointer = FactPlusPlusReasoner.#fact_get_str_data_type(this.#pointer);
		return new FactPlusPlusDataTypeExpression(this, pointer);
	}

	getIntDataType(): FactPlusPlusDataTypeExpression {
		const pointer = FactPlusPlusReasoner.#fact_get_int_data_type(this.#pointer);
		return new FactPlusPlusDataTypeExpression(this, pointer);
	}

	getRealDataType(): FactPlusPlusDataTypeExpression {
		const pointer = FactPlusPlusReasoner.#fact_get_real_data_type(this.#pointer);
		return new FactPlusPlusDataTypeExpression(this, pointer);
	}

	getBoolDataType(): FactPlusPlusDataTypeExpression {
		const pointer = FactPlusPlusReasoner.#fact_get_bool_data_type(this.#pointer);
		return new FactPlusPlusDataTypeExpression(this, pointer);
	}

	getTimeDataType(): FactPlusPlusDataTypeExpression {
		const pointer = FactPlusPlusReasoner.#fact_get_time_data_type(this.#pointer);
		return new FactPlusPlusDataTypeExpression(this, pointer);
	}

	restrictedType(type: FactPlusPlusDataTypeExpression, facet: FactPlusPlusFacetExpression): FactPlusPlusDataTypeExpression {
		const pointer = FactPlusPlusReasoner.#fact_restricted_type(this.#pointer, type.pointer, facet.pointer);
		return new FactPlusPlusDataTypeExpression(this, pointer);
	}

	dataValue(value: string, type: FactPlusPlusDataTypeExpression): FactPlusPlusDataValueExpression {
		const pointer = FactPlusPlusReasoner.#fact_data_value(this.#pointer, value, type.pointer);
		return new FactPlusPlusDataValueExpression(this, pointer);
	}

	dataNot(e: FactPlusPlusDataExpression): FactPlusPlusDataExpression {
		const pointer = FactPlusPlusReasoner.#fact_data_not(this.#pointer, e.pointer);
		return new FactPlusPlusDataExpression(this, pointer);
	}

	dataAnd(...es: FactPlusPlusDataExpression[]): FactPlusPlusDataExpression {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const e of es)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, e.pointer);
		const pointer = FactPlusPlusReasoner.#fact_data_and(this.#pointer);
		return new FactPlusPlusDataExpression(this, pointer);
	}

	dataOr(...es: FactPlusPlusDataExpression[]): FactPlusPlusDataExpression {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const e of es)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, e.pointer);
		const pointer = FactPlusPlusReasoner.#fact_data_or(this.#pointer);
		return new FactPlusPlusDataExpression(this, pointer);
	}

	dataOneOf(...es: FactPlusPlusDataValueExpression[]): FactPlusPlusDataExpression {
		FactPlusPlusReasoner.#fact_new_arg_list(this.#pointer);
		for (const e of es)
			FactPlusPlusReasoner.#fact_add_arg(this.#pointer, e.pointer);
		const pointer = FactPlusPlusReasoner.#fact_data_one_of(this.#pointer);
		return new FactPlusPlusDataExpression(this, pointer);
	}

	facetMinInclusive(v: FactPlusPlusDataValueExpression): FactPlusPlusFacetExpression {
		const pointer = FactPlusPlusReasoner.#fact_facet_min_inclusive(this.#pointer, v.pointer);
		return new FactPlusPlusFacetExpression(this, pointer);
	}

	facetMinExclusive(v: FactPlusPlusDataValueExpression): FactPlusPlusFacetExpression {
		const pointer = FactPlusPlusReasoner.#fact_facet_min_exclusive(this.#pointer, v.pointer);
		return new FactPlusPlusFacetExpression(this, pointer);
	}

	facetMaxInclusive(v: FactPlusPlusDataValueExpression): FactPlusPlusFacetExpression {
		const pointer = FactPlusPlusReasoner.#fact_facet_max_inclusive(this.#pointer, v.pointer);
		return new FactPlusPlusFacetExpression(this, pointer);
	}

	facetMaxExclusive(v: FactPlusPlusDataValueExpression): FactPlusPlusFacetExpression {
		const pointer = FactPlusPlusReasoner.#fact_facet_max_exclusive(this.#pointer, v.pointer);
		return new FactPlusPlusFacetExpression(this, pointer);
	}

	static #wasm: any;
	static #fact_get_version: any;
	static #fact_reasoning_kernel_new: any;
	static #fact_reasoning_kernel_free: any;
	static #fact_is_kb_preprocessed: any;
	static #fact_is_kb_classified: any;
	static #fact_is_kb_realised: any;
	static #fact_set_progress_monitor: any;
	static #fact_set_verbose_output: any;
	static #fact_set_top_bottom_role_names: any;
	static #fact_set_operation_timeout: any;
	static #fact_new_kb: any;
	static #fact_release_kb: any;
	static #fact_clear_kb: any;
	static #fact_declare: any;
	static #fact_implies_concepts: any;
	static #fact_equal_concepts: any;
	static #fact_disjoint_concepts: any;
	static #fact_disjoint_union: any;
	static #fact_set_inverse_roles: any;
	static #fact_implies_o_roles: any;
	static #fact_implies_d_roles: any;
	static #fact_equal_o_roles: any;
	static #fact_equal_d_roles: any;
	static #fact_disjoint_o_roles: any;
	static #fact_disjoint_d_roles: any;
	static #fact_set_o_domain: any;
	static #fact_set_d_domain: any;
	static #fact_set_o_range: any;
	static #fact_set_d_range: any;
	static #fact_set_transitive: any;
	static #fact_set_reflexive: any;
	static #fact_set_irreflexive: any;
	static #fact_set_symmetric: any;
	static #fact_set_asymmetric: any;
	static #fact_set_o_functional: any;
	static #fact_set_d_functional: any;
	static #fact_set_inverse_functional: any;
	static #fact_instance_of: any;
	static #fact_related_to: any;
	static #fact_related_to_not: any;
	static #fact_value_of: any;
	static #fact_value_of_not: any;
	static #fact_process_same: any;
	static #fact_process_different: any;
	static #fact_set_fairness_constraint: any;
	static #fact_retract: any;
	static #fact_is_kb_consistent: any;
	static #fact_preprocess_kb: any;
	static #fact_classify_kb: any;
	static #fact_realise_kb: any;
	static #fact_is_o_functional: any;
	static #fact_is_d_functional: any;
	static #fact_is_inverse_functional: any;
	static #fact_is_transitive: any;
	static #fact_is_symmetric: any;
	static #fact_is_asymmetric: any;
	static #fact_is_reflexive: any;
	static #fact_is_irreflexive: any;
	static #fact_is_sub_o_roles: any;
	static #fact_is_sub_d_roles: any;
	static #fact_is_disjoint_o_roles: any;
	static #fact_is_disjoint_d_roles: any;
	static #fact_is_disjoint_roles: any;
	static #fact_is_sub_chain: any;
	static #fact_is_satisfiable: any;
	static #fact_is_subsumed_by: any;
	static #fact_is_disjoint: any;
	static #fact_is_equivalent: any;
	static #fact_get_sup_concepts: any;
	static #fact_get_sub_concepts: any;
	static #fact_get_equivalent_concepts: any;
	static #fact_get_disjoint_concepts: any;
	static #fact_get_sup_roles: any;
	static #fact_get_sub_roles: any;
	static #fact_get_equivalent_roles: any;
	static #fact_get_o_role_domain: any;
	static #fact_get_d_role_domain: any;
	static #fact_get_role_range: any;
	static #fact_get_direct_instances: any;
	static #fact_get_instances: any;
	static #fact_get_types: any;
	static #fact_get_same_as: any;
	static #fact_is_same_individuals: any;
	static #fact_is_instance: any;
	static #fact_is_related: any;
	static #fact_concept_actor_new: any;
	static #fact_individual_actor_new: any;
	static #fact_o_role_actor_new: any;
	static #fact_d_role_actor_new: any;
	static #fact_actor_free: any;
	static #fact_get_synonyms: any;
	static #fact_get_elements_2d: any;
	static #fact_get_elements_1d: any;
	static #fact_new_arg_list: any;
	static #fact_add_arg: any;
	static #fact_top: any;
	static #fact_bottom: any;
	static #fact_concept: any;
	static #fact_not: any;
	static #fact_and: any;
	static #fact_or: any;
	static #fact_one_of: any;
	static #fact_self_reference: any;
	static #fact_o_value: any;
	static #fact_o_exists: any;
	static #fact_o_forall: any;
	static #fact_o_min_cardinality: any;
	static #fact_o_max_cardinality: any;
	static #fact_o_cardinality: any;
	static #fact_d_value: any;
	static #fact_d_exists: any;
	static #fact_d_forall: any;
	static #fact_d_min_cardinality: any;
	static #fact_d_max_cardinality: any;
	static #fact_d_cardinality: any;
	static #fact_individual: any;
	static #fact_object_role_top: any;
	static #fact_object_role_bottom: any;
	static #fact_object_role: any;
	static #fact_inverse: any;
	static #fact_compose: any;
	static #fact_project_from: any;
	static #fact_project_into: any;
	static #fact_data_role_top: any;
	static #fact_data_role_bottom: any;
	static #fact_data_role: any;
	static #fact_data_top: any;
	static #fact_data_bottom: any;
	static #fact_data_type: any;
	static #fact_get_str_data_type: any;
	static #fact_get_int_data_type: any;
	static #fact_get_real_data_type: any;
	static #fact_get_bool_data_type: any;
	static #fact_get_time_data_type: any;
	static #fact_restricted_type: any;
	static #fact_data_value: any;
	static #fact_data_not: any;
	static #fact_data_and: any;
	static #fact_data_or: any;
	static #fact_data_one_of: any;
	static #fact_facet_min_inclusive: any;
	static #fact_facet_min_exclusive: any;
	static #fact_facet_max_inclusive: any;
	static #fact_facet_max_exclusive: any;

	static async initialize(factWasm?: string): Promise<void> {

		const wasm = await FactPlusPlus({
			locateFile: (file: any) => factWasm,
			//onRuntimeInitialized: async (_: any) => {
			//}
		});

		FactPlusPlusReasoner.#wasm = wasm;
		FactPlusPlusReasoner.#fact_get_version = wasm.cwrap('fact_get_version', 'string', []);
		FactPlusPlusReasoner.#fact_reasoning_kernel_new = wasm.cwrap('fact_reasoning_kernel_new', 'number', []);
		FactPlusPlusReasoner.#fact_reasoning_kernel_free = wasm.cwrap('fact_reasoning_kernel_free', null, ['number']);
		FactPlusPlusReasoner.#fact_is_kb_preprocessed = wasm.cwrap('fact_is_kb_preprocessed', 'number', ['number']);
		FactPlusPlusReasoner.#fact_is_kb_classified = wasm.cwrap('fact_is_kb_classified', 'number', ['number']);
		FactPlusPlusReasoner.#fact_is_kb_realised = wasm.cwrap('fact_is_kb_realised', 'number', ['number']);
		FactPlusPlusReasoner.#fact_set_progress_monitor = wasm.cwrap('fact_set_progress_monitor', null, ['number', 'number']);
		FactPlusPlusReasoner.#fact_set_verbose_output = wasm.cwrap('fact_set_verbose_output', null, ['number', 'number']);
		FactPlusPlusReasoner.#fact_set_top_bottom_role_names = wasm.cwrap('fact_set_top_bottom_role_names', null, ['number', 'string', 'string', 'string', 'string']);
		FactPlusPlusReasoner.#fact_set_operation_timeout = wasm.cwrap('fact_set_operation_timeout', null, ['number', 'number']);
		FactPlusPlusReasoner.#fact_new_kb = wasm.cwrap('fact_new_kb', 'number', ['number']);
		FactPlusPlusReasoner.#fact_release_kb = wasm.cwrap('fact_release_kb', 'number', ['number']);
		FactPlusPlusReasoner.#fact_clear_kb = wasm.cwrap('fact_clear_kb', 'number', ['number']);
		FactPlusPlusReasoner.#fact_declare = wasm.cwrap('fact_declare', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_implies_concepts = wasm.cwrap('fact_implies_concepts', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_equal_concepts = wasm.cwrap('fact_equal_concepts', 'number', ['number']);
		FactPlusPlusReasoner.#fact_disjoint_concepts = wasm.cwrap('fact_disjoint_concepts', 'number', ['number']);
		FactPlusPlusReasoner.#fact_disjoint_union = wasm.cwrap('fact_disjoint_union', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_set_inverse_roles = wasm.cwrap('fact_set_inverse_roles', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_implies_o_roles = wasm.cwrap('fact_implies_o_roles', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_implies_d_roles = wasm.cwrap('fact_implies_d_roles', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_equal_o_roles = wasm.cwrap('fact_equal_o_roles', 'number', ['number']);
		FactPlusPlusReasoner.#fact_equal_d_roles = wasm.cwrap('fact_equal_d_roles', 'number', ['number']);
		FactPlusPlusReasoner.#fact_disjoint_o_roles = wasm.cwrap('fact_disjoint_o_roles', 'number', ['number']);
		FactPlusPlusReasoner.#fact_disjoint_d_roles = wasm.cwrap('fact_disjoint_d_roles', 'number', ['number']);
		FactPlusPlusReasoner.#fact_set_o_domain = wasm.cwrap('fact_set_o_domain', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_set_d_domain = wasm.cwrap('fact_set_d_domain', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_set_o_range = wasm.cwrap('fact_set_o_range', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_set_d_range = wasm.cwrap('fact_set_d_range', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_set_transitive = wasm.cwrap('fact_set_transitive', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_set_reflexive = wasm.cwrap('fact_set_reflexive', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_set_irreflexive = wasm.cwrap('fact_set_irreflexive', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_set_symmetric = wasm.cwrap('fact_set_symmetric', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_set_asymmetric = wasm.cwrap('fact_set_asymmetric', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_set_o_functional = wasm.cwrap('fact_set_o_functional', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_set_d_functional = wasm.cwrap('fact_set_d_functional', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_set_inverse_functional = wasm.cwrap('fact_set_inverse_functional', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_instance_of = wasm.cwrap('fact_instance_of', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_related_to = wasm.cwrap('fact_related_to', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_related_to_not = wasm.cwrap('fact_related_to_not', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_value_of = wasm.cwrap('fact_value_of', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_value_of_not = wasm.cwrap('fact_value_of_not', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_process_same = wasm.cwrap('fact_process_same', 'number', ['number']);
		FactPlusPlusReasoner.#fact_process_different = wasm.cwrap('fact_process_different', 'number', ['number']);
		FactPlusPlusReasoner.#fact_set_fairness_constraint = wasm.cwrap('fact_set_fairness_constraint', 'number', ['number']);
		FactPlusPlusReasoner.#fact_retract = wasm.cwrap('fact_retract', null, ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_kb_consistent = wasm.cwrap('fact_is_kb_consistent', 'number', ['number']);
		FactPlusPlusReasoner.#fact_preprocess_kb = wasm.cwrap('fact_preprocess_kb', null, ['number']);
		FactPlusPlusReasoner.#fact_classify_kb = wasm.cwrap('fact_classify_kb', null, ['number']);
		FactPlusPlusReasoner.#fact_realise_kb = wasm.cwrap('fact_realise_kb', null, ['number']);
		FactPlusPlusReasoner.#fact_is_o_functional = wasm.cwrap('fact_is_o_functional', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_d_functional = wasm.cwrap('fact_is_d_functional', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_inverse_functional = wasm.cwrap('fact_is_inverse_functional', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_transitive = wasm.cwrap('fact_is_transitive', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_symmetric = wasm.cwrap('fact_is_symmetric', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_asymmetric = wasm.cwrap('fact_is_asymmetric', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_reflexive = wasm.cwrap('fact_is_reflexive', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_irreflexive = wasm.cwrap('fact_is_irreflexive', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_sub_o_roles = wasm.cwrap('fact_is_sub_o_roles', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_is_sub_d_roles = wasm.cwrap('fact_is_sub_d_roles', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_is_disjoint_o_roles = wasm.cwrap('fact_is_disjoint_o_roles', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_is_disjoint_d_roles = wasm.cwrap('fact_is_disjoint_d_roles', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_is_disjoint_roles = wasm.cwrap('fact_is_disjoint_roles', 'number', ['number']);
		FactPlusPlusReasoner.#fact_is_sub_chain = wasm.cwrap('fact_is_sub_chain', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_satisfiable = wasm.cwrap('fact_is_satisfiable', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_is_subsumed_by = wasm.cwrap('fact_is_subsumed_by', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_is_disjoint = wasm.cwrap('fact_is_disjoint', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_is_equivalent = wasm.cwrap('fact_is_equivalent', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_sup_concepts = wasm.cwrap('fact_get_sup_concepts', null, ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_sub_concepts = wasm.cwrap('fact_get_sub_concepts', null, ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_equivalent_concepts = wasm.cwrap('fact_get_equivalent_concepts', null, ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_disjoint_concepts = wasm.cwrap('fact_get_disjoint_concepts', null, ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_sup_roles = wasm.cwrap('fact_get_sup_roles', null, ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_sub_roles = wasm.cwrap('fact_get_sub_roles', null, ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_equivalent_roles = wasm.cwrap('fact_get_equivalent_roles', null, ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_o_role_domain = wasm.cwrap('fact_get_o_role_domain', null, ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_d_role_domain = wasm.cwrap('fact_get_d_role_domain', null, ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_role_range = wasm.cwrap('fact_get_role_range', null, ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_direct_instances = wasm.cwrap('fact_get_direct_instances', null, ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_instances = wasm.cwrap('fact_get_instances', null, ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_types = wasm.cwrap('fact_get_types', null, ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_get_same_as = wasm.cwrap('fact_get_same_as', null, ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_is_same_individuals = wasm.cwrap('fact_is_same_individuals', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_is_instance = wasm.cwrap('fact_is_instance', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_is_related = wasm.cwrap('fact_is_related', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_concept_actor_new = wasm.cwrap('fact_concept_actor_new', 'number', []);
		FactPlusPlusReasoner.#fact_individual_actor_new = wasm.cwrap('fact_individual_actor_new', 'number', []);
		FactPlusPlusReasoner.#fact_o_role_actor_new = wasm.cwrap('fact_o_role_actor_new', 'number', []);
		FactPlusPlusReasoner.#fact_d_role_actor_new = wasm.cwrap('fact_d_role_actor_new', 'number', []);
		FactPlusPlusReasoner.#fact_actor_free = wasm.cwrap('fact_actor_free', null, ['number']);
		FactPlusPlusReasoner.#fact_get_synonyms = wasm.cwrap('fact_get_synonyms', 'number', ['number']);
		FactPlusPlusReasoner.#fact_get_elements_2d = wasm.cwrap('fact_get_elements_2d', 'number', ['number']);
		FactPlusPlusReasoner.#fact_get_elements_1d = wasm.cwrap('fact_get_elements_1d', 'number', ['number']);
		FactPlusPlusReasoner.#fact_new_arg_list = wasm.cwrap('fact_new_arg_list', null, ['number']);
		FactPlusPlusReasoner.#fact_add_arg = wasm.cwrap('fact_add_arg', null, ['number', 'number']);
		FactPlusPlusReasoner.#fact_top = wasm.cwrap('fact_top', 'number', ['number']);
		FactPlusPlusReasoner.#fact_bottom = wasm.cwrap('fact_bottom', 'number', ['number']);
		FactPlusPlusReasoner.#fact_concept = wasm.cwrap('fact_concept', 'number', ['number', 'string']);
		FactPlusPlusReasoner.#fact_not = wasm.cwrap('fact_not', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_and = wasm.cwrap('fact_and', 'number', ['number']);
		FactPlusPlusReasoner.#fact_or = wasm.cwrap('fact_or', 'number', ['number']);
		FactPlusPlusReasoner.#fact_one_of = wasm.cwrap('fact_one_of', 'number', ['number']);
		FactPlusPlusReasoner.#fact_self_reference = wasm.cwrap('fact_self_reference', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_o_value = wasm.cwrap('fact_o_value', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_o_exists = wasm.cwrap('fact_o_exists', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_o_forall = wasm.cwrap('fact_o_forall', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_o_min_cardinality = wasm.cwrap('fact_o_min_cardinality', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_o_max_cardinality = wasm.cwrap('fact_o_max_cardinality', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_o_cardinality = wasm.cwrap('fact_o_cardinality', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_d_value = wasm.cwrap('fact_d_value', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_d_exists = wasm.cwrap('fact_d_exists', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_d_forall = wasm.cwrap('fact_d_forall', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_d_min_cardinality = wasm.cwrap('fact_d_min_cardinality', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_d_max_cardinality = wasm.cwrap('fact_d_max_cardinality', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_d_cardinality = wasm.cwrap('fact_d_cardinality', 'number', ['number', 'number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_individual = wasm.cwrap('fact_individual', 'number', ['number', 'string']);
		FactPlusPlusReasoner.#fact_object_role_top = wasm.cwrap('fact_object_role_top', 'number', ['number']);
		FactPlusPlusReasoner.#fact_object_role_bottom = wasm.cwrap('fact_object_role_bottom', 'number', ['number']);
		FactPlusPlusReasoner.#fact_object_role = wasm.cwrap('fact_object_role', 'number', ['number', 'string']);
		FactPlusPlusReasoner.#fact_inverse = wasm.cwrap('fact_inverse', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_compose = wasm.cwrap('fact_compose', 'number', ['number']);
		FactPlusPlusReasoner.#fact_project_from = wasm.cwrap('fact_project_from', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_project_into = wasm.cwrap('fact_project_into', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_data_role_top = wasm.cwrap('fact_data_role_top', 'number', ['number']);
		FactPlusPlusReasoner.#fact_data_role_bottom = wasm.cwrap('fact_data_role_bottom', 'number', ['number']);
		FactPlusPlusReasoner.#fact_data_role = wasm.cwrap('fact_data_role', 'number', ['number', 'string']);
		FactPlusPlusReasoner.#fact_data_top = wasm.cwrap('fact_data_top', 'number', ['number']);
		FactPlusPlusReasoner.#fact_data_bottom = wasm.cwrap('fact_data_bottom', 'number', ['number']);
		FactPlusPlusReasoner.#fact_data_type = wasm.cwrap('fact_data_type', 'number', ['number', 'string']);
		FactPlusPlusReasoner.#fact_get_str_data_type = wasm.cwrap('fact_get_str_data_type', 'number', ['number']);
		FactPlusPlusReasoner.#fact_get_int_data_type = wasm.cwrap('fact_get_int_data_type', 'number', ['number']);
		FactPlusPlusReasoner.#fact_get_real_data_type = wasm.cwrap('fact_get_real_data_type', 'number', ['number']);
		FactPlusPlusReasoner.#fact_get_bool_data_type = wasm.cwrap('fact_get_bool_data_type', 'number', ['number']);
		FactPlusPlusReasoner.#fact_get_time_data_type = wasm.cwrap('fact_get_time_data_type', 'number', ['number']);
		FactPlusPlusReasoner.#fact_restricted_type = wasm.cwrap('fact_restricted_type', 'number', ['number', 'number', 'number']);
		FactPlusPlusReasoner.#fact_data_value = wasm.cwrap('fact_data_value', 'number', ['number', 'string', 'number']);
		FactPlusPlusReasoner.#fact_data_not = wasm.cwrap('fact_data_not', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_data_and = wasm.cwrap('fact_data_and', 'number', ['number']);
		FactPlusPlusReasoner.#fact_data_or = wasm.cwrap('fact_data_or', 'number', ['number']);
		FactPlusPlusReasoner.#fact_data_one_of = wasm.cwrap('fact_data_one_of', 'number', ['number']);
		FactPlusPlusReasoner.#fact_facet_min_inclusive = wasm.cwrap('fact_facet_min_inclusive', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_facet_min_exclusive = wasm.cwrap('fact_facet_min_exclusive', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_facet_max_inclusive = wasm.cwrap('fact_facet_max_inclusive', 'number', ['number', 'number']);
		FactPlusPlusReasoner.#fact_facet_max_exclusive = wasm.cwrap('fact_facet_max_exclusive', 'number', ['number', 'number']);
	}

}

export abstract class FactPlusPlusObject {

	#reasoner: FactPlusPlusReasoner;
	#pointer: number;

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		this.#reasoner = reasoner;
		this.#pointer = pointer;
	}

	get pointer() {
		return this.#pointer;
	}

	get reasoner() {
		return this.#reasoner;
	}

}

export class FactPlusPlusProgressMonitor extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusAxiom extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusConceptExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusRoleExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusObjectRoleExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusObjectRoleComplexExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusDataRoleExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusIndividualExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusDataExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusDataTypeExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusDataValueExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}

export class FactPlusPlusFacetExpression extends FactPlusPlusObject {

	constructor(reasoner: FactPlusPlusReasoner, pointer: number) {
		super(reasoner, pointer);
	}

}
