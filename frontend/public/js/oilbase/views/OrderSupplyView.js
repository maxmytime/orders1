import { AppView } from '/js/oilbase/views/AppView.js'

export class OrderSupplyView extends AppView {
  constructor(helpers) {
    super();
    this.container = document.querySelector('.app-oilbase');        // Контейнер приложения. На текущий момент на него вешаются все события
    this.templateOrderSupply = this.getTemplate('order-supply');    // Шаблон Заявки снабжения в базисе

    this.helpers = helpers;

    // console.log('OrderSupplyView');
  }

  render(data) {
    // if (!data.array_sections) console.log(data);
    const order = this.templateOrderSupply.cloneNode(true);
    this.templateFfilling(order, data);
    return order;
  }

  renderNewOrderSupply(data, tankID, index) {
    console.log(data, tankID, index);
    // Находим контейнер
    const container = document.querySelector(`div[data-id="${tankID}"] .order-supply-container`);
    if (!container) return;

    // Создаем новый элемент заявки снабжения и наполняем его данными
    const order = this.templateOrderSupply.cloneNode(true);
    this.templateFfilling(order, data);

    // Получаем все дочерние элементы с классом "item" в виде массива
    const items = [...container.children].filter(child => child.classList.contains('order-supply'));

    // Вставляем в нужное место
    if (index < 0) {
      // Отрицательный индекс – в начало
      container.prepend(order);
    } else if (index >= items.length) {
      // Индекс больше или равен количеству – в конец
      container.appendChild(order);
    } else {
      // Иначе перед элементом с указанным индексом
      container.insertBefore(order, items[index]);
    }
  };


  updateOrderSupply(data) {
    const orderSupplyNode = document.querySelector(`div[data-id="${data.id}"]`);
    this.templateFfilling(orderSupplyNode, data);
  }

  // --- Вспомогательные методы ---

  // --- Расчет распределенного объема в заявке снабжения ---
  totalVolumeDistributed = (orderSupply) => {
    if (orderSupply.volume_dispatch) {
      return orderSupply.volume_dispatch;
    }

    const itemsArrayName = orderSupply.type_suplorder === 1 ? 'array_tanks' : 'array_dispatch';

    const totalVolume = orderSupply.array_sections.reduce((sum, section) => {
      const items = section[itemsArrayName] || [];
      return sum + items.reduce((s, item) => s + Number(item.volume_dispatch), 0);
    }, 0);

    return totalVolume;
  }

  // --- Заполнение шаблона данными ---
  templateFfilling(template, data) {
    // Устанавливаем ID
    template.dataset.id = data.id;
    // Часть заявки снабжения с типом отгрузка на свой склад
    if (data.warehouse_part) {
      template.dataset.warehousePart = data.warehouse_part;
    }
    // Устанавливаем тип заявки
    template.dataset.type = data.type_suplorder;
    // Дата
    template.querySelector('.date_dispatch').textContent = data.date_income;
    // Продукт
    template.querySelector('.name-product').textContent = data.product.name_product;
    // Количество
    template.querySelector('.volume').textContent = data.volume;
    // Распределено
    template.querySelector('.volume-distributed').textContent = this.totalVolumeDistributed(data);
    // Остаток, плановый
    template.querySelector('.planned-balance').textContent = '-';
    // Комментарий
    template.querySelector('.comment').textContent = data.commentary;
  }


}