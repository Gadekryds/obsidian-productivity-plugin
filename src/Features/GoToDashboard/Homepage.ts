import {App, View, normalizePath} from "obsidian";
import ProductivityPlugin from "../../main";
import {LEAF_TYPES} from "./HomepageUtils";
import {ProductivityCommand} from "../../ProductivityTypes";

export class Homepage {
	app: App;
	plugin: ProductivityPlugin;

	constructor(plugin: ProductivityPlugin) {
		this.plugin = plugin;
		this.app = plugin.app;
	}

	async openWhenEmpty(): Promise<void> {
		//if (!this.plugin.loaded || this.plugin.executing) return;
		const leaf = this.app.workspace.getActiveViewOfType(View)?.leaf;

		if (leaf?.getViewState().type !== "empty" ||
			leaf.parentSplit.children.length != 1) return
		await open(this.plugin);
	}
}

const open = async (plugin: ProductivityPlugin): Promise<void> => {
	const file = plugin.app.vault.getFileByPath(plugin.settings.dashboardPath)!;
	const leaf = plugin.app.workspace.getLeaf(false);
	if (leaf.getViewState().type !== "empty")
		leaf.setPinned(true);
	await leaf.openFile(file);
}

export const createDashboardIfMissing = async (plugin: ProductivityPlugin) => {

	const templatePath = `${plugin.manifest.dir}/src/Resources/dashboardTemplate.md`;
	const dashboardPath = normalizePath(plugin.settings.dashboardPath);
	const dashboard = plugin.app.vault.getAbstractFileByPath(dashboardPath);

	if (dashboard === null) {
		console.warn("Creating dashboard");
		await plugin.app.vault.create(plugin.settings.dashboardPath,
			(await plugin.app.vault.adapter.read(templatePath)));
	}
}


const openExisting = async (plugin: ProductivityPlugin): Promise<void> => {
	const leaves = LEAF_TYPES.flatMap(i => plugin.app.workspace.getLeavesOfType(i));
	const dashboard = leaves.filter(l => {
		const filename = (l.view.getState().file as string)
		console.debug(filename)
		return filename === plugin.settings.dashboardPath;
	}).first();

	if (dashboard !== undefined) {
		plugin.app.workspace.setActiveLeaf(dashboard.view.leaf);
	} else {
		await open(plugin);
	}
}

export const addGotoDashboardCommand = (plugin: ProductivityPlugin): ProductivityCommand => {
	return {
		hotkey: "Alt+H",
		command: {
			id: "goto-dashboard",
			name: "Go to dashboard",
			callback: async () => {
				await createDashboardIfMissing(plugin);
				await openExisting(plugin);
			}
		}
	}
}
