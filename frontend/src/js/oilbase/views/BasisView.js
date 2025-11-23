import { AppView } from '/js/oilbase/views/AppView.js'

export class BasisView extends AppView {
    constructor() {
        super();
        this.container = document.querySelector('.app-oilbase');        // Контейнер приложения. На текущий момент на него вешаются все события
        this.templateBasis = this.getTemplate('oilbasis');              // Шаблон базиса
        this.templateUndistributed = this.getTemplate('undistributed'); // Шаблон нераспределенной части заявки
    }

    // Метод рендеринга базиса
    renderBasis(item) {
        const template = this.templateBasis.cloneNode(true);
        const name = template.querySelector('.basis-name');
        const containerUndistributed = template.querySelector('.container-undistributed');
        const tanksContainer = template.querySelector('.tank-container');

        template.dataset.id = item.id;
        name.textContent = item.name;
        // console.log(item);
        template.querySelector('.title-distributed').textContent = item.supplier ? 'Спецификации' : 'Емкости';

        this.container.appendChild(template);
        return {
            'containerUndistributed': containerUndistributed,
            'tanksContainer': tanksContainer

        };
    }

    // View не обрабатывает события, только предоставляет элементы
    getContainer() {
        return this.container;
    }
}