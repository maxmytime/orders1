export class UpdatingView {

  // Удаляет элемент со странице по ID
  deleteElementByID(id) {
    console.log(id);
    let element = document.querySelector(`div[data-id="${id}"]`); 
        if (!element) {
      element = document.querySelector(`.oilbasis div[data-id-warehouse="${id}"]`);
      element.remove();
      return;
    }
    if (!element) {
      element = document.querySelector(`.oilbasis div[data-id-warehouse="${id}"]`);
      element.remove();
      return;
    }

    element.remove();
  }


  // Делает расчет планового остатка
  tankСalculationPlannedBalance(tank) {
    // --- Вспомогательные функции (локальные) ---
    const $ = (selector, root = tank) => root.querySelector(selector);
    const $$ = (selector, root = tank) => root.querySelectorAll(selector);

    // --- Подсвечиваем отрицательный остаток красным ---
    const _highlightingDanger = (balance, element) => {
      if (balance < 0) {
        element.classList.add('has-text-danger');
      } else {
        element.classList.remove('has-text-danger');
      }
    }

    let mainCurrentBalance = Number($('.current-balance').textContent);
    const mainPlannedBalance = $('.planned-balance');
    const ordersSupply = $$('.order-supply');

    if (ordersSupply.length === 0) {
      mainPlannedBalance.textContent = mainCurrentBalance.toFixed(0);
      return;
    }

    ordersSupply.forEach(orderSupply => {
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


      const plannedBalance = $('.planned-balance', orderSupply);
      console.log(mainCurrentBalance);
      plannedBalance.textContent = mainCurrentBalance.toFixed(0);
      _highlightingDanger(mainCurrentBalance, plannedBalance);


    })

    mainPlannedBalance.textContent = mainCurrentBalance.toFixed(0);
    _highlightingDanger(mainCurrentBalance, mainPlannedBalance);
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
    if (warehous) {
      const tank = warehous.closest('.tank');
      this.tankСalculationPlannedBalance(tank);
      this.updateOrderNumbers(tank);
    }
  }

  // Обновляем поля "Масса, текущая (т)", "Объем, текущий (л)" у емкости
  updateTankFields(tank) {
    const tankID = tank.id;
    const volume = tank.volume;
    const weight = tank.weight;

    if (!tankID || !volume || !weight) {
      console.warn(`updateTankFields: Не найдены необходимые данные`);
      return;
    }

    // --- Обновляем поля на странице ---
    const currentBalanceField = document.querySelector(`.tank[data-id="${tankID}"] .current-balance`);
    const weightField = document.querySelector(`.tank[data-id="${tankID}"] .weight`);

    if (!currentBalanceField || !weightField) {
      console.warn(`updateTankFields: Не найдены необходимые поля для обновления`);
      return;
    }

    currentBalanceField.textContent = Number(volume).toFixed(3);
    weightField.textContent = Number(weight).toFixed(3);
  }

}