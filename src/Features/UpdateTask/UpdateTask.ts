import {App, Notice, View} from "obsidian";
import {UpdateTaskModal, UpdateTaskModel} from "./UpdateTaskModal";
import ProductivityPlugin from "main";
import {Status, STATUS_LIST} from '../../Utils/Status';

const GetNextStatus = (status: string) => {
	const index = STATUS_LIST.findIndex(x => x === status) + 1 % STATUS_LIST.length;
	return STATUS_LIST[index];
}

const GetPreviousStatus = (status: Status) => {
	const index = STATUS_LIST.findIndex(x => x === status);
	if (index == 0) return STATUS_LIST[index];
	return STATUS_LIST[index - 1];
}

export function addUpdateTaskCommand(plugin: ProductivityPlugin) {
	plugin.addCommand({
		id: 'update-task',
		name: "Update task",
		callback: () => {
			new UpdateTaskModal(plugin.app, async (task: UpdateTaskModel) => {
				await updateTask(plugin.app, task);
			}).open();
		}
	})
}

export async function updateTask(app: App, task: UpdateTaskModel) {
	await app.fileManager.processFrontMatter(task.file, (frontmatter: { [x: string]: string; }) => {
		frontmatter["status"] = GetNextStatus(frontmatter["status"] as Status)!;
	});
}

export function addUpdateStatusCommand(plugin: ProductivityPlugin) {
	plugin.addCommand({
		id: "update-task-status",
		name: "Update task status",
		callback: () => {
			const leaf = plugin.app.workspace.getActiveViewOfType(View);
			const root = leaf?.containerEl;

			if (root) {
				updateSelectedRowStatus(root, "Forward");
			}
		}
	})

	plugin.addCommand({
		id: "update-task-status-reverse",
		name: "Update task status reverse",
		callback: () => {
			const leaf = plugin.app.workspace.getActiveViewOfType(View);
			const root = leaf?.containerEl;

			if (root) {
				updateSelectedRowStatus(root, "Backwards");
			}
		}
	})
}

function updateSelectedRowStatus(root: HTMLElement, direction: Direction) {
	const basesRoot = (root.querySelector('.bases-view') as HTMLElement) ?? root;
	let focused: HTMLElement | null = null;
	const focusedInBases = basesRoot.querySelector(':focus');
	if (focusedInBases instanceof HTMLElement) {
		focused = focusedInBases;
		const row = selectRow(focused);
		if (!row) {
			new Notice("Select an editable member of a  row")
			return;
		}
		const cell = row?.querySelector('[data-property="note.status"]');
		const el = cell?.querySelector(".metadata-input-longtext");
		const newStatus = direction === "Forward" ? GetNextStatus(el?.getText() as Status) : GetPreviousStatus(el?.getText() as Status);
		if (newStatus === undefined) return;
		el?.setText(newStatus);
	}
}

function selectRow(focused: HTMLElement): HTMLElement | null {
	if (focused.classList.contains("bases-table-container")) {
		return getActiveBasesRowFromActiveCell(focused);
	}

	return getActiveBasesRowFromEditingCell(focused);
}

function getActiveBasesRowFromEditingCell(focused: HTMLElement): HTMLDivElement | null {
	let depth = 0;
	let current = focused;
	while (depth < 3) {
		depth++;
		const parent = current.parentNode as HTMLElement;
		if (parent && parent.classList.contains("bases-tr")) {
			return parent as HTMLDivElement;
		}
		current = parent;
	}
	return null;
}

function getActiveBasesRowFromActiveCell(focused: HTMLElement): HTMLDivElement | null {
	if (!focused) return null;

	const activeCell = focused.querySelector<HTMLElement>(".bases-table-active-cell");
	if (!activeCell) return null;

	const tbody = activeCell.closest(".bases-tbody");
	if (!tbody) return null;

	const rows = Array.from(tbody.querySelectorAll<HTMLDivElement>(".bases-tr"));
	const activeRect = activeCell.getBoundingClientRect();
	const y = activeRect.top + activeRect.height / 2;

	return (
		rows.find((row) => {
			const r = row.getBoundingClientRect();
			return y >= r.top && y <= r.bottom;
		}) ?? null
	);
}

type Direction = "Forward" | "Backwards";
