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
            if (!dataForMenu.has(basis.region)) dataForMenu.set(basis.region || 'Без региона', []);
            dataForMenu.get(basis.region || 'Без региона').push(basis.name);
        }

        this.setDataMenu(dataForMenu);

        return dataForMenu;
    }

    // События выбора региона
    choosingRegion(e) {
        if (e.target.classList.contains('navbar-link-region')) {
            this.renderNewListBasiss(e);
        }
    }

    // События выбора базиса
    choosingBasis(e) {
        if (e.target.classList.contains('navbar-item-basis')) {
            this.renderNewListBasiss(e);
        }
    }

    // Ренден новового списка базисов согласно установленным фильтрам
    renderNewListBasiss(e) {
        const name = e.target.textContent;
        // console.log(this.getDataMenu());
        const dataForMenu = this.getDataMenu();
        let filter;
        // Определяем является ли выбранный элемент базисом или регионом
        if (dataForMenu.get(name)) {
            filter = { 'region': name, 'basiss': dataForMenu.get(name) };
        } else {
            for (const value of dataForMenu.values()) {
                for (const basis of value) {
                    if (basis === name) filter = { 'region': '', 'basiss': new Array(name) };
                }
            }
        }
        // console.log(filter);
        if (this.setFilters(filter)) {
            const filters = this.getFilters();
            // console.log(filters);
            const basisList = this.filterBasis(filters);
            this.clearListBases();
            this.basisController.init(basisList);
            this.view.renderTag(name);
            const listFilterNames = this.getListFilterNames();
            this.view.synchronizationFilters(listFilterNames);
        }
    }

    // Возвращает список базисов согласно установленным фильтрам
    filterBasis(filters) {
        const listBasis = [];
        // console.log(filters);
        for (const filter of filters) {
            const partListBasis = this.model.model.
                filter(basis => basis.name === filter && basis.visible === true);
            partListBasis.map(basis => listBasis.push(basis));
        }

        if (filters.length === 0) {
            const partListBasis = this.model.model.filter(basis => basis.visible === true);
            partListBasis.map(basis => listBasis.push(basis));
        }

        return listBasis;
    }

    // Очищает страницу от отрисованных базисов
    clearListBases() {
        this.view.clearListBases();
    }

    // Удаляем тег фильтров
    clearTag(e) {
        if (e.target.classList.contains('delete-tag-navbar-region')) {
            console.log('clearTag(e)');
            const arrFilters = this.view.clearTag(e.target);
            this.deleteFilters(arrFilters);
            const filters = this.getFilters();
            console.log(filters);
            const basisList = this.filterBasis(filters);
            this.clearListBases();
            this.basisController.init(basisList);
        }
    }

    // Удаляем все теги из фильтров
    clearTags(e) {
        // console.log('clearTags(e)');
        if (e.target.classList.contains('delete-tags-navbar-region')) {
            const arrFilters = this.view.clearTags(e.target);
            // console.log(arrFilters);
            this.deleteFilters(arrFilters);
            const filters = this.getFilters();
            // console.log(filters);
            const basisList = this.filterBasis(filters);
            this.clearListBases();
            this.basisController.init(basisList);
        }
    }

    // Возвращает список имен фильтроф для панели фильтров
    getListFilterNames() {
        return this.model.getListFilterNames();
    }

    // Добавляет новый фильтр в список фильтров
    setFilters(filter) {
        return this.model.setFilters(filter);
    }

    // Получает список фильтров
    getFilters() {
        return this.model.getFilters();
    }

    // Получает массив имен фильтров и удаляет их из списка фильтров
    deleteFilters(arr) {
        this.model.deleteFilters(arr);
    }

    // Устанавливаем данные для меню
    setDataMenu(dataForMenu) {
        this.model.setDataMenu(dataForMenu);
    }

    // Получить данные для меню
    getDataMenu() {
        return this.model.getDataMenu();
    }
}