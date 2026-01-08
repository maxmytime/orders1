import { ApiClient } from '/js/oilbase/models/ApiClient.js';

export class OrderSupplyModalContoller {
    constructor(modelApp,
            orderSupplyModalModel,
            orderSupplyModalView,
            helpers,
            socket) {
        this.modelApp = modelApp;
        this.model = orderSupplyModalModel;
        this.view = orderSupplyModalView;
        this.api = new ApiClient();
        this.helpers = helpers;
        this.socket = socket.socket;

        console.log('OrderSupplyModalContoller');
        // Контроллер подписывается на событие ввода данных в поле Базис,
        // this.view.getContainer().addEventListener('input', this.dropdown.bind(this));

    }


    // // Выпадающий список для выбора
    // async dropdown(e) {
    //     if (e.target.name === 'basis') {   // Выбор базисов
    //         const listBasiss = await this.api.fetchGetData(`/getbasises`);
    //         this.view.dropdownBasis(e, listBasiss);
    //     } else if (e.target.name === 'provider' || e.target.name === 'nameClient') {  // Выбор поставщиков
    //         const listPartner = await this.api.fetchGetData(`/getpartnerslistspec`);
    //         this.view.dropdownPartner(e, listPartner);
    //     } else if (e.target.name === 'product') {  // Выбор продукта
    //         const listProduct = await this.api.fetchGetData(`/getproductslist`);
    //         this.view.dropdownProduct(e, listProduct);
    //     }
    // }


    // // Выбор элемента из выпадающего списка
    // selectAnItem(e) {
    //     if (e.target.classList.contains('droplist-item')) {
    //         const modal = e.target.closest('.modal-part');
    //         this.view.selectAnItem(e);
    //         // console.log(modal.querySelector('input[name="basis"]'));
    //         const nameBasis = modal?.querySelector('input[name="basis"]').value;

    //         // Обновление списка емкостей при смене базиса в части заявки
    //         if (nameBasis && modal !== null) {
    //             console.log(modal);
    //             const listTanks = this.model.getListTanksName(nameBasis);
    //             const product = modal.querySelector('input[name="product"]').value;
    //             console.log(product);
    //             const faragmentList = this.view.setTanks(listTanks, product);
    //             console.log(listTanks, faragmentList);
    //             const selectTanks = modal.querySelector('select[name="tankName"]');
    //             selectTanks.textContent = '';
    //             selectTanks.appendChild(faragmentList);
    //         }

    //     }
    // }

    // // Валидация
    // isNumber(e) {
    //     if (e.target.name === 'weight' ||
    //         e.target.name === 'volume' ||
    //         e.target.name === 'density' ||
    //         e.target.name === 'cost_management_tonn' ||
    //         e.target.name === 'cost_price_tonn' ||
    //         e.target.name === 'startVolume' ||
    //         e.target.name === 'weight_fact'
    //     ) {
    //         this.view.isNumber(e);
    //     }

    // }

    // // Ограничение дленны ввода числа знаков после запятой
    // isNumberTrim(e) {
    //     if (e.target.name === 'cost_management_tonn') {
    //         this.view.isNumberTrim(e);
    //     }
    // }

    open() {
        this.view.open();
    }


    // Инициализация модальных окон
    init() {
        this.view.renderModal(this.model);
    }
}