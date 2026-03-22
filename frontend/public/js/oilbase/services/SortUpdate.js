export class SortUpdate {
  constructor(model) {
    this.model = model;
  }

  update(tankID) {
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
      const tank = this.model.getTank(tankID);
      if (!tank) {
        console.warn(`update: Элемент tank не найден в модели`);
        return;
      }

      const listSuplOrders = tank.tank.listOfOrderSupply;

      listSuplOrders.forEach(order => {
        for (const element of objectUpdate) {
          if (order.id === element.id) {
            order.sort_number = element.sort;
          }
        }
      })
    };

    console.log('class SortUpdate, metod update(tankID)');

    // Создаем объект для обновления модели
    const objectUpdate = _createObjectUpdate(tankID);
    // Обновляем модель
    _updateModel(tankID, objectUpdate);

  }
}