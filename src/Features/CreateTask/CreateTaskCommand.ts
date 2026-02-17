import {CreateTaskModal, TaskModel} from "./CreateTaskModal";
import {ProductivityCommand} from "ProductivityTypes";
import {Tasks} from "./Tasks";

export function addCreateTaskCommand(tasks: Tasks, projects: Set<string>): ProductivityCommand {
	return {
		command: {
			id: 'create-task',
			name: 'Create task',
			callback: () => {
				new CreateTaskModal(tasks.plugin.app, tasks.projectPath, projects, tasks.fallbackTasksPath, async (task: TaskModel) => {
					await tasks.createTaskFile(task);
				}).open();
			}
		},
		hotkey: "Alt+T"
	}
}
