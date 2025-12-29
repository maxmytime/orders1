export class NavbarRegionModel {
    constructor(model) {
        this.model = model;
        this.dataMenu = null;
        this.filters = new Array();
    }

    setDataMenu(dataForMenu) {
        this.dataMenu = dataForMenu;
    }

    getDataMenu() {
        return this.dataMenu;
    }

    // Добавляет новый фильтор
    setFilters(filter) {
        // console.log('setFilters(filter)');
        console.log('setFilters(filter)', filter);
        // Про веряем  есть ли уже в списке фильтров устанавливаемый фильтр если да
        // то функция возвращает false и фильтр новый фильтр не добавляется
        for (const f of this.filters) {
            if (f.region && f.region === filter.region) {
                console.log('setFilters(filter) map', f.region, filter.region);
                return false;
            } else if (f.region === '' && filter.region === '' && f.basiss[0] === filter.basiss[0]) {
                console.log('setFilters(filter) map', f, filter);
                return false;
            }
        }


        // В качестве фильтра установлен базис, проверяем есть ли в списке фильтров регион этого базиса
        // если находим его то удаляем
        if (filter.region === '') {
            for (const [index, value] of this.filters.entries()) {
                for (const basis of value.basiss) {
                    // console.log(basis, filter);
                    if (basis === filter.basiss[0]) delete this.filters[index];
                }
            }
            // В качестве фильтра установлен регион, проверяем есть ли установленные
            // базисы этого региона и если на ходим то удаляем их
        } else if (filter.region) {
            console.log(filter.region);
            for (const [index, value] of this.filters.entries()) {
                for (const basis of filter.basiss) {
                    if (basis === value.basiss[0]) delete this.filters[index];
                }
            }

        }

        // Очищаем фильтр от пустых значений
        this.filters = this.filters.filter(filter => filter);
        // Добавляем новый фильтр в список фильтров
        this.filters.push(filter);
        // console.log(this.filters);
        return true;
    }

    // возвращает список фильтров ввиде масива базисов
    getFilters() {
        const filters = [];
        for (const filter of this.filters) {
            for (const basis of filter.basiss) {
                filters.push(basis);
            }
        }
        return filters;
    }

    // Получает массив имен фильтров и удаляет их из списка фильтров
    deleteFilters(arr) {
        for (const name of arr) {
            for (const [index, filter] of this.filters.entries()) {
                console.log(filter?.region, name);
                if (filter?.region === name) {
                    delete this.filters[index];
                } else if (filter) {
                    for (const basis of filter.basiss) {
                        if (basis === name) delete this.filters[index];
                    }
                }
            }
        }

        this.filters = this.filters.filter(filter => filter);

        console.log(this.filters);

    }

    // Возвращает список имен фильтроф для панели фильтров
    getListFilterNames() {
        const listFilterNames = [];
        for (const filter of this.filters) {
            if (filter.region) {
                listFilterNames.push(filter.region);
            } else {
                listFilterNames.push(filter.basiss[0]);
            }
        }

        return listFilterNames;
    }
}