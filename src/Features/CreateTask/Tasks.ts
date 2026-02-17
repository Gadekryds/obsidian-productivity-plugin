import ProductivityPlugin from "main";
import {TaskModel} from "./CreateTaskModal";
import {FileExists, GenerateFilePath, IsEmpty, NormalizedPath} from "../../Utils/Helpers";
import {App, moment, Notice, TFile} from "obsidian";

export class Tasks {
	constructor(plugin: ProductivityPlugin) {
		this.plugin = plugin;
		this.projects = plugin.projects;
		this.projectPath = plugin.settings.getProjectPath();
		this.fallbackTasksPath = plugin.settings.getFallbackTaskLocation();
	}

	plugin: ProductivityPlugin;
	//pluginRoot: string; // I don't need this as I'm resolving the relative project and fallbackTask paths.
	projectPath: string;
	projects: Set<string>;
	fallbackTasksPath: string;

	async createTaskFile(task: TaskModel) {
		const fallbackPath = NormalizedPath(this.fallbackTasksPath);
		const app = this.plugin.app;

		await this.ensureFallbackPathAvailability(fallbackPath, app);
		if (IsEmpty(task.taskName) || FileExists(app, this.projectPath, task.project, task.taskName, fallbackPath)) {
			this.failureNotice();
			return;
		}
		this.successNotice(task);
		const fileName = GenerateFilePath(this.projectPath, task.taskName, task.project, fallbackPath);
		const file = await app.vault.create(fileName, '')
		await this.appendProperties(file, app, task);
		await app.workspace.getLeaf('split').openFile(file);

	}

	private ensureFallbackPathAvailability = async (fallbackPath: string, app: App) => {
		if (!app.vault.getAbstractFileByPath(fallbackPath)) {
			await app.vault.createFolder(fallbackPath);
		}
	}

	private failureNotice() {
		const fragment = document.createDocumentFragment();
		const failure = document.createElement("p");
		failure.appendText("Task name must not be empty and location unique");
		fragment.appendChild(failure);
		new Notice(fragment);
	}

	private successNotice(task: TaskModel) {
		const fragment = document.createDocumentFragment();
		const ul = document.createElement("ul");
		// eslint-disable-next-line obsidianmd/no-static-styles-assignment
		ul.style.listStyle = "none";

		["Task Name: " + task.taskName,
			"Project: " + task.project,
			"Due Date: " + task.due]
			.forEach(text => {
				const li = document.createElement("li");
				li.textContent = text;
				ul.appendChild(li);
			});

		fragment.appendChild(ul);
		new Notice(fragment);
	}

	private async appendProperties(file: TFile, app: App, task: TaskModel) {
		await app.fileManager.processFrontMatter(file, (frontmatter: { [x: string]: string; }) => {
			frontmatter["kind"] = "Task";
			frontmatter["due"] = task.due ? task.due : moment().add(1, "day").format('YYYY-MM-DD');
			if (!IsEmpty(task.project)) {
				frontmatter["project"] = task.project;
			}
			frontmatter["status"] = "New";
		});
	}
}
