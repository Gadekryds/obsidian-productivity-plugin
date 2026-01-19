import {App, TFile, moment, CachedMetadata} from 'obsidian';

export function getProjects(app: App): Set<string> {
	const projectValues = new Set<string>();

	const files = app.vault.getMarkdownFiles().filter((file: TFile) =>
		app.metadataCache.getFileCache(file)?.frontmatter?.kind === 'Project');
	files.forEach((element: TFile) => {
		const cache = app.metadataCache.getFileCache(element) as CachedMetadata;
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

export const IsEmpty = (str: string) => (!str?.length);
export const NormalizedPath = (path: string): string => (!IsEmpty(path) && path.startsWith("/") ? path.slice(1) : path);

export const FileExists = (app: App, project: string, fileName: string, fallbackPath: string) => {
	const path = GenerateFilePath(app, fileName, project, fallbackPath);
	return app.vault.getAbstractFileByPath(path) !== null;
}

export const GenerateFilePath = (app: App, fileName: string, project: string, fallbackPath: string, useTimestamp = false): string => {

	const location = BuildBasePath(fallbackPath, project);
	let file = `${location}/${fileName}.md`;
	if (useTimestamp) {
		file = file.replace('.md', '');
		file += ` ${moment().format('DD-MM-YYYY')}.md`;
	}
	return file;
}

const BuildBasePath = (fallbackPath: string, project: string): string => {

	if (!IsEmpty(project)) {
		return `projects/${project}/tasks`;
	}
	return fallbackPath;
}
