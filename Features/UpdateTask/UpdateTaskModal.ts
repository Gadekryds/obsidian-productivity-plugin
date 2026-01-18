import { App, Modal, Setting, TFile } from "obsidian";
import { createSearchElement } from "../../Utils/Components/Search/SearchElement";
import { IsEmpty } from "../../Utils/Helpers";

export class UpdateTaskModel {
	file: TFile;

	constructor(file: TFile) {
		this.file = file;
	}
}

export class UpdateTaskModal extends Modal {
	constructor(app: App, onSubmit: (task: UpdateTaskModel) => void) {
		super(app);
		this.onSubmit = onSubmit;

		const files = this.app.vault.getMarkdownFiles();
		console.log(files);
		this.statusFiles = files.filter((file) => {
			const cache = this.app.metadataCache.getFileCache(file);
			return cache?.frontmatter?.kind === 'Task' && cache?.frontmatter?.status !== 'Done';
		})
		console.log(this.statusFiles);
	}

	statusFiles: TFile[];
	onSubmit: (task: UpdateTaskModel) => void;

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	onOpen() {
		let searchResults: TFile[];

		this.contentEl.createEl("h1", { text: "Update Task" });


		new Setting(this.contentEl)
			.setName("Find file")
			.addSearch(s => {
				s.onChange(async (value) => {
					searchResults = this.searchByStatus(value);
					this.displayElements(searchResults, value);

				});
			})

		this.displayElements(this.statusFiles, '');
	}
	searchByStatus(value: string) {
		return IsEmpty(value) ? this.statusFiles :
			this.statusFiles.filter((file) =>
				file.path.match(value));
	}

	displayElements(searchResults: TFile[], value: string) {
		const resultsDiv = (this.contentEl.querySelector(".status-results")
			?? this.contentEl.createDiv("status-results")) as HTMLElement;
		resultsDiv?.empty();
		searchResults?.slice(0, 5).forEach((file) => {

			createSearchElement(resultsDiv, file, (selectedFile) => {
				this.onSubmit(new UpdateTaskModel(selectedFile));
				this.close();
			})
		})
	}
}
