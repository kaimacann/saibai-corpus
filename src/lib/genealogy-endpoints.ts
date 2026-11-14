import type { Person } from '@lib/types';

// terra-quality-ignore single-use -- This exported graph operation is exercised directly by genealogy endpoint tests and used by the renderer.
/** Returns distinct child IDs recorded by either person in a spouse pair.
 * @param people - Source records for the corpus graph.
 * @param personId - ID of the current person's record.
 * @param spouseId - ID of the current person's spouse record.
 * @returns Children listed by either partner, in source order without duplicates.
 */
export function getSpousePairChildren(people: Person[], personId: string, spouseId: string): string[] {
	const partnerIds = new Set([personId, spouseId]);
	const childIds = new Set<string>();
	for (const person of people) {
		if (!partnerIds.has(person.id)) continue;
		for (const childId of person.children) childIds.add(childId);
	}
	return [...childIds];
}

// terra-quality-ignore single-use -- This exported endpoint mutation is exercised directly by genealogy endpoint tests and used by the renderer.
/**
 * Assigns incoming and outgoing edge markers after the relationship graph is complete.
 *
 * @param nodes Person and connector nodes whose visible endpoint flags are updated.
 * @param edges Directed relationships used to identify each person's connections.
 *
 * @return Nothing; custom person-node data receives `origin` and `terminus` flags.
 */
export function markGenealogyNodeEndpoints(nodes: { id: string; type: string; data: object }[], edges: { source: string; target: string }[]): void {
	const targets = new Set(edges.map(e => e.target));
	const sources = new Set(edges.map(e => e.source));
	for (const node of nodes) {
		if (node.type !== 'custom') continue;
		const data = node.data as { origin?: boolean; terminus?: boolean };
		data.origin = targets.has(node.id);
		data.terminus = sources.has(node.id);
	}
}
