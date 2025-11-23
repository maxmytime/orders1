import { BasisModel } from '/js/oilbase/models/BasisModel.js';
import { BasisView } from '/js/oilbase/views/BasisView.js';
import { BasisController } from '/js/oilbase/controllers/BasisController.js';
import { PartControllerFactory } from '/js/oilbase/PartControllerFactory.js';
import { TankControllerFactory } from '/js/oilbase/TankControllerFactory.js';

export class BasisControllerFactory {
    constructor() {  // Принимаем Helpers
        this.partControllerFactory = new PartControllerFactory();
        this.tankControllerFactory = new TankControllerFactory();

    }

    create(basisData) {
        const model = {
            'basiss': basisData,
        };
        const view = new BasisView();
        return new BasisController(model, view, '', this.partControllerFactory, this.tankControllerFactory);
    }

}