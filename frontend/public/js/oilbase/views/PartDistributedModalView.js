import { AppView } from '/js/oilbase/views/AppView.js';
import { Helpers } from '/js/oilbase/utils/Helpers.js';

export class PartDistributedModalView extends AppView {
    constructor() {
        super();
        this.container = document.querySelector('.app-oilbase');     // Контейнер приложения
        this.modalPartDistributed = null; // Шаблон модального окна распределение заявки
        this.helpers = new Helpers();
        console.log('PartDistributedModalView');
    }

    // Рендер модальных окон
    renderModal() {
        console.log('renderModal PartDistributedModalView');
        this.modalPartDistributed = this.getTemplate('modal-part-distributed').cloneNode(true);
        this.container.appendChild(this.modalPartDistributed);
    }

    // Открыть модальное окно
    open() {
        this.modalPartDistributed.classList.add('is-active');
    }
}

