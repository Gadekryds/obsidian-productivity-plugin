import {App} from "obsidian";
import {UpdateTaskModal, UpdateTaskModel} from "./UpdateTaskModal";
import ProductivityPlugin from "main";
import {GetNextStatus} from "./UpdateUtils";
import {ProductivityCommand, Status} from "../../ProductivityTypes";


export function addUpdateTaskCommand(plugin: ProductivityPlugin): ProductivityCommand {
	return {
		hotkey: "Ctrl+U",
		command: {
			id: 'update-task',
			name: "Update task",
			callback: () => {
				new UpdateTaskModal(plugin.app, async (task: UpdateTaskModel) => {
					await updateTask(plugin.app, task);
				}).open();
			}
		}
	}
}

export async function updateTask(app: App, task: UpdateTaskModel) {
	await app.fileManager.processFrontMatter(task.file, (frontmatter: { [x: string]: string; }) => {
		frontmatter["status"] = GetNextStatus(frontmatter["status"] as Status)!;
	});
}
