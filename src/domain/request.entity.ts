import type { DomainEventType, RequestDomainEvent } from "./request.events";
import type { UUID, UserID, EpochMillisecond } from "./types";

/**
 * イベントソーシングパターンで管理されるエンティティの基底インターフェース
 * エンティティの状態変更は全てイベントとして記録される
 */
interface EventSourcedEntity<T extends DomainEventType> {
	events: T[];
}

/**
 * リクエストエンティティの基底インターフェース
 * イベントソーシングパターンを使用し、リクエストの状態変更をイベントとして記録
 */
interface RequestAggregate extends EventSourcedEntity<RequestDomainEvent> {
	id: UUID;
	title: string;
	description: string;
	requesterId: UserID;
	createdAt: EpochMillisecond;
}

/**
 * 保留中のリクエストを表すインターフェース
 * 承認待ちの状態を示し、更新日時を保持
 */
export interface PendingRequest extends RequestAggregate {
	status: "PENDING";
	updatedAt: EpochMillisecond;
}

/**
 * 承認済みのリクエストを表すインターフェース
 * 承認者情報と承認日時を保持
 */
export interface ApprovedRequest extends RequestAggregate {
	status: "APPROVED";
	approverId: UserID;
	approvedAt: EpochMillisecond;
	updatedAt: EpochMillisecond;
}

/**
 * 却下されたリクエストを表すインターフェース
 * 却下理由と却下者情報を保持
 */
export interface RejectedRequest extends RequestAggregate {
	status: "REJECTED";
	approverId: UserID;
	rejectedAt: EpochMillisecond;
	reason: string;
	updatedAt: EpochMillisecond;
}

/**
 * キャンセルされたリクエストを表すインターフェース
 * キャンセル日時を保持
 */
export interface CanceledRequest extends RequestAggregate {
	status: "CANCELED";
	canceledAt: EpochMillisecond;
	updatedAt: EpochMillisecond;
}

/**
 * リクエストの状態を表すユニオン型
 * 保留中、承認済み、却下、キャンセルの4つの状態を表現
 */
export type RequestType =
	| PendingRequest
	| ApprovedRequest
	| RejectedRequest
	| CanceledRequest;

/**
 * リクエストが保留中かどうかを判定するタイプガード関数
 */
export function isPendingRequest(
	request: RequestType,
): request is PendingRequest {
	return request.status === "PENDING";
}
