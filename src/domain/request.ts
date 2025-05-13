import type { EventType } from "./request-events";
import type { UUID, UserID, Timestamp } from "./types";

interface EventSourcedEntity<T extends EventType> {
	events: T[];
}

interface RequestBase extends EventSourcedEntity<EventType> {
	id: UUID;
	title: string;
	description: string;
	requesterId: UserID;
	createdAt: Timestamp;
}

export interface PendingRequest extends RequestBase {
	status: "PENDING";
	updatedAt: Timestamp;
}

export interface ApprovedRequest extends RequestBase {
	status: "APPROVED";
	approverId: UserID;
	approvedAt: Timestamp;
	updatedAt: Timestamp;
}

export interface RejectedRequest extends RequestBase {
	status: "REJECTED";
	approverId: UserID;
	rejectedAt: Timestamp;
	reason: string;
	updatedAt: Timestamp;
}

export interface CanceledRequest extends RequestBase {
	status: "CANCELED";
	canceledAt: Timestamp;
	updatedAt: Timestamp;
}

export type RequestType =
	| PendingRequest
	| ApprovedRequest
	| RejectedRequest
	| CanceledRequest;

// タイプガード関数
export function isPendingRequest(
	request: RequestType,
): request is PendingRequest {
	return request.status === "PENDING";
}
