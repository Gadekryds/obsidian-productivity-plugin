import ProductivityPlugin from "main";
import { ProductivityPluginSetting } from './ProductivityPluginSetting';
import {PluginSettingTab, Setting} from 'obsidian';

export class ProductivityPluginSettingsTab extends PluginSettingTab {
	plugin: ProductivityPlugin;

	constructor(plugin: ProductivityPlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Plugin root")
			.setDesc("The root of the productivity plugin")
			.addText(text =>
				text.setValue(this.plugin.settings.root)
					.onChange(async (value) => {
						this.plugin.settings.root = value;
						await this.plugin.saveSettings();
					})
			)
		new Setting(containerEl)
			.setName("Dashboard path")
			.setDesc("Path to the dashboard page")
			.addText(text =>
				text.setValue(this.plugin.settings.dashboardPath)
					.onChange(async (value) => {
						this.plugin.settings.dashboardPath = value;
						await this.plugin.saveSettings();
					})
			)

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

		new Setting(containerEl)
			.setName("Set hotkeys")
			.setDesc("Productivity comes with a set of default hotkeys. If enabled, it'll try to set these.")
			.addToggle(toggle =>
				toggle.setValue(this.plugin.settings.setHotkeys)
					.onChange(async (value) => {
						this.plugin.settings.setHotkeys = value;
						await this.plugin.saveSettings();
					})
			)

		new Setting(containerEl)
			.setName("Drawing template path")
			.setDesc("Fill this field, if you want to use a drawing template")
			.addText(text =>
				text.setValue(this.plugin.settings.dashboardTemplate)
					.onChange(async (value) => {
						this.plugin.settings.dashboardTemplate = value;
						await this.plugin.saveSettings();
					})
			)
	}
}
