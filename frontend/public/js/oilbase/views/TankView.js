import { AppView } from '/js/oilbase/views/AppView.js';

export class TankView extends AppView {
    constructor(container, helpers) {
        super();
        this.container = container;
        this.templateTank = this.getTemplate('tank');
        this.helpers = helpers;

    }

    renderNewTank(item) {
        console.log(tank);
        const template = this.templateTank.cloneNode(true);
        // console.log(tank);
        // Идентификатор емкости
        template.dataset.id = item.model.id;
        // Поставщик
        this.setValue('provider', '', template);
        // Имя емкости
        this.setValue('name-tank', item.model.name, template);
        // Продукт
        this.setValue('product', item.model.product.name_product, template);
        // Номенклатура
        // this.setValue('nomenclature', 'Поле не передается', template);
        // Плотность
        this.setValue('density', item.model.density, template);
        // УПР СС (руб./т.) <br> УПР СС (руб./т.)
        this.setValue('management-сost', item.model.cost_management_tonn, template);
        this.setValue('management-сost-l', (Number(item.model.cost_management_tonn) * ( Number(item.model.density) || 1 ) / 1000).toFixed(2), template);
        // Прайс СС (руб./т.) <br> Прайс СС (руб./т.)
        this.setValue('price-offer', item.model.cost_price_tonn, template);
        this.setValue('price-offer-l', (Number(item.model.cost_price_tonn) * ( Number(item.model.density) || 1 ) / 1000).toFixed(2), template);
        // Масса, текущая
        this.setValue('weight', Number(item.model.weight).toFixed(3), template);
        // Остаток, текущий
        this.setValue('current-balance', Number(item.model.volume).toFixed(0), template);
        // Остаток, плановый
        this.setValue('planned-balance', Number(item.model.volume_plan || item.model.volume).toFixed(0), template);


        this.helpers.userRights(template);

        this.container.appendChild(template);
    }

    renderUpdateTank(item) {
        console.log(item.model);
        const container = document.querySelector(`div[data-id='${item.model.id}']`);
        // Идентификатор емкости
        // template.dataset.id = item.id;
        // Поставщик
        this.setValue('provider', '', container);
        // Имя емкости
        this.setValue('name-tank', item.model.name, container);
        // Продукт
        this.setValue('product', item.model.product.name_product, container);
        // Номенклатура
        // this.setValue('nomenclature', 'Поле не передается', container);
        // Плотность
        this.setValue('density', item.model.density, container);
        // УПР СС (руб./т.) <br> УПР СС (руб./т.)
        this.setValue('management-сost', item.model.cost_management_tonn, container);
        this.setValue('management-сost-l', (Number(item.model.cost_management_tonn) * ( Number(item.model.density) || 1 ) / 1000).toFixed(2), container);
        // Прайс СС (руб./т.) <br> Прайс СС (руб./т.)
        this.setValue('price-offer', item.model.cost_price_tonn, container);
        this.setValue('price-offer-l', (Number(item.model.cost_price_tonn) * ( Number(item.model.density) || 1 ) / 1000).toFixed(2), container);
        // Масса, текущая
        this.setValue('weight', (Number(item.model.weight)).toFixed(3), container);
        // Остаток, текущий
        this.setValue('current-balance', Number(item.model.volume).toFixed(0), container);
        // Остаток, плановый
        this.setValue('planned-balance', Number(item.model.volume_plan).toFixed(0), container);

        this.helpers.userRights(container);

    }

    // Рендер емкости
    renderTank(item) {
        // console.log('renderTank');
        const template = this.templateTank.cloneNode(true);
        // console.log(item);
        // Идентификатор емкости
        template.dataset.id = item.model.id;
        // Поставщик
        this.setValue('provider', '', template);
        // Имя емкости
        this.setValue('name-tank', item.model.name, template);
        // Продукт
        this.setValue('product', item.model.product.name_product, template);
        // Номенклатура
        // this.setValue('nomenclature', 'Поле не передается', template);
        // Плотность
        this.setValue('density', item.model.density, template);
        // УПР СС (руб./т.) <br> УПР СС (руб./т.)
        this.setValue('management-сost', item.model.cost_management_tonn, template);
        this.setValue('management-сost-l', (Number(item.model.cost_management_tonn) * ( Number(item.model.density) || 1 ) / 1000).toFixed(2), template);
        // Прайс СС (руб./т.) <br> Прайс СС (руб./т.)
        this.setValue('price-offer', item.model.cost_price_tonn, template);
        this.setValue('price-offer-l', (Number(item.model.cost_price_tonn) * ( Number(item.model.density) || 1 ) / 1000).toFixed(2), template);
        // Масса, текущая
        this.setValue('weight', item.model.weight, template);
        // Остаток, текущий
        this.setValue('current-balance', Number(item.model.volume).toFixed(0), template);
        // Остаток, плановый
        // console.log(Math.round(Number(item.model.volume_plan)));
        this.setValue('planned-balance', Math.round(Number(item.model.volume_plan)), template);

        // console.log(template);
        this.helpers.userRights(template);

        return template;
    }


    render(item, index) {
        const element = this.renderTank(item, index);
        return element; // Возвращаем созданный элемент
    }

    setValue(selector, value, template) {
        const element = template.querySelector('.' + selector);
        if (element) element.textContent = value;
    }

    getObjectID() {
        const parts = this.container.querySelectorAll('.distributed');
        // console.log(parts);
        let objectID = [];
        for (const part of parts) {
            objectID.push({'id': part.dataset.id});
        }
        return objectID;
    }

    updateVolume(objectUpdateVolume) {
        const plannedBalance = this.container.querySelector('.planned-balance');
        plannedBalance.textContent = Number(objectUpdateVolume.volume_plan).toFixed(0);
        if (Number(objectUpdateVolume.volume_plan) < 0) plannedBalance.classList.add('has-text-danger');
        if (Number(objectUpdateVolume.volume_plan) >= 0) plannedBalance.classList.remove('has-text-danger');
        const parts = [...this.container.querySelectorAll('.distributed')];
        // objectUpdateVolume.volume_part
        for (const [key, value] of Object.entries(objectUpdateVolume.volume_part)) {
            const part = parts.find(part => part.dataset.id === key);
            // console.log(parts);
            if (part) {
                const currentBalance = part.querySelector('.current-balance');
                currentBalance.textContent = Number(value).toFixed(0);
                // console.log(Number(value));
                // if (Number(value) < 0) currentBalance.classList.add('has-text-danger');
                // if (Number(value) >= 0) currentBalance.classList.remove('has-text-danger');

            }
        }

    }

    alertTank() {
        // console.log(this.container);
        const tankAlert = this.container.querySelector('.tank-alert');
        const changes = this.container.querySelectorAll('.has-text-danger');
        // console.log(changes);

        if (changes.length) {
            tankAlert.classList.remove('is-hidden');
        } else {
            tankAlert.classList.add('is-hidden');
        }
    }

}

