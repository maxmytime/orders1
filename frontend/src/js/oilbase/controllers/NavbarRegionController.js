export class NavbarRegionController {
    constructor(modal, view, basisController) {
        this.model = modal;
        this.view = view;
        this.basisController = basisController

        // Контроллер подписывается на событие выбора региона в меню
        this.view.getContainer().addEventListener('click', this.choosingRegion.bind(this));
        // Контроллер подписывается на событие выбора базиса в меню
        this.view.getContainer().addEventListener('click', this.choosingBasis.bind(this));
        // Контроллер подписывается на событие удаления тега из фильтров
        this.view.getContainer().addEventListener('click', this.clearTag.bind(this));
        // Контроллер подписывается на событие удаления всех тегов из фильтров
        this.view.getContainer().addEventListener('click', this.clearTags.bind(this));
    }

    // Инициализация меню регионы при старте приложения
    init() {
        const data = this.generatesDataForMenu();
        this.view.renderNavbarRegion(data);
    }

    // Генерация данных для построения меню по регионам и базисам
    generatesDataForMenu() {
        const basissVisibl = this.model.model.filter(basis => basis.visible === true);
        const dataForMenu = new Map();

        for (const basis of basissVisibl) {
            if (!dataForMenu.has(basis.region)) dataForMenu.set(basis.region, []);
            dataForMenu.get(basis.region).push(basis.name);
        }

        return dataForMenu;
    }

    // События выбора региона
    choosingRegion(e) {
        if (e.target.classList.contains('navbar-link-region')) {
            // console.log('Выбран региона', e.target.textContent);
            const nameRegion = e.target.textContent;
            if (this.setFilters(nameRegion)) {
                const filters = this.getFilters();
                const basisList = this.filterBasis(filters, 'region');
                this.clearListBases();
                this.basisController.init(basisList);
                this.view.renderTag(nameRegion);
            }

        }
    }

    // События выбора базиса
    choosingBasis(e) {
        if (e.target.classList.contains('navbar-item-basis')) {
            // console.log('Выбран базис', e.target.textContent);
            const nameBasis = e.target.textContent;
            if (this.setFilters(nameBasis)) {
                const filters = this.getFilters();
                const basisList = this.filterBasis(filters, 'region');
                this.clearListBases();
                this.basisController.init(basisList);
                this.view.renderTag(nameBasis);
            }
        }
    }

    // Возвращает список базисов согласно установленным фильтрам
    filterBasis(filters, field) {
        let listBasis = [];
        // console.log(filters);
        for (const param of filters) {
            console.log(param);
            const parametr = param === 'Без региона' ? '' : param;
            // console.log(parametr);

            if (field === 'region') {
                const partListBasis = this.model.model.
                                        filter(basis => basis.region === parametr && basis.visible === true);
                partListBasis.map(region => listBasis.push(region));
            } else if (field === 'name') {
                const partListBasis = this.model.model.
                                        filter(basis => basis.name === parametr && basis.visible === true);
                partListBasis.map(basis => listBasis.push(basis));
            }
        }

        // console.log(listBasis);
        return listBasis;
    }

    // Очищает страницу от отрисованных базисов
    clearListBases() {
        this.view.clearListBases();
    }

    // Удаляем тег фильтров
    clearTag(e) {
        // console.log('clearTag(e)');
        if (e.target.classList.contains('delete-tag-navbar-region')) {
            this.view.clearTag(e.target);
        }
    }

    // Удаляем все теги из фильтров
    clearTags(e) {
        // console.log('clearTags(e)');
        if (e.target.classList.contains('delete-tags-navbar-region')) {
            this.view.clearTags(e.target);
        }
    }

    // Добавляет новый фильтр в список фильтров
    setFilters(filter) {
        return this.model.setFilters(filter);
    }

    // Получает список фильтров
    getFilters() {
        return this.model.getFilters();
    }
}