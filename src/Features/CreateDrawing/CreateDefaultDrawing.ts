import ProductivityPlugin from "main";
import {Hotkey, Notice, moment} from "obsidian";
import { ProductivityCommand } from "ProductivityTypes";

interface ObsidianApp {
	plugins: {
		plugins: Record<string, unknown>;
	};
}

interface ExcalidrawPlugin {
	createDrawing(
		filename: string,
		location: string,
		content: string | null,
		openNewPane: boolean
	): Promise<string>;
}


export const CreateDrawingForNote = async (plugin: ProductivityPlugin, folder: string, name?: string) => {
	const excalidrawPlugin = (plugin.app as ObsidianApp).plugins.plugins['obsidian-excalidraw-plugin'] as ExcalidrawPlugin;

	if (!excalidrawPlugin) {
		new Notice('Excalidraw plugin is not installed or enabled');
		return null;
	}

	const current = plugin.app.workspace.getActiveFile();
	const path = current?.parent?.path ?? folder;
	const fileName = current?.name ?? name ?? moment(moment.now()).format("YYYY-MM-DD") + "- Drawing"
	const template = plugin.settings.dashboardTemplate != '' ? plugin.app.vault.getFileByPath(plugin.settings.dashboardTemplate) : null;

	let fileContent: string | null = null;
	if (template) {
		fileContent = await plugin.app.vault.read(template);
	}

	try {
		return await excalidrawPlugin.createDrawing(fileName, path, fileContent, false);

	} catch (error) {
		console.error('Error creating drawing:', error);
		new Notice('Failed to create Excalidraw drawing');
		return null;
	}
}

export const addDrawingCommand = (plugin: ProductivityPlugin) : ProductivityCommand | undefined => {

	const excalidrawPlugin = (plugin.app as ObsidianApp).plugins.plugins['obsidian-excalidraw-plugin'] as ExcalidrawPlugin;
	if (!excalidrawPlugin) {
		return;
	}

	return {
		command: {
			id: 'create-drawing',
			name: 'Create drawing',
			callback: async () => {
				await CreateDrawingForNote(plugin, plugin.settings.dashboardTemplate);
			}
		},
		hotkey: "Alt+D"
	}
}
