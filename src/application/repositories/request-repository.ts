import type { PendingRequest, RequestType } from "../../domain/request";
import type { UUID } from "../../domain/types";

export interface RequestRepository {
	store(request: RequestType): Promise<void>;
	findById(id: UUID): Promise<RequestType | null>;
	findPendingById(id: UUID): Promise<PendingRequest | null>;
	findAllPending(): Promise<PendingRequest[]>;
}
