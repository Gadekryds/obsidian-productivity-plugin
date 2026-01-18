import { TaskModel } from "./CreateTaskModal";
import { Notice, moment, App, TFile } from "obsidian";
import ProductivityPlugin from "main";
import { FileExists, GenerateFilePath, IsEmpty, NormalizedPath } from "../../Utils/Helpers";

export async function createTaskFile(plugin: ProductivityPlugin, task: TaskModel) {
	const fallbackPath = NormalizedPath(plugin.settings.fallbackTaskLocation);
	const app = plugin.app;

	await EnsureFallbackPathAvailability(fallbackPath, app);
	if (IsEmpty(task.taskName) || FileExists(app, task.project, task.taskName, fallbackPath)) {
		FailureNotice();
		return;
	}
	SuccessNotice(task);
	const fileName = GenerateFilePath(app, task.taskName, task.project, fallbackPath);
	const file = await app.vault.create(fileName, '')
	await AppendProperties(file, app, task);
	await app.workspace.getLeaf('split').openFile(file);

}

const AppendProperties = async (file: TFile, app: App, task: TaskModel) => {
	await app.fileManager.processFrontMatter(file, (frontmatter: { [x: string]: string; }) => {
		frontmatter["kind"] = "Task";
		frontmatter["due"] = task.due ? task.due : moment().add(1, "day").format('YYYY-MM-DD');
		if (!IsEmpty(task.project)) {
			frontmatter["project"] = task.project;
		}
		frontmatter["status"] = "New";
	});
}

const EnsureFallbackPathAvailability = async (fallbackPath: string, app: App) => {
	if (!app.vault.getAbstractFileByPath(fallbackPath)) {
		await app.vault.createFolder(fallbackPath);
	}
}

const FailureNotice = () => {
	const fragment = document.createDocumentFragment();
	const failure = document.createElement("p");
	failure.appendText("Task name must not be empty and location unique");
	fragment.appendChild(failure);
	new Notice(fragment);
}

const SuccessNotice = (task: TaskModel) => {
	const fragment = document.createDocumentFragment();
	const ul = document.createElement("ul");
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
