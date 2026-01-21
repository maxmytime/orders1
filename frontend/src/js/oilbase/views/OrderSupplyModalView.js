import { AppView } from '/js/oilbase/views/AppView.js';
import { Helpers } from '/js/oilbase/utils/Helpers.js';

export class OrderSupplyModalView extends AppView {
  constructor() {
    super();
    this.container = document.querySelector('.app-oilbase');            // Контейнер приложения
    this.modalOrderSupply = null;                                       // Шаблон модального окна заявки снабжения
    this.orderSupplySection = this.getTemplate('order-supply-section'); // Шаблон секции
    this.undistributedPart = this.getTemplate('order-supply-undistributed-part'); // Шаблон не распределенной части заявки
    this.helpers = new Helpers();
    // console.log('OrderSupplyModalView');
  }

  // Рендер модальных окон
  renderModal() {
    // console.log('renderModal OrderSupply');
    this.modalOrderSupply = this.getTemplate('modal-order-supply').cloneNode(true);
    this.container.appendChild(this.modalOrderSupply);
  }

  // Открыть модальное окно
  open(tank, basisID, partsList) {
    console.log(tank, basisID, partsList);

    // Базис id
    this.modalOrderSupply.dataset.basisId = basisID;

    //Список не распределенных частей заявок
    const divPartsList = this.modalOrderSupply.querySelector('.order-supply-list-undistributed-parts');
    divPartsList.appendChild(this.creatingListOfParts(partsList));

    // Базис
    this.modalOrderSupply.querySelector('input[name="basis"]').value = tank.name_base;

    // Список емкостей
    this.modalOrderSupply.querySelector('input[name="order-supple-tank-name"]').value = tank.name;

    // Продукт
    this.modalOrderSupply.querySelector('input[name="product"]').value = tank.product.name_product;
    this.modalOrderSupply.querySelector('input[name="product"]').dataset.code = tank.product.code_product;

    // Загрузка/Приход
    // this.modalOrderSupply.querySelector('input[name="order-supple-tank-name"]').value = tank.name;

    // Масса (т)
    this.modalOrderSupply.querySelector('input[name="weight"]').value = tank.weight;

    // Плотность
    this.modalOrderSupply.querySelector('input[name="density"]').value = tank.density;

    // this.openAddNewOrderSupply();
    this.modalOrderSupply.classList.add('is-active');
  }

  // Закрыть модальное окно
  close() {
    const listParts = this.modalOrderSupply.querySelector('.order-supply-list-undistributed-parts');
    listParts.textContent = '';
  }

  // Открываем модальное окно для добавления нововой заявки снабжения
  openAddNewOrderSupply() {

  }

  // Формируем список не распределенных заявок
  creatingListOfParts(partsList) {
    const fragment = document.createDocumentFragment();
    for (const part of partsList) {
      const templatePart = this.undistributedPart.cloneNode(true);
      templatePart.dataset.id = part.id
      templatePart.querySelector('.date-of-shipment').textContent = this.getDateShipment(part.basisDateStart, part.basisDateEnd);
      templatePart.querySelector('.name-client').dataset.code = part.client.code_client;
      templatePart.querySelector('.name-client').textContent = part.client.name_client;
      templatePart.querySelector('.name-product').textContent = part.product.name_product;
      templatePart.querySelector('.volume').textContent = part.volume;

      fragment.appendChild(templatePart);
    }

    return fragment;
  }

  // Формирование списка емкостей
  createListOfTanks(tanksList) {
    const fragment = document.createDocumentFragment();
    const option = document.createElement('option');
    option.textContent = '-';
    fragment.appendChild(option);

    for (const tank of tanksList) {
      const option = document.createElement('option');
      option.value = tank.id;
      option.textContent = tank.name;

      fragment.appendChild(option);
    }

    return fragment;
  }

  // Получить дату отгрузки
  getDateShipment(dateStart, dateEnd) {
    const start = dateStart.split('-');
    const end = dateEnd.split('-');
    return dateStart === dateEnd ?
      `${start[2]}.${start[1]}` :
      `${start[2]}.${start[1]} - ${end[2]}.${end[1]}`;
  }


  // Добавить секциию
  addSection(e) {
    const container = e.target.closest('.order-supple-sections').
      querySelector('.orderc-supple-sections-container');
    const section = this.orderSupplySection.cloneNode(true);
    container.appendChild(section);
  }

  // Получаем ID Базис
  getBasisID(e) {
    return e.target.closest('.oilbasis').dataset.id;
  }

  // Получаем ID Базис
  getTankID(e) {
    return e.target.closest('.tank').dataset.id;
  }

  // Удалить секцию
  delSection(e) {
    const section = e.target.closest('.order-supply-section');
    section.remove();
  }

  // Получаем объект документа
  getDocObject(e, tankNumber) {
    const modal = e.target.closest('.modal-order-supply');
    // console.log(orderSupply);
    const docObject = {
      "number": "",
      "type_dispatch": 1,          // Как то должен меняться в зависимости от типа отгрузка или загрузка
      "code_tank": tankNumber,     // Получить в контроллере
      "date_income": this.helpers.convertDateTo1С(modal.querySelector('input[name="date_dispatch"]').value),
      "product": {
        "name_product": modal.querySelector('input[name="product"]').value,
        "code_product": modal.querySelector('input[name="product"]').dataset.code
      },
      "volume": Number(modal.querySelector('input[name="startVolume"]').value),
      "weight": Number(modal.querySelector('input[name="weight"]').value),         // disabled расчет из volume и density
      "density": Number(modal.querySelector('input[name="density"]').value),       // Возможно нужно получить из емкости
      "sort_number": 1,     // Как то получаю от дамира
      "commentary": modal.querySelector('textarea[name="comment"]').value,
      "author": "site",
      "array_sections": [...this.getSections(modal)],
      "id": "mkkjftsnz6205o1fe1o"
    }
    return docObject;
  }

  // Получаем секции
  getSections(modal) {
    const sectionsNode = [...modal.querySelectorAll('.order-supply-section')];
    const section = sectionsNode.map(sectionNode => {
      return {
        "order_section": 1,
        "name_section": sectionNode.querySelector('.title').textContent,
        "volume_section": sectionNode.querySelector('input[name="order-supply-volume"]').value,
        "array_dispatch": [...sectionNode.querySelectorAll('.order-supply-part')].map(part => {
          return {
            "number_dispatch": part.dataset.numberDispatch,
            "volume_dispatch": part.querySelector('.volume-dispatch').textContent
          }
        })
      }
    });
    return section;
  }

  // Получаем узел модального окна
  getModal(e) {
    return e.target.closest('.modal-order-supply');
  }

  // Получаем значение поля value у элемента
  getElementValue(element, selector) {
    return element.querySelector(selector).value;
  }

  // Распределить заявку в секцию
  handleStartDistribution(e) {
    console.log(e);
    const uPart = e.target.closest('.order-supply-undistributed-part');
    const formOfDistribution = uPart.querySelector('.form-of-distribution');
    const selectSection = formOfDistribution.querySelector('select[name="u-part-section"]');
    const btnOpen = uPart.querySelector('.open');
    const btnClose = uPart.querySelector('.close');

    // Начинаем или завершаем распределение
    if (formOfDistribution.classList.contains('is-hidden')) {
      btnOpen.classList.add('is-hidden');
      btnClose.classList.remove('is-hidden');
      // Получаем все секции в заявке снабжения
      const listSection = this.getSectionsStartDistribution(e);
      // Формируем список options для select в котором находятся секции
      this.creatingListSections(selectSection, listSection);


      formOfDistribution.classList.remove('is-hidden');
    } else {
      btnOpen.classList.remove('is-hidden');
      btnClose.classList.add('is-hidden');
      formOfDistribution.classList.add('is-hidden');
    }

  }

  // Получить секции в заявке-снабжения для начала распределения
  getSectionsStartDistribution(e) {
    const orderSupply = e.target.closest('.modal-order-supply');
    console.log(orderSupply);
    const sections = [ ...orderSupply.querySelectorAll('.order-supply-section') ].map(section => {
        return {
          'name': section.querySelector('.title').textContent,
          'volume': Number(section.querySelector('input[name="order-supply-volume"]').value),
          'distributed': Number(section.querySelector('input[name="order-supply-distributed"]').value),
          'remainder': Number(section.querySelector('input[name="order-supply-remainder"]').value),
        }
    });

    return sections;

  }

  // Формируем список секций
  creatingListSections(element, listSection) {
    console.log(element, listSection);
    element.textContent = '';
    for (const section of listSection) {
      const option = document.createElement('option');
      option.value = section.name;
      option.textContent = section.name;
      option.dataset.volume = section.volume;
      option.dataset.distributed = section.distributed;
      option.dataset.remainder = section.remainder;
      element.append(option);
    }
  }

  // Получаем контейнер приложения
  getContainer() {
    return this.container;
  }

}