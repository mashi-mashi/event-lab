import { RequestCommandHandler } from "./application/handlers/request.command-handler";
import { RequestRepositoryImpl } from "./infrastrucutre/request-repository-impl";
import { InMemoryEventStore } from "./infrastrucutre/in-memory-event-store";
import { RequesterServiceImpl } from "./application/services/requester.service";
import { ApproverServiceImpl } from "./application/services/approver.service";
import { generateUUID } from "./infrastrucutre/id-genenrator";

const main = async () => {
	const eventStore = new InMemoryEventStore();
	const repository = new RequestRepositoryImpl(eventStore);
	const commandHandler = new RequestCommandHandler(repository);

	const requesterService = new RequesterServiceImpl(commandHandler, repository);
	const approverService = new ApproverServiceImpl(commandHandler, repository);

	// 1. 申請者：リクエストを作成
	const requestId = await requesterService.createRequest("test", "test", "1");

	console.log(requestId);

	// 2. 管理者：保留中のリクエストを取得
	const pendingRequests = await approverService.getPendingRequests();

	console.log(pendingRequests);

	// 3. 管理者：リクエストを承認
	await approverService.approveRequest(requestId, "2");
	const request = await approverService.getRequestById(requestId);

	console.log(request);

	try {
		// 100. 申請者：存在しないリクエストを承認しようとする
		await approverService.approveRequest(generateUUID(), "2");
	} catch (error) {
		console.log(error);
	}
};

main();
