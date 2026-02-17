import {normalizePath} from 'obsidian';

export interface ProductivityPluginSetting {
	fallbackTaskLocation: string;
	dashboardPath: string;
	root: string;
	openWhenEmpty: boolean;
	setHotkeys: boolean;
	dashboardTemplate: string;
	projectFileTemplate: string;
	projectPath: string;

	getFallbackTaskLocation(): string;

	getProjectPath(): string;
}

export const DEFAULT_SETTINGS: ProductivityPluginSetting = {
	fallbackTaskLocation: '/tasks',
	dashboardPath: 'dashboard',
	root: '',
	openWhenEmpty: true,
	setHotkeys: true,
	dashboardTemplate: '',
	projectFileTemplate: '',
	projectPath: '/projects',
	getFallbackTaskLocation(): string {
		return this.root + this.fallbackTaskLocation;
	},
	getProjectPath(): string {
		return this.projectPath.includes(this.root)
			? this.projectPath : normalizePath(this.root + this.projectPath);
	}
}
