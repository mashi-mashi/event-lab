import type { RequestType } from "../../domain/request";
import type {
	CreateRequestCommand,
	CancelRequestCommand,
} from "../../domain/request-commands";
import type { UserID, UUID } from "../../domain/types";
import {
	generateUUID,
	getCurrentTimestamp,
} from "../../infrastrucutre/id-genenrator";
import type { RequestCommandHandler } from "../handlers/request-command-handler";
import type { RequestRepository } from "../repositories/request-repository";

export interface RequesterService {
	createRequest(
		title: string,
		description: string,
		requesterId: UserID,
	): Promise<UUID>;
	cancelRequest(requestId: UUID, requesterId: UserID): Promise<void>;
	getRequestById(requestId: UUID): Promise<RequestType | null>;
}

// 申請者用サービスの実装
export class RequesterServiceImpl implements RequesterService {
	constructor(
		private commandHandler: RequestCommandHandler,
		private repository: RequestRepository,
	) {}

	async createRequest(
		title: string,
		description: string,
		requesterId: UserID,
	): Promise<UUID> {
		const requestId = generateUUID();
		const command: CreateRequestCommand = {
			id: generateUUID(),
			timestamp: getCurrentTimestamp(),
			type: "CREATE_REQUEST",
			data: {
				id: requestId,
				title,
				description,
				requesterId,
			},
		};

		await this.commandHandler.handleCommand(command);
		return requestId;
	}

	async cancelRequest(requestId: UUID, requesterId: UserID): Promise<void> {
		const command: CancelRequestCommand = {
			id: generateUUID(),
			timestamp: getCurrentTimestamp(),
			type: "CANCEL_REQUEST",
			data: {
				requestId,
				requesterId,
			},
		};

		await this.commandHandler.handleCommand(command);
	}

	async getRequestById(requestId: UUID): Promise<RequestType | null> {
		return await this.repository.findById(requestId);
	}
}
