import "obsidian";
import {App, Command, Plugin, SplitDirection } from "obsidian";

declare module "obsidian" {
	interface WorkspaceLeaf {
		parentSplit: WorkspaceSplit;
	}

	interface WorkspaceSplit {
		children: WorkspaceItem[];
		direction: SplitDirection;
	}

	interface WorkspaceItem {
		children: WorkspaceItem[];
	}

	interface App {
		commands: UnsafeCommands;
		plugins: UnsafePlugins;
	}
}

export interface UnsafePlugins {
	app: App
	plugins: Record<string, Plugin>
}


export interface UnsafeCommands {
	app: App
	commands: Record<string, Command>
	editorCommands: Record<string, Command>
	addCommand(command: Command): void
	executeCommand(command: Command): boolean
	listCommands(): Command[]
	findCommand(id: string): Command
	removeCommand(id: string): void
	executeCommandById(id: string): boolean
}
