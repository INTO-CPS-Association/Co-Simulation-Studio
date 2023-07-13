/*
 * Copyright (C) 2023 Perpetual Labs, Ltd.
 *
 * All information contained herein is proprietary and confidential to
 * Perpetual Labs Ltd. Any use, reproduction, or disclosure without
 * the written permission of Perpetual Labs is prohibited.
 */

import BitSet from 'bitset';
import Graph from "graphology";
import { dfs, bfs, dfsFromNode } from 'graphology-traversal';
import { FactPlusPlusReasoner } from '../factPlusPlusReasoner';
import { AxiomType, Axiom, DisjointClassesAxiom, DisjointUnionAxiom } from './axiom';
import { ClassExpression, Class } from './classExpression';

/**
 * Based on original Java implementation by
 * @author Steven Jenkins <j.s.jenkins@jpl.nasa.gov>
 * @see https://github.com/opencaesar/owl-tools/blob/master/owl-close-world/src/main/java/io/opencaesar/closeworld/Taxonomy.java
 * 
 * @author Mohamad Omar Nachawati <omar@perpetuallabs.io>
 */

export class Taxonomy {

	#graph: Graph;
	#reasoner: FactPlusPlusReasoner;

	constructor(reasoner: FactPlusPlusReasoner) {
		this.#reasoner = reasoner;
		this.#graph = new Graph({ type: 'directed' });
	}

	generateClosureAxioms(axiomType: AxiomType): Axiom[] {

		this.#populate();
		this.#transitivelyReduce();
		this.#rootTaxonomy();
		this.#treeify();

		const siblingMap = this.#siblingMap();
		const axioms = new Set<string>();

		for (const entry of siblingMap.entries()) {

			const c = ClassExpression.fromJson(JSON.parse(entry[0]));
			const s = [...entry[1]].map(str => ClassExpression.fromJson(JSON.parse(str)));

			switch (axiomType) {

				case AxiomType.DISJOINT_CLASSES:
					axioms.add(new DisjointClassesAxiom(...s).toJsonString());
					break;

				case AxiomType.DISJOINT_UNION:
					if (c instanceof Class)
						axioms.add(new DisjointUnionAxiom(c, ...s).toJsonString());
					else
						axioms.add(new DisjointClassesAxiom(...s).toJsonString());
					break;

				case AxiomType.EQUIVALENT_CLASSES:
				default:
			}

		}

		return [...axioms.values()].map(a => Axiom.fromJson(JSON.parse(a)));

	}

	#populate() {
		this.#graph.clear();
		for (const concept of this.#reasoner.getSubConcepts(this.#reasoner.top())) {
			if (!this.#graph.hasNode(concept))
				this.#graph.addNode(concept);
			for (const supConcept of this.#reasoner.getSupConcepts(this.#reasoner.concept(concept), true))
				if (!this.#graph.hasEdge(concept, supConcept))
					this.#graph.addEdge(concept, supConcept);
		}
	}

	#bypassIsolate(node: string) {
		// TODO
	}

	#childrenOf(node: string): string[] {
		return this.#graph.outEdges(node).map(edge => this.#graph.target(edge));
	}

	#descendantsOf(node: string): string[] {

		const descendants = new Set<string>();

		bfs(this.#graph, (node) => {
			descendants.add(node);
		}, {
			mode: 'in'
		});

		return [...descendants];

	}

	#directChildrenOf(node: string): string[] {
		const c = this.#childrenOf(node);
		const cd = new Set<string>();
		c.forEach(e => this.#descendantsOf(e).forEach(d => cd.add(d)));
		return c.filter(e => !cd.has(e));
	}

	#parentsOf(node: string): string[] {
		return this.#graph.inEdges(node).map(edge => this.#graph.source(edge));
	}

	#ancestorsOf(node: string): string[] {

		const ancestors = new Set<string>();

		bfs(this.#graph, (node) => {
			ancestors.add(node);
		}, {
			mode: 'out'
		});

		return [...ancestors];

	}

	#directParentsOf(node: string): string[] {
		const p = this.#parentsOf(node);
		const pa = new Set<string>();
		p.forEach(e => this.#ancestorsOf(e).forEach(a => pa.add(a)));
		return p.filter(e => !pa.has(e));
	}

	#reduceChild(node: string) {

		const parents = this.#parentsOf(node);
		const directParents = this.#directParentsOf(node);

		for (const parent of parents)
			this.#graph.dropDirectedEdge(node, parent);

		for (const directParent of directParents)
			this.#graph.addDirectedEdge(node, directParent);

	}

	#multiParentChild(): string | null {

		let multiParentChild = null;

		dfsFromNode(this.#graph, Class.THING.toJsonString(), node => {
			if (this.#directParentsOf(node).length > 1) {
				multiParentChild = node;
				return true;
			}
		}, {
			mode: 'out'
		});

		return multiParentChild;

	}

	#treeify() {

		let node = null;

		while ((node = this.#multiParentChild()) != null) {
			this.#bypassIsolate(node);
			this.#reduceChild(node);
		}

	}

	#siblingMap(): Map<string, Set<string>> {

		const siblingMap = new Map<string, Set<string>>();

		for (const node of this.#graph.nodes()) {

			const siblings = new Set<string>();

			for (const edge of this.#graph.edges(node)) {
				if (this.#graph.source(edge) != node)
					continue;
				siblings.add(this.#graph.target(node));
			}

			if (siblings.size > 1)
				siblingMap.set(node, siblings);

		}

		return siblingMap;

	}

	#rootTaxonomy() {

		const root = Class.THING.toJsonString();

		if (!this.#graph.hasNode(root))
			this.#graph.addNode(root);

		for (const node of this.#graph.nodes()) {
			if (this.#graph.inDegreeWithoutSelfLoops(node) > 0)
				continue;
			this.#graph.addDirectedEdge(root, node);
		}

	}

	/**
	 * @see https://github.com/jgrapht/jgrapht/blob/master/jgrapht-core/src/main/java/org/jgrapht/alg/TransitiveReduction.java
	 */
	#transitivelyReduce() {

		const nodes = this.#graph.nodes();
		const n = nodes.length;

		const matrix = Array<BitSet>(n);
		for (let i = 0; i < n; i++) {
			matrix[i] = new BitSet();
			matrix[i].setRange(0, n - 1, 0);
		}

		for (const edge of this.#graph.edges()) {
			const source = nodes.indexOf(this.#graph.source(edge));
			const target = nodes.indexOf(this.#graph.target(edge));
			matrix[source].set(target);
		}

		// compute path matrix
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j)
					continue;
				if (matrix[j].get(i))
					for (let k = 0; k < n; k++)
						if (!matrix[j].get(k))
							matrix[j].set(k, matrix[i].get(k));
			}
		}

		// transitively reduce
		for (let j = 0; j < n; j++)
			for (let i = 0; i < n; i++)
				if (matrix[i].get(j))
					for (let k = 0; k < n; k++)
						if (matrix[j].get(k))
							matrix[i].set(k, 0);

		for (let i = 0; i < n; i++)
			for (let j = 0; j < n; j++)
				if (!matrix[i].get(j))
					this.#graph.dropDirectedEdge(nodes[i], nodes[j]);

	}

}