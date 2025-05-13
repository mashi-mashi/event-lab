import type { RequestDomainEvent } from "../../domain/request.events";
import type { UUID } from "../../domain/types";

export interface EventStore {
	saveEvent(event: RequestDomainEvent): Promise<void>;
	getEventsByAggregateId(aggregateId: UUID): Promise<RequestDomainEvent[]>;
}
