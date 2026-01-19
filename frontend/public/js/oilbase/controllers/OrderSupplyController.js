export class OrderSupplyController {
    constructor(modal, view) {
        this.model = modal;
        this.view = view;

        // console.log('OrderSupplyController');
        // Контроллер подписывается на событие выбора региона в меню
        // this.view.getContainer().addEventListener('click', this.choosingRegion.bind(this));

    }

    render(orderSupply) {
        return this.view.render(orderSupply);
    }

}