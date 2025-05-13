import type { Timestamp, UserID, UUID } from "./types";

export interface Command {
	id: UUID;
	timestamp: Timestamp;
	type: string;
}

export interface CreateRequestCommand extends Command {
	type: "CREATE_REQUEST";
	data: {
		id: UUID;
		title: string;
		description: string;
		requesterId: UserID;
	};
}

export interface ApproveRequestCommand extends Command {
	type: "APPROVE_REQUEST";
	data: {
		requestId: UUID;
		approverId: UserID;
	};
}

export interface RejectRequestCommand extends Command {
	type: "REJECT_REQUEST";
	data: {
		requestId: UUID;
		approverId: UserID;
		reason: string;
	};
}

export interface CancelRequestCommand extends Command {
	type: "CANCEL_REQUEST";
	data: {
		requestId: UUID;
		requesterId: UserID;
	};
}

export type RequestCommand =
	| CreateRequestCommand
	| ApproveRequestCommand
	| RejectRequestCommand
	| CancelRequestCommand;
