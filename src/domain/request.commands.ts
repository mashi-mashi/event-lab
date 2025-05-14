import type { EpochMillisecond, UserID, UUID } from "./types";

/**
 * コマンドの基底インターフェース
 * 全てのコマンドは一意のID、タイムスタンプ、タイプを持つ
 */
export interface Command {
	id: UUID;
	timestamp: EpochMillisecond;
	type: string;
}

/**
 * リクエスト作成コマンド
 * 新しいリクエストを作成する際に使用
 */
export interface CreateRequestCommand extends Command {
	type: "CREATE_REQUEST";
	data: {
		id: UUID;
		title: string;
		description: string;
		requesterId: UserID;
	};
}

/**
 * リクエスト承認コマンド
 * 申請を承認する際に使用
 */
export interface ApproveRequestCommand extends Command {
	type: "APPROVE_REQUEST";
	data: {
		requestId: UUID;
		approverId: UserID;
	};
}

/**
 * リクエスト却下コマンド
 * 申請を却下する際に使用
 */
export interface RejectRequestCommand extends Command {
	type: "REJECT_REQUEST";
	data: {
		requestId: UUID;
		approverId: UserID;
		reason: string;
	};
}

/**
 * リクエストキャンセルコマンド
 * 申請をキャンセルする際に使用
 */
export interface CancelRequestCommand extends Command {
	type: "CANCEL_REQUEST";
	data: {
		requestId: UUID;
		requesterId: UserID;
	};
}

/**
 * リクエスト関連コマンドのユニオン型
 * 申請作成・承認・却下・キャンセルの4種類を表現
 */
export type RequestCommand =
	| CreateRequestCommand
	| ApproveRequestCommand
	| RejectRequestCommand
	| CancelRequestCommand;
