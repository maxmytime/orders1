import { ArchiveModel } from '/js/oilbase/archive/ArchiveModel.js';
import { ArchiveView } from '/js/oilbase/archive/ArchiveView.js';
import { ArchiveController } from '/js/oilbase/archive/ArchiveController.js';

export class ArchiveControllerFactory {
    constructor(helpers) {  // Принимаем Helpers
        this.helpers = helpers;
    }

    create(data) {
        const model = new ArchiveModel(data, this.helpers);
        const view = new ArchiveView(this.helpers);
        return new ArchiveController(model, view);
    }
}