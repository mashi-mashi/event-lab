import type { EventStore } from "../application/repositories/event-store";
import type { RequestRepository } from "../application/repositories/request-repository";
import { isPendingRequest } from "../domain/request";
import type { PendingRequest, RequestType } from "../domain/request";
import type { RequestEvent } from "../domain/request-events";
import type { UUID } from "../domain/types";

function rebuildRequestFromEvents(events: RequestEvent[]): RequestType | null {
	if (events.length === 0) return null;

	// 初期イベントは REQUEST_CREATED であるべき
	const firstEvent = events[0] as any;
	if (firstEvent.type !== "REQUEST_CREATED") {
		throw new Error("First event must be REQUEST_CREATED");
	}

	// 基本プロパティを初期化
	const initialRequest: Partial<RequestType> = {
		id: firstEvent.aggregateId,
		title: firstEvent.data.title,
		description: firstEvent.data.description,
		requesterId: firstEvent.data.requesterId,
		status: "PENDING" as const,
		createdAt: firstEvent.timestamp,
		updatedAt: firstEvent.timestamp,
		events: [],
	};

	const request = events.slice(1).reduce<Partial<RequestType>>((acc, event) => {
		const updatedAcc = {
			// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
			...acc,
			updatedAt: event.timestamp,
			events: [...(acc.events || []), event],
		};

		switch (event.type) {
			case "REQUEST_APPROVED": {
				const approvedEvent = event;
				return {
					...updatedAcc,
					status: "APPROVED" as const,
					approverId: approvedEvent.data.approverId,
					approvedAt: approvedEvent.timestamp,
				};
			}
			case "REQUEST_REJECTED": {
				const rejectedEvent = event;
				return {
					...updatedAcc,
					status: "REJECTED" as const,
					approverId: rejectedEvent.data.approverId,
					rejectedAt: rejectedEvent.timestamp,
					reason: rejectedEvent.data.reason,
				};
			}
			case "REQUEST_CANCELED": {
				return {
					...updatedAcc,
					status: "CANCELED" as const,
					canceledAt: event.timestamp,
				};
			}
			default:
				return updatedAcc;
		}
	}, initialRequest);

	return request as RequestType;
}

export class RequestRepositoryImpl implements RequestRepository {
	private eventStore: EventStore;
	private requestCache: Map<UUID, RequestType> = new Map();

	constructor(eventStore: EventStore) {
		this.eventStore = eventStore;
	}

	async saveRequest(request: RequestType): Promise<void> {
		this.requestCache.set(request.id, request);
		const lastEvent = request.events[request.events.length - 1];
		if (lastEvent) {
			await this.eventStore.saveEvent(lastEvent as RequestEvent);
		}
	}

	async findById(id: UUID): Promise<RequestType | null> {
		// まずキャッシュを確認
		if (this.requestCache.has(id)) {
			return this.requestCache.get(id) || null;
		}

		// キャッシュにない場合はイベントストアから再構築
		const events = await this.eventStore.getEventsByAggregateId(id);
		const request = rebuildRequestFromEvents(events);

		if (request) {
			this.requestCache.set(id, request);
		}

		return request;
	}

	async findPendingById(id: UUID): Promise<PendingRequest | null> {
		const request = await this.findById(id);
		if (request && isPendingRequest(request)) {
			return request;
		}
		return null;
	}

	async findAllPending(): Promise<PendingRequest[]> {
		const pendingRequests: PendingRequest[] = [];

		for (const request of this.requestCache.values()) {
			if (isPendingRequest(request)) {
				pendingRequests.push(request);
			}
		}

		return pendingRequests;
	}
}
