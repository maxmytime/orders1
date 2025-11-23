import { AppView } from '/js/oilbase/views/AppView.js'

export class NavbarView extends AppView {
    constructor(helpers) {
        super();
        this.container = document.querySelector('.app-oilbase');        // Контейнер приложения. На текущий момент на него вешаются все события
        this.templateNavbar = this.getTemplate('nav-bar');              // Шаблон базиса
        this.helpers = helpers;
    }

    render() {
        const navbar = this.templateNavbar.cloneNode(true);
        this.helpers.userRights(navbar);
        this.container.appendChild(navbar);
    }



    // View не обрабатывает события, только предоставляет элементы
    getContainer() {
        return this.container;
    }
}