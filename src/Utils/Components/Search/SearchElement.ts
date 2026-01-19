import { TFile } from "obsidian";

export function createSearchElement(
    container: HTMLElement,
    file: TFile,
    onClick: (file: TFile) => void
): HTMLElement {
    const searchElement = container.createDiv("search-element");
    searchElement.addClass("clickable-item");

    // Make element keyboard accessible
    searchElement.tabIndex = 0;
    searchElement.setAttribute("role", "button");
    searchElement.setAttribute("aria-label", `Select ${file.basename}`);

    searchElement.createEl("div", {
        text: file.basename,
        cls: "search-element-title"
    });

    searchElement.createEl("div", {
        text: file.path,
        cls: "search-element-path"
    });

    searchElement.onclick = () => onClick(file);

    // Handle keyboard navigation
    searchElement.onkeydown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onClick(file);
        }
    };

    return searchElement;
}
