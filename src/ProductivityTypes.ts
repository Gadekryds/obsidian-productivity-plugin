import { Command } from "obsidian";

export const STATUS_LIST = ["New", "In Progress", "Done"] as const;
export type Status = typeof STATUS_LIST[number];

export const AUDIENCE_LIST = ["Any", "Dev", "Non Technical"];
export type Audiences = typeof AUDIENCE_LIST[number];

export const KIND_LIST = ["Task", "Documentation", "Project", "Drawing"]
export type Kinds = typeof KIND_LIST[number];

export type ProductivityCommand = {
	hotkey: string,
	command: Command
}
