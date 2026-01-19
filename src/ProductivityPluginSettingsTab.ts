import MyPlugin from 'main';
import { PluginSettingTab, App, Setting } from 'obsidian';

export interface ProductivityPluginSetting {
	fallbackTaskLocation: string;
}

export const DEFAULT_SETTINGS: ProductivityPluginSetting = {
	fallbackTaskLocation: '/tasks'
}


export class ProductivityPluginSettingsTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Fallback task location")
			.setDesc("Where to save tasks if not other rules apply")
			.addText(text =>
				text.setValue(this.plugin.settings.fallbackTaskLocation)
					.onChange(async (value) => {
						this.plugin.settings.fallbackTaskLocation = value;
						await this.plugin.saveSettings();
					})
			)
	}
}
