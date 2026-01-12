export class PartDistributedModalController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        console.log('PartDistributedModalController');

        // Контроллер подписывается на события
        // this.view.getContainer().addEventListener('click', this.openModal.bind(this));
    }

    // Открыть модальное окно
    open() {
        this.view.open();
    }


    // Инициализация модальных окон
    init() {
        this.view.renderModal(this.model);
    }
}