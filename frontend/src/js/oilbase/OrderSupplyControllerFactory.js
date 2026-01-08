import { OrderSupplyModel } from '/js/oilbase/models/OrderSupplyModel.js';
import { OrderSupplyView } from '/js/oilbase/views/OrderSupplyView.js';
import { OrderSupplyController } from '/js/oilbase/controllers/OrderSupplyController.js';

export class OrderSupplyControllerFactory {
    constructor(helpers) {  // Принимаем Helpers
        this.helpers = helpers;

        console.log('OrderSupplyControllerFactory');
    }

    create(data) {
        console.log('OrderSupplyControllerFactory create');
        const model = new OrderSupplyModel(data, this.helpers);
        const view = new OrderSupplyView(this.helpers);
        return new OrderSupplyController(model, view);
    }
}