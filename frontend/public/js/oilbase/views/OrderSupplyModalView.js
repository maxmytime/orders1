import { AppView } from '/js/oilbase/views/AppView.js';
import { Helpers } from '/js/oilbase/utils/Helpers.js';

export class OrderSupplyModalView extends AppView {
    constructor() {
        super();
        this.container = document.querySelector('.app-oilbase');            // Контейнер приложения
        this.modalOrderSupply = null;                                       // Шаблон модального окна заявки снабжения
        this.orderSupplySection = this.getTemplate('order-supply-section'); // Шаблон секции
        this.helpers = new Helpers();
        console.log('OrderSupplyModalView');
    }

    // Рендер модальных окон
    renderModal() {
        console.log('renderModal OrderSupply');
        this.modalOrderSupply = this.getTemplate('modal-order-supply').cloneNode(true);
        this.container.appendChild(this.modalOrderSupply);
    }

    // Открыть модальное окно
    open() {
        console.log(this.modalOrderSupply);
        this.modalOrderSupply.classList.add('is-active');
    }

    // Добавить секциию
    addSection(e) {
        const container = e.target.closest('.order-supple-sections').
            querySelector('.orderc-supple-sections-container');
        const section = this.orderSupplySection.cloneNode(true);
        container.appendChild(section);
    }

    // Удалить секцию
    delSection(e) {
        const section = e.target.closest('.order-supply-section');
        section.remove();
    }

    getContainer() {
        return this.container;
    }

}