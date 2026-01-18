import ProductivityPlugin from "main";
import { createTaskFile } from "./CreateTask";
import { CreateTaskModal, TaskModel } from "./CreateTaskModal";

export function addCreateTaskCommand(plugin: ProductivityPlugin, projects: Set<string>) {
    plugin.addCommand({
        id: 'create-task',
        name: 'Create Task',
        callback: () => {
            new CreateTaskModal(plugin.app, projects, plugin.settings.fallbackTaskLocation, async (task: TaskModel) => {
                await createTaskFile(plugin, task);
            }).open();
        }
    });
}
