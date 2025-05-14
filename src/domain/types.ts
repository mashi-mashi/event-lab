export type UUID = string & { __brand: "UUID" };
export type UserID = string;
export type EpochMillisecond = number & { __brand: "EpochMillisecond" };

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";

/**
 * 13桁のエポックミリ秒かどうかを判定し、brand型として返す
 */
export function toEpochMillisecond(value: number): EpochMillisecond {
	if (!Number.isInteger(value) || value < 1e12 || value >= 1e13) {
		throw new Error("Invalid epoch millisecond");
	}
	return value as EpochMillisecond;
}
