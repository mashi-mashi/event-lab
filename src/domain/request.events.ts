import type { Timestamp, UserID, UUID } from "./types";

/**
 * ドメインイベントの基底インターフェース
 * 全てのドメインイベントは一意のID、タイムスタンプ、集約ID、イベントタイプを持つ
 */
export interface DomainEventType {
	id: UUID;
	timestamp: Timestamp;
	aggregateId: UUID;
	type: string;
}

/**
 * リクエスト作成イベント
 * リクエストの初期情報（タイトル、説明、申請者ID）を含む
 */
export interface RequestCreatedEvent extends DomainEventType {
	type: "REQUEST_CREATED";
	data: {
		title: string;
		description: string;
		requesterId: UserID;
	};
}

/**
 * リクエスト承認イベント
 * 承認者のIDを含む
 */
export interface RequestApprovedEvent extends DomainEventType {
	type: "REQUEST_APPROVED";
	data: {
		approverId: UserID;
	};
}

/**
 * リクエスト却下イベント
 * 却下理由と却下者のIDを含む
 */
export interface RequestRejectedEvent extends DomainEventType {
	type: "REQUEST_REJECTED";
	data: {
		approverId: UserID;
		reason: string;
	};
}

/**
 * リクエストキャンセルイベント
 * キャンセル時には追加データは不要
 */
export interface RequestCanceledEvent extends DomainEventType {
	type: "REQUEST_CANCELED";
}

/**
 * リクエストに関連する全てのドメインイベントを表すユニオン型
 * 作成、承認、却下、キャンセルの4つのイベントタイプを表現
 */
export type RequestDomainEvent =
	| RequestCreatedEvent
	| RequestApprovedEvent
	| RequestRejectedEvent
	| RequestCanceledEvent;
