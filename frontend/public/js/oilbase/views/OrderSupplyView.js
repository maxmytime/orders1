import { AppView } from '/js/oilbase/views/AppView.js'

export class OrderSupplyView extends AppView {
    constructor(helpers) {
        super();
        this.container = document.querySelector('.app-oilbase');        // Контейнер приложения. На текущий момент на него вешаются все события
        // this.templateOrderSupply = this.getTemplate('');  // Шаблон Заявки снабжения в базисе

        this.helpers = helpers;

        console.log('OrderSupplyView');
    }

}