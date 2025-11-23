import { PartModel } from '/js/oilbase/models/PartModel.js';
import { PartView } from '/js/oilbase/views/PartView.js';
import { PartController } from '/js/oilbase/controllers/PartController.js';

export class PartControllerFactory {
    constructor(helpers) {  // Принимаем Helpers
        this.helpers = helpers;
    }

    create(partData, container, index) {
        const model = new PartModel(partData, this.helpers);
        const view = new PartView(container, this.helpers);
        return new PartController(model, view, index);
    }
}