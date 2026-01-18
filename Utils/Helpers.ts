import { App, TFile, moment } from 'obsidian';

export function getProjects(): Set<string> {
    const projectValues = new Set<string>();

    const files = this.app.vault.getMarkdownFiles().filter((file: TFile) =>
        this.app.metadataCache.getFileCache(file)?.frontmatter?.kind === 'Project');
    files.forEach((element: TFile) => {
        const cache = this.app.metadataCache.getFileCache(element);
        const val = cache?.frontmatter.project;
        if (val) {
            if (Array.isArray(val)) {
                val.forEach(el => projectValues.add(el));
            }
            else {
                projectValues.add(val);
            }
        }
    });
    console.log(projectValues);
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
