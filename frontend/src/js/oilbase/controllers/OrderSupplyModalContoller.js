import { ApiClient } from '/js/oilbase/models/ApiClient.js';
import { UpdatingView } from '/js/oilbase/services/UpdatingView.js';

export class OrderSupplyModalContoller {
  constructor(modelApp,
    orderSupplyModalModel,
    orderSupplyModalView,
    partDistributedModalController,
    helpers,
    socket,
    orderSupplyControllerFactory) {
    this.modelApp = modelApp;
    this.model = orderSupplyModalModel;
    this.view = orderSupplyModalView;
    this.partDistributedModalController = partDistributedModalController;
    this.api = new ApiClient();
    this.helpers = helpers;
    this.socket = socket.socket;
    this.orderSupplyControllerFactory = orderSupplyControllerFactory;
    this.dispatchList = [];
    this.updatingView = new UpdatingView();

    // console.log('OrderSupplyModalContoller');
    // Контроллер подписывается на событие ввода данных в поле Базис,
    // this.view.getContainer().addEventListener('input', this.dropdown.bind(this));
    // Контроллер подписывается на событие добавление новой секции
    this.view.getContainer().addEventListener('click', this.addSection.bind(this));
    // Контроллер подписывается на событие удалить секцию
    this.view.getContainer().addEventListener('click', this.delSection.bind(this));
    // Контроллер подписывается на событие открытие модального окна распределения заявки
    // this.view.getContainer().addEventListener('click', this.openPartDistributed.bind(this));
    // Контроллер подписывается на событие клик по кнопки создать заявка снабжение
    // this.view.getContainer().addEventListener('click', this.open.bind(this));
    // Контроллер подписывается на событие клик по кнопке закрыть модальное окно
    this.view.getContainer().addEventListener('click', this.close.bind(this));
    // Контроллер подписывается на событие клик по кнопке создать заявку снабжения
    this.view.getContainer().addEventListener('click', this.createOrderSupply.bind(this));
    // Контроллер подписывается на событие клик по кнопке редактировать заявку снабжения
    this.view.getContainer().addEventListener('click', this.editOrderSupply.bind(this));
    // Контроллер подписывается на событие клик по кнопке создать заявку снабжения с типом отгрузка на свой склад
    this.view.getContainer().addEventListener('click', this.createOrderSupplyWarehouse.bind(this));
    // Контроллер подписывается на событие клик по кнопке редактировать заявку снабжения с типом отгрузка на свой склад
    this.view.getContainer().addEventListener('click', this.editOrderSupplyWarehouse.bind(this));
    // Контроллер подписывается на событие клик по кнопке начать распределение в секцию
    this.view.getContainer().addEventListener('click', this.handleStartDistribution.bind(this));
    // Контроллер подписывается на событие ввода именя секции
    this.view.getContainer().addEventListener('input', this.enterNameSection.bind(this));
    // Контроллер подписывается на событие нажатия кнопки  переименовать секцию
    this.view.getContainer().addEventListener('click', this.handleRenameSection.bind(this));
    // Контроллер подписывается на событие нажатия кнопки  закончить распределение в  секцию
    this.view.getContainer().addEventListener('click', this.handleEndDistribution.bind(this));
    // Контроллер подписывается на событие выбора секции
    this.view.getContainer().addEventListener('change', this.selectSection.bind(this));
    // Контроллер подписывается на событие ввода данных в поле загрузка
    this.view.getContainer().addEventListener('input', this.validationUploadField.bind(this));
    // Контроллер подписывается на событие ввода данных в поле объем в секции
    this.view.getContainer().addEventListener('input', this.volumeInputSection.bind(this));
    // Контроллер подписывается на событие ввода объема отгрузки на свой склад
    this.view.getContainer().addEventListener('input', this.volumeInputWarehouse.bind(this));
    // Контроллер подписывается на событие удаления блока из секции
    this.view.getContainer().addEventListener('click', this.handleDeletBlock.bind(this));
    // Контроллер подписывается на событие клика по элементу выпадающегося списка
    this.view.getContainer().addEventListener('click', this.selectAnItem.bind(this));
    // Контроллер подписывается на событие переключения свича "Отгрузка на свой склад"
    this.view.getContainer().addEventListener('change', this.handleToYourWarehouse.bind(this));
    // Контроллер подписывается на событие нажата кнопка добавить свой слад
    this.view.getContainer().addEventListener('click', this.handleAddWarehouse.bind(this));
    // Контроллер подписывается на событие нажата кнопка удалить свой слад
    this.view.getContainer().addEventListener('click', this.handleDeleteWarehouse.bind(this));
    // Контроллер подписывается на событие нажата кнопка начало отгрузки
    this.view.getContainer().addEventListener('click', this.handleShippingStart.bind(this));
    // Контроллер подписывается на событие нажата кнопка отмена начало отгрузки
    this.view.getContainer().addEventListener('click', this.handleShippingСancellation.bind(this));
    // Контроллер подписывается на событие ввода фактически отгружаемго объема
    this.view.getContainer().addEventListener('input', this.volumeInputFact.bind(this));
    // Контроллер подписывается на событие загрузка заявки снабжения
    this.view.getContainer().addEventListener('click', this.shippingOrderSupply.bind(this));

  }

  // Открыть модальное окно для создания новой заявки снабжения
  open(e) {
    const tankID = this.view.getTankID(e);
    const { tank, basisID } = this.modelApp.getTank(tankID);
    const partsList = this.modelApp.getListUndistributedParts(basisID);
    this.view.open(tank, basisID, partsList);
  }

  // Открыть модальное окно для редактирования заявки снабжения
  edit(e) {
    console.log('edit');
    const tankID = this.view.getTankID(e);
    const { tank, basisID } = this.modelApp.getTank(tankID);
    const partsList = this.modelApp.getListUndistributedParts(basisID);
    const supplyOrderID = e.target.closest('.order-supply').dataset.id;
    console.log(partsList);
    const supplyOrder = this.modelApp.getSupplyOrder(supplyOrderID);
    console.log(supplyOrder);

    if (supplyOrder.type_suplorder === 2) {
      // Запоминаем исходный список распределенных блоков заявки
      this.dispatchList = this.createDispatchList(supplyOrder);
      this.view.edit(tank, basisID, partsList, supplyOrder);
    }

    if (supplyOrder.type_suplorder === 1) {
      // Добавляем список емкостей
      supplyOrder.array_sections.forEach(section => {
        section.array_tanks.forEach(tank => {
          tank.tanksList = this.modelApp.getBasis(tank.name_basis).listOfTanks;
        })
      })
      this.view.editWarehouse(tank, basisID, partsList, supplyOrder);
    }

  }

  // Создать список распределенных блоков заявки
  createDispatchList(supplyOrder) {
    let dispatchList = [];
    supplyOrder.array_sections.forEach(section => {
      section.array_dispatch.forEach(dispatch => {
        dispatchList.push({
          'name_section': section.name_section,
          'number_dispatch': dispatch.number_dispatch,
          'volume_dispatch': dispatch.volume_dispatch,
          "volume_dispatch_fact": dispatch.volume_dispatch_fact,
          "weight_dispatch_fact": dispatch.weight_dispatch_fact,
          "density_dispatch_fact": dispatch.density_dispatch_fact,
        })

      })
    })
    return dispatchList;
  }

  // Создание объекта для обновления списка распределенных блоков заявки
  createObjectUpdate(oldDispatchList, newDispatchList) {
    let objectUpdate = {
      'delete': [],
      'edit': [],
      'create': []
    }


    // Определяем распределенные блоки заявки, которые нужно удалить
    oldDispatchList.forEach(oldDispatch => {
      console.log(oldDispatch);
      const status = newDispatchList.find(newDispach =>
        newDispach.number_dispatch === oldDispatch.number_dispatch);
      if (!status) {
        objectUpdate.delete.push(oldDispatch);
      }
    })

    // Определяем блоки заявки, которые нужно обновить
    oldDispatchList.forEach(oldDispatch => {

      const newDispach = newDispatchList.find(newDispach =>
        newDispach.number_dispatch === oldDispatch.number_dispatch &&
        newDispach.volume_dispatch !== oldDispatch.volume_dispatch ||
        newDispach.number_dispatch === oldDispatch.number_dispatch &&
        newDispach.volume_dispatch_fact !== oldDispatch.volume_dispatch_fact);
      console.log(oldDispatch, newDispach);
      if (newDispach) {

        objectUpdate.edit.push(newDispach);
      }
    })

    // Определяем блоки заявки, которые нужно создать
    objectUpdate.create = newDispatchList.filter(newDispach => newDispach.number_dispatch === '');

    return objectUpdate;
  }

  close(e) {
    if (e.target.classList.contains('delete-modal')) {
      this.dispatchList = [];
      const modal = e.target.closest('.modal-order-supply');
      if (modal) {
        this.view.close();
      }
    }

  }

  // Добавить секциию
  addSection(e) {
    if (e.target.classList.contains('btn-add-section')) {
      console.log('addSection(e)');
      this.view.addSection(e);
    }
  }

  // Ввод имяни секции
  enterNameSection(e) {
    if (e.target.name === 'order-supply-name-section') {
      console.log('renameSection(e)');
      console.log(e.target);
      this.view.enterNameSection(e, '123');
    }
  }

  // Кнопка переименовать секцию
  handleRenameSection(e) {
    if (e.target.classList.contains('btn-rename-section')) {
      console.log('handleRenameSection(e)');
      this.view.handleRenameSection(e);
    }
  }

  // Удалить секцию
  delSection(e) {
    if (e.target.classList.contains('btn-del-section')) {
      console.log('delSection(e)');
      this.view.delSection(e);
    }
  }

  // Начало распределения заявки в секцию
  handleStartDistribution(e) {
    if (e.target.classList.contains('btn-start-distribution')) {
      console.log('handleStartDistribution(e)');
      this.view.handleStartDistribution(e);
    }
  }

  // Выбрать секцию
  selectSection(e) {
    if (e.target.name === 'u-part-section') {
      console.log('selectSection(e)');
      this.view.selectSection(e);
    }
  }

  // Конец распределения заявки в секцию
  handleEndDistribution(e) {
    if (e.target.classList.contains('btn-end-distribution')) {
      // console.log('handleEndDistribution(e)');
      const partID = e.target.closest('.order-supply-undistributed-part').dataset.id;
      const part = this.modelApp.getPart(partID).part;
      this.view.handleEndDistribution(e, part);
    }
  }

  // Ввод объема в секции
  volumeInputSection(e) {
    if (e.target.name === 'order-supply-volume') {
      this.view.volumeInputSection(e);
    }
  }

  // Удаляем распределенный блок из секции
  handleDeletBlock(e) {
    if (e.target.classList.contains('btn-del-block')) {
      this.view.handleDeletBlock(e);
    }
  }

  // Включаем тип заявки снабжения - отгрузка на  свой склад
  handleToYourWarehouse(e) {
    if (e.target.classList.contains('order-supply-to-your-warehouse')) {
      console.log('handleToYourWarehouse');
      console.log(e.target.checked);
      this.view.handleToYourWarehouse(e);
    }
  }

  // Кнопка добавить свой склад
  handleAddWarehouse(e) {
    if (e.target.classList.contains('btn-add-warehouse')) {
      this.view.handleAddWarehouse(e);
    }
  }

  // Кнопка удалить свой склад
  handleDeleteWarehouse(e) {
    if (e.target.classList.contains('btn-del-warehous')) {
      this.view.handleDeleteWarehouse(e);
    }
  }

  // Ввод объема в отгрузки на свой склад
  volumeInputWarehouse(e) {
    if (e.target.name === 'warehouse_volume') {
      console.log('volumeInputWarehouse');
      this.view.volumeInputWarehouse(e);
    }
  }

  // Кнопка начало отгрузки
  handleShippingStart(e) {
    if (e.target.classList.contains('btn-os-shipping-start')) {
      this.view.handleShippingStart(e);
    }
  }

  // Кнопка отмена начало отгрузки
  handleShippingСancellation(e) {
    if (e.target.classList.contains('btn-os-shipping-cancellation')) {
      this.view.handleShippingСancellation(e);
    }
  }

  // Ввод объема отгрузки факт
  volumeInputFact(e) {
    if (e.target.name === 'os-volume_fact') {
      console.log('volumeInputFact(e)');
      this.view.totalVolumeInputFact(e);
    }
  }

  // Создать заявку снабжение
  async createOrderSupply(e) {
    if (e.target.classList.contains('btn-create-order-supply')) {
      // console.log(e.target);
      const modal = this.view.getModal(e);  // Получаем узел модального окна
      const tankID = this.view.getElementID(modal, 'input[name="order-supple-tank-name"]'); // Получаем значение поля value у узла
      const tankNumber = this.modelApp.getTank(tankID).tank.code;  // Получаем номер емкости
      console.log(tankNumber);
      const docObject = this.view.getDocObject(e, tankNumber);     // Получаем объект документа
      console.log(this.createDispatchList(docObject));
      console.log(this.dispatchList);
      // console.log(this.createObjectUpdate(this.dispatchList, this.createDispatchList(docObject)));
      // this.view.getSections(modal);

      // Получаем number_dispach для распределенных блоков заявки
      for (const [index, section] of docObject.array_sections.entries()) {
        for (const block of section.array_dispatch) {

          console.log(block.number_dispatch);

          const dispatch = {
            'number': '',                //только для изменений, номер распределенной части, присваивается при создании
            'type_action_dispatch': 1,   //аналогично type_action_order (1 - новая, 2 - обновить данные, 3 - отгрузить)
            'type_dispatch': 2,          //тип заявки, 1 - приход, 2 - расход
            'code_tank': docObject.code_tank,      //код емкости docObject.code_tank
            'date_income': "01010001",             //дата загрузки
            'date_dispatch': '28.01.2026',         //дата отгрузки part.date_dispatch
            'code_client': this.modelApp.getPartGuid(block.guid_orderblock).part.client.code_client,   //код клиента
            'code_product': docObject.product.code_product,    //код продукта
            'id_order': this.modelApp.getPartGuid(block.guid_orderblock).part.id_order,         //номер заказа менеджера
            'num_address': this.modelApp.getPartGuid(block.guid_orderblock).part.num_address,   //номер адреса в заявке
            'num_basis': this.modelApp.getPartGuid(block.guid_orderblock).part.num_basis,       //номер базиса в заявке
            'volume': block.volume_dispatch,                   //объем
            'weight': docObject.weight,                        //вес
            'density': docObject.density,                      //плотность
            'commentary': docObject.commentary,
            'sort_number': index,
            'guid_orderblock': block.guid_orderblock
          }

          console.log(dispatch);
          const status = await this.api.fetchPostData('/postupdatedispatch', dispatch);
          console.log(status.Data);
          block.number_dispatch = status.Data;
        }
      }

      // Формируем объект для создания заявки снабжения
      const supply = {
        "number": "", //только для изменений, номер заявки снабжения, присваивается при создании
        "type_action_suplorder": 1, //аналогично type_action_order (1 - новая, 2 - обновить данные)
        "type_suplorder": 2,  //тип заявки снабжения, 1 - приход, 2 - расход
        "code_tank": docObject.code_tank, //код емкости
        "date_income": docObject.date_income,  //дата загрузки
        "code_product": docObject.product.code_product,  //код продукта
        "volume": docObject.volume,    // объем
        "weight": docObject.weight,    // вес
        "density": docObject.density,  // плотность
        "commentary": docObject.commentary,
        "array_sections": docObject.array_sections.map((section, index) => {
          ++index;
          if (section.array_dispatch.length) {
            return section.array_dispatch.map(part => {
              console.log(part);
              return {
                "sort_number": index,
                "name_section": section.name_section,
                "volume_section": section.volume_section,  //объем секции
                "number_dispatch": part.number_dispatch,    //номер распределенного блока заявки
              }
            })
          } else {
            return {
              "sort_number": index,
              "name_section": section.name_section,
              "volume_section": section.volume_section,  //объем секции
              "number_dispatch": ''    //номер распределенного блока заявки
            }
          }

        }).flat(Infinity)
      }

      // console.log(supply);

      // Отправляем данные для создания заявки снабжения
      const status = await this.api.fetchPostData('/postupdatesuplorder', supply);
      console.log(status);

      // Добавляем новую заявку снабжения в модель
      if (status.Status === 'OK') {
        docObject.number = status.Data;
        docObject.type_suplorder = 2;
        console.log(docObject);
        const tankID = this.modelApp.addOrderSupply(docObject);

        // Рисуем новую заявку снабжения в емкости
        if (tankID) {
          const orderSupplyController = this.orderSupplyControllerFactory.create(docObject);
          orderSupplyController.renderNewOrderSupply(docObject, tankID);
          this.view.close();
        }
      }
    }

    // this.dispatchList = [];
    // this.view.close();
  }

  // Редактироваnm заявкe снабжения
  async editOrderSupply(e, status = false) {
    if (e.target.classList.contains('btn-edit-order-supply') || status) {
      console.log('editOrderSupply(e)');
      // supply-order-id
      const modal = this.view.getModal(e);  // Получаем узел модального окна
      const tankID = this.view.getElementID(modal, 'input[name="order-supple-tank-name"]'); // Получаем значение поля value у узла
      const tankNumber = this.modelApp.getTank(tankID).tank.code;  // Получаем номер емкости
      const docObject = this.view.getDocObject(e, tankNumber);     // Получаем объект документа
      const supplyOrderID = modal.dataset.supplyOrderId;    // ID заявки снабжения
      const supplyOrder = this.modelApp.getSupplyOrder(supplyOrderID);
      // console.log(supplyOrder);

      // console.log(supplyOrderID);
      // console.log(this.createDispatchList(docObject));
      // console.log(this.dispatchList);
      // console.log(this.createObjectUpdate(this.dispatchList, this.createDispatchList(docObject)));

      const objectUpdate = this.createObjectUpdate(this.dispatchList,
        this.createDispatchList(docObject));

      // Удаляем распределенные блоки
      for (const block of objectUpdate.delete) {
        const dispatch = {
          'number': block.number_dispatch,                //только для изменений, номер распределенной части, присваивается при создании
          'type_action_dispatch': 4,   //аналогично type_action_order (1 - новая, 2 - обновить данные, 3 - отгрузить)
          // 'type_dispatch': 2,          //тип заявки, 1 - приход, 2 - расход
          // 'code_tank': '',      //код емкости docObject.code_tank
          // 'date_income': "01010001",             //дата загрузки
          // 'date_dispatch': '28.01.2026',         //дата отгрузки part.date_dispatch
          // 'code_client': this.modelApp.getPartGuid(block.guid).part.client.code_client,   //код клиента
          // 'code_product': docObject.product.code_product,    //код продукта
          // 'id_order': this.modelApp.getPartGuid(block.guid).part.id_order,         //номер заказа менеджера
          // 'num_address': this.modelApp.getPartGuid(block.guid).part.num_address,   //номер адреса в заявке
          // 'num_basis': this.modelApp.getPartGuid(block.guid).part.num_basis,       //номер базиса в заявке
          // 'volume': block.volume_dispatch,                   //объем
          // 'weight': docObject.weight,                        //вес
          // 'density': docObject.density,                      //плотность
          // 'commentary': docObject.commentary,
          // 'sort_number': index,
          // 'guid_orderblock': block.guid_orderblock
        }
        // console.log(dispatch);
        const status = await this.api.fetchPostData('/postupdatedispatch', dispatch);
        // console.log(status);
      }

      // Получаем number_dispach для новых блоков и обновляем
      // существующие блоки если в них изменился объем
      for (const [index, section] of docObject.array_sections.entries()) {
        for (const block of section.array_dispatch) {

          // Если поле number_dispatch === '', то новыйблок
          if (block.number_dispatch === '') {
            // console.log(block.number_dispatch);

            const dispatch = {
              'number': '',                //только для изменений, номер распределенной части, присваивается при создании
              'type_action_dispatch': 1,   //аналогично type_action_order (1 - новая, 2 - обновить данные, 3 - отгрузить)
              'type_dispatch': 2,          //тип заявки, 1 - приход, 2 - расход
              'code_tank': '',             //код емкости docObject.code_tank
              'date_income': "01010001",             //дата загрузки
              'date_dispatch': '28.01.2026',         //дата отгрузки part.date_dispatch
              'code_client': this.modelApp.getPartGuid(block.guid_orderblock).part.client.code_client,   //код клиента
              'code_product': docObject.product.code_product,    //код продукта
              'id_order': this.modelApp.getPartGuid(block.guid_orderblock).part.id_order,         //номер заказа менеджера
              'num_address': this.modelApp.getPartGuid(block.guid_orderblock).part.num_address,   //номер адреса в заявке
              'num_basis': this.modelApp.getPartGuid(block.guid_orderblock).part.num_basis,       //номер базиса в заявке
              'volume': block.volume_dispatch,                   //объем
              'weight': docObject.weight,                        //вес
              'density': docObject.density,                      //плотность
              'commentary': docObject.commentary,
              'sort_number': index,
              'guid_orderblock': block.guid_orderblock,
              "volume_fact": block.volume_dispatch_fact,
              "weight_fact": block.weight_dispatch_fact,
              "density_fact": block.density_dispatch_fact,
            }

            // console.log(dispatch);
            const status = await this.api.fetchPostData('/postupdatedispatch', dispatch);
            // console.log(status);
            block.number_dispatch = status.Data;
          }

          // Если поле number_dispatch !== '' && такой блок есть в списке на редактирование
          // то это заявка на редактирование
          if (block.number_dispatch !== '' && objectUpdate.edit.filter(dispatch => dispatch.number_dispatch === block.number_dispatch)) {

            console.log(block);

            const dispatch = {
              'number': block.number_dispatch, //только для изменений, номер распределенной части, присваивается при создании
              'type_action_dispatch': 2,   //аналогично type_action_order (1 - новая, 2 - обновить данные, 3 - отгрузить)
              'type_dispatch': 2,          //тип заявки, 1 - приход, 2 - расход
              'code_tank': '',             //код емкости docObject.code_tank
              'date_income': "01010001",             //дата загрузки
              'date_dispatch': '28.01.2026',         //дата отгрузки part.date_dispatch
              'code_client': this.modelApp.getPartGuid(block.guid_orderblock).part.client.code_client,   //код клиента
              'code_product': docObject.product.code_product,    //код продукта
              'id_order': this.modelApp.getPartGuid(block.guid_orderblock).part.id_order,         //номер заказа менеджера
              'num_address': this.modelApp.getPartGuid(block.guid_orderblock).part.num_address,   //номер адреса в заявке
              'num_basis': this.modelApp.getPartGuid(block.guid_orderblock).part.num_basis,       //номер базиса в заявке
              'volume': block.volume_dispatch,                   //объем
              'weight': docObject.weight,                        //вес
              'density': docObject.density,                      //плотность
              'commentary': docObject.commentary,
              'sort_number': index,
              'guid_orderblock': block.guid_orderblock,
              "volume_fact": block.volume_dispatch_fact,
              "weight_fact": block.weight_dispatch_fact,
              "density_fact": block.density_dispatch_fact,
            }

            console.log(dispatch);
            const status = await this.api.fetchPostData('/postupdatedispatch', dispatch);
            console.log(status);
            // this.view.close();
          }


        }
      }

      // Формируем объект для редактирования заявки снабжения
      const supply = {
        "number": supplyOrder.number, //только для изменений, номер заявки снабжения, присваивается при создании
        "type_action_suplorder": 2, //аналогично type_action_order (1 - новая, 2 - обновить данные)
        "type_suplorder": 2,  //тип заявки снабжения, 1 - приход, 2 - расход
        "code_tank": docObject.code_tank, //код емкости
        "date_income": docObject.date_income,  //дата загрузки
        "code_product": docObject.product.code_product,  //код продукта
        "volume": docObject.volume,    // объем
        "weight": docObject.weight,    // вес
        "density": docObject.density,  // плотность
        "commentary": docObject.commentary,
        "volume_fact": docObject.volume_fact,
        "weight_fact": docObject.weight_fact,
        "density_fact": docObject.density_fact,
        "array_sections": docObject.array_sections.map((section, index) => {
          ++index;
          if (section.array_dispatch.length) {
            return section.array_dispatch.map(part => {
              // console.log(part);
              return {
                "sort_number": index,
                "name_section": section.name_section,
                "volume_section": section.volume_section,  //объем секции
                "volume_section_fact": section.volume_section_fact,
                "weight_section_fact": section.weight_section_fact,
                "density_section_fact": section.density_section_fact,
                "number_dispatch": part.number_dispatch,    //номер распределенного блока заявки
                "volume_dispatch_fact": part.volume_dispatch_fact,
                "weight_dispatch_fact": part.weight_dispatch_fact,
                "density_dispatch_fact": part.density_dispatch_fact,
              }
            })
          } else {
            return {
              "sort_number": index,
              "name_section": section.name_section,
              "volume_section": section.volume_section,  //объем секции
              "volume_section_fact": section.volume_section_fact,
              "weight_section_fact": section.weight_section_fact,
              "density_section_fact": section.density_section_fact,
              "number_dispatch": ''    //номер распределенного блока заявки
            }
          }

        }).flat(Infinity)
      }

      console.log(supply);
      // console.log(docObject);

      // Отправляем данные для создания заявки снабжения
      const status = await this.api.fetchPostData('/postupdatesuplorder', supply);
      console.log(status);

      // Добавляем новую заявку снабжения в модель
      if (status.Status === 'OK') {
        docObject.number = status.Data;
        docObject.type_suplorder = 2;
        console.log(docObject);
        const tankID = this.modelApp.updateOrderSupply(docObject);
        console.log(tankID);
        this.view.close();
        console.log(supply);
        return {'data': supply, 'id': docObject.id};
      }
    }
  }

  // Создать заявку снабжение с типом отгрузка на свой склад
  async createOrderSupplyWarehouse(e) {
    if (e.target.classList.contains('btn-create-order-supply-warehous')) {
      const modal = this.view.getModal(e);  // Получаем узел модального окна
      const tankID = this.view.getElementID(modal, 'input[name="order-supple-tank-name"]'); // Получаем значение поля value у узла
      const tankNumber = this.modelApp.getTank(tankID).tank.code;  // Получаем номер емкости
      console.log(tankNumber);
      const docObject = this.view.getDocObject(e, tankNumber);     // Получаем объект документа

      // Формируем объект для создания заявки снабжения
      const supply = {
        "number": "", //только для изменений, номер заявки снабжения, присваивается при создании
        "type_action_suplorder": 1, //аналогично type_action_order (1 - новая, 2 - обновить данные)
        "type_suplorder": 1,  //тип заявки снабжения, 1 - приход, 2 - расход
        "code_tank": docObject.code_tank, //код емкости
        "date_income": docObject.date_income,  //дата загрузки
        "code_product": docObject.product.code_product,  //код продукта
        "volume": docObject.volume,    // объем
        "weight": docObject.weight,    // вес
        "density": docObject.density,  // плотность
        "commentary": docObject.commentary,
        "array_sections": docObject.array_sections
      }

      // console.log(supply);

      // Отправляем данные для создания заявки снабжения
      const status = await this.api.fetchPostData('/postupdatesuplorder', supply);
      console.log(status);

      // Добавляем новую заявку снабжения в модель
      if (status.Status === 'OK') {
        docObject.number = status.Data;
        docObject.type_suplorder = 1;
        docObject.array_sections = this.view.getSectionsWarehouseToModel(modal);
        const tankID = this.modelApp.addOrderSupply(docObject);
        console.log(docObject);
        // Рисуем новую заявку снабжения в емкости
        if (tankID) {
          const orderSupplyController = this.orderSupplyControllerFactory.create(docObject);
          orderSupplyController.renderNewOrderSupply(docObject, tankID);
          this.view.close();
        }
      }
    }

    // this.dispatchList = [];
    // this.view.close();
  }

  // Редактировать заявку снабжения с типом на свой склад
  async editOrderSupplyWarehouse(e, status = false) {
    if (e.target.classList.contains('btn-edit-order-supply-warehouse') || status) {
      console.log('editOrderSupplyWarehouse');
      const modal = this.view.getModal(e);  // Получаем узел модального окна
      const tankID = this.view.getElementID(modal, 'input[name="order-supple-tank-name"]'); // Получаем значение поля value у узла
      const tankNumber = this.modelApp.getTank(tankID).tank.code;  // Получаем номер емкости
      // console.log(tankNumber);
      const docObject = this.view.getDocObject(e, tankNumber);     // Получаем объект документа
      const supplyOrderID = modal.dataset.supplyOrderId;           // ID заявки снабжения
      const supplyOrder = this.modelApp.getSupplyOrder(supplyOrderID);

      // Формируем объект для создания заявки снабжения
      const supply = {
        "number": supplyOrder.number, //только для изменений, номер заявки снабжения, присваивается при создании
        "type_action_suplorder": 2, //аналогично type_action_order (1 - новая, 2 - обновить данные)
        "type_suplorder": 1,  //тип заявки снабжения, 1 - приход, 2 - расход
        "code_tank": docObject.code_tank, //код емкости
        "date_income": docObject.date_income,  //дата загрузки
        "code_product": docObject.product.code_product,  //код продукта
        "volume": docObject.volume,    // объем
        "weight": docObject.weight,    // вес
        "density": docObject.density,  // плотность
        "volume_fact": docObject.volume_fact,
        "weight_fact": docObject.weight_fact,
        "density_fact": docObject.density_fact,
        "commentary": docObject.commentary,
        "array_sections": docObject.array_sections
      }


      console.log(supply);
      // Отправляем данные для обновления заявки снабжения
      const status = await this.api.fetchPostData('/postupdatesuplorder', supply);
      console.log(status);


      // Добавляем новую заявку снабжения в модель
      if (status.Status === 'OK') {
        docObject.number = status.Data;
        docObject.type_suplorder = 1;
        docObject.array_sections = this.view.getSectionsWarehouseToModel(modal);
        console.log(docObject);
        const tankID = this.modelApp.updateOrderSupply(docObject);

        this.view.close();
        // console.log(supply);
        return {'data': supply, 'id': docObject.id};
      }
    }
  }

  // Загрузка заявки снабжения
  async shippingOrderSupply(e) {
    if (e.target.classList.contains('btn-order-supply-shipping')) {
      // console.log('shippingOrderSupply(e)');
      // Определяем тип ЗС: true - на свой склад, false - под клиента
      const typeOrderSupplyWarehous = this.view.modalOrderSupply.querySelector('.warehous') ? true : false;
      let supply = null;

      if (!typeOrderSupplyWarehous) {
        supply = await this.editOrderSupply(e, true);
      } else if (typeOrderSupplyWarehous) {
        supply = await this.editOrderSupplyWarehouse(e, true);
      }

      // Устанавливаем тип действия 3 - отгрузить заявку
      // supply.type_action_suplorder = 3;

      console.log(supply);
      // Отправляем данные для обновления заявки снабжения
      const status = await this.api.fetchPostData('/postupdatesuplorder', supply.data);
      console.log(status);

      if (status.Status === 'OK') {
        const id = supply.id;                    // Получаем ID заявки снабжения.
        console.log(id);
        this.modelApp.deleteOrderSupply(id);     // Удаляем заявку снабжения из модели.
        this.updatingView.deleteElementByID(id); // Удаляем загруженную ЗС из интерфейса.
      }
      
    }
  }

  // Валидация поля Загрузка
  validationUploadField(e) {
    if (e.target.name === 'u-part-load') {
      console.log('validationUploadField(e)');
      this.view.validationUploadField(e);
    }

  }

  // Выбор элемента из выпадающего списка
  selectAnItem(e) {
    if (e.target.classList.contains('droplist-item') && e.target.closest('.undistributed-parts-wrapper')) {
      console.log('OK');
      const partList = this.modelApp.getBasis(e.target.textContent).listOfUndistributedApplications;
      this.view.updateListOfParts(e, partList);
    }

    if (e.target.classList.contains('droplist-item') && e.target.closest('.order-supply-warehouses')) {
      console.log('OK');
      const tanksList = this.modelApp.getBasis(e.target.textContent).listOfTanks;
      this.view.updateListOfTanks(e, tanksList);
      // console.log(tanksList);
    }
  }

  // Инициализация модальных окон
  init() {
    this.view.renderModal(this.model);
  }
}