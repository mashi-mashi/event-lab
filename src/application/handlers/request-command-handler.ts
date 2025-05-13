import type {
	ApprovedRequest,
	CanceledRequest,
	PendingRequest,
	RejectedRequest,
} from "../../domain/request";
import type {
	ApproveRequestCommand,
	CancelRequestCommand,
	CreateRequestCommand,
	RejectRequestCommand,
	RequestCommand,
} from "../../domain/request-commands";
import type {
	RequestApprovedEvent,
	RequestCanceledEvent,
	RequestCreatedEvent,
	RequestRejectedEvent,
} from "../../domain/request-events";
import {
	generateUUID,
	getCurrentTimestamp,
} from "../../infrastrucutre/id-genenrator";
import type { RequestRepository } from "../repositories/request-repository";

export class RequestCommandHandler {
	constructor(private repository: RequestRepository) {}

	async handleCommand(command: RequestCommand): Promise<void> {
		switch (command.type) {
			case "CREATE_REQUEST":
				await this.handleCreateRequest(command);
				break;
			case "APPROVE_REQUEST":
				await this.handleApproveRequest(command);
				break;
			case "REJECT_REQUEST":
				await this.handleRejectRequest(command);
				break;
			case "CANCEL_REQUEST":
				await this.handleCancelRequest(command);
				break;
			default:
				throw new Error(`Unknown command type: ${(command as any).type}`);
		}
	}

	private async handleCreateRequest(
		command: CreateRequestCommand,
	): Promise<void> {
		const event: RequestCreatedEvent = {
			id: generateUUID(),
			timestamp: getCurrentTimestamp(),
			aggregateId: command.data.id,
			type: "REQUEST_CREATED",
			data: {
				title: command.data.title,
				description: command.data.description,
				requesterId: command.data.requesterId,
			},
		};

		const pendingRequest: PendingRequest = {
			id: command.data.id,
			title: command.data.title,
			description: command.data.description,
			requesterId: command.data.requesterId,
			status: "PENDING",
			createdAt: event.timestamp,
			updatedAt: event.timestamp,
			events: [event],
		};

		await this.repository.store(pendingRequest);
	}

	private async handleApproveRequest(
		command: ApproveRequestCommand,
	): Promise<void> {
		const request = await this.repository.findPendingById(
			command.data.requestId,
		);
		if (!request) {
			throw new Error(
				`Cannot approve request: Pending request not found with id ${command.data.requestId}`,
			);
		}

		const event: RequestApprovedEvent = {
			id: generateUUID(),
			timestamp: getCurrentTimestamp(),
			aggregateId: command.data.requestId,
			type: "REQUEST_APPROVED",
			data: {
				approverId: command.data.approverId,
			},
		};

		const approvedRequest: ApprovedRequest = {
			...request,
			status: "APPROVED",
			approverId: command.data.approverId,
			approvedAt: event.timestamp,
			updatedAt: event.timestamp,
			events: [...request.events, event],
		};

		await this.repository.store(approvedRequest);
	}

	private async handleRejectRequest(
		command: RejectRequestCommand,
	): Promise<void> {
		const request = await this.repository.findPendingById(
			command.data.requestId,
		);
		if (!request) {
			throw new Error(
				`Cannot reject request: Pending request not found with id ${command.data.requestId}`,
			);
		}

		const event: RequestRejectedEvent = {
			id: generateUUID(),
			timestamp: getCurrentTimestamp(),
			aggregateId: command.data.requestId,
			type: "REQUEST_REJECTED",
			data: {
				approverId: command.data.approverId,
				reason: command.data.reason,
			},
		};

		const rejectedRequest: RejectedRequest = {
			...request,
			status: "REJECTED",
			approverId: command.data.approverId,
			rejectedAt: event.timestamp,
			reason: command.data.reason,
			updatedAt: event.timestamp,
			events: [...request.events, event],
		};

		await this.repository.store(rejectedRequest);
	}

	private async handleCancelRequest(
		command: CancelRequestCommand,
	): Promise<void> {
		const request = await this.repository.findPendingById(
			command.data.requestId,
		);
		if (!request) {
			throw new Error(
				`Cannot cancel request: Pending request not found with id ${command.data.requestId}`,
			);
		}

		if (request.requesterId !== command.data.requesterId) {
			throw new Error("Only the requester can cancel the request");
		}

		const event: RequestCanceledEvent = {
			id: generateUUID(),
			timestamp: getCurrentTimestamp(),
			aggregateId: command.data.requestId,
			type: "REQUEST_CANCELED",
		};

		const canceledRequest: CanceledRequest = {
			...request,
			status: "CANCELED",
			canceledAt: event.timestamp,
			updatedAt: event.timestamp,
			events: [...request.events, event],
		};

		await this.repository.store(canceledRequest);
	}
}
