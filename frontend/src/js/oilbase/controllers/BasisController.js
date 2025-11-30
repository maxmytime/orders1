import settings from '/js/config.js';
import { ApiClient } from '/js/oilbase/models/ApiClient.js';

export class BasisController {
    constructor(model, view, modalController, partControllerFactory, tankControllerFactory, helpers) {
        this.model = model;
        this.view = view;
        this.modalController = modalController;
        this.partControllerFactory = partControllerFactory;
        this.tankControllerFactory = tankControllerFactory;
        this.api = new ApiClient();
        this.helpers = helpers;



        // Контроллер подписывается на нажатие кнопки редактировать часть заявки
        this.view.getContainer().addEventListener('click', this.editPart.bind(this));
        // Контроллер подписыватся на нажатие окрытие окна редактирования емкости
        this.view.getContainer().addEventListener('click', this.editTank.bind(this));
        // Показаты скрыть таблицу распределенных частей заявок к емкости
        this.view.getContainer().addEventListener('click', this.toggleSubTable.bind(this));
        // Контроллер подписывается на событие начала перетаскивания элемента
        this.view.getContainer().addEventListener('dragstart', this.eventDragstart.bind(this));
        // Контроллер подписывается на событие наведения на перетаскиваемый элемент
        this.view.getContainer().addEventListener('dragover', this.eventDragover.bind(this));
        // Контроллер подписывается на событие конец перетаскивания элемента
        this.view.getContainer().addEventListener('dragend', this.eventDragend.bind(this));
        // Контроллер подписывается на событие открыть уведомление
        this.view.getContainer().addEventListener('click', this.deleteTankNotification.bind(this));

    }



    // Открыть модальное окно для редактирования емкости
    editTank(e) {
        const tank = e.target.closest('.table-content');
        const toggleSubtable = e.target.classList.contains('toggle-subtable');
        const deleteTank = e.target.classList.contains('delete-tank');

        if (tank && !toggleSubtable && !deleteTank) {
            const element = e.target.closest('[data-id]');
            const tank = this.model.getTank(element.dataset.id);
            console.log('modalcontroller', tank);
            if (this.helpers.userRights(this.view.getContainer()) != 3) {
                this.modalController.openModalEditTank(tank);
            }

        }
    }

    // Открть модальное окно для редактирования части заявки
    editPart(e) {
        if (e.target.classList.contains('open-modal')) {
            console.log('editPart(e)');
            const element = e.target.closest('[data-id]');
            const part = this.model.getPart(element.dataset.id);
            console.log(part);
            const basiss = this.model.getBasiss();
            this.modalController.openModalEditPart(part.part, basiss, part.basisID, part.listTanks, part.tankID);
            // this.validationMassFild();
        }
    }

    toggleSubTable(e) {
        if (e.target.classList.contains('toggle-subtable')) {
            const subtable = e.target.closest('.tank').querySelector('.subtable');
            const tableContent = e.target.closest('.tank').querySelector('.table-content');
            const parts = subtable.querySelectorAll('.subtable-row');
            if (1) {
                e.target.classList.toggle('toggle-subtable-rotate');
                // tableContent.classList.toggle('has-text-weight-bold');
                subtable.classList.toggle('is-hidden');
            }

        }
    }

    deleteTankNotification(e) {
        if (e.target.classList.contains('delete-tank')) {
            this.modalController.notification(e);
        }
    }



    // ОБЪЯСНЕНИЕ: Используем делегирование на document для обработки ВСЕХ списков
    eventDragstart(e) {
        // ОБЪЯСНЕНИЕ: Проверяем, что перетаскиваем элемент LI внутри любого списка
        if (e.target.classList.contains('distributed') && e.target.closest('.subtable-rows')) {
            console.log('eventDragstart');
            const draggedItem = e.target;

            // Сохраняем данные о перетаскиваемом элементе
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', draggedItem.outerHTML);

            // Добавляем класс для визуального эффекта
            draggedItem.classList.add('dragging');

            // ОБЪЯСНЕНИЕ: Сохраняем ссылку на исходный список
            draggedItem.setAttribute('data-original-parent', draggedItem.parentNode.id);
        }
    }

    // ОБЪЯСНЕНИЕ: Обработчик для всей страницы - будет работать с любым списком
    // eventDragover(e) {
    //     // console.log(e.target);
    //     if (e.target.closest('.distributed') && e.target.closest('.subtable-rows')) {
    //         // console.log('eventDragover');
    //         e.preventDefault();
    //         // ОБЪЯСНЕНИЕ: Ищем ближайший .subtable-rows (текущий список) и .distributed (целевой элемент)
    //         const targetList = e.target.closest('.subtable-rows');
    //         const targetItem = e.target.closest('.distributed');
    //         const draggingItem = document.querySelector('.dragging');
    //         const targetItemID = targetItem.dataset.id;
    //         const draggingItemID = draggingItem.dataset.id;
    //         const targetItemDate = this.model.getPart(targetItemID).part.date_dispatch;
    //         const draggedItemDate = this.model.getPart(draggingItemID).part.date_dispatch;

    //         targetList.querySelectorAll('.shadow').forEach(el => {
    //             el.remove();
    //         })

    //         if (targetItemDate === draggedItemDate) {
    //             // console.log('Даты равны', targetItemDate, draggedItemDate);
    //             draggingItem.classList.remove('dragging-err');


    //             // Проверяем все условия для безопасной вставки
    //             if (targetList && targetItem && draggingItem && targetItem !== draggingItem) {
    //                 const rect = targetItem.getBoundingClientRect();
    //                 // console.log(e.clientY, rect.bottom, rect.height / 3);
    //                 const nextSibling = (e.clientY - rect.top > rect.height / 2)
    //                     ? targetItem.nextElementSibling
    //                     : targetItem;


    //                 const shadow = document.createElement('div');
    //                 shadow.classList.add('column', 'is-12', 'shadow', 'has-background-grey-light');

    //                 // ОБЪЯСНЕНИЕ: Вставляем перетаскиваемый элемент в найденную позицию
    //                 // targetList.insertBefore(draggingItem, nextSibling);
    //                 if (targetItem != nextSibling) {
    //                     targetList.insertBefore(shadow, nextSibling);
    //                 }

    //                 // const idPart = document.querySelector('.dragging').dataset.id;
    //                 // const idTank = this.model.getPart(idPart).tankID;
    //                 // const tank = this.model.getTank(idTank).tank;
    //                 // const containerTank = document.querySelector(`div[data-id="${idTank}"]`);
    //                 // const tankController = this.tankControllerFactory.create(tank, containerTank);
    //                 // // let objectUpdateSort = tankController.updateSort();
    //                 // console.log('tankController.volumeСalculation()');
    //                 // tankController.volumeСalculation();



    //             }

    //         } else {
    //             console.log('Даты не равны', targetItemDate, draggedItemDate);
    //             // draggingItem.classList.add('dragging-err');
    //         }


    //     }

    // };

    eventDragover(e) {
        if (e.target.closest('.distributed') && e.target.closest('.subtable-rows')) {
            e.preventDefault();
            const targetList = e.target.closest('.subtable-rows');
            const targetItem = e.target.closest('.distributed');
            const draggingItem = document.querySelector('.dragging');

            // Удаляем все существующие тени
            targetList.querySelectorAll('.shadow').forEach(el => el.remove());

            if (!draggingItem || !targetItem) return;

            const targetItemID = targetItem.dataset.id;
            const draggingItemID = draggingItem.dataset.id;
            const targetItemDate = this.model.getPart(targetItemID).part.date_dispatch;
            const draggedItemDate = this.model.getPart(draggingItemID).part.date_dispatch;

            if (targetItemDate === draggedItemDate) {
                draggingItem.classList.remove('dragging-err');

                // Основное изменение: разрешаем вставку перед первым элементом
                const rect = targetItem.getBoundingClientRect();
                const nextSibling = (e.clientY - rect.top > rect.height / 2)
                    ? targetItem.nextElementSibling
                    : targetItem;

                const shadow = document.createElement('div');
                shadow.classList.add('column', 'is-12', 'shadow', 'color-bg-gray', 'is-gapless');

                // Всегда вставляем тень, даже если это первая позиция
                targetList.insertBefore(shadow, nextSibling);

            } else {
                console.log('Даты не равны', targetItemDate, draggedItemDate);
                draggingItem.classList.add('dragging-err');
            }
        }
    }

    // ОБЪЯСНЕНИЕ: Завершение перетаскивания для любого элемента
    async eventDragend(e) {
        if (e.target.classList.contains('distributed')) {
            const idPart = document.querySelector('.dragging').dataset.id;
            const idTank = this.model.getPart(idPart).tankID;
            const tank = this.model.getTank(idTank).tank;
            const containerTank = document.querySelector(`div[data-id="${idTank}"]`);
            const tankController = this.tankControllerFactory.create(tank, containerTank);
            const targetList = e.target.closest('.subtable-rows');
            const shadow = document.querySelector('.shadow');
            if (shadow) {
                targetList.insertBefore(e.target, shadow);
                shadow.remove();
            }

            let objectUpdateSort = tankController.updateSort();
            const statusUpdate = await this.api.fetchPostData('/postdispatchsort', objectUpdateSort);

            tankController.volumeСalculation();

            // shadow.remove();

            // Убираем визуальные эффекты со всех элементов
            document.querySelectorAll('.distributed').forEach(item => {
                item.classList.remove('dragging');
            });

            document.querySelectorAll('.dragging-err').forEach(item => {
                item.classList.remove('dragging-err');
            });
        }
    };

    // Метод инициализации
    init(basisData) {
        // console.log(this.model);
        const basiss = basisData || this.model.basiss;
        basiss.forEach(basis => {
            if (basis.listOfUndistributedApplications.length || basis.listOfTanks.length || basisData) {
                // console.log(basis);
                const containers = this.view.renderBasis(basis);
                const fragmentUndistributed = document.createDocumentFragment();
                const fragmentTsnks = document.createDocumentFragment();
                const fragmentDistributed = document.createDocumentFragment();

                basis.visible = true;

                basis.listOfUndistributedApplications.forEach((part, index) => {
                    const controller = this.partControllerFactory.create(part, containers.containerUndistributed, index);
                    // Вместо немедленной вставки - добавляем во фрагмент
                    fragmentUndistributed.appendChild(controller.render());
                });

                containers.containerUndistributed.appendChild(fragmentUndistributed);

                basis.listOfTanks.forEach((tank, index) => {
                    const controller = this.tankControllerFactory.create(tank, containers.tanksContainer, index);
                    const tankContainer = controller.renderInit();


                    // Рендер распределенных заявок
                    if (tank.listOfDistributedApplications.length) {
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

                    fragmentTsnks.appendChild(tankContainer);
                    // console.log(tankContainer);
                })
                containers.tanksContainer.appendChild(fragmentTsnks);
                // console.log(containers.tanksContainer);
                const tanks = [...containers.tanksContainer.children];
                for (const tank of tanks) {
                    const tankData = this.model.getTank(tank.dataset.id).tank;
                    const tankController = this.tankControllerFactory.create(tankData, tank);
                    tankController.volumeСalculation();
                    tankController.alertTank();
                    this.helpers.userRights(tank);
                }


            }

        });
    }
}
