import { Plugin } from 'obsidian';
import { ProductivityPluginSetting, ProductivityPluginSettingsTab, DEFAULT_SETTINGS } from 'ProductivityPluginSettingsTab';
import { getProjects } from 'Utils/Helpers';
import { addCreateTaskCommand } from 'Features/CreateTask/CreateTaskCommand';
import { addUpdateStatusCommand, addUpdateTaskCommand } from 'Features/UpdateTask/UpdateTask';
import { addCreateProjectCommand } from 'Features/CreateProject/CreateProject';
import { addCreateDocumentationCommand } from 'Features/CreateLearning/CreateLearning';


export default class ProductivityPlugin extends Plugin {
	settings: ProductivityPluginSetting;
	private projects: Set<string>;

	async onload() {
		await this.loadSettings();

		this.projects = getProjects();
		addCreateTaskCommand(this, this.projects);
		addUpdateTaskCommand(this);
		addCreateDocumentationCommand(this);
		addCreateProjectCommand(this, this.projects);
		addUpdateStatusCommand(this);

		this.addSettingTab(new ProductivityPluginSettingsTab(this.app, this));
	}

	onunload() { }

	addProject(project: string) {
		if (this.projects.has(project)) return;
		this.projects.add(project);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


}


