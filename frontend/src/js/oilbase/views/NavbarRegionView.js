import { AppView } from '/js/oilbase/views/AppView.js'

export class NavbarRegionView extends AppView {
    constructor(helpers) {
        super();
        this.container = document.querySelector('.app-oilbase');        // Контейнер приложения. На текущий момент на него вешаются все события
        this.templateNavbarRegion = this.getTemplate('navbar-region');  // Шаблон навигации по регионам
        this.templateItemRegion = this.getTemplate('navbar-item-region'); // Шаблон элемента регион в меню
        this.templateItemBasis = this.getTemplate('navbar-item-basis'); // Шаблон элемента базис в меню
        this.templateTag = this.getTemplate('tag'); // Шаблон элемента тег
        this.helpers = helpers;

        console.log('NavbarRegionView');
    }

    // Рендер меню регионов и базисов
    renderNavbarRegion(data) {
        console.log('renderNavbarRegion()', data);
        const navbar = this.templateNavbarRegion;

        for (const region of data) {
            // console.log(region);
            const itemRegion = this.templateItemRegion.cloneNode(true);
            itemRegion.querySelector('.navbar-link').textContent = region[0] || 'Без региона';

            for (const basis of region[1]) {
                const itemBasis = this.templateItemBasis.cloneNode(true);
                itemBasis.textContent = basis;
                itemRegion.querySelector('.navbar-dropdown').appendChild(itemBasis);
            }

            navbar.querySelector('.navbar-start').appendChild(itemRegion);
        }

        this.container.prepend(navbar);

    }

    // Очистка списка базисов на странице
    clearListBases() {
        const basiss = document.querySelectorAll('.oilbasis');
        basiss.forEach(basis => basis.remove());
    }

    // Рисуем тег фильтра
    renderTag(name) {
        const tag = this.templateTag.cloneNode(true);
        const tagClear = this.templateTag.cloneNode(true);
        const tags = this.templateNavbarRegion.querySelector('.tags');

        tagClear.querySelector('.tag-name').textContent = 'Очистить фильтр';
        tagClear.querySelector('.delete-tag-navbar-region').classList.add('delete-tags-navbar-region');
        tagClear.querySelector('.delete-tag-navbar-region').classList.remove('delete-tag-navbar-region');
        tag.querySelector('.tag-name').textContent = name;

        // console.log(tags.children.length);
        if (tags.children.length === 1) {
            tags.prepend(tag);
            tags.appendChild(tagClear);
        } else {
            tags.prepend(tag);
        }

    }

    // Удаляем тег из фильтров
    clearTag(e) {
        const tag = e.closest('.tag');
        const tags = e.closest('.tags');
        if (tags.children.length === 2) {
            this.clearTags(e);
        }
        tag.remove();
    }

    // Удаляем тег из фильтров
    clearTags(e) {
        const tags = e.closest('.tags');
        [ ...tags.children ].forEach(tag => tag.remove());
    }

    // View не обрабатывает события, только предоставляет элементы
    getContainer() {
        return this.container;
    }
}