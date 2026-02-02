import { ApiClient } from '/js/oilbase/models/ApiClient.js';

export class OrderSupplyModalContoller {
    constructor(modelApp,
        orderSupplyModalModel,
        orderSupplyModalView,
        partDistributedModalController,
        helpers,
        socket,
        orderSupplyControllerFactory) {
        this.modelApp = modelApp;
        this.model = orderSupplyModalModel;
        this.view = orderSupplyModalView;
        this.partDistributedModalController = partDistributedModalController;
        this.api = new ApiClient();
        this.helpers = helpers;
        this.socket = socket.socket;
        this.orderSupplyControllerFactory = orderSupplyControllerFactory;
        this.dispatchList = [];

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
        // Контроллер подписывается на событие ввода именя секции
        this.view.getContainer().addEventListener('input', this.enterNameSection.bind(this));
        // Контроллер подписывается на событие нажатия кнопки  переименовать секцию
        this.view.getContainer().addEventListener('click', this.handleRenameSection.bind(this));
        // Контроллер подписывается на событие нажатия кнопки  закончить распределение в  секцию
        this.view.getContainer().addEventListener('click', this.handleEndDistribution.bind(this));
        // Контроллер подписывается на событие выбора секции
        this.view.getContainer().addEventListener('change', this.selectSection.bind(this));
        // Контроллер подписывается на событие ввода данных в поле загрузка
        this.view.getContainer().addEventListener('input', this.validationUploadField.bind(this));
        // Контроллер подписывается на событие ввода данных в поле объем в секции
        this.view.getContainer().addEventListener('input', this.volumeInputSection.bind(this));
        // Контроллер подписывается на событие удаления блока из секции
        this.view.getContainer().addEventListener('click', this.handleDeletBlock.bind(this));

    }

    // Открыть модальное окно для создания новой заявки снабжения
    open(e) {
        const tankID = this.view.getTankID(e);
        const { tank, basisID } = this.modelApp.getTank(tankID);
        console.log(tank);
        const partsList = this.modelApp.getListUndistributedParts(basisID);
        this.view.open(tank, basisID, partsList);
    }

    // Открыть модальное окно для редактирования заявки снабжения
    edit(e) {
        console.log('edit');
        const tankID = this.view.getTankID(e);
        const { tank, basisID } = this.modelApp.getTank(tankID);
        const partsList = this.modelApp.getListUndistributedParts(basisID);
        const supplyOrderID = e.target.closest('.order-supply').dataset.id;
        // console.log(supplyOrderID);
        const supplyOrder = this.modelApp.getSupplyOrder(supplyOrderID);
        // console.log(supplyOrder);
        // Запоминаем исходный список распределенных блоков заявки
        this.dispatchList = this.createDispatchList(supplyOrder);


        this.view.edit(tank, basisID, partsList, supplyOrder);
    }

    // Создать список распределенных блоков заявки
    createDispatchList(supplyOrder) {
        let dispatchList = [];
        supplyOrder.array_sections.forEach(section => {
            section.array_dispatch.forEach(dispatch => {
                dispatchList.push({
                    'name_section': section.name_section,
                    'number_dispatch': dispatch.number_dispatch,
                    'volume_dispatch': dispatch.volume_dispatch
                })

            })
        })
        return dispatchList;
    }

    // Создание объекта для обновления списка распределенных блоков заявки
    createObjectUpdate(oldDispatchList, newDispatchList) {
        let objectUpdate = {
            'delete': [],
            'edit': [],
            'create': []
        }


        // Определяем распределенные блоки заявки, которые нужно удалить
        oldDispatchList.forEach(oldDispatch => {
            console.log(oldDispatch);
            const status = newDispatchList.find(newDispach =>
                newDispach.number_dispatch === oldDispatch.number_dispatch);
            if (!status) {
                objectUpdate.delete.push(oldDispatch);
            }
        })

        // Определяем блоки заявки, которые нужно обновить
        oldDispatchList.forEach(oldDispatch => {
            console.log(oldDispatch);
            const newDispach = newDispatchList.find(newDispach =>
                newDispach.number_dispatch === oldDispatch.number_dispatch &&
                newDispach.volume_dispatch !== oldDispatch.volume_dispatch);
            if (newDispach) {
                objectUpdate.edit.push(newDispach);
            }
        })

        // Определяем блоки заявки, которые нужно создать
        objectUpdate.create = newDispatchList.filter(newDispach => newDispach.number_dispatch === '');

        return objectUpdate;
    }

    close(e) {
        if (e.target.classList.contains('delete-modal')) {
            this.dispatchList = [];
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

    // Ввод имяни секции
    enterNameSection(e) {
        if (e.target.name === 'order-supply-name-section') {
            console.log('renameSection(e)');
            console.log(e.target);
            this.view.enterNameSection(e, '123');
        }
    }

    // Кнопка переименовать секцию
    handleRenameSection(e) {
        if (e.target.classList.contains('btn-rename-section')) {
            console.log('handleRenameSection(e)');
            this.view.handleRenameSection(e);
        }
    }

    // Удалить секцию
    delSection(e) {
        if (e.target.classList.contains('btn-del-section')) {
            console.log('delSection(e)');
            this.view.delSection(e);
        }
    }

    // Начало распределения заявки в секцию
    handleStartDistribution(e) {
        if (e.target.classList.contains('btn-start-distribution')) {
            console.log('handleStartDistribution(e)');
            this.view.handleStartDistribution(e);
        }
    }

    // Выбрать секцию
    selectSection(e) {
        if (e.target.name === 'u-part-section') {
            console.log('selectSection(e)');
            this.view.selectSection(e);
        }
    }

    // Конец распределения заявки в секцию
    handleEndDistribution(e) {
        if (e.target.classList.contains('btn-end-distribution')) {
            // console.log('handleEndDistribution(e)');
            const partID = e.target.closest('.order-supply-undistributed-part').dataset.id;
            const part = this.modelApp.getPart(partID).part;
            this.view.handleEndDistribution(e, part);
        }
    }

    // Ввод объема в секции
    volumeInputSection(e) {
        if (e.target.name === 'order-supply-volume') {
            this.view.volumeInputSection(e);
        }
    }

    // Удаляем распределенный блок из секции
    handleDeletBlock(e) {
        if (e.target.classList.contains('btn-del-block')) {
            this.view.handleDeletBlock(e);
        }
    }

    // Создать заявку снабжение
    async createOrderSupply(e) {
        if (e.target.classList.contains('btn-create-order-supply')) {
            // console.log(e.target);
            const modal = this.view.getModal(e);  // Получаем узел модального окна
            const tankID = this.view.getElementID(modal, 'input[name="order-supple-tank-name"]'); // Получаем значение поля value у узла
            const tankNumber = this.modelApp.getTank(tankID).tank.code;  // Получаем номер емкости
            const docObject = this.view.getDocObject(e, tankNumber);     // Получаем объект документа
            console.log(this.createDispatchList(docObject));
            console.log(this.dispatchList);
            console.log(this.createObjectUpdate(this.dispatchList, this.createDispatchList(docObject)));
            // this.view.getSections(modal);

            // Получаем number_dispach для распределенных блоков заявки
            for (const [index, section] of docObject.array_sections.entries()) {
                for (const block of section.array_dispatch) {

                    console.log(block.number_dispatch);

                    const dispatch = {
                        'number': '',                //только для изменений, номер распределенной части, присваивается при создании
                        'type_action_dispatch': 1,   //аналогично type_action_order (1 - новая, 2 - обновить данные, 3 - отгрузить)
                        'type_dispatch': 2,          //тип заявки, 1 - приход, 2 - расход
                        'code_tank': '',      //код емкости docObject.code_tank
                        'date_income': "01010001",             //дата загрузки
                        'date_dispatch': '28.01.2026',         //дата отгрузки part.date_dispatch
                        'code_client': this.modelApp.getPartGuid(block.guid).part.client.code_client,   //код клиента
                        'code_product': docObject.product.code_product,    //код продукта
                        'id_order': this.modelApp.getPartGuid(block.guid).part.id_order,         //номер заказа менеджера
                        'num_address': this.modelApp.getPartGuid(block.guid).part.num_address,   //номер адреса в заявке
                        'num_basis': this.modelApp.getPartGuid(block.guid).part.num_basis,       //номер базиса в заявке
                        'volume': block.volume_dispatch,                   //объем
                        'weight': docObject.weight,                        //вес
                        'density': docObject.density,                      //плотность
                        'commentary': docObject.commentary,
                        'sort_number': index,
                        'guid_orderblock': block.guid
                    }

                    // console.log(dispatch);
                    // const status = await this.api.fetchPostData('/postupdatedispatch', dispatch);
                    // console.log(status.Data);
                    // block.number_dispatch = status.Data;
                }
            }

            // Формируем объект для создания заявки снабжения
            const supply = {
                "number": "", //только для изменений, номер заявки снабжения, присваивается при создании
                "type_action_suplorder": 1, //аналогично type_action_order (1 - новая, 2 - обновить данные)
                "type_suplorder": 1,  //тип заявки снабжения, 1 - приход, 2 - расход
                "code_tank": docObject.code_tank, //код емкости
                "date_income": docObject.date_income,  //дата загрузки
                "code_product": docObject.product.code_product,  //код продукта
                "volume": docObject.volume,    // объем
                "weight": docObject.weight,    // вес
                "density": docObject.density,  // плотность
                "commentary": docObject.commentary,
                "array_sections": docObject.array_sections.map((section, index) => {
                    ++index;
                    if (section.array_dispatch.length) {
                        return section.array_dispatch.map(part => {
                            console.log(part);
                            return {
                                "sort_number": index,
                                "name_section": section.name_section,
                                "volume_section": section.volume_section,  //объем секции
                                "number_dispatch": part.number_dispatch    //номер распределенного блока заявки
                            }
                        })
                    } else {
                        return {
                                "sort_number": index,
                                "name_section": section.name_section,
                                "volume_section": section.volume_section,  //объем секции
                                "number_dispatch": ''    //номер распределенного блока заявки
                            }
                    }

                }).flat(Infinity)
            }

            // console.log(supply);

            // Отправляем данные для создания заявки снабжения
            // const status = await this.api.fetchPostData('/postupdatesuplorder', supply);
            // console.log(status);

            // Добавляем новую заявку снабжения в модель
            // if (status.Status === 'OK') {
            //     docObject.number = status.Data;
            //     const tankID = this.modelApp.addOrderSupply(docObject);

            //     // Рисуем новую заявку снабжения в емкости
            //     if (tankID) {
            //         const orderSupplyController = this.orderSupplyControllerFactory.create(docObject);
            //         orderSupplyController.renderNewOrderSupply(docObject, tankID);
            //     }
            // }
        }

        // this.dispatchList = [];
        // this.view.close();
    }

    // Валидация поля Загрузка
    validationUploadField(e) {
        if (e.target.name === 'u-part-load') {
            console.log('validationUploadField(e)');
            this.view.validationUploadField(e);
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