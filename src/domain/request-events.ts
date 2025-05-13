import type { Timestamp, UserID, UUID } from "./types";

export interface EventType {
	id: UUID;
	timestamp: Timestamp;
	aggregateId: UUID;
	type: string;
}

export interface RequestCreatedEvent extends EventType {
	type: "REQUEST_CREATED";
	data: {
		title: string;
		description: string;
		requesterId: UserID;
	};
}

export interface RequestApprovedEvent extends EventType {
	type: "REQUEST_APPROVED";
	data: {
		approverId: UserID;
	};
}

export interface RequestRejectedEvent extends EventType {
	type: "REQUEST_REJECTED";
	data: {
		approverId: UserID;
		reason: string;
	};
}

export interface RequestCanceledEvent extends EventType {
	type: "REQUEST_CANCELED";
}

// イベントの総称型
export type RequestEvent =
	| RequestCreatedEvent
	| RequestApprovedEvent
	| RequestRejectedEvent
	| RequestCanceledEvent;
