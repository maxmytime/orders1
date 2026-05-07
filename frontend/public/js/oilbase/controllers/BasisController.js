import settings from '/js/config.js';
import { ApiClient } from '/js/oilbase/models/ApiClient.js';
import { UpdatingModel } from '/js/oilbase/services/UpdatingModel.js';
import { UpdatingView } from '/js/oilbase/services/UpdatingView.js';
import { SortUpdate } from '/js/oilbase/services/SortUpdate.js';


export class BasisController {
  constructor(model, view, modalController, orderSupplyModalContoller, partControllerFactory, tankControllerFactory, orderSupplyControllerFactory, helpers, socket) {
    this.model = model;
    this.view = view;
    this.modalController = modalController;
    this.orderSupplyModalContoller = orderSupplyModalContoller;
    this.partControllerFactory = partControllerFactory;
    this.tankControllerFactory = tankControllerFactory;
    this.orderSupplyControllerFactory = orderSupplyControllerFactory;
    this.api = new ApiClient();
    this.helpers = helpers;
    this.socket = socket.socket;
    this.updatingModel = new UpdatingModel(model, partControllerFactory, tankControllerFactory, this.api, this.helpers, this);
    this.updatingView = new UpdatingView();
    this.sortableInstances = [];
    this.sortUpdate = new SortUpdate(this.model);

    // Контроллер подписывается на нажатие кнопки редактировать часть заявки
    this.view.getContainer().addEventListener('click', this.editPart.bind(this));
    // Контроллер подписыватся на нажатие окрытие окна редактирования емкости
    this.view.getContainer().addEventListener('click', this.editTank.bind(this));
    // Показаты скрыть таблицу распределенных частей заявок к емкости
    this.view.getContainer().addEventListener('click', this.toggleSubTable.bind(this));
    // Показать скрыть таблицу деталий заявки снабжения
    this.view.getContainer().addEventListener('click', this.toggleSubTableOrderSupply.bind(this));
    // Контроллер подписывается на событие начала перетаскивания элемента
    // this.view.getContainer().addEventListener('dragstart', this.eventDragstart.bind(this));
    // Контроллер подписывается на событие наведения на перетаскиваемый элемент
    // this.view.getContainer().addEventListener('dragover', this.eventDragover.bind(this));
    // Контроллер подписывается на событие конец перетаскивания элемента
    // this.view.getContainer().addEventListener('dragend', this.eventDragend.bind(this));
    // Контроллер подписывается на событие открыть уведомление (Удалить емкость)
    this.view.getContainer().addEventListener('click', this.deleteTankNotification.bind(this));
    // Контроллер подписывается на событие открыть уведомление (Удалить ЗС)
    this.view.getContainer().addEventListener('click', this.deleteSupplyOrderNotification.bind(this));
    // Закрыть окно уведомлений
    this.view.getContainer().addEventListener('click', this.cancellationBtn.bind(this));
    // Удалить ЗС
    this.view.getContainer().addEventListener('click', this.orderSupplyDelBtn.bind(this));
    // Контроллер подписывается на событие открытя модального окна для создания новой заявки снабжения
    this.view.getContainer().addEventListener('click', this.openModalAddNewOrderSupply.bind(this));
    // Контроллер подписывается на событие открытя модального окна для редактирования заявки-снабжения
    this.view.getContainer().addEventListener('click', this.openModalAddEditOrderSupply.bind(this));

    // Прослушивание соккетов
    // Сохранена заявка в сервисе заявок
    // this.socket.on('order-save', this.getOrder.bind(this));
    // Создана новая заявка в сервисе заявок - расход
    this.socket.on('order-create', this.updatingModel.orderCreated.bind(this.updatingModel));
    this.socket.on('order-save', this.updatingModel.orderSave.bind(this.updatingModel));

    this.socket.on('ordergoods-save', (msg) => {
      console.log('ordergoods-save', msg);
    });

    // Создана новая заявка в сервисе заявок - приход
    this.socket.on('ordergoods-create', this.updatingModel.orderCreated.bind(this.updatingModel));
    // Создана новая емкость
    this.socket.on('tank-create', this.updatingModel.tankCreated.bind(this.updatingModel));
    // Данные в емкости обновились
    this.socket.on('tank-save', this.updatingModel.tankUpdate.bind(this.updatingModel));


  }


  // Открыть модальное окно для редактирования емкости
  editTank(e) {
    const tank = e.target.closest('.table-content');
    const toggleSubtable = e.target.classList.contains('toggle-subtable');
    const deleteTank = e.target.classList.contains('delete-tank');
    const addOrderSupply = e.target.classList.contains('bnt-add-order-supply');

    if (tank && !toggleSubtable && !deleteTank && !addOrderSupply) {
      const element = e.target.closest('[data-id]');
      const tank = this.model.getTank(element.dataset.id);
      // console.log('modalcontroller', tank);
      if (this.helpers.userRights(this.view.getContainer()) != 3) {
        this.modalController.openModalEditTank(tank);
      }

    }
  };

  // Открть модальное окно для редактирования части заявки
  editPart(e) {
    if (e.target.classList.contains('open-modal')) {
      // console.log('editPart(e)');
      const element = e.target.closest('[data-id]');
      const part = this.model.getPart(element.dataset.id);
      // console.log(part.part);
      const basiss = this.model.getBasiss();
      this.modalController.openModalEditPart(part.part, basiss, part.basisID, part.listTanks, part.tankID, part.basisSupplier);
      // this.validationMassFild();
    }
  }


  // Показать скрыть таблицу заявок снабжения
  toggleSubTable(e) {
    if (e.target.classList.contains('toggle-subtable')) {
      console.log('toggleSubTable');
      const subtable = e.target.closest('.tank').querySelector('.subtable');
      console.log(subtable);
      const tableContent = e.target.closest('.tank').querySelector('.table-content');
      const parts = subtable.querySelectorAll('.subtable-row');
      if (1) {
        e.target.classList.toggle('toggle-subtable-rotate');
        // tableContent.classList.toggle('has-text-weight-bold');
        subtable.classList.toggle('is-hidden');
      }

    }
  }

  // Показать скрыть таблицу деталий заявки снабжения
  toggleSubTableOrderSupply(e) {
    if (e.target.classList.contains('bnt-show-details') && !e.target.classList.contains('disabled')) {
      const btnShowDetails = e.target;

      const orderSupplyNode = btnShowDetails.closest('.order-supply');
      if (!orderSupplyNode) {
        console.warn(`toggleSubTableOrderSupply: Не найден родительский элемент order-supply`);
        return;
      }

      const details = orderSupplyNode.querySelector('.details');
      if (!details) {
        console.warn(`toggleSubTableOrderSupply: Не найден элемент subtable`);
        return;
      }

      details.classList.toggle('is-hidden');
    }
  }

  deleteTankNotification(e) {
    if (e.target.classList.contains('delete-tank')) {
      this.modalController.notification(e);
    }
  }

  // Удаалить заявку снабжения
  deleteSupplyOrderNotification(e) {
    if (e.target.classList.contains('delete-supply-order')) {
      const id = e.target.closest('.order-supply').dataset.id;
      const data = this.model.getSupplyOrder(id);
      const orderSupplyController = this.orderSupplyControllerFactory.create(data);
      orderSupplyController.notification(id);
    }
  }

  cancellationBtn(e) {
    if (e.target.classList.contains('cancellation-order-supply')) {
      e.target.closest('.modal').remove();
    }
  }

  async orderSupplyDelBtn(e) {
    if (e.target.classList.contains('order-supply-del')) {
      const id = e.target.closest('.modal').dataset.id;
      console.log(id);

      const data = this.model.getSupplyOrder(id);

      // Формируем объект для создания заявки снабжения
      const supply = {
          'number': data.number, 
          'type_action_suplorder': 4,   
        }
      const status = await this.api.fetchPostData('/postupdatesuplorder', supply);
      console.log(status);
      // if (status.Status === 'OK') {
        this.model.deleteOrderSupply(id);
        const supplyOrderNode = document.querySelector(`[data-id="${id}"]`);  // Получаем узел заявки снабжения
        const tankNode = supplyOrderNode.closest('.tank');                    // Получаем узел емкости
        supplyOrderNode.remove();                                             // Удаляем заявку снабжения из DOM
        // Делает расчет планового остатка
        this.updatingView.tankСalculationPlannedBalance(tankNode);
        // Обновляет порядковые номера внутри блоков заявок в указанном контейнере
        this.updatingView.updateOrderNumbers(tankNode);
        console.log(tankNode);
        e.target.closest('.modal').remove();
      // }
      
    }
  }

  // Открывает модальное окно для создания новой заявки-снабжения
  openModalAddNewOrderSupply(e) {
    if (e.target.classList.contains('bnt-add-order-supply')) {
      // console.log('bnt-add-order-supply');
      this.orderSupplyModalContoller.open(e);
    }
  }

  // Открытие модального окна для редактирования заявки снабжения
  openModalAddEditOrderSupply(e) {
    if (e.target.classList.contains('bnt-edit-order-supply')) {
      // console.log('bnt-add-order-supply');
      this.orderSupplyModalContoller.edit(e);
    }
  }

  /**
   * Инициализация Drag & Drop с помощью SortableJS
   * Вызывать после того, как все DOM-элементы списков (.subtable-rows) созданы
   */
  initDragAndDrop() {
    // Уничтожаем предыдущие экземпляры
    this.destroyDragAndDrop();

    // --- Для заявок снабжения (order-supply) ---
    const orderSupplyContainers = document.querySelectorAll('.order-supply-container');
    orderSupplyContainers.forEach(container => {
      const sortable = new Sortable(container, {
        group: 'shared',
        animation: 150,
        ghostClass: 'dragging',
        dragClass: 'dragging',
        placeholderClass: 'shadow color-bg-gray is-gapless',

        onMove: (evt) => {
          const { dragged, related } = evt;

          // Если список пуст или вставка в начало – разрешаем, убираем красный класс
          if (!related) {
            dragged.classList.remove('dragging-err');
            return true;
          }

          // Получаем ID перетаскиваемого элемента
          const draggedId = dragged.dataset.id || dragged.dataset.idWarehouse;

          // Находим ближайший элемент заявки (может быть сам related или его родитель)
          const targetElement = related.closest('.order-supply') || related;
          const relatedId = targetElement.dataset.id || targetElement.dataset.idWarehouse;

          console.log(draggedId, relatedId);

          // Если не удалось получить ID у целевого элемента – разрешаем (например, контейнер)
          if (!relatedId) {
            dragged.classList.remove('dragging-err');
            return true;
          }

          // Если перетаскиваемый элемент возвращается на своё место (draggedId === relatedId)
          if (draggedId === relatedId) {
            dragged.classList.remove('dragging-err');
            return true;
          }

          // Если ID одного из элементов отсутствует – безопаснее разрешить
          if (!draggedId || !relatedId) {
            dragged.classList.remove('dragging-err');
            return true;
          }

          // Получаем данные заявок из модели
          const orderSupplyDragged = this.model.getSupplyOrder(draggedId);
          const orderSupplyRelated = this.model.getSupplyOrder(relatedId);

          // Сравниваем даты
          if (orderSupplyDragged.date_income === orderSupplyRelated.date_income) {
            dragged.classList.remove('dragging-err');
            return true;
          } else {
            dragged.classList.add('dragging-err');
            return false;
          }
        },

        onEnd: async (evt) => {
          const { item, to, from, oldIndex, newIndex } = evt;
          const orderSupplyId = item.dataset.id;

          console.log('Перемещена заявка снабжения', orderSupplyId, 'новый индекс', newIndex);

          const tankElement = to.closest('.tank');
          if (tankElement) {
            // Делает расчет планового остатка
            this.updatingView.tankСalculationPlannedBalance(tankElement);
            // Обновляет порядковые номера внутри блоков заявок в указанном контейнере
            this.updatingView.updateOrderNumbers(tankElement);
            // Получаем ID емкости
            const tankID = tankElement.dataset.id;
            // Обновляем порядок сортировки
            this.sortUpdate.update(tankID);
          }

          // Убираем классы ошибок, если они были
          document.querySelectorAll('.dragging-err').forEach(el => el.classList.remove('dragging-err'));
        }
      });

      this.sortableInstances.push(sortable);
    });
  }

  /**
   * Уничтожает все экземпляры Sortable (полезно при перерисовке списков)
   */
  destroyDragAndDrop() {
    this.sortableInstances.forEach(sortable => sortable.destroy());
    this.sortableInstances = [];
  }

  // Метод инициализации
  init(basisData) {
    console.log(this.model.basiss);
    const basiss = basisData || this.model.basiss;
    basiss.forEach(basis => {
      // console.log(basis);
      if (basis.listOfUndistributedApplications.length || basis.listOfTanks.length || basisData) {
        // console.log(basis);
        const containers = this.view.renderBasis(basis);
        const fragmentUndistributed = document.createDocumentFragment();
        const fragmentTsnks = document.createDocumentFragment();
        const fragmentDistributed = document.createDocumentFragment();
        const fragmentOrderSupply = document.createDocumentFragment();

        basis.visible = true;

        basis.listOfUndistributedApplications.forEach((part, index) => {
          const controller = this.partControllerFactory.create(part, containers.containerUndistributed, index);
          // Вместо немедленной вставки - добавляем во фрагмент
          fragmentUndistributed.appendChild(controller.render());
        });

        containers.containerUndistributed.appendChild(fragmentUndistributed);

        basis.listOfTanks.forEach((tank, index) => {
          const controller = this.tankControllerFactory.create(tank, containers.tanksContainer, index);

          // ------------------------------------------
          const tankContainer = controller.renderInit();


          // Рендер распределенных заявок
          if (tank.listOfDistributedApplications?.length) {
            const subtable = tankContainer.querySelector('.subtable-rows');
            // console.log(tankContainer.querySelector('.subtable-rows'));
            tank.listOfDistributedApplications.forEach((part, index) => {
              const partController = this.partControllerFactory.create(part, subtable, index + 1);
              fragmentDistributed.appendChild(partController.renderDistributed());
            })
            subtable.appendChild(fragmentDistributed);
            // console.log(subtable);
            // controller.volumeСalculation();

          }

          // Рендер заявок снабжения
          if (tank.listOfOrderSupply?.length) {
            // console.log(tank.listOfOrderSupply);
            const container = tankContainer.querySelector('.order-supply-container');
            // console.log(container);
            tank.listOfOrderSupply.forEach((OrderSupply) => {
              const orderSupplyController = this.orderSupplyControllerFactory.create();
              fragmentOrderSupply.appendChild(orderSupplyController.render(OrderSupply, this.model));
            })
            container.appendChild(fragmentOrderSupply);
          }


          // Делает расчет планового остатка
          this.updatingView.tankСalculationPlannedBalance(tankContainer);
          // Обновляет порядковые номера внутри блоков заявок в указанном контейнере
          this.updatingView.updateOrderNumbers(tankContainer);

          fragmentTsnks.appendChild(tankContainer);

          // console.log(tankContainer);
        })
        containers.tanksContainer.appendChild(fragmentTsnks);
        // console.log(containers.tanksContainer);
        const tanks = [...containers.tanksContainer.children];
        for (const tank of tanks) {
          const tankData = this.model.getTank(tank.dataset.id).tank;
          const tankController = this.tankControllerFactory.create(tankData, tank);
          // tankController.volumeСalculation();
          tankController.alertTank();
          this.helpers.userRights(tank);
        }


      }

    });

    this.initDragAndDrop();
    // console.log(basiss);
  }
}
