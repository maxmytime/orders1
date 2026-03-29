import { ApiClient } from './../models/ApiClient.js';

export class SortUpdate {
  constructor(model) {
    this.model = model;
    this.api = new ApiClient();
  }

  update(tankID) {
    // --- Получаем список заявок снабжения ---
    const _getListSuplOrders = (tankID) => {
      const tank = this.model.getTank(tankID);
      if (!tank) {
        console.warn(`update: Элемент tank не найден в модели`);
        return;
      }

      return tank.tank.listOfOrderSupply;
    };

    // --- Создаем объект для обновления модели ---
    const _createObjectUpdate = (tankID) => {
      const tankNode = document.querySelector(`div[data-id="${tankID}"]`);

      if (!tankNode) {
        console.warn(`update: Элемент tankNode не найден на странице`);
        return;
      }

      const supplyOrdersNodes = [...tankNode.querySelectorAll('.order-supply')];
      if (!supplyOrdersNodes.length) {
        console.warn(`update: Массив supplyOrdersNodes пуст, в емкости нет заявок снабжения`);
      }

      // Объект для обновления модели
      const objectUpdate = [];

      // Создание объекта для обновления модели
      supplyOrdersNodes.forEach((node, index) => {
        objectUpdate.push({
          'id': node.dataset.id || node.dataset.idWarehouse,
          'sort': index + 1,
        });
      });

      return objectUpdate;

    };

    // --- Обновление модели ---
    const _updateModel = (tankID, objectUpdate) => {
      const listSuplOrders = _getListSuplOrders(tankID);
      // console.log(objectUpdate, listSuplOrders);
      listSuplOrders.forEach(order => {
        
        for (const element of objectUpdate) {
          if (order.id === element.id || order.id_warehouse === element.id) {
            console.log('order', order);
            if (order.hasOwnProperty('sort_number')) {
              order.sort_number = element.sort;
            } else if ( order.hasOwnProperty('order_dispatch_suplorder') ) {
              order.order_dispatch_suplorder = element.sort;
            }
            
          }
        }
      })
    };

    // --- Обновление данных на сервере ---
    const _updateServer = async (tankID) => {
      let objectUpdateSort = [];
      const listSupplyOrders = _getListSuplOrders(tankID);
      for (const supplyOrder of listSupplyOrders) {
        // console.log('suplOrder', supplyOrder);
        objectUpdateSort.push({
          // Если полная ЗС то supplyOrder.number, если блок ЗС то 
          // supplyOrder.number к которому относится блок
          "number": supplyOrder.number,
          // Если полная ЗС то supplyOrder.sort_number, если блок      
          // supplyOrder.order_dispatch_suplorder
          "sort_number": supplyOrder.sort_number || supplyOrder.order_dispatch_suplorder,
          // Если полная ЗС то передаем ""
          "guid_dispatch_suplorder": supplyOrder.guid_dispatch_suplorder || '',
        }
        );
      }

      console.log(objectUpdateSort);

      const status = await this.api.fetchPostData('/PostSuplorderSort', objectUpdateSort);
      console.log('status', status);
    };

    console.log('class SortUpdate, metod update(tankID)');

    // Создаем объект для обновления модели
    const objectUpdate = _createObjectUpdate(tankID);
    console.log('objectUpdate', objectUpdate);
    // Обновляем модель
    _updateModel(tankID, objectUpdate);
    // Обновление данных на сервере
    _updateServer(tankID, objectUpdate);

  }
}