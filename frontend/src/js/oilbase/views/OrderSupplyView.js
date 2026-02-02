import { AppView } from '/js/oilbase/views/AppView.js'

export class OrderSupplyView extends AppView {
    constructor(helpers) {
        super();
        this.container = document.querySelector('.app-oilbase');        // Контейнер приложения. На текущий момент на него вешаются все события
        this.templateOrderSupply = this.getTemplate('order-supply');    // Шаблон Заявки снабжения в базисе

        this.helpers = helpers;

        // console.log('OrderSupplyView');
    }

    render(orderSupply) {
        console.log(orderSupply);
        const order = this.templateOrderSupply.cloneNode(true);

        // Устанавливаем ID
        order.dataset.id = orderSupply.id;
        // Продукт
        order.querySelector('.name-product').textContent = orderSupply.product.name_product;
        // Количество
        order.querySelector('.volume').textContent = orderSupply.volume;
        // Распределено
        order.querySelector('.volume-distributed').textContent = '-';
        // Остаток, плановый
        order.querySelector('.planned-balance').textContent = '-';

        return order;
    }

    renderNewOrderSupply(docObject, tankID) {
        const container = document.querySelector(`div[data-id="${tankID}"] .order-supply-container`);
        const tplOrderSupply = this.templateOrderSupply.cloneNode(true);

        // Устанавливаем ID
        tplOrderSupply.dataset.id = docObject.id;

        // Дата
        // tplOrderSupply.querySelector('.date_dispatch').textContent = docObject.date_income;
        // Клиент
        // tplOrderSupply.querySelector('.name-client').textContent =
        // Продукт
        // tplOrderSupply.querySelector('.name-product').textContent = docObject.name_product;
        // Количество
        // tplOrderSupply.querySelector('.volume').textContent = docObject.volume;

        container.append(tplOrderSupply);
    }

}