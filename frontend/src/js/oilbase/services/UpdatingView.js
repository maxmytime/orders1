export class UpdatingView {

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

    if (ordersSupply.length === 0) return;

    ordersSupply.forEach(orderSupply => {
      // const type = orderSupply.dataset.type;
      const volumeDistributed = Number($('.volume-distributed', orderSupply).textContent);
      // mainCurrentBalance = type === '1' 
      //   ? mainCurrentBalance - volumeDistributed
      //   : mainCurrentBalance + volumeDistributed
      mainCurrentBalance -= volumeDistributed;

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
}