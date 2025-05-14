import { v4 as uuidv4 } from "uuid";
import {
	toEpochMillisecond,
	type EpochMillisecond,
	type UUID,
} from "../domain/types";

export const generateUUID = (): UUID => {
	return uuidv4() as UUID;
};

export const getCurrentTimestamp = (): EpochMillisecond => {
	return toEpochMillisecond(Date.now());
};
