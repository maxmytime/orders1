export class UpdatingView {

  // Удаляет элемент со странице по ID
  deleteElementByID(id) {
    document.querySelector(`div[data-id="${id}"]`).remove();
  }

  // Делает расчет планового остатка
  tankСalculationPlannedBalance(tank) {
    // --- Вспомогательные функции (локальные) ---
    const $ = (selector, root = tank) => root.querySelector(selector);
    const $$ = (selector, root = tank) => root.querySelectorAll(selector);

    let mainCurrentBalance = Number($('.current-balance').textContent);
    const mainPlannedBalance = $('.planned-balance');
    const ordersSupply = $$('.order-supply');

    if (ordersSupply.length === 0) {
      mainPlannedBalance.textContent = mainCurrentBalance;
      return;
    }

    ordersSupply.forEach(orderSupply => {
      // const type = orderSupply.dataset.type;
      const ElVolumeDistributed = $('.volume-distributed', orderSupply);
      if (!orderSupply) {
        console.warn('tankСalculationPlannedBalance: элемент распределенный объем не найден');
        return;
      }
      const volumeDistributed = Number(ElVolumeDistributed.textContent);

      // Уточняем является ли ЗС частью другой ЗС с типом "Отгрузка на свой склад"
      const warehousePart = Boolean(orderSupply.dataset.warehousePart);

      if (warehousePart) {
        mainCurrentBalance += volumeDistributed;
      } else {
        mainCurrentBalance -= volumeDistributed;
      }


      $('.planned-balance', orderSupply).textContent = mainCurrentBalance;


    })

    mainPlannedBalance.textContent = mainCurrentBalance;
  }

  /**
   * Обновляет порядковые номера внутри блоков заявок в указанном контейнере.
   * Для каждого элемента .order-supply находит .part-number и устанавливает
   * его текстовое содержимое равным индексу + 1.
   * @param {HTMLElement} tank - корневой элемент, содержащий заявки.
   */
  updateOrderNumbers(tank) {
    const orderSupplies = tank.querySelectorAll('.order-supply');

    orderSupplies.forEach((supply, index) => {
      const numberElement = supply.querySelector('.part-number');
      if (numberElement) {
        numberElement.textContent = index + 1; // нумерация с 1
      }
    });
  }

  // Обновление распределенного объема у не распределенных блоков заявок
  updatingDistributedVolume(parts) {
    console.log(parts);
    parts.forEach(part => {
      const elementPart = document.querySelector(`.oilbasis div[data-id="${part.id}"]`);
      console.log(elementPart);

      if (!elementPart) {
        console.warn('updatingDistributedVolume: Элемент - Часть заявки не найдена на странице');
        return;
      }

      const elementDistributedVolume = elementPart.querySelector('.volume-distributed');
      // console.log(elementDistributedVolume);

      if (!elementDistributedVolume) {
        console.warn('updatingDistributedVolume: Элемент - Распределенный объем не найден');
        return;
      }

      // console.log(elementDistributedVolume, part.volume_distributed);
      elementDistributedVolume.textContent = part.volume_distributed;

    })
  }

  // Удаляет элемент свой склад который приходует объем
  deleteWarehouseByID(id) {
    const warehous = document.querySelector(`.oilbasis div[data-id-warehouse="${id}"]`);
    const tank = warehous.closest('.tank');
    warehous.remove();
    this.tankСalculationPlannedBalance(tank);
    this.updateOrderNumbers(tank);
  }

  // Добавляем элемент свой склад который приходует объем
  addElementWarehouse(id) {
    const warehous = document.querySelector(`.oilbasis div[data-id-warehouse="${id}"]`);
    const tank = warehous.closest('.tank');
    this.tankСalculationPlannedBalance(tank);
    this.updateOrderNumbers(tank);
  }

}