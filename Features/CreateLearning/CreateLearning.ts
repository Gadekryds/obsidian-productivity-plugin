import ProductivityPlugin from "main";
import { CreateLearningDocModel } from "./CreateLearningDocModel";
import { CreateLearningDocumentModal } from "./CreateLearningDocumentModal";


const defaultProjectProperties: Map<string, string> = new Map();
defaultProjectProperties.set('kind', 'documentation');
defaultProjectProperties.set('project', '');
defaultProjectProperties.set('status', '');
defaultProjectProperties.set('audience', '');
defaultProjectProperties.set("tags", '');
defaultProjectProperties.set('owner', '');

export function addCreateDocumentationCommand(plugin: ProductivityPlugin) {

    plugin.addCommand({
        id: "create-learning-doc",
        name: "Create learning documentation",
        callback: () => {
            new CreateLearningDocumentModal(plugin.app, (doc: CreateLearningDocModel) => {
                createLearningDocument(doc);
            }).open();
        }
    })
}

function createLearningDocument(doc: CreateLearningDocModel) {

    // 

}
