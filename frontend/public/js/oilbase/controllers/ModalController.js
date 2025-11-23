import { ApiClient } from '/js/oilbase/models/ApiClient.js';

export class ModalController {
    constructor(model, view, partControllerFactory, tankControllerFactory, helpers) {
        this.model = model;
        this.view = view;
        this.api = new ApiClient();
        this.helpers = helpers;
        this.tankControllerFactory = tankControllerFactory;
        this.partControllerFactory = partControllerFactory;

        // Контроллер подписывается на событие ввода данных в поле Базис,
        // при вводе открывается выпадающий список
        this.view.getContainer().addEventListener('input', this.dropdown.bind(this));
        // Выбор пункта элемента списка
        this.view.getContainer().addEventListener('click', this.selectAnItem.bind(this));
        // Валидация поля input. Содержит только число
        this.view.getContainer().addEventListener('input', this.isNumber.bind(this));
        // Добавить новую емкость
        this.view.getContainer().addEventListener('click', this.addNewTank.bind(this));
        // Редактировать емкость
        this.view.getContainer().addEventListener('click', this.updateTank.bind(this));
        // Контроллер подписывается на нажатие кнопки закрыть модальное окно
        this.view.getContainer().addEventListener('click', this.closeModal.bind(this));
        // Контроллер подписывается на нажатие кнопки сохранить часть заявки. Модальное окно
        this.view.getContainer().addEventListener('click', this.savePart.bind(this));
        // Контроллер подписывается на изменение поля Масса и Плотность для расчета Объема
        this.view.getContainer().addEventListener('input', this.volumeСalculation.bind(this));
        // Контроллер подписывается на изменение поля управленчиская и прайсовая себестоимость
        this.view.getContainer().addEventListener('input', this.costLitrСalculation.bind(this));
        // Контроллер подписывается на нажатие кнопки отгрузить
        this.view.getContainer().addEventListener('click', this.shipPart.bind(this));
        // Контроллер подписывается на установку флажка принята полная масса
        this.view.getContainer().addEventListener('change', this.fullWeightChecked.bind(this));
        // Контроллер подписывается на изменения значения полная масса
        this.view.getContainer().addEventListener('input', this.changingValueMassFull.bind(this));
        // Контроллер подписывается на изменения значения полей Масса и Объем для расчета плотности
        this.view.getContainer().addEventListener('input', this.densityСalculation.bind(this));
        // Контроллер подписывается на событие закрития модального окна уведомлений
        this.view.getContainer().addEventListener('click', this.notificationСancellation.bind(this));
        // Контроллер подписывается на событие удалить емкость
        this.view.getContainer().addEventListener('click', this.deleteTank.bind(this));
        // Контроллер подписывается на событие выбора емкости для перемещения
        this.view.getContainer().addEventListener('change', this.setDensityPart.bind(this));
    }


    // Выпадающий список для выбора
    async dropdown(e) {
        if (e.target.name === 'basis') {   // Выбор базисов
            const listBasiss = await this.api.fetchGetData(`/getbasises`);
            this.view.dropdownBasis(e, listBasiss);
        } else if (e.target.name === 'provider' || e.target.name === 'nameClient') {  // Выбор поставщиков
            const listPartner = await this.api.fetchGetData(`/getpartnerslistspec`);
            this.view.dropdownPartner(e, listPartner);
        } else if (e.target.name === 'product') {  // Выбор продукта
            const listProduct = await this.api.fetchGetData(`/getproductslist`);
            this.view.dropdownProduct(e, listProduct);
        }
    }


    // Выбор элемента из выпадающего списка
    selectAnItem(e) {
        if (e.target.classList.contains('droplist-item')) {
            const modal = e.target.closest('.modal-part');
            this.view.selectAnItem(e);
            // console.log(modal.querySelector('input[name="basis"]'));
            const nameBasis = modal?.querySelector('input[name="basis"]').value;

            // Обновление списка емкостей при смене базиса в части заявки
            if (nameBasis && modal !== null) {
                console.log(modal);
                const listTanks = this.model.getListTanksName(nameBasis);
                const product = modal.querySelector('input[name="product"]').value;
                console.log(product);
                const faragmentList = this.view.setTanks(listTanks, product);
                console.log(listTanks, faragmentList);
                const selectTanks = modal.querySelector('select[name="tankName"]');
                selectTanks.textContent = '';
                selectTanks.appendChild(faragmentList);
            }

        }
    }

    // Валидация
    isNumber(e) {
        if (e.target.name === 'weight' ||
            e.target.name === 'volume' ||
            e.target.name === 'density' ||
            e.target.name === 'cost_management_tonn' ||
            e.target.name === 'cost_price_tonn' ||
            e.target.name === 'startVolume' ||
            e.target.name === 'weight_fact'
        ) {
            this.view.isNumber(e);
        }

    }

    // Расчет Обьем (л.)
    volumeСalculation(e) {
        if (e.target.name === 'weight' ||
            e.target.name === 'density'
        ) {
            this.view.volumeСalculation(e);
        }
    }

    //
    costLitrСalculation(e) {
        if (e.target.name === 'cost_management_tonn' ||
            e.target.name === 'cost_price_tonn'
        ) {
            this.view.costLitrСalculation(e);
        }
    }

    // Открытие модального окна для добавления новой емкости
    openModalAddTank() {
        this.view.modalTankActive();
    }

    // Открытие модального окна для редактирования емкости
    openModalEditTank(tank) {
        this.view.modalTankActiveEdit(tank);
    }

    // Нажатие кнопки сохранить если открыто окно создания новой емкости
    async addNewTank(e) {

        if (e.target.classList.contains('btn-add-tank')) {
            e.preventDefault();
            console.log('Добавить новую емкоссть');
            const modalTank = e.target.closest('.modal-tank');
            // console.log(modalTank.querySelector('input[name="weight"]').value);
            const tank = {
                "code": modalTank.dataset.code,
                "name": modalTank.querySelector('input[name="nameTank"]').value,
                "type_tank": modalTank.querySelector('input[name="type"]').dataset.code,
                "name_base": modalTank.querySelector('input[name="basis"]').value,
                "redeem_volume": modalTank.querySelector('input[name="redeemed-volume"]').value,
                "date_limitation_redeem": this.helpers.convertDateTo1С(modalTank.querySelector('input[name="date"]').value),
                "cost_management_tonn": modalTank.querySelector('input[name="cost_management_tonn"]').value,
                "cost_price_tonn": modalTank.querySelector('input[name="cost_price_tonn"]').value,
                "cost_management_litr": modalTank.querySelector('input[name="cost_management_litr"]').value,
                "cost_price_litr": modalTank.querySelector('input[name="cost_price_litr"]').value,
                "product": {
                    "name_product": modalTank.querySelector('input[name="product"]').value,
                    "code_product": modalTank.querySelector('input[name="product"]').dataset.code
                },
                "client": {
                    "name_client": modalTank.querySelector('input[name="provider"]').value,
                    "code_client": modalTank.querySelector('input[name="provider"]').dataset.code,
                    "type_client": ""
                },
                "volume": modalTank.querySelector('input[name="volume"]').value,
                "density": modalTank.querySelector('input[name="density"]').value,
                "weight": modalTank.querySelector('input[name="weight"]').value,
                "commentary": "какой-то коммент",
                "author": "site",
                "id": this.helpers.getID(),
                "listOfDistributedApplications": [],
            }

            const basis = this.model.getBasis(tank.name_base);
            console.log(this.helpers.convertDateTo1С(modalTank.querySelector('input[name="date"]').value));

            if (basis && !basis.visible) {
                // basis.listOfTanks.push(tank);
                this.basisController.init([basis]);
            }

            const container = document.querySelector(`div[data-id='${basis.id}'] .tank-container`);
            const tankController = this.tankControllerFactory.create(tank, container);
            const objectCreatTank = tankController.getObjectCreatTank();
            console.log(objectCreatTank);

            const statusCreatTank = basis ?
                await this.api.fetchPostData('/postupdatetank', objectCreatTank) :
                false;
            console.log(statusCreatTank);


            if (statusCreatTank.Errors === '') {
                tank.code = statusCreatTank.Data;
                console.log('modalcontroller add tank', tank);
                basis.listOfTanks.push(tank);
                tankController.renderNewTank();
                this.view.modalClose(e);
            } else {
                alert('Проверьте правильность заполнения полей');
            }


        }
    }

    // Нажатие кнопки сохранить если открыто окно создания новой емкости
    async updateTank(e) {

        if (e.target.classList.contains('btn-update-tank')) {
            e.preventDefault();
            console.log('Редактировнаие емкости');
            const modalTank = e.target.closest('.modal-tank');
            const tank = {
                "code": modalTank.dataset.code,
                "name": modalTank.querySelector('input[name="nameTank"]').value,
                "type_tank": modalTank.querySelector('input[name="type"]').dataset.code,
                "name_base": modalTank.querySelector('input[name="basis"]').value,
                "redeem_volume": modalTank.querySelector('input[name="redeemed-volume"]').value,
                "date_limitation_redeem": this.helpers.convertDateTo1С(modalTank.querySelector('input[name="date"]').value), // element.querySelector('input[name="date"]').value
                "cost_management_tonn": modalTank.querySelector('input[name="cost_management_tonn"]').value,
                "cost_price_tonn": modalTank.querySelector('input[name="cost_price_tonn"]').value,
                "cost_management_litr": modalTank.querySelector('input[name="cost_management_litr"]').value,
                "cost_price_litr": modalTank.querySelector('input[name="cost_price_litr"]').value,
                "product": {
                    "name_product": modalTank.querySelector('input[name="product"]').value,
                    "code_product": modalTank.querySelector('input[name="product"]').dataset.code,
                },
                "client": {
                    "name_client": modalTank.querySelector('input[name="provider"]').value,
                    "code_client": modalTank.querySelector('input[name="provider"]').dataset.code,
                    "type_client": ""
                },
                "volume": modalTank.querySelector('input[name="volume"]').value,
                "density": modalTank.querySelector('input[name="density"]').value,
                "weight": modalTank.querySelector('input[name="weight"]').value,
                "commentary": "какой-то коммент",
                "author": "site",
                "id": modalTank.dataset.tankId,
                "listOfDistributedApplications": []
            }

            // console.log(modalTank.dataset.tankId);

            const tankController = this.tankControllerFactory.create(tank);
            const objectUpdateTank = tankController.getObjectUpdateTank();
            // console.log(objectUpdateTank);

            const statusUpdateTankServer = await this.api.fetchPostData('/postupdatetank', objectUpdateTank);
            // console.log(statusUpdateTankServer);

            if (statusUpdateTankServer.Status === 'Error') {
                alert('Проверьте правильность заполнения полей')
            } else if (statusUpdateTankServer.Status === 'OK') {
                const statusUpdateTankModel = this.model.updateTank(tank, tank.id);
                // console.log(statusUpdateTankModel);
                if (statusUpdateTankModel) {
                    console.log('modalcontroller updata tank', tank);
                    tankController.renderUpdateTank();

                    const containerTank = document.querySelector(`div[data-id="${tank.id}"]`);
                    const t = this.model.getTank(tank.id).tank;
                    const tc = this.tankControllerFactory.create(t, containerTank);
                    tc.volumeСalculation();

                    this.view.modalClose(e);
                }
            }



            // + Получить объект для обновления емкости на сервере
            // + Обновить данные на сервере
            // Обновить данные в модели
            // Обнвоить интерфес


        }
    }

    // Распределение части заявки API
    async postUpdatePart(modalPart) {
        const part = {
            "id": modalPart.dataset.partid,
            "number": modalPart.dataset.number,
            "type_dispatch": modalPart.dataset.typedispatch,
            "code_tank": '',   // Будет устанавливаться при распределении в емкость
            "date_income": "01010001", // this.helpers.convertDateTo1С(modalTank.querySelector('input[name="date"]').value)
            "date_dispatch": modalPart.querySelector('input[name="date_dispatch"]').value, // this.helpers.convertDateTo1С(modalTank.querySelector('input[name="date"]').value)
            "client": {
                "name_client": modalPart.querySelector('input[name="nameClient"]').value,
                "code_client": modalPart.querySelector('input[name="nameClient"]').dataset.code,
                "type_client": ''
            },
            "product": {
                "name_product": modalPart.querySelector('input[name="product"]').value,
                "code_product": modalPart.querySelector('input[name="product"]').dataset.code
            },
            "id_order": modalPart.dataset.idorder,
            "num_address": modalPart.dataset.numaddress,
            "num_basis": modalPart.dataset.numbasis,
            // "startVolume": modalPart.querySelector('input[name="startVolume"]').value,
            "volume": modalPart.querySelector('input[name="startVolume"]').value,
            "endVolume": modalPart.dataset.endVolume,
            "weight": Number(modalPart.querySelector('input[name="weight"]').value).toFixed(3),
            "density": modalPart.querySelector('input[name="density"]').value,
            // "density": this.model.getTank(modalPart.querySelector('select[name="tankName"]').value)?.tank.density || '',
            "nameBasis": modalPart.querySelector('input[name="basis"]').value,
            "dateStart": modalPart.querySelector('input[name="basisDateStart"]').value,
            "dateEnd": modalPart.dataset.dateEnd,
            "basisDateStart": modalPart.querySelector('input[name="basisDateStart"]').value,
            "basisDateEnd": modalPart.querySelector('input[name="basisDateEnd"]').value,
            "kind_order": modalPart.dataset.kindOrder,
            "commentary": modalPart.querySelector('textarea[name="comment"]').value,
            "author": "site",
            'sort_number': 1,
            'volume_fact': modalPart.querySelector('input[name="volume_fact"]').value,
            'weight_fact': modalPart.querySelector('input[name="weight_fact"]').value,
            'density_fact': modalPart.querySelector('input[name="density_fact"]').value,
            'temperature': modalPart.querySelector('input[name="temperature"]').value,
            'acquiered_full': modalPart.querySelector('input[name="acquiered_full"]').checked,
        }

        // console.log(this.model.getTank(modalPart.querySelector('select[name="tankName"]').value)?.tank.number);
        const dispatchPart = {
            'number': part.number,        //только для изменений, номер распределенной части, присваивается при создании
            // 'type_action_dispatch': part.number ? 2 : 1,    //аналогично type_action_order (1 - новая, 2 - обновить данные)
            'type_action_dispatch': (modalPart.querySelector('.card-ship').classList.contains('is-hidden') ? false : 3) || (part.number ? 2 : 1),   //аналогично type_action_order (1 - новая, 2 - обновить данные, 3 - отгрузить)
            'type_dispatch': part.kind_order == 1 ? 2 : 1,           //тип заявки, 1 - приход, 2 - расход
            'code_tank': this.model.getTank(modalPart.querySelector('select[name="tankName"]').value)?.tank.code || '',      //код емкости
            'date_income': "01010001",                    //дата загрузки
            'date_dispatch': this.helpers.convertDateTo1С(part.date_dispatch),          //дата отгрузки part.date_dispatch
            'code_client': part.client.code_client,       //код клиента
            'code_product': part.product.code_product,    //код продукта
            'id_order': part.id_order,                    //номер заказа менеджера
            'num_address': part.num_address,              //номер адреса в заявке
            'num_basis': part.num_basis,                  //номер базиса в заявке
            'volume': part.volume,                   //объем
            'weight': part.weight,                        //вес
            'density': part.density,                      //плотность
            'commentary': part.commentary,
            'sort_number': 1,
            'volume_fact': part.volume_fact,
            'weight_fact': part.weight_fact,
            'density_fact': part.density_fact,
            'temperature': part.temperature,
            'acquiered_full': part.acquiered_full,
        }

        console.log(dispatchPart);

        const statusUpdatePartkServer = await this.api.fetchPostData('/postupdatedispatch', dispatchPart);
        console.log(statusUpdatePartkServer);

        if (dispatchPart.type_action_dispatch == 3) {
            const partContainer = document.querySelector(`div[data-id="${part.id}"]`);
            const partObject = this.model.getPart(part.id);
            const partController = this.partControllerFactory.create(partObject.part, partContainer);
            partController.deletePart();
            this.model.deletePart(partObject.part.id);
            console.log(partObject);

            const containerTank = document.querySelector(`div[data-id="${partObject.tankID}"]`);
            const tank = this.model.getTank(partObject.tankID)?.tank;
            console.log(tank);
            if (tank) {
                const tankController = this.tankControllerFactory.create(tank, containerTank);
                tankController.recalculatingBalance(Number(dispatchPart.volume_fact),
                                                    Number(dispatchPart.weight_fact),
                                                    Number(partObject.part.kind_order));
                tankController.volumeСalculation();
                tankController.alertTank();
            }


            return null;
        }

        part.number = statusUpdatePartkServer.Data;
        part.code_tank = dispatchPart.code_tank;

        return part;

    }

    // Обновление модели после распределения части заявки
    async updateModelPart(part, modalPart) {
        // const idTank = this.model.getTank(modalPart.querySelector('select[name="tankName"]').value)?.tank.code;
        const addressPart = this.model.getAddressPart(part.id);
        const partOld = this.model.getPart(part.id).part;
        const addressPartNew = {
            'basisName': modalPart.querySelector('input[name="basis"]').value,
            'tankID': modalPart.querySelector('select[name="tankName"]').value,
            'date_dispatch': modalPart.querySelector('input[name="date_dispatch"]').value,
        };

        // console.log(addressPart, addressPartNew);

        // Адрес изменился?
        console.log(partOld.date_dispatch, addressPartNew.date_dispatch);
        if (addressPart.basisName == addressPartNew.basisName &&
            addressPart.tankID == addressPartNew.tankID &&
            partOld.date_dispatch == addressPartNew.date_dispatch) {
            // Нет
            console.log('Обновление');
            let partUpdate = this.model.getPart(part.id).part;
            // Сравниваем 2 объекта
            part.partUpdate = [];
            part.differences = this.model.findDifferences(part, partUpdate);
            // Удаляем все собственные свойства из obj1
            // console.log(part, partUpdate);
            Object.keys(partUpdate).forEach(key => delete partUpdate[key]);
            // Копируем все свойства из obj2 в obj1
            Object.assign(partUpdate, part);

            const container = document.querySelector(`div[data-id='${part.id}']`);
            const partController = this.partControllerFactory.create(part, container);

            // Выбираем шаблон для обновления
            if (part.code_tank) {
                partController.updateDistributedPart();
            } else {
                console.log('partController.updateUndistributedPart()');
                partController.updateUndistributedPart();
            }

            const containerTank = document.querySelector(`div[data-id="${addressPartNew.tankID}"]`);
            const t = this.model.getTank(addressPartNew.tankID)?.tank;
            console.log(t);
            if (t) {
                const tc = this.tankControllerFactory.create(t, containerTank);
                tc.volumeСalculation();
                tc.alertTank();
            }



        } else {
            // Да
            console.log('Перемещение');
            let partUpdate = this.model.getPartOriginal(part.id);
            // Сравниваем 2 объекта
            part.differences = this.model.findDifferences(part, partUpdate);
            // Удаляем все собственные свойства из obj1
            // Object.keys(partUpdate).forEach(key => delete partUpdate[key]);
            // // Копируем все свойства из obj2 в obj1
            // Object.assign(partUpdate, part);
            // part.volume = part.startVolume;

            // if (addressPart.tankID != addressPartNew.tankID) {
                this.model.deletePart(part.id);
            // }

            // console.log(part, addressPartNew.basisName, addressPartNew.tankID);
            const index = this.model.addPart(part, addressPartNew.basisName, addressPartNew.tankID);
            console.log(index);

            const container = document.querySelector(`div[data-id='${part.id}']`);
            const wrapper = container.closest('.subtable-rows');
            // console.log(wrapper);
            const partController = this.partControllerFactory.create(part, container, index);
            partController.deletePart();
            partController.updateSerialNumber(wrapper);

            // ----
            const ct =  wrapper.closest('.tank');
            if (ct) {
                const tankID = ct.dataset.id
                const t = this.model.getTank(tankID).tank;
                const tc = this.tankControllerFactory.create(t, ct);
                tc.volumeСalculation();
                tc.alertTank();

            }

            // ----


            let containerTank = '';
            if (addressPartNew.tankID != '0') {
                containerTank = document.querySelector(`div[data-id='${addressPartNew.tankID}'] .subtable-rows`);


            } else {
                const basisTitle = [...document.querySelectorAll('.basis-name')].
                    find(basis => basis.textContent === addressPartNew.basisName);
                // console.log();
                const basisContainer = basisTitle.parentElement.closest('.oilbasis');
                containerTank = basisContainer.querySelector('.container-undistributed');

            }

            // Выбираем шаблон для вставки
            if (part.code_tank) {
                console.log('renderDistributed');
                const children = [...containerTank.children];
                containerTank.insertBefore(partController.renderDistributed(), children[index]);
                partController.updateSerialNumber(containerTank);

                const tank = this.model.getTank(addressPartNew.tankID).tank;
                const container = document.querySelector(`div[data-id='${addressPartNew.tankID}']`);
                const tankController = this.tankControllerFactory.create(tank, container);
                let objectUpdateSort = tankController.updateSort();
                const statusUpdate = await this.api.fetchPostData('/postdispatchsort', objectUpdateSort);
                tankController.volumeСalculation();
                tankController.alertTank();
            } else {
                console.log('render');
                const children = [...containerTank.children];
                containerTank.insertBefore(partController.render(), children[index]);
                // containerTank.appendChild(partController.render());
                partController.updateSerialNumber(containerTank);
            }

        }


    }

    async savePart(e) {

        if (e.target.classList.contains('btn-save-part')) {
            e.preventDefault();
            // console.log('savePart(e) запуск', e.target);
            const modalPart = e.target.closest('.modal-part');
            const part = await this.postUpdatePart(modalPart);
            if (part) {
                this.updateModelPart(part, modalPart);
            }
            // console.log(part);
            this.view.modalClose(e);

        }
    }

    // Нажатие кнопки отгрузить/загрузить в модальном окне
    // части заявки
    async shipPart(e) {
        if (e.target.classList.contains('btn-ship-part') ||
            e.target.classList.contains('btn-cancellation-part')) {
            console.log('Отгрузка');
            const modalPart = e.target.closest('.modal-part');
            // const part = await this.postUpdatePart(modalPart, 3);
            this.view.shipPart(modalPart);
            this.view.validationShip();
        }
    }

    // Принята полная масса
    fullWeightChecked(e) {
        if (e.target.name == 'acquiered_full') {
            const modalPart = e.target.closest('.modal-part')
            this.view.fullWeightChecked(e);
        }
    }

    // Проверка заполненности массы в модальном окне Part
    // если поля масса пустое кнопка загрузить должна быть
    // Недоступна для нажатия
    validationMassFild(modal) {
        this.view.validationMassFild();
    }

    // Изменения значения в поле "Масса факт (т)"
    changingValueMassFull(e) {
        console.log('changingValueMassFull');
        if (e.target.name === 'weight') {
            this.validationMassFild();
        }
    }

    // Кнопка закрыть модальное окно без внесения изменений
    closeModal(e) {
        if (e.target.classList.contains('delete')) {
            console.log('closeModal');
            this.view.modalClose(e);
        }
    }

    // Расчет плотности при вводе значений в поле Масса и Объем
    densityСalculation(e) {
        if (e.target.name === 'weight' ||
            e.target.name === 'startVolume') {

            this.view.densityСalculation();
        }
    }

    // Открыть модальное окно уведомлений
    notification(e) {
        this.view.notification(e);
    }

    // Закрыть модальное окно уведомления
    notificationСancellation(e) {
        if (e.target.classList.contains('cancellation')) {
            this.view.notificationСancellation(e);
        }
    }

     async deleteTank(e) {
        if (e.target.classList.contains('tank-del')) {
            console.log('deleteTank');
            const id = e.target.closest('.modal-notification').dataset.id;
            const tankContainer = document.querySelector(`div.tank[data-id="${id}"]`);
            const tankData = this.model.getTank(id);
            // Получаем список всех частей заявок в удаляемой емкости
            const parts = tankData.tank.listOfDistributedApplications;
            // Добавляем части заявок в раздел нераспределенные
            for (const part of parts) {
                const index = this.model.addPart(part, part.nameBasis);
                const partController = this.partControllerFactory.create(part, '', index);
                const containerTank = document.querySelector(`div[data-id="${tankData.basisID}"] .container-undistributed`);
                const children = [...containerTank.children];
                containerTank.insertBefore(partController.render(), children[index]);
                // containerTank.appendChild(partController.render());
                partController.updateSerialNumber(containerTank);
            }
            // console.log(tank)
            const tankController = this.tankControllerFactory.create(tankData.tank, tankContainer);
            const objectDeleteTank = tankController.getObjectDeleteTank();
            console.log(id, tankContainer, tankData);
            const tankDeleteStatus = await this.api.fetchPostData('/postupdatetank', objectDeleteTank);
            console.log(tankDeleteStatus);
            if (tankDeleteStatus.Errors === '') {
                tankContainer.remove();
                this.model.deleteTank(id);
            }
            this.view.notificationСancellation(e);

        }
    }

    // Установка плотности в не распределенной части заявки согласно выбранной емкости
    setDensityPart(e) {
        if (e.target.name === 'tankName') {
            console.log('setDensityPart(e)');
            console.log(e.target.value);
            const tankID = e.target.value;
            const tankDensity = this.model.getTank(tankID)?.tank.density;
            const partDensity = this.model.getPart(e.target.closest('.modal-part').dataset.partid).part.density;
            this.view.setDensityPart(tankID, tankDensity, partDensity);
        }
    }


    // -------------------------------------------




    // Открытие модального окна для редактирования части заявки
    openModalEditPart(part, basiss, basisID, listTanks, tankID) {
        this.view.modalPartActive(part, basiss, basisID, listTanks, tankID);
        this.view.validationMassFild();
    }


    updateListTenks(listTanks) {
        this.view.updateListTenks(listTanks);
    }

    // Инициализация модальных окон
    init() {
        this.view.renderModals(this.model);
    }
}