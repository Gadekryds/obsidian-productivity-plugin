import {Status, STATUS_LIST} from "ProductivityTypes";

export const GetNextStatus = (status: string) => {
	const index = STATUS_LIST.findIndex(x => x === status) + 1 % STATUS_LIST.length;
	return STATUS_LIST[index];
}

export const GetPreviousStatus = (status: Status) => {
	const index = STATUS_LIST.findIndex(x => x === status);
	if (index == 0) return STATUS_LIST[index];
	return STATUS_LIST[index - 1];
}
