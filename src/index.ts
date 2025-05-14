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

	const requestId = await requesterService.createRequest("test", "test", "1");

	console.log(requestId);

	const pendingRequests = await approverService.getPendingRequests();

	console.log(pendingRequests);

	await approverService.approveRequest(requestId, "2");
	const request = await approverService.getRequestById(requestId);

	console.log(request);

	try {
		await approverService.approveRequest(generateUUID(), "2");
	} catch (error) {
		console.log(error);
	}
};

main();
