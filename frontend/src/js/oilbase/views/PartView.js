import { AppView } from '/js/oilbase/views/AppView.js';

export class PartView extends AppView {
    constructor(container, helpers) {
        super();
        this.container = container;
        this.templateUndistributed = this.getTemplate('undistributed');
        this.templateDistributed = this.getTemplate('distributed');
        this.helpers = helpers;
    }

    renderPartDistributed(part, index) {
        // console.log(part);


        const template = this.templateDistributed.cloneNode(true);

        const tank = template.closest('.tank');
        // console.log(tank);

        // id элемента
        template.dataset.id = part.part.id;
        // kindOrder
        template.dataset.kindOrder = part.part.kind_order;
        // Парядковый номер
        template.querySelector('.part-number').textContent = index;
        if (part.part.kind_order == 1) {
            template.querySelector('.part-number').classList.add('part-number-bg');
        } else if (part.part.kind_order == 2) {
            template.querySelector('.part-number').classList.add('part-number-bb');
        }
        // Дата загрузки/дата прихода
        // template.querySelector('.date_dispatch').textContent = this.helpers.convertDateTo1С(part.part.date_dispatch);
        template.querySelector('.date_dispatch').textContent = this.helpers.convertDateTo1С(part.part.date_dispatch);
        if (this.getDifferences(part.part.differences, 'date_dispatch')) {
            template.querySelector('.date_dispatch').classList.add('has-text-danger');
        }

        // Дата отгрузки
        template.querySelector('.date-of-shipment').textContent = this.getDateShipment(part.part.basisDateStart, part.part.basisDateEnd);
        // Партнер
        template.querySelector('.name-client').textContent = part.part.client.name_client;   // Имя клиента
        template.querySelector('.name-client').dataset.code = part.part.client.code_client;   // Код клиента
        if (this.getDifferences(part.part.differences, 'client.name_client')) {
            template.querySelector('.name-client').classList.add('has-text-danger');
        }
        // Номенклатура
        template.querySelector('.name-product').textContent = part.part.product.name_product;
        template.querySelector('.name-product').dataset.code = part.part.product.code_product;
        if (this.getDifferences(part.part.differences, 'product.name_product')) {
            template.querySelector('.name-product').classList.add('has-text-danger');
        }
        // console.log(part.part.differences);
        // Количество
        template.querySelector('.volume').textContent = part.part.volume;
        if (this.getDifferences(part.part.differences, 'volume')) {
            template.querySelector('.volume').classList.add('has-text-danger');
        }
        // Комментарий
        template.querySelector('.comment').textContent = part.part.commentary;

        this.helpers.userRights(template);

        return template;
    }

    // Рендер не распределенной заявки
    renderPart(part, index) {
        // console.log(part.part);
        const template = this.templateUndistributed.cloneNode(true);

        // id элемента
        template.dataset.id = part.part.id;
        // kindOrder
        template.dataset.kindOrder = part.part.kind_order;
        // Парядковый номер
        template.querySelector('.part-number').textContent = index + 1;
        if (part.part.kind_order == 1) {
            template.querySelector('.part-number').classList.add('part-number-bg');
        } else if (part.part.kind_order == 2) {
            template.querySelector('.part-number').classList.add('part-number-bb');
        }

        // Дата загрузки/дата прихода
        template.querySelector('.date_dispatch').textContent = part.part.kindOrder == 2 ? part.part.dateStart : '';

        // Дата отгрузки
        template.querySelector('.date-of-shipment').textContent = this.getDateShipment(part.part.basisDateStart, part.part.basisDateEnd);
        // Партнер
        template.querySelector('.name-client').textContent = part.part.client.name_client;   // Имя клиента
        template.querySelector('.name-client').dataset.code = part.part.client.code_client;   // Код клиента
        if (this.getDifferences(part.part.differences, 'client.name_client')) {
            template.querySelector('.name-client').classList.add('has-text-danger');
        }
        // Номенклатура
        template.querySelector('.name-product').textContent = part.part.product.name_product;
        template.querySelector('.name-product').dataset.code = part.part.product.code_product;
        if (this.getDifferences(part.part.differences, 'product.name_product')) {
            template.querySelector('.name-product').classList.add('has-text-danger');
        }
        // Количество
        template.querySelector('.volume').textContent = part.part.volume;
        if (this.getDifferences(part.part.differences, 'volume')) {
            template.querySelector('.volume').classList.add('has-text-danger');
        }
        // Комментарий
        template.querySelector('.comment').textContent = part.part.commentary;

        this.helpers.userRights(template);

        return template;
    }

    getDifferences(differences, fild) {
        if (differences) {
            for (const element of differences) {
                if (element === fild)
                    return true;
            }
        }
    }


    render(item, index) {
        const element = this.renderPart(item, index);
        return element; // Возвращаем созданный элемент
    }

    updateUndistributedPart(part, container) {
        console.log(part);
        // id элемента
        container.dataset.id = part.part.id;
        // kindOrder
        container.dataset.kindOrder = part.part.kind_order;
        // Парядковый номер
        // container.querySelector('.part-number').textContent = index + 1;
        // Дата загрузки/дата прихода
        container.querySelector('.date_dispatch').textContent = part.part.kindOrder == 2 ? part.part.dateStart : '';
        // Дата отгрузки
        container.querySelector('.date-of-shipment').textContent = this.getDateShipment(part.part.basisDateStart, part.part.basisDateEnd);
        // Партнер
        container.querySelector('.name-client').textContent = part.part.client.name_client;   // Имя клиента
        container.querySelector('.name-client').dataset.code = part.part.client.code_client;   // Код клиента
        if (this.getDifferences(part.part.differences, 'client.name_client')) {
            container.querySelector('.name-client').classList.add('has-text-danger');
        } else {
            container.querySelector('.name-client').classList.remove('has-text-danger');
        }

        // Номенклатура
        container.querySelector('.name-product').textContent = part.part.product.name_product;
        container.querySelector('.name-product').dataset.code = part.part.product.code_product;
        if (this.getDifferences(part.part.differences, 'product.name_product')) {
            container.querySelector('.name-product').classList.add('has-text-danger');
        } else {
            container.querySelector('.name-product').classList.remove('has-text-danger');
        }

        // Количество
        container.querySelector('.volume').textContent = part.part.volume;
        if (this.getDifferences(part.part.differences, 'volume')) {
            container.querySelector('.volume').classList.add('has-text-danger');
        } else {
            container.querySelector('.volume').classList.remove('has-text-danger');
        }
        // Комментарий
        container.querySelector('.comment').textContent = part.part.commentary;
    }

    updateDistributedPart(part, container) {
        // console.log(part);
        // id элемента
        container.dataset.id = part.part.id;
        // kindOrder
        container.dataset.kindOrder = part.part.kind_order;
        // Парядковый номер
        // container.querySelector('.part-number').textContent = index + 1;
        // Дата загрузки/дата прихода
        // container.querySelector('.date-order').textContent = this.helpers.convertDateTo1С(part.part.dateStart);
        container.querySelector('.date_dispatch').textContent = this.helpers.convertDateTo1С(part.part.date_dispatch);
        if (this.getDifferences(part.part.differences, 'date_dispatch')) {
            container.querySelector('.date_dispatch').classList.add('has-text-danger');
        } else {
            container.querySelector('.date_dispatch').classList.remove('has-text-danger');
        }
        // Дата отгрузки
        container.querySelector('.date-of-shipment').textContent = this.getDateShipment(part.part.basisDateStart, part.part.basisDateEnd);
        // Партнер
        container.querySelector('.name-client').textContent = part.part.client.name_client;   // Имя клиента
        container.querySelector('.name-client').dataset.code = part.part.client.code_client;   // Код клиента
        if (this.getDifferences(part.part.differences, 'client.name_client')) {
            container.querySelector('.name-client').classList.add('has-text-danger');
        } else {
            container.querySelector('.name-client').classList.remove('has-text-danger');
        }
        // Номенклатура
        container.querySelector('.name-product').textContent = part.part.product.name_product;
        container.querySelector('.name-product').dataset.code = part.part.product.code_product;
        if (this.getDifferences(part.part.differences, 'product.name_product')) {
            container.querySelector('.name-product').classList.add('has-text-danger');
        } else {
            container.querySelector('.name-product').classList.remove('has-text-danger');
        }
        // Количество
        container.querySelector('.volume').textContent = part.part.volume;
        // console.log('1');
        if (this.getDifferences(part.part.differences, 'volume')) {
            // console.log('2');
            container.querySelector('.volume').classList.add('has-text-danger');
        } else {
            // console.log('3');
            container.querySelector('.volume').classList.remove('has-text-danger');
        }
        // Комментарий
        container.querySelector('.comment').textContent = part.part.commentary;
    }

    deletePart(container) {
        container.remove();
    }

    getDateShipment(dateStart, dateEnd) {
        const start = dateStart.split('-');
        const end = dateEnd.split('-');
        return dateStart === dateEnd ?
            `${start[2]}.${start[1]}` :
            `${start[2]}.${start[1]} - ${end[2]}.${end[1]}`;
    }

    updateSerialNumber(wrapper) {
        const list = wrapper.querySelectorAll('.part-number');
        list.forEach((element, index)  => {
            element.textContent = index + 1;
        });
    }

}