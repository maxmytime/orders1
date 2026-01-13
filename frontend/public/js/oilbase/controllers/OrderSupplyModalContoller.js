import { ApiClient } from '/js/oilbase/models/ApiClient.js';

export class OrderSupplyModalContoller {
    constructor(modelApp,
        orderSupplyModalModel,
        orderSupplyModalView,
        partDistributedModalController,
        helpers,
        socket) {
        this.modelApp = modelApp;
        this.model = orderSupplyModalModel;
        this.view = orderSupplyModalView;
        this.partDistributedModalController = partDistributedModalController;
        this.api = new ApiClient();
        this.helpers = helpers;
        this.socket = socket.socket;

        console.log('OrderSupplyModalContoller');
        // Контроллер подписывается на событие ввода данных в поле Базис,
        // this.view.getContainer().addEventListener('input', this.dropdown.bind(this));
        // Контроллер подписывается на событие добавление новой секции
        this.view.getContainer().addEventListener('click', this.addSection.bind(this));
        // Контроллер подписывается на событие удалить секцию
        this.view.getContainer().addEventListener('click', this.delSection.bind(this));
        // Контроллер подписывается на событие открытие модального окна распределения заявки
        this.view.getContainer().addEventListener('click', this.openPartDistributed.bind(this));
        // Контроллер подписывается на событие клик по кнопки создать заявка снабжение
        // this.view.getContainer().addEventListener('click', this.open.bind(this));
        // Контроллер подписывается на событие клик по кнопке закрыть модальное окно
        this.view.getContainer().addEventListener('click', this.close.bind(this));
        // Контроллер подписывается на событие клик по кнопке создать заявку снабжения
        this.view.getContainer().addEventListener('click', this.createOrderSupply.bind(this));

    }

    // Открыть модальное окно
    open(e) {
        const basisID = this.view.getBasisID(e);
        const tanksList = this.modelApp.getListTanks(basisID);
        const partsList = this.modelApp.getListUndistributedParts(basisID);
        const basisName = this.modelApp.getBasisName(basisID);
        this.view.open(basisID, basisName, tanksList, partsList);
    }

    close(e) {
        if (e.target.classList.contains('delete-modal')) {
            const modal = e.target.closest('.modal-order-supply');
            if (modal) {
                this.view.close();
            }
        }

    }

    // Добавить секциию
    addSection(e) {
        if (e.target.classList.contains('btn-add-section')) {
            console.log('addSection(e)');
            this.view.addSection(e);
        }
    }

    // Удалить секцию
    delSection(e) {
        if (e.target.classList.contains('btn-del-section')) {
            console.log('delSection(e)');
            this.view.delSection(e);
        }
    }

    // Создать заявку снабжение
    createOrderSupply(e) {
        if (e.target.classList.contains('btn-create-order-supply')) {
            const docObject = this.view.getDocObject(e);
            console.log(docObject);
        }
    }

    // Открыть заявку для распределение
    openPartDistributed(e) {
        const container = e.target.closest('.order-supply-undistributed-part');

        if (container) {
            this.partDistributedModalController.open();
        }
    }

    // Инициализация модальных окон
    init() {
        this.view.renderModal(this.model);
    }
}