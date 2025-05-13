import type { RequestEvent } from "../../domain/request-events";
import type { UUID } from "../../domain/types";

export interface EventStore {
	saveEvent(event: RequestEvent): Promise<void>;
	getEventsByAggregateId(aggregateId: UUID): Promise<RequestEvent[]>;
}
