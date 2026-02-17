import ProductivityPlugin from "main";
import {Modal, Setting} from "obsidian";
import {CreateProjectTask} from "./CreateProject";


export class CreateProjectModal extends Modal {
	constructor(plugin: ProductivityPlugin, onSubmit: (task: CreateProjectTask) => Promise<void>) {
		super(plugin.app);
		this.plugin = plugin;
		this.projects = plugin.projects;
		this.onSubmit = onSubmit;
	}

	plugin: ProductivityPlugin;
	projects: Set<string>;
	onSubmit: (task: CreateProjectTask) => Promise<void>;


	onOpen() {

		let task: CreateProjectTask = {
			projectName: '',
			description: '',
			createWhiteboard: false,
			status: "New",
			tags: []
		}

		const submit = async (evt: MouseEvent | KeyboardEvent) => {
			if (evt instanceof KeyboardEvent && evt.key !== "Enter") {
				return;
			}

			evt.preventDefault();
			this.close();

			await this.onSubmit(task)
				.catch((err) => {
					console.error(err)
				});
		}

		new Setting(this.contentEl)
			.setName("Create project")
			.setDesc("Pick a project name")
			.addText(text => {
				text.onChange(value => {
					task.projectName = value;
				})
			})

		new Setting(this.contentEl)
			.setName("Summarize the project")
			.addTextArea(text => {
				text.onChange(value => {
					task.description = value;
				})
			})

		new Setting(this.containerEl)
			.setName("Add tags")
			.addText(text => {
				text.onChange(value => {
					task.tags = value.split(',');
				})
			})

		new Setting(this.contentEl)
			.setName("Submit")
			.addButton(btn => {
				btn.onClick(submit)
					.setButtonText("Submit")
					.buttonEl.innerText = "Submit"
			})


	}


}
