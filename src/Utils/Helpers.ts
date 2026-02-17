import {App, moment} from 'obsidian';


export const IsEmpty = (str: string) => (!str?.length);
export const NormalizedPath = (path: string): string => (!IsEmpty(path) && path.startsWith("/") ? path.slice(1) : path);

export const FileExists = (app: App, projectRoot: string, project: string, fileName: string, fallbackPath: string) => {
	const path = GenerateFilePath(projectRoot, fileName, project, fallbackPath);
	return app.vault.getAbstractFileByPath(path) !== null;
}

export const GenerateFilePath = (projectRoot: string, fileName: string, project: string, fallbackPath: string, useTimestamp = false): string => {

	const location = BuildBasePath(projectRoot, fallbackPath, project);
	let file = `${location}/${fileName}.md`;
	if (useTimestamp) {
		file = file.replace('.md', '');
		file += ` ${moment().format('DD-MM-YYYY')}.md`;
	}
	return file;
}

const BuildBasePath = (projectRoot: string, fallbackPath: string, project: string): string => {

	if (!IsEmpty(project)) {
		return `${projectRoot}/${project}/tasks`;
	}
	return fallbackPath;
}
