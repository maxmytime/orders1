import { AppView } from '/js/oilbase/views/AppView.js';
import { Helpers } from '/js/oilbase/utils/Helpers.js';

export class OrderSupplyModalView extends AppView {
    constructor() {
        super();
        this.container = document.querySelector('.app-oilbase');     // Контейнер приложения
        this.modalOrderSupply = null;
        this.helpers = new Helpers();
        console.log('OrderSupplyModalView');
    }

    // Рендер модальных окон
    renderModal() {
        console.log('renderModal OrderSupply');
        this.modalOrderSupply = this.getTemplate('modal-order-supply').cloneNode(true);
        this.container.appendChild(this.modalOrderSupply);
    }

    open() {
        console.log(this.modalOrderSupply);
        this.modalOrderSupply.classList.add('is-active');
    }

    getContainer() {
        return this.container;
    }

}