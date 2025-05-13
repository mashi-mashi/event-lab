import type { PendingRequest, RequestType } from "../../domain/request";
import type {
	ApproveRequestCommand,
	RejectRequestCommand,
} from "../../domain/request-commands";
import type { UUID, UserID } from "../../domain/types";
import {
	generateUUID,
	getCurrentTimestamp,
} from "../../infrastrucutre/id-genenrator";
import type { RequestCommandHandler } from "../handlers/request-command-handler";
import type { RequestRepository } from "../repositories/request-repository";

export interface ApproverService {
	approveRequest(requestId: UUID, approverId: UserID): Promise<void>;
	rejectRequest(
		requestId: UUID,
		approverId: UserID,
		reason: string,
	): Promise<void>;
	getRequestById(requestId: UUID): Promise<RequestType | null>;
	getPendingRequests(): Promise<PendingRequest[]>;
}

export class ApproverServiceImpl implements ApproverService {
	constructor(
		private commandHandler: RequestCommandHandler,
		private repository: RequestRepository,
	) {}

	async approveRequest(requestId: UUID, approverId: UserID): Promise<void> {
		const command: ApproveRequestCommand = {
			id: generateUUID(),
			timestamp: getCurrentTimestamp(),
			type: "APPROVE_REQUEST",
			data: {
				requestId,
				approverId,
			},
		};

		await this.commandHandler.handleCommand(command);
	}

	async rejectRequest(
		requestId: UUID,
		approverId: UserID,
		reason: string,
	): Promise<void> {
		const command: RejectRequestCommand = {
			id: generateUUID(),
			timestamp: getCurrentTimestamp(),
			type: "REJECT_REQUEST",
			data: {
				requestId,
				approverId,
				reason,
			},
		};

		await this.commandHandler.handleCommand(command);
	}

	async getRequestById(requestId: UUID): Promise<RequestType | null> {
		return await this.repository.findById(requestId);
	}

	async getPendingRequests(): Promise<PendingRequest[]> {
		return await this.repository.findAllPending();
	}
}
