import {Modal, App, Setting} from 'obsidian';
import {FileExists, IsEmpty} from '../../Utils/Helpers';

const taskNameValue = "Task name";

export class TaskModel {
	constructor(task: string, project: string, due: string) {
		this.taskName = task;
		this.project = project;
		this.due = due;
	}

	taskName: string;
	project: string;
	due: string;
}

export class CreateTaskModal extends Modal {
	constructor(app: App, projects: Set<string>, fallbackPath: string, onSubmit: (task: TaskModel) => Promise<void>) {
		super(app);
		this.onSubmit = onSubmit;
		const list = Array.from(projects).filter(x => !IsEmpty(x));
		this.projects = ["", ...list];
		this.fallbackPath = fallbackPath;
	}

	fallbackPath: string;
	projects: string[];
	onSubmit: (task: TaskModel) => Promise<void>;

	onOpen() {
		let taskName = "";
		let project = this.projects[0];
		let due = "";

		this.contentEl.createEl("h1", {text: "Create task"});

		const taskNameSetting = new Setting(this.contentEl)
			.setName(taskNameValue)
			.addText(text => {
				text.onChange(value => {
					taskName = value;
					const errorSpan = taskNameSetting.nameEl.querySelector(".error-asterisk");
					if (errorSpan) {
						errorSpan.remove();
					}
					taskNameSetting.setDesc("");
				})
			});


		let showProjects = true;
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile) {
			const cache = this.app.metadataCache.getFileCache(activeFile);
			if (cache?.frontmatter && cache.frontmatter["project"]) {
				project = (cache.frontmatter["project"] as string);
				showProjects = false;
			}
		}

		if (showProjects) {
			new Setting(this.contentEl)
				.setName("Pick project")
				.addDropdown(dd => {
					this.projects.forEach(element => {
						dd.addOption(element, element);
					})
					dd.onChange(val => {
						project = val
					})
				});
		}

		new Setting(this.contentEl)
			.setName("Due date")
			.addText(text => {
				text.inputEl.type = "date"
				text.onChange(value => {
					due = value;
				});
			});

		const submit = (evt: MouseEvent | KeyboardEvent) => {
			if (evt instanceof KeyboardEvent && evt.key !== "Enter") {
				return;
			}
			if (IsEmpty(taskName)) {
				SetErrorMessage(taskNameSetting, "Task name is required.");
				return;
			}
			if (FileExists(this.app, project!, taskName, this.fallbackPath)) {
				SetErrorMessage(taskNameSetting, "File already exists.");
				return;
			}

			evt.preventDefault();
			this.close();
			this.onSubmit(new TaskModel(taskName, project!, due)).catch((err) => {
				console.error(err)
			});
		}

		new Setting(this.contentEl)
			.setName("Submit")
			.addButton(cb => cb.onClick(submit)
				.buttonEl.innerText = "Submit")

		// Listen for Enter key
		this.contentEl.addEventListener("keydown", submit);
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

const SetErrorMessage = (el: Setting, msg: string) => {
	el.setName(taskNameValue);
	el.nameEl.createEl("span", {text: "*", cls: "error-asterisk", attr: {style: "color: red;"}});
	el.setDesc(msg);
}
