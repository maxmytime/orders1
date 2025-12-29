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
            itemRegion.querySelector('.navbar-link').textContent = region[0];

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
        tagClear.classList.add('has-background-link');
        tagClear.classList.add('has-text-white');
        tagClear.classList.add('has-text-weight-bold');
        tagClear.querySelector('.delete-tag-navbar-region').classList.remove('delete-tag-navbar-region');

        tag.querySelector('.tag-name').textContent = name;
        tag.classList.add('tag-filter');
        tag.classList.add('has-background-success');
        tag.classList.add('has-text-white');
        tag.classList.add('has-text-weight-bold');

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
        const nameTag = tag.querySelector('.tag-name').textContent;
        if (tags.children.length === 2) {
            this.clearTags(e);
        }
        tag.remove();
        return new Array(nameTag);
    }

    // Удаляем тег из фильтров
    clearTags(e) {
        const tags = e.closest('.tags');
        const listFilterNames = [];
        const tagFilters = tags.querySelectorAll('.tag-filter .tag-name');
        tagFilters.forEach(filter => {
            listFilterNames.push(filter.textContent);
        });

        [ ...tags.children ].forEach(tag => tag.remove());
        console.log(listFilterNames);
        return listFilterNames;
    }

    // Синхронизирует панель фильтров со списком фильтров в модели
    synchronizationFilters(listFilterNames) {
        const listFilters = this.templateNavbarRegion.querySelectorAll('.tag-filter .tag-name');
        for (const filter of listFilters) {
            // console.log(filter.textContent);
            if (!listFilterNames.find(name => name === filter.textContent)) {
                filter.closest('.tag').remove();
            }
        }

    }

    // View не обрабатывает события, только предоставляет элементы
    getContainer() {
        return this.container;
    }
}