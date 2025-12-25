export class UpdatingModel {
    constructor(model, partControllerFactory, tankControllerFactory, api, helpers, basisController) {
        this.model = model;
        this.partControllerFactory = partControllerFactory;
        this.tankControllerFactory = tankControllerFactory;
        this.api = api;
        this.helpers = helpers;
        this.basisController = basisController;
    }

    //----------------------------------------
    // Создана новая заявка - расход/приход
    async orderCreated(msg) {
        console.log('orderCreated(msg)');
        const partList = await this.getNewOrders(msg);
        // console.log(partList);
        for (const part of partList) {
            const index = this.addNewOrderToModel(part);
            // console.log(part);
            if (this.checkingVisibilityBasis(part.nameBasis)) {
                this.renderNewPart(part, index);
            } else {
                this.initBasis(part.nameBasis);
            }

        }
    }

    // Сохранена заявка - приход/расход
    async orderSave(msg) {
        console.log('orderSave(msg)', msg);
        const partList = await this.getNewOrders(msg);
        console.log(partList);
    }

    // Создана новая емкость
    async tankCreated(msg) {
        console.log('tankCreated(msg)');
        const tankList = await this.getNewTank(msg);
        for (const tank of tankList) {
            console.log(tank);
            this.addNewTankToModel(tank);
            if (this.checkingVisibilityBasis(tank.name_base)) {
                this.renderNewTank(tank)
            } else {
                this.initBasis(tank.name_base);
            }
        }
    }

    // Данные в емкости обновлены
    async tankUpdate(msg) {
        console.log('tankUpdate(msg)', msg);
        const tankList = await this.getNewTank(msg);
        for (const tank of tankList) {
            console.log(tank);
            const tankID = this.updatingTankToModal(tank);
            if (tankID) {
                this.renderUpdateTank(tankID);
            }
        }
    }

    //----------------------------------------

    // Проверка видимости базиса
    checkingVisibilityBasis(basisName) {
        const basis = this.model.getBasis(basisName);
        if (basis.visible === true) return true;
        if (basis.visible === false) return false;
    }
    // Отрисовка базиса которого нет на странице
    initBasis(basisName) {
        console.log('Базиса нет на странице');
        const basis = this.model.getBasis(basisName);
        const basisData = [];
        basisData.push(basis);
        this.basisController.init(basisData);
    }

    // Получает новую выдачу для канбана и находит вновь созаднную заявку или обновленную заявку
    async getNewOrders(msg) {
        console.log('getNewOrders(msg)', msg);
        const number = msg.Data;
        const response = await this.api.fetchGetData(`/orderlist?archieved=false`);
        const ordersForKanban = response.Data.OrdersList.filter(order => order.number === number);
        const partList = this.model.getListPart(ordersForKanban);
        return partList;
    }
    // Добавляет ную заявку в модель
    addNewOrderToModel(part) {
        console.log(part);
        const index = this.model.addPart(part, part.nameBasis);
        return index;
    }
    // Отрисовывает новую заявку в интерфесе
    renderNewPart(part, index) {
        console.log('renderNewPart', part, index)
        const basisID = this.model.getBasis(part.nameBasis).id;
        console.log('basisID', basisID);
        const container = document.querySelector(`div[data-id=${basisID}] .container-undistributed`);
        console.log(container);
        console.log(basisID);
        const partController = this.partControllerFactory.create(part, container, index);
        const partTpl =  partController.render();
        const children = [ ...container.children];
        container.insertBefore(partTpl, children[index]);
    }

    // Получает новый список емкостей и находит вновь созданную
    async getNewTank(msg) {
        console.log('getNewTank', msg);
        const number = msg.Data;
        const response = await this.api.fetchGetData(`/gettanklist`);
        const tankList = response.Data.OrdersList.filter(tank => tank.code === number);
        console.log(tankList);
        return tankList;
    }
    // Добавляем новую емкость в модель
    addNewTankToModel(tank) {
        const basisName = tank.name_base;
        const listOfTanks = this.model.getBasis(basisName).listOfTanks;
        tank.id = this.helpers.getID();
        listOfTanks.push(tank);
        console.log(listOfTanks);
    }
    // Отрисовываем новую емкость в инерфейсе
    renderNewTank(tank) {
        const basisID = this.model.getBasis(tank.name_base).id;
        const container = document.querySelector(`div[data-id=${basisID}] .tank-container`);
        const tankController = this.tankControllerFactory.create(tank, container);
        tankController.renderNewTank();
    }

    // Обновить емкость в модели
    updatingTankToModal(tank) {
        console.log('updatingTankToModal(tank)');
        const basisName = tank.name_base;
        const listOfTanks = this.model.getBasis(basisName).listOfTanks;
        let tankID = '';

        for (const t of listOfTanks) {
            if (t.code === tank.code) {
                tankID = t.id;
                break;
            }
        }

        if (tankID) {
            this.model.updateTank(tank, tankID);
            return tankID;
        }
    }
    // Отрисовываем обновленную емкость в интерфейсе
    renderUpdateTank(tankID) {
        const container = document.querySelector(`div[data-id=${tankID}]`);
        const tank = this.model.getTank(tankID).tank;
        const tankController = this.tankControllerFactory.create(tank, container);
        tankController.renderUpdateTank();
        tankController.volumeСalculation();
    }
}