import { TankModel } from '/js/oilbase/models/TankModel.js';
import { TankView } from '/js/oilbase/views/TankView.js';
import { TankController } from '/js/oilbase/controllers/TankController.js';

export class TankControllerFactory {
    constructor(helpers) {  // Принимаем Helpers
        this.helpers = helpers;
    }
    create(tankData, container) {
        const model = new TankModel(tankData, this.helpers);
        const view = new TankView(container, this.helpers);
        return new TankController(model, view);
    }

}