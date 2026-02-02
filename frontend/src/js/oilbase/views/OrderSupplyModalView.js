import { AppView } from '/js/oilbase/views/AppView.js';
import { Helpers } from '/js/oilbase/utils/Helpers.js';

export class OrderSupplyModalView extends AppView {
  constructor() {
    super();
    this.container = document.querySelector('.app-oilbase');            // Контейнер приложения
    this.modalOrderSupply = null;                                       // Шаблон модального окна заявки снабжения
    this.orderSupplySection = this.getTemplate('order-supply-section'); // Шаблон секции
    this.undistributedPart = this.getTemplate('order-supply-undistributed-part');  // Шаблон не распределенной части заявки
    this.distributedPart = this.getTemplate('order-supply-distributed-part');      // Шаблон распределенной части заявки
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

    // Имя емкости
    this.modalOrderSupply.querySelector('input[name="order-supple-tank-name"]').value = tank.name;
    this.modalOrderSupply.querySelector('input[name="order-supple-tank-name"]').dataset.id = tank.id;

    // Продукт
    this.modalOrderSupply.querySelector('input[name="product"]').value = tank.product.name_product;
    this.modalOrderSupply.querySelector('input[name="product"]').dataset.code = tank.product.code_product;

    // Объем в емкости
    this.modalOrderSupply.querySelector('input[name="startVolume"]').value = tank.volume;

    // Масса (т)
    this.modalOrderSupply.querySelector('input[name="weight"]').value = tank.weight;

    // Плотность
    this.modalOrderSupply.querySelector('input[name="density"]').value = tank.density;

    // this.openAddNewOrderSupply();
    this.modalOrderSupply.classList.add('is-active');
  }


  // Открыть модальное окно для редактирования заявки снабжения
  edit(tank, basisID, partsList, supplyOrder) {
    console.log(tank, basisID, partsList, supplyOrder);

    // Базис ID
    this.modalOrderSupply.dataset.basisId = basisID;
    // Заявка снабжения ID
    this.modalOrderSupply.dataset.supplyOrderId = supplyOrder.id;

    //Список не распределенных частей заявок
    const divPartsList = this.modalOrderSupply.querySelector('.order-supply-list-undistributed-parts');
    divPartsList.appendChild(this.creatingListOfParts(partsList));

    // Базис
    this.modalOrderSupply.querySelector('input[name="basis"]').value = tank.name_base;

    // Имя емкости
    this.modalOrderSupply.querySelector('input[name="order-supple-tank-name"]').value = tank.name;
    this.modalOrderSupply.querySelector('input[name="order-supple-tank-name"]').dataset.id = tank.id;

    // Продукт
    this.modalOrderSupply.querySelector('input[name="product"]').value = tank.product.name_product;
    this.modalOrderSupply.querySelector('input[name="product"]').dataset.code = tank.product.code_product;

    // Объем в емкости
    this.modalOrderSupply.querySelector('input[name="startVolume"]').value = tank.volume;

    // Объем (л)
    this.modalOrderSupply.querySelector('input[name="supply-volume"]').value = supplyOrder.volume;

    // Загрузка/Приход
    this.modalOrderSupply.
      querySelector('input[name="date_dispatch"]').
        value = this.helpers.convertDateToInput(supplyOrder.date_income);

    // Масса (т)
    this.modalOrderSupply.querySelector('input[name="weight"]').value = tank.weight;

    // Плотность
    this.modalOrderSupply.querySelector('input[name="density"]').value = tank.density;

    //Список не распределенных частей заявок
    const divSection = this.modalOrderSupply.querySelector('.orderc-supple-sections-container');
    for (const section of supplyOrder.array_sections) {
      const tplSection = this.orderSupplySection.cloneNode(true);
      // ID секции
      tplSection.dataset.id = this.helpers.getID();
      // Имя секции
      tplSection.querySelector('.title').textContent = section.name_section;
      tplSection.querySelector('.title').classList.remove('is-hidden');
      tplSection.querySelector('input[name="order-supply-name-section"]').classList.add('is-hidden');
      // Объем
      tplSection.querySelector('input[name="order-supply-volume"]').value = section.volume_section;

      // Блоки заявки
      const divBlocks = tplSection.querySelector('.order-supply-parts');
      for (const block of section.array_dispatch) {
        const tplBlock = this.distributedPart.cloneNode(true);
        const part = partsList.find(part => part.guid === block.guid_orderblock);
        console.log(part);
        // guid
        tplBlock.dataset.guid = block.guid_orderblock
        // number_dispatch
        tplBlock.dataset.numberDispatch = block.number_dispatch
        // Дата
        tplBlock.querySelector('.part-date').textContent = this.getDateShipment(part.dateStart, part.dateEnd);
        // Клиент
        tplBlock.querySelector('.part-partner').textContent = part.client.name_client;
        // Продукт
        tplBlock.querySelector('.part-product').textContent = part.product.name_product;
        // Распределенный объем
        tplBlock.querySelector('.part-remainder').textContent = block.volume_dispatch;
        divBlocks.append(tplBlock);
      }

      //Распределено
      const inputSupplytplDistributed = tplSection.querySelector('input[name="order-supply-distributed"]');
      divBlocks.querySelectorAll('.part-remainder').forEach(remainder => {
        console.log(remainder);
        inputSupplytplDistributed.value = Number(inputSupplytplDistributed.value) + Number(remainder.textContent);
      })

      // Остаток
      tplSection.querySelector('input[name="order-supply-remainder"]').value
        = Number(tplSection.querySelector('input[name="order-supply-volume"]').value)
        - Number(inputSupplytplDistributed.value)

      divSection.appendChild(tplSection);
    }


    // this.openAddNewOrderSupply();
    this.modalOrderSupply.classList.add('is-active');
  }

  // Закрыть модальное окно
  close() {
    const listParts = this.modalOrderSupply.querySelector('.order-supply-list-undistributed-parts');
    listParts.textContent = '';
    const sections = this.modalOrderSupply.querySelector('.orderc-supple-sections-container');
    sections.textContent = '';
  }

  // Открываем модальное окно для добавления нововой заявки снабжения
  openAddNewOrderSupply() {

  }

  // Формируем список не распределенных заявок
  creatingListOfParts(partsList) {
    const fragment = document.createDocumentFragment();
    for (const part of partsList) {
      const templatePart = this.undistributedPart.cloneNode(true);
      templatePart.dataset.id = part.id;
      templatePart.dataset.guid = part.guid;
      templatePart.querySelector('.date-of-shipment').textContent = this.getDateShipment(part.basisDateStart, part.basisDateEnd);
      templatePart.querySelector('.name-client').dataset.code = part.client.code_client;
      templatePart.querySelector('.name-client').textContent = part.client.name_client;
      templatePart.querySelector('.name-product').textContent = part.product.name_product;
      templatePart.querySelector('.volume').textContent = part.volume;
      // console.log(part);
      templatePart.querySelector('.volume-distributed').textContent = part.volume_distributed;

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
    section.dataset.id = this.helpers.getID();
    container.appendChild(section);
  }

  // Ввод имяни секции
  enterNameSection(e) {
    // console.log(e, string);
    const section = e.target.closest('.order-supply-section');
    const title = section.querySelector('.title');
    title.textContent = e.target.value;
  }

  // Кнопка переименовать секцию
  handleRenameSection(e) {
    const section = e.target.closest('.order-supply-section');
    const input = section.querySelector('input[name="order-supply-name-section"]');
    const title = section.querySelector('.title');
    input.value = title.textContent;
    title.classList.toggle('is-hidden');
    input.classList.toggle('is-hidden');

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
      "volume": Number(modal.querySelector('input[name="supply-volume"]').value),
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
    console.log(sectionsNode);
    const section = sectionsNode.map(sectionNode => {
      return {
        "order_section": 1,
        "name_section": sectionNode.querySelector('.title').textContent,
        "volume_section": Number(sectionNode.querySelector('input[name="order-supply-volume"]').value),
        "array_dispatch": [...sectionNode.querySelectorAll('.order-supply-distributed-part')].map(part => {
          return {
            "number_dispatch": part.dataset.numberDispatch || '',
            "volume_dispatch": Number(part.querySelector('.part-remainder').textContent),
            "guid": part.dataset.guid,
          }
        })
      }
    });
    console.log(section);
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

  // Получаем id элемента
  getElementID(element, selector) {
    return element.querySelector(selector).dataset.id;
  }

  // Распределить заявку в секцию
  handleStartDistribution(e) {
    console.log(e);
    const uPart = e.target.closest('.order-supply-undistributed-part');
    const formOfDistribution = uPart.querySelector('.form-of-distribution');
    const selectSection = formOfDistribution.querySelector('select[name="u-part-section"]');
    const btnOpen = uPart.querySelector('.open');
    const btnClose = uPart.querySelector('.close');

    // Блокировка кнопки распределить
    this.lockDistributeButton(e);

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
      uPart.querySelector('input[name="u-section-remainder"]').value = '';
      uPart.querySelector('input[name="u-part-remainder"]').value = '';
      uPart.querySelector('input[name="u-part-load"]').value = '';
      btnOpen.classList.remove('is-hidden');
      btnClose.classList.add('is-hidden');
      formOfDistribution.classList.add('is-hidden');
    }

  }

  // Получить секции в заявке-снабжения для начала распределения
  getSectionsStartDistribution(e) {
    const orderSupply = e.target.closest('.modal-order-supply');
    // console.log(orderSupply);
    const sections = [...orderSupply.querySelectorAll('.order-supply-section')].map(section => {
      return {
        'id': section.dataset.id,
        'name': section.querySelector('.title').textContent,
        'volume': Number(section.querySelector('input[name="order-supply-volume"]').value),
        'distributed': Number(section.querySelector('input[name="order-supply-distributed"]').value),
        'remainder': Number(section.querySelector('input[name="order-supply-remainder"]').value),
      }
    });

    return sections;

  }

  // Блокировка кнопки распределение
  // Если возможный остаток отгрузки 0 или '' кнопка блокируется
  // Событие срабатывает при открытии формы распределение,
  // при вводе данных в поле загрузить, выборе секции
  lockDistributeButton(e) {
    console.log('lockDistributeButton(e)');
    const uPart = e.target.closest('.order-supply-undistributed-part');
    const formOfDistribution = uPart.querySelector('.form-of-distribution');
    const inputLoad = formOfDistribution.querySelector('input[name="u-part-load"]');
    const btnDistribution = formOfDistribution.querySelector('button.btn-end-distribution');
    console.log(btnDistribution, inputLoad.value);
    if (Number(inputLoad.value) === 0 || inputLoad.value === '') {
      console.log('lock');
      btnDistribution.disabled = true;
    } else {
      console.log('unlock');
      btnDistribution.disabled = false;
    }
  }

  // Формируем список секций
  creatingListSections(element, listSection) {
    console.log(element, listSection);
    element.textContent = '';
    const option = document.createElement('option');
    option.textContent = '-';
    option.value = '-';
    element.append(option);
    for (const section of listSection) {
      const option = document.createElement('option');
      option.value = section.id;
      option.textContent = section.name;
      option.dataset.volume = section.volume;
      option.dataset.distributed = section.distributed;
      option.dataset.remainder = section.remainder;
      element.append(option);
    }
  }

  // Выбрать секцию
  selectSection(e) {
    console.log(e.target.value);
    const section = e.target;
    const sectionID = e.target.value;
    const part = e.target.closest('.order-supply-undistributed-part');
    const sectionRemainder = part.querySelector('input[name="u-section-remainder"]');
    const partRemainder = part.querySelector('input[name="u-part-remainder"]');
    const volume = Number(part.querySelector('.volume').textContent);
    const volumeDistributed = Number(part.querySelector('.volume-distributed').textContent);
    const load = part.querySelector('input[name="u-part-load"]');



    if (sectionID === '-') {
      sectionRemainder.value = '';
      partRemainder.value = '';
      load.value = '';
      this.lockDistributeButton(e);
      return;
    }

    const sectionData = this.getSectionsStartDistribution(e).
      find(section => section.id === sectionID);
    console.log(sectionData);
    sectionRemainder.value = sectionData.remainder;
    partRemainder.value = volume - volumeDistributed;

    if (Number(sectionData.remainder) <= Number(volume - volumeDistributed)) {
      load.value = sectionData.remainder;
    } else {
      load.value = volume - volumeDistributed;
    }

    // Блокировка кнопки распределить
    this.lockDistributeButton(e);

  }

  // Ввод объема в секции
  volumeInputSection(e) {
    const section = e.target.closest('.order-supply-section');
    const inputVolume = section.querySelector('input[name="order-supply-volume"]');
    const inputDistributed = section.querySelector('input[name="order-supply-distributed"]');
    const inputRemainder = section.querySelector('input[name="order-supply-remainder"]');
    // console.log(volume, inputDistributed);
    if (Number.isNaN((Number(inputVolume.value) - Number(inputDistributed.value)))) return;
    inputRemainder.value = Number(inputVolume.value) - Number(inputDistributed.value);
  }

  // Валидация поля Загрузка
  validationUploadField(e) {
    const form = e.target.closest('.form-of-distribution');
    const partLoad = Number(e.target.value);
    const sectionSelectValue = form.querySelector('select[name="u-part-section"]').value;
    const sectionRemainder = Number(form.querySelector('input[name="u-section-remainder"]').value);
    const partRemainder = Number(form.querySelector('input[name="u-part-remainder"]').value);

    if (sectionSelectValue === '-') return;

    if (sectionRemainder <= partRemainder) {
      if (partLoad > sectionRemainder) e.target.value = sectionRemainder;
    } else {
      if (partLoad > partRemainder) e.target.value = partRemainder;
    }

    this.lockDistributeButton(e);
  }

  // Конец распределения объема в секцию, в секции создается или обнавляется
  // существующий блок заявки
  handleEndDistribution(e, part) {
    console.log(part);
    const modal = e.target.closest('.modal-order-supply');
    const undistributedPart = e.target.closest('.order-supply-undistributed-part');
    const sectionID = undistributedPart.querySelector('select[name="u-part-section"]').value;
    const containerOrderSupplyParts = modal.querySelector(`div[data-id="${sectionID}"] .order-supply-parts`);
    const volumeLoad = e.target.closest('.form-of-distribution').
      querySelector('input[name="u-part-load"]').value;
    const guid = e.target.closest('.order-supply-undistributed-part').dataset.guid

    // Наполняем шаблон распределенного блока заявки даннми и вставляем его в секцию
    this.distributedVolume(guid, containerOrderSupplyParts, part, volumeLoad);

    // Обновляем поле Распределено в секции
    const section = modal.querySelector(`div[data-id="${sectionID}"]`);
    const inputVolume = section.querySelector('input[name="order-supply-volume"]');
    const inputDistributed = section.querySelector('input[name="order-supply-distributed"]');
    const inputRemainder = section.querySelector('input[name="order-supply-remainder"]');
    inputDistributed.value = Number(inputDistributed.value) + Number(volumeLoad);
    // console.log(volume, inputDistributed);
    if (Number.isNaN((Number(inputVolume.value) - Number(inputDistributed.value)))) return;
    inputRemainder.value = Number(inputVolume.value) - Number(inputDistributed.value);

    // Обновляем поле распределено в нераспределенной части заявки
    const volumeDistributed = e.target.closest('.order-supply-undistributed-part')
      .querySelector('.volume-distributed');
    volumeDistributed.textContent = Number(volumeDistributed.textContent) + Number(volumeLoad);

    // Скрываем форму распределения и очищаем поля
    const uPart = e.target.closest('.order-supply-undistributed-part');
    uPart.querySelector('input[name="u-section-remainder"]').value = '';
    uPart.querySelector('input[name="u-part-remainder"]').value = '';
    uPart.querySelector('input[name="u-part-load"]').value = '';
    const btnOpen = uPart.querySelector('.open');
    const btnClose = uPart.querySelector('.close');
    btnOpen.classList.remove('is-hidden');
    btnClose.classList.add('is-hidden');
    const formDistribution = e.target.closest('.form-of-distribution');
    formDistribution.classList.add('is-hidden');
  }

  // Добавить новый блок заявки в секциию, если такой блок уже существует в секции
  // то прибавить распределяемый объем к объему блока в секции
  distributedVolume(guid, container, partData, volumeLoad) {

    // Если такой блок уже распределен то обнавляем его остаток
    const distributedBlocks = [ ...container.children ];
    if (distributedBlocks.length) {
      for (const block of distributedBlocks) {
        if (block.dataset.guid === guid) {
          const remainder = block.querySelector('.part-remainder').textContent;
          block.querySelector('.part-remainder').textContent = Number(remainder) + Number(volumeLoad);
          return;
        }
      }
    }

    // Если болка нет то добавляем его в секцию
    const distributedPart = this.distributedPart.cloneNode(true);
    distributedPart.dataset.guid = guid;
    distributedPart.querySelector('.part-date').textContent = this.getDateShipment(partData.basisDateStart,
                                                                                    partData.basisDateEnd)
    distributedPart.querySelector('.part-partner').textContent = partData.client.name_client;
    distributedPart.querySelector('.part-product').textContent = partData.product.name_product;
    distributedPart.querySelector('.part-remainder').textContent = volumeLoad;
    container.append(distributedPart);
  }

  // Удаляем распределенный блок из секции
  handleDeletBlock(e) {
    const block = e.target.closest('.order-supply-distributed-part');
    const blockRemainder = Number(block.querySelector('.part-remainder').textContent);
    const section = e.target.closest('.order-supply-section');
    const sectionDistributed = section.querySelector('input[name="order-supply-distributed"]');
    const sectionRemainder = section.querySelector('input[name="order-supply-remainder"]');
    sectionDistributed.value = Number(sectionDistributed.value) - blockRemainder;
    sectionRemainder.value = Number(sectionRemainder.value) + blockRemainder;

    block.remove();
  }

  // Получаем контейнер приложения
  getContainer() {
    return this.container;
  }

}