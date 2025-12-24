export class UpdatingModel {
    constructor(model, partControllerFactory, tankControllerFactory, api, helpers) {
        this.model = model;
        this.partControllerFactory = partControllerFactory;
        this.tankControllerFactory = tankControllerFactory;
        this.api = api;
        this.helpers = helpers;
    }

    //----------------------------------------
    // Создана новая заявка
    async orderCreated(msg) {
        console.log('orderCreated(msg)');
        const partList = await this.getNewOrders(msg);
        for (const part of partList) {
            const index = this.addNewOrderToModel(part);
            this.renderNewPart(part, index);
        }
    }

    // Создана новая емкость
    async tankCreated(msg) {
        console.log('tankCreated(msg)');
        const tankList = await this.getNewTank(msg);
        for (const tank of tankList) {
            console.log(tank);
            this.addNewTankToModel(tank);
            this.renderNewPart(tank)
        }
    }

    //----------------------------------------

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
        const index = this.model.addPart(part, part.nameBasis);
        return index;
    }

    // Отрисовывает новую заявку в интерфесе
    renderNewPart(part, index) {
        const basisID = this.model.getBasis(part.nameBasis).id;
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
    renderNewPart(tank) {
        const basisID = this.model.getBasis(tank.name_base).id;
        const container = document.querySelector(`div[data-id=${basisID}] .tank-container`);
        const tankController = this.tankControllerFactory.create(tank, container);
        tankController.renderNewTank();
    }
}