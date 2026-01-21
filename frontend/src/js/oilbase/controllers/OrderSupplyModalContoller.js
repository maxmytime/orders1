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

        // console.log('OrderSupplyModalContoller');
        // Контроллер подписывается на событие ввода данных в поле Базис,
        // this.view.getContainer().addEventListener('input', this.dropdown.bind(this));
        // Контроллер подписывается на событие добавление новой секции
        this.view.getContainer().addEventListener('click', this.addSection.bind(this));
        // Контроллер подписывается на событие удалить секцию
        this.view.getContainer().addEventListener('click', this.delSection.bind(this));
        // Контроллер подписывается на событие открытие модального окна распределения заявки
        // this.view.getContainer().addEventListener('click', this.openPartDistributed.bind(this));
        // Контроллер подписывается на событие клик по кнопки создать заявка снабжение
        // this.view.getContainer().addEventListener('click', this.open.bind(this));
        // Контроллер подписывается на событие клик по кнопке закрыть модальное окно
        this.view.getContainer().addEventListener('click', this.close.bind(this));
        // Контроллер подписывается на событие клик по кнопке создать заявку снабжения
        this.view.getContainer().addEventListener('click', this.createOrderSupply.bind(this));
        // Контроллер подписывается на событие клик по кнопке начать распределение в секцию
        this.view.getContainer().addEventListener('click', this.handleStartDistribution.bind(this));

    }

    // Открыть модальное окно
    open(e) {
        const tankID = this.view.getTankID(e);
        const { tank, basisID} = this.modelApp.getTank(tankID);
        console.log(tank);
        const partsList = this.modelApp.getListUndistributedParts(basisID);
        this.view.open(tank, basisID, partsList);
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

    // Распределить заявку в секцию
    handleStartDistribution(e) {
        if (e.target.classList.contains('btn-start-distribution')) {
            console.log('handleStartDistribution(e)');
            this.view.handleStartDistribution(e);
        }
    }

    // Создать заявку снабжение
    async createOrderSupply(e) {
        if (e.target.classList.contains('btn-create-order-supply')) {
            // console.log(e.target);
            const modal = this.view.getModal(e);  // Получаем узел модального окна
            const tankID = this.view.getElementValue(modal, 'select[name="order-supple-tank-name"]'); // Получаем значение поля value у узла
            if (tankID === '-') return;      // Прекращаем выполнение функции если поле емкость не выбрано
            const tankNumber = this.modelApp.getTank(tankID).tank.code;  // Получаем номер емкости
            const docObject = this.view.getDocObject(e, tankNumber);     // Получаем объект документа
            console.log(docObject);
            this.view.getSections(modal);

            const supply = {
                "number": "", //только для изменений, номер заявки снабжения, присваивается при создании
                "type_action_suplorder": 1, //аналогично type_action_order (1 - новая, 2 - обновить данные)
                "type_suplorder": 1,  //тип заявки снабжения, 1 - приход, 2 - расход
                "code_tank": docObject.code_tank, //код емкости
                "date_income": docObject.date_income,  //дата загрузки
                "code_product": docObject.product.code_product,  //код продукта
                "volume": docObject.volume,  //объем
                "weight": docObject.weight,  //вес
                "density": docObject.density,  //плотность
                "commentary": docObject.commentary,
                "array_sections": [...docObject.array_sections].map(section => {
                    return section.array_dispatch.map(part => {
                        return {
                            "sort_number": 1,
                            "name_section": section.name_section,
                            "volume_section": section.volume_section,  //объем секции
                            "number_dispatch": part.number_dispatch    //номер распределенного блока заявки
                        }
                    })
                }).flat(Infinity)
            }

            console.log(supply);

            const status = await this.api.fetchPostData('/postupdatesuplorder', supply);
            console.log(status);
        }
    }

    // Открыть заявку для распределение
    // openPartDistributed(e) {
    //     const container = e.target.closest('.order-supply-undistributed-part');

    //     if (container) {
    //         this.partDistributedModalController.open();
    //     }
    // }

    // Инициализация модальных окон
    init() {
        this.view.renderModal(this.model);
    }
}