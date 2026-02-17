import ProductivityPlugin from "main";
import {ProductivityCommand} from "ProductivityTypes";
import {CreateProjectModal} from "./CreateProjectModal";
import {Status} from "../../ProductivityTypes";
import {TFile, normalizePath} from "obsidian";
import {CreateDrawingForNote} from "../CreateDrawing/CreateDefaultDrawing";

export type CreateProjectTask = {
	projectName: string;
	description: string;
	status: Status;
	createWhiteboard: boolean;
	tags: string[];
}

export function addCreateProjectCommand(plugin: ProductivityPlugin): ProductivityCommand {
	return {
		hotkey: "Alt+P",
		command: {
			id: 'create-project',
			name: 'Create project',
			callback: () => {
				new CreateProjectModal(plugin, async (task: CreateProjectTask) => {
					const newProject = await createProject(plugin, task);
					if (newProject) {
						plugin.addProject(newProject);
					}
				}).open();

			}
		}
	}
}

const createProject = async (plugin: ProductivityPlugin, task: CreateProjectTask): Promise<string> => {

	const projectFolder = normalizePath(plugin.settings.root + "/" + task.projectName)
	if (plugin.app.vault.getAbstractFileByPath(projectFolder) === null) {
		console.debug('Creating project root.');
		await plugin.app.vault.createFolder(projectFolder);
	}

	const projectTasksFolder = normalizePath(projectFolder + "/tasks");
	if (plugin.app.vault.getAbstractFileByPath(projectFolder) === null) {
		console.debug('Creating project tasks folder.');
		await plugin.app.vault.createFolder(projectFolder);
	}

	const projectFile = normalizePath(projectFolder + "/" + task.projectName + ".md");
	if (plugin.app.vault.getAbstractFileByPath(projectFile) === null) {
		const projectFileTemplate = plugin.app.vault.getFileByPath(plugin.settings.projectFileTemplate);
		const data = projectFileTemplate instanceof TFile ? await plugin.app.vault.read(projectFileTemplate) : '';
		console.debug('Creating project file.');
		const created = await plugin.app.vault.create(projectFile, data);
		await CreateDrawingForNote(plugin, projectFolder, created.name);
	}

	return task.projectName;
}
