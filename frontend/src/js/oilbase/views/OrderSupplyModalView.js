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
        console.log('OrderSupplyModalView');
    }

    // Рендер модальных окон
    renderModal() {
        console.log('renderModal OrderSupply');
        this.modalOrderSupply = this.getTemplate('modal-order-supply').cloneNode(true);
        this.container.appendChild(this.modalOrderSupply);
    }

    // Открыть модальное окно
    open(basisID, basisName, tanksList, partsList) {
        // console.log(basisID, basisName, tanksList, partsList);

        // Базис id
        this.modalOrderSupply.dataset.basisId = basisID;

        //Список не распределенных частей заявок
        const divPartsList = this.modalOrderSupply.querySelector('.order-supply-list-undistributed-parts');
        divPartsList.appendChild(this.creatingListOfParts(partsList));

        // Список емкостей
        const selectTanks = this.modalOrderSupply.querySelector('select[name="order-supple-tank-name"]');
        selectTanks.textContent = '';
        selectTanks.appendChild(this.createListOfTanks(tanksList));

        // Базис
        this.modalOrderSupply.querySelector('input[name="basis"]').value = basisName;

        this.openAddNewOrderSupply();
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

    // Удалить секцию
    delSection(e) {
        const section = e.target.closest('.order-supply-section');
        section.remove();
    }

    // Получаем объект документа
    getDocObject(e) {
        const oredrSupply = e.target.closest('.modal-order-supply');
        // console.log(orderS)
        const docObject = {
            'basisName': oredrSupply.querySelector('input[name="basis"]').value,
            'basisID': oredrSupply.dataset.basisId,
            'tankID': oredrSupply.querySelector('select[name="order-supple-tank-name"]').value,
        }
        return docObject;


    }

    // Получаем контейнер приложения
    getContainer() {
        return this.container;
    }

}