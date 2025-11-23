import { ApiClient } from '/js/oilbase/models/ApiClient.js';

export class ArchiveController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.api = new ApiClient();

        // Контроллер подписыватся на выбор емкости
        // this.view.getContainer().addEventListener('change', this.selectTank.bind(this));
        // Контроллер подписыватся на выбор емкости
        this.view.getContainer().addEventListener('click', this.getDataByBaseName.bind(this));
        // Контроллер подписыватся на событие очистки поле базис
        this.view.getContainer().addEventListener('click', this.getFullData.bind(this));
        // Контроллер подписывается на событие ввода данных в поле Базис,
        // при вводе открывается выпадающий список
        this.view.getContainer().addEventListener('input', this.dropdown.bind(this));
        // Выбор пункта элемента списка
        this.view.getContainer().addEventListener('click', this.selectAnItem.bind(this));
        // Контроллер подписывается на выбор емкости
        this.view.getContainer().addEventListener('click', this.getDataByTankName.bind(this));
    }

    openArchive(dataArchive, tanks) {
        this.view.render(dataArchive, tanks);
        this.view.hiddenBasis();
    }

    getFullData(e) {
        if (e.target.classList.contains('btn-clear')) {
            const container = e.target.closest('.archive');
            container.querySelector('input[name="basisArchive"]').value = '';
            container.querySelector('select[name="tankNameHistory"]').disabled = true;
            const data = this.model.model;
            console.log(data);
            this.view.tableFormation(data, container);
            this.view.selectTank(data, container);
        }
    }

    getDataByBaseName(e) {
        if (e.target.classList.contains('droplist-item-archive')) {
            console.log(e.target);
            const basisName = e.target.textContent;
            const container = e.target.closest('.archive');
            container.querySelector('select[name="tankNameHistory"]').disabled = false;
            const data = this.model.getDataByBaseName(basisName);
            console.log(data);
            this.view.tableFormation(data, container);
            this.view.selectTank(data, container);
        }
    }

    getDataByTankName(e) {
        if (e.target.name === 'tankNameHistory') {
            console.log('getDataByTankName(e)');
            const container = e.target.closest('.archive');
            const basisName = container.querySelector('input[name="basisArchive"]').value;
            const tankName = container.querySelector('select[name="tankNameHistory"]').value;
            const dataByBase = this.model.getDataByBaseName(basisName);
            const dataByTank = dataByBase.filter(tank => tank.text_tank === tankName);
            console.log(dataByBase, dataByTank);

            if (tankName === '-') {
                this.view.tableFormation(dataByBase, container);
            } else {
                this.view.tableFormation(dataByTank, container);
            }

            this.view.selectTank(dataByBase, container);
        }
    }

    // async selectTank(e) {
    //     if (e.target.name = 'tankNameHistory') {
    //         console.log(e.target.value);

    //         // if (e.target.value != '-') {
    //         //     const history = await this.api.fetchGetData(`/gettankhistory?CodeTank=` + `${e.target.value}`);
    //         //     console.log(history.Data.TankHistory);
    //         //     const archive = e.target.closest('.archive');
    //         //     this.view.selectTank(archive, history.Data.TankHistory);
    //         // } else {
    //         //     const archive = e.target.closest('.archive');
    //         //     archive.querySelector('.container-tank .subtable-head').textContent = '';
    //         // }

    //     }
    // }

    // Выпадающий список для выбора
    async dropdown(e) {
        if (e.target.name === 'basisArchive') {   // Выбор базисов
            const listBasiss = await this.api.fetchGetData(`/getbasises`);
            this.view.dropdownBasis(e, listBasiss);
        }
    }

    // Выбор элемента из выпадающего списка
    selectAnItem(e) {
        if (e.target.classList.contains('droplist-item-archive')) {
            console.log(e.target);
            // const modal = e.target.closest('.modal-part');
            this.view.selectAnItem(e);
        }
    }

    init() {
        this.view.render();
    }

}