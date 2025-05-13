import type { EventStore } from "../application/repositories/event.store";
import type { RequestDomainEvent } from "../domain/request.events";
import type { UUID } from "../domain/types";

import { generateUUID, getCurrentTimestamp } from "./id-genenrator";

export class InMemoryEventStore implements EventStore {
	private events: RequestDomainEvent[] = [];

	async saveEvent(event: RequestDomainEvent): Promise<void> {
		this.events.push({
			...event,
			id: event.id || generateUUID(),
			timestamp: event.timestamp || getCurrentTimestamp(),
		});
	}

	async getEventsByAggregateId(
		aggregateId: UUID,
	): Promise<RequestDomainEvent[]> {
		return this.events.filter((event) => event.aggregateId === aggregateId);
	}
}
