import { AppView } from '/js/oilbase/views/AppView.js'

export class ArchiveView extends AppView {
    constructor() {
        super();
        this.container = document.querySelector('.app-oilbase');        // Контейнер приложения. На текущий момент на него вешаются все события
        this.templateArchive = this.getTemplate('archive');             // Шаблон архива
        this.templateTank = this.getTemplate('tank-container');         // Шаблон емкости
        this.templatePoint = this.getTemplate('tank-history-point');    // Шаблон запись в истории

    }

    render(data, tanks) {
        console.log(data);
        const container = this.templateArchive.cloneNode(true);



        // archive.textContent = '';
        // const table = archive.createFea('div');
        const archive = this.tableFormation(data, container);
        this.container.appendChild(archive);
        // this.hiddenBasis();

    }

    tableFormation(data, container) {
        const archive = container;

        // this.selectTank(data, container);
        // console.log(archive);
        archive.querySelector('.container-tank .subtable-head').textContent = '';

        for (const t of data) {
            // for (const t of tank.history) {
            const subtable = archive.querySelector('.container-tank .subtable-head');
            const tank = this.templateTank.cloneNode(true);
            // tank.querySelector('.tank-name').textContent = t.name;
            const history = tank.querySelector('.tank-history');
            const row = this.templatePoint.cloneNode(true);
            row.querySelector('.date').textContent = t.date;
            row.querySelector('.time').textContent = t.time;
            row.querySelector('.text_basis').textContent = t.text_basis;
            row.querySelector('.text_tank').textContent = t.text_tank;
            row.querySelector('.text_action').textContent = t.text_action;
            row.querySelector('.text_weight').textContent = t.text_weight;
            row.querySelector('.text_volume').textContent = t.text_volume;
            row.querySelector('.text_cost_management').textContent = t.text_cost_management;
            row.querySelector('.text_description').textContent = t.text_description;
            row.querySelector('.text_user').textContent = t.text_user;
            history.appendChild(row);
            subtable.appendChild(tank);
            // }
        }

        return archive;
    }



    selectTank(data, container) {
        const archive = container;
        const tankList = archive.querySelector('select[name="tankNameHistory"]');
        const tankListValue = tankList.value;

        [...tankList.children].forEach(select => {
            if (select.textContent != '-') {
                select.remove();
            }
        });

        for (const history of data) {
            console.log(history);
            const option = document.createElement('option');
            option.value = history.text_tank;
            option.textContent = history.text_tank;
            tankList.appendChild(option);
        }

        tankList.value = tankListValue;
    }

    hiddenBasis() {
        const oilbasis = this.container.querySelectorAll('.oilbasis');
        oilbasis.forEach(element => {
            element.classList.toggle('is-hidden');
            // if (element.classList.containt('oilbasis')) {

            // }
        });
    }

    // Выпадающие списки
    dropdownBasis(e, listBasiss) {
        console.log(listBasiss);
        const droplist = e.target.nextSibling.nextSibling;
        const value = e.target.value;

        if (value.length > 1) {
            droplist.innerHTML = '';
            droplist.classList.remove('is-hidden');

            listBasiss.Data.filter(item => {
                const nameBasis = item.name.toLowerCase();
                if (nameBasis.includes(value.toLowerCase())) {
                    const span = document.createElement('span');
                    span.classList.add('droplist-item-archive');
                    span.textContent = item.name;
                    span.dataset.supplier = item.supplier;
                    droplist.appendChild(span);
                }
            });

        }
    }

    // Выбор элемента выпадающего списка
    selectAnItem(e) {
        const wrapper = e.target.closest('.droplist-wrapper');
        console.log(wrapper);
        const input = wrapper.querySelector('input[name="basisArchive"]');
        const droplist = wrapper.querySelector('.droplist');
        input.value = e.target.textContent;

        droplist.classList.add('is-hidden');
        droplist.textContent = '';
    }

    // View не обрабатывает события, только предоставляет элементы
    getContainer() {
        return this.container;
    }
}