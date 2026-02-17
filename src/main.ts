import {Command, Plugin, Platform, Modifier, TFile, CachedMetadata} from 'obsidian';
import {
	ProductivityPluginSetting,
	DEFAULT_SETTINGS
} from './ProductivityPluginSetting';
import {ProductivityPluginSettingsTab} from './ProductivityPluginSettingsTab'
import {addCreateTaskCommand} from './Features/CreateTask/CreateTaskCommand';
import {addUpdateTaskCommand} from './Features/UpdateTask/UpdateTask';
import {addUpdateStatusCommand} from './Features/UpdateTask/UpdateTaskStatus';
import {addCreateDocumentationCommand} from './Features/CreateLearning/CreateLearning';
import {addGotoDashboardCommand, createDashboardIfMissing, Homepage} from './Features/GoToDashboard/Homepage';
import {addDrawingCommand} from "./Features/CreateDrawing/CreateDefaultDrawing";
import {addCreateProjectCommand} from "./Features/CreateProject/CreateProject";
import {Tasks} from "Features/CreateTask/Tasks";

export default class ProductivityPlugin extends Plugin {
	settings: ProductivityPluginSetting;
	projects: Set<string>;
	homepage: Homepage;
	tasks: Tasks;
	usedHotKeys: Set<string> = new Set();
	pluginReady: boolean = false;

	async onload() {
		await this.loadSettings();
		this.projects = this.getProjects();
		this.homepage = new Homepage(this);
		this.tasks = new Tasks(this);
		this.usedHotKeys = this.getUsedHotkeys();
		await this.setupHomepage();
		this.registerCommands();
		this.addSettingTab(new ProductivityPluginSettingsTab(this));
	}

	async setupHomepage() {

		this.app.metadataCache.on('resolved', async () => {
			await this.setStateReady();
		});
		this.registerEvent(this.app.workspace.on("layout-change", this.onLayoutChange));
	}

	onunload() {
		this.app.workspace.off("layout-change", this.onLayoutChange);
	}

	addProject(projectName: string) {
		this.projects.add(projectName);
	}

	registerCommands = () => {

		let commands = [
			addCreateTaskCommand(this.tasks, this.projects),
			addUpdateTaskCommand(this),
			addCreateDocumentationCommand(this),
			...addUpdateStatusCommand(this),
			addGotoDashboardCommand(this),
			addCreateProjectCommand(this)
		]

		const drawingCommand = addDrawingCommand(this);
		if (drawingCommand) {
			commands.push(drawingCommand);
		}
		for (const item of commands) {
			if (!this.usedHotKeys.has(item.hotkey) || !this.settings.setHotkeys) {
				const mods = item.hotkey.split('+');
				const key = mods.pop()!;
				item.command.hotkeys = [{modifiers: mods as Modifier[], key: key}]
				this.usedHotKeys.add(item.hotkey);
			}
			this.addCommand(item.command);
		}

	}

	setStateReady = async () => {
		this.pluginReady = true;
		await createDashboardIfMissing(this);
	}

	onLayoutChange = async (): Promise<void> => {
		if (this.pluginReady) {
			await this.handleHomepage();
		}
	}

	async handleHomepage() {
		if (this.settings.openWhenEmpty) await this.homepage.openWhenEmpty();
	}

	async loadSettings() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	private getUsedHotkeys(): Set<string> {
		const allCommands = this.getCommands();

		const usedHotKeys = new Set<string>();

		const modKey = Platform.isMacOS ? '⌘' : 'Ctrl';
		for (const command of allCommands) {
			if (!command.hotkeys) continue;

			command.hotkeys.forEach(hotkey => {
				let uniqueKey = `${hotkey.modifiers.join('+')}${(hotkey.modifiers.length > 0 ? '+' : '')}${hotkey.key}`;
				uniqueKey = uniqueKey.replace('Mod', modKey);
				usedHotKeys.add(uniqueKey);
			})
		}
		return usedHotKeys;
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private getCommands(): Command[] {
		return Object.values(this.app.commands.commands)
	}

	private getProjects(): Set<string> {
		const projectValues = new Set<string>();

		const files = this.app.vault.getMarkdownFiles().filter((file: TFile) =>
			this.app.metadataCache.getFileCache(file)?.frontmatter?.kind === 'Project');
		files.forEach((element: TFile) => {
			const cache = this.app.metadataCache.getFileCache(element) as CachedMetadata;
			const val: string = cache.frontmatter!.project as string;
			if (val) {
				if (Array.isArray(val)) {
					val.forEach((el: string) => projectValues.add(el));
				} else {
					projectValues.add(val);
				}
			}
		});
		return projectValues;
	}
}
