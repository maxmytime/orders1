import { AppView } from '/js/oilbase/views/AppView.js'

export class OrderSupplyView extends AppView {
  constructor(helpers) {
    super();
    this.container = document.querySelector('.app-oilbase');       // Контейнер приложения. На текущий момент на него вешаются все события
    this.templateOrderSupply = this.getTemplate('order-supply');   // Шаблон Заявки снабжения в базисе
    this.templateDetailDistributed = this.getTemplate('detail-distributed');    // Шаблон детальной записии распределенного блока
    this.templateDetailOwnWarehouse = this.getTemplate('detail-own-warehouse'); // Шаблон детальной записии своего склада

    this.helpers = helpers;
  }

  render(data, detalis) {
    // if (!data.array_sections) console.log(data);
    const order = this.templateOrderSupply.cloneNode(true);
    this.templateFfilling(order, data, detalis);
    return order;
  }

  renderNewOrderSupply(data, tankID, index, detalis) {
    console.log(data, tankID, index);
    // Находим контейнер
    const container = document.querySelector(`div[data-id="${tankID}"] .order-supply-container`);
    if (!container) return;

    // Создаем новый элемент заявки снабжения и наполняем его данными
    const order = this.templateOrderSupply.cloneNode(true);
    this.templateFfilling(order, data, detalis);

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


  updateOrderSupply(data, detalis) {
    const orderSupplyNode = document.querySelector(`div[data-id="${data.id}"]`);
    this.templateFfilling(orderSupplyNode, data, detalis);
  }

  // --- Вспомогательные методы ---

  // --- Расчет распределенного объема в заявке снабжения ---
  totalVolumeDistributed = (orderSupply) => {
    if (orderSupply.volume_dispatch) {
      return orderSupply.volume_dispatch;
    }

    const itemsArrayName = orderSupply.type_suplorder === 1 ? 'array_tanks' : 'array_dispatch';

    const totalVolume = orderSupply.array_sections?.reduce((sum, section) => {
      const items = section[itemsArrayName] || [];
      return sum + items.reduce((s, item) => s + Number(item.volume_dispatch), 0);
    }, 0);

    return totalVolume;
  }

  // --- Заполнение шаблона данными ---
  templateFfilling(template, data, detalis) {

    // Внутренняя функция для формирования детальных записей
    const _createDetails = (detalis) => {

      // Создание деталей для распределенного блока
      const _createDetailsDistributed = (details, detailsFragment) => {
        if (Array.isArray(details) && details.length > 0) {

          details.forEach(item => {

            const tplDetail = this.templateDetailDistributed.cloneNode(true);
            console.log(this.helpers);
            tplDetail.querySelector('.part-date').textContent =
              this.helpers.getDateShipment(item.basisDateStart, item.basisDateEnd);
            tplDetail.querySelector('.part-partner').textContent = item.client.name_client;
            tplDetail.querySelector('.conteragent').textContent = item.counteragent;
            tplDetail.querySelector('.part-product').textContent = item.product.name_product;
            tplDetail.querySelector('.part-remainder').textContent = item.volume_dispatch;

            detailsFragment.appendChild(tplDetail);
          })
        };
      }

      // Создание деталей для своего склада
      const _createDetailsOwnWarehouse = (detalis, detailsFragment) => {
        if (Array.isArray(detalis) && detalis.length > 0) {
          detalis.forEach(item => {
            const tplDetail = this.templateDetailOwnWarehouse.cloneNode(true);

            tplDetail.querySelector('.os-warehous-basis').textContent = item.name_basis;
            tplDetail.querySelector('.warehouse-tank-name').textContent = item.tank;
            tplDetail.querySelector('.warehouse_volume').textContent = item.volume_dispatch;
            tplDetail.querySelector('.warehouse_date_dispatch').textContent = item.date_income;

            detailsFragment.appendChild(tplDetail);
          })
        }
      }

      if (!detalis || !detalis.data) {
        console.warn(`_createDetails: Объект data не передан или имеет не верный формат`);
        return;
      }

      const TYPE = {
        OWN_WAREHOUSE: 1, // Свой склад
        DISTRIBUTED: 2    // Распределенный
      }

      // Тип заявки
      const type = detalis.type_suplorder;
      // Фрагмент для деталей
      const detailsFragment = document.createDocumentFragment();

      if (Array.isArray(detalis.data) && detalis.data.length > 0) {

        if (type === TYPE.OWN_WAREHOUSE) {
          _createDetailsOwnWarehouse(detalis.data, detailsFragment);
        } else if (type === TYPE.DISTRIBUTED) {
          _createDetailsDistributed(detalis.data, detailsFragment);
        }

      }

      return detailsFragment;
    }

    // Устанавливаем ID
    template.dataset.id = data.id || '';
    // Устанавливаем parntID
    template.dataset.parentId = data?.parent_id || '';
    // Часть заявки снабжения с типом отгрузка на свой склад
    if (data.warehouse_part) {
      template.dataset.idWarehouse = data.id_warehouse;
      template.dataset.warehousePart = data.warehouse_part;
    }
    // Устанавливаем тип заявки
    template.dataset.type = data.type_suplorder || '';
    // Выделяем цыетом тип заявки .part-number-bb .part-number-bg
    if (data.warehouse_part) {
      template.querySelector('.part-number').classList.add('part-number-bg');
    } else if (data.type_suplorder === 2) {
      template.querySelector('.part-number').classList.add('part-number-bb');
    } else if (data.type_suplorder === 1) {
      template.querySelector('.part-number').classList.add('part-number-by');
    }
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
    // Детали
    if (!data.warehouse_part) {
      template.querySelector('.details').append(_createDetails(detalis));
    }
    // Если ЗС является блоком прихода disabled = true
    if (data.warehouse_part) {
      template.querySelector('.bnt-show-details').classList.add('disabled');
    }

  }


}