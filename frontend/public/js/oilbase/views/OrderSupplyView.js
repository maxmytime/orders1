import { AppView } from '/js/oilbase/views/AppView.js'

export class OrderSupplyView extends AppView {
    constructor(helpers) {
        super();
        this.container = document.querySelector('.app-oilbase');        // Контейнер приложения. На текущий момент на него вешаются все события
        this.templateOrderSupply = this.getTemplate('order-supply');  // Шаблон Заявки снабжения в базисе

        this.helpers = helpers;

        // console.log('OrderSupplyView');
    }

    render(orderSupply) {
        // console.log(orderSupply);
        const order = this.templateOrderSupply.cloneNode(true);

        // Устанавливаем ID
        order.dataset.id = orderSupply.id;

        // Дата
        order.querySelector('.date_dispatch').textContent = orderSupply.date_income;
        // Клиент
        // order.querySelector('.name-client').textContent =
        // Продукт
        order.querySelector('.name-product').textContent = orderSupply.name_product;
        // Количество
        order.querySelector('.volume').textContent = orderSupply.volume;


        return order;
    }

}