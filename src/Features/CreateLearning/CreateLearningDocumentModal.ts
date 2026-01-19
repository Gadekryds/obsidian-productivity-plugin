import { Modal, App } from "obsidian";
import { CreateLearningDocModel } from "./CreateLearningDocModel";

export class CreateLearningDocumentModal extends Modal {
    app: App;
    onSubmit: (doc: CreateLearningDocModel) => void;
    constructor(app: App, onSubmit: (doc: CreateLearningDocModel) => void) {
       super(app);
       this.onSubmit = onSubmit;
    }
}