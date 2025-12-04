import { AppView } from '/js/oilbase/views/AppView.js';
import { Helpers } from '/js/oilbase/utils/Helpers.js';

export class ModalView extends AppView {
    constructor() {
        super();
        this.container = document.querySelector('.app-oilbase');  // Контейнер приложения. На текущий момент на него вешаются все события
        // this.templateModalPart = this.getTemplate('modal-part');  // Модальное окно части заявки
        // this.templateModalTank = this.getTemplate('modal-tank');  // Модальное окно емкости
        this.modalPart = null;
        this.modalTank = null;
        this.modalNotification = null;
        // console.log('ModalView');

        // Вспомогательные функции
        this.helpers = new Helpers();
    }

    notification(e) {
        const id = e.target.closest('.tank').dataset.id;
        this.modalNotification.dataset.id = id;
        this.modalNotification.classList.add('is-active');
    }

    notificationСancellation(e) {
        this.modalNotification.classList.remove('is-active');
    }


    // Рендер модальных окон
    renderModals() {
        // console.log('renderModals');
        this.modalPart = this.getTemplate('modal-part').cloneNode(true);
        this.container.appendChild(this.modalPart);

        this.modalTank = this.getTemplate('modal-tank').cloneNode(true);
        this.container.appendChild(this.modalTank);

        this.modalNotification = this.getTemplate('modal-notification').cloneNode(true);
        this.container.appendChild(this.modalNotification);
    }

    modalPartActive(part, basiss, basisID, listTanks, tankID, basisSupplier) {
        console.log(basisSupplier);
        // устанавливаем id части заявки
        this.modalPart.dataset.partid = part.id;
        // Номер распределенной заявки, если номера нет то заявка не распределена
        this.modalPart.dataset.number = part.number;
        // Тип распределенной заявки
        this.modalPart.dataset.typedispatch = part.type_dispatch;
        //
        this.modalPart.dataset.weight = part.weight;
        // Плотность
        this.modalPart.dataset.density = part.density;

        // устанавливаем id базиса
        // this.modalPart.dataset.basisId = basisID;
        // устанавливаем id мкости
        // this.modalPart.dataset.tankId = tankID;
        // kindOrder
        this.modalPart.dataset.kindOrder = part.kind_order;
        // dateEnd
        this.modalPart.dataset.dateEnd = part.dateEnd;
        // endVolume
        this.modalPart.dataset.endVolume = part.endVolume;
        // ID Ордера
        this.modalPart.dataset.idorder = part.id_order;
        // numaddress
        this.modalPart.dataset.numaddress = part.num_address;
        // numbasis
        this.modalPart.dataset.numbasis = part.num_basis;
        // Заголовок
        this.modalPart.querySelector('.modal-card-title').textContent = Number(part.kind_order) === 2 ? 'Отгрузка' : 'Загрузка';
        // Базис
        // this.modalPart.querySelector('select[name="basisName"]').textContent = '';
        // this.modalPart.querySelector('select[name="basisName"]').appendChild(this.setBasiss(basiss));
        this.modalPart.querySelector('input[name="basis"]').value = part.nameBasis
        // this.modalPart.querySelector('input[name="basis"]').disabled = true;
        // this.modalPart.querySelector('input[name="basis"]').dataset.code = basisID;
        // this.modalPart.querySelector('select[name="basisName"]').value = basisID;
        // Емкость
        this.modalPart.querySelector('.lable-tank').textContent = basisSupplier ? 'Спецификация' : 'Емкость';
        this.modalPart.querySelector('select[name="tankName"]').textContent = '';
        this.modalPart.querySelector('select[name="tankName"]').appendChild(this.setTanks(listTanks, part.product.name_product));
        this.modalPart.querySelector('select[name="tankName"]').value = tankID;
        // Загрузка/Приход
        this.setInputValue('input[name="date_dispatch"]', part.date_dispatch != '' ? part.date_dispatch : part.dateStart);
        // Дата отгрузки
        this.setInputValue('input[name="basisDateStart"]', part.basisDateStart);
        this.setInputValue('input[name="basisDateEnd"]', part.basisDateEnd);
        // Партнер
        this.setInputValue('input[name="nameClient"]', part.client.name_client);
        this.setDatasetValue('input[name="nameClient"]', part.client.code_client, 'code');
        // Номенклатура
        this.setInputValue('input[name="product"]', part.product.name_product);
        this.setDatasetValue('input[name="product"]', part.product.code_product, 'code');
        // Количество
        this.setInputValue('input[name="startVolume"]', Number(part.volume).toFixed(0) || Number(part.startVolume).toFixed(0));
        // Масса (т)
        this.setInputValue('input[name="weight"]', Number(part.volume * (part.density || 1) / 1000).toFixed(3));
        // Плотность
        this.setInputValue('input[name="density"]', part.density || '');
        // Комментарий
        this.setInputValue('textarea[name="comment"]', part.commentary);

        // Объем факт (л)
        if (Number(part.kind_order) === 2) {
            this.setInputValue('input[name="volume_fact"]', part.volume_fact || '');
        } else {
            this.setInputValue('input[name="volume_fact"]', part.volume || part.startVolume);
            // this.modalPart.querySelector('input[name="volume_fact"]').disabled = true;
        }

        // Масса факт (т)
        if (Number(part.kind_order) === 2) {
            this.setInputValue('input[name="weight_fact"]', part.weight_fact || '');
        } else {
            this.setInputValue('input[name="weight_fact"]', part.weight || '');
            // this.modalPart.querySelector('input[name="weight_fact"]').disabled = true;
        }

        // Плотность факт
        if (Number(part.kind_order) === 2) {
            this.setInputValue('input[name="density_fact"]', part.density_fact || '');
        } else {
            this.setInputValue('input[name="density_fact"]', part.density || '');
            // this.modalPart.querySelector('input[name="density_fact"]').disabled = true;
        }

        // Температура
        if (Number(part.kind_order) === 2) {
            this.setInputValue('input[name="temperature"]', part.temperature || '');
        } else {
            this.setInputValue('input[name="temperature"]', part.temperature || '');
            // this.modalPart.querySelector('input[name="temperature"]').disabled = true;
        }


        // Принята полная масса
        // this.setInputValue('input[name="acquiered_full"]', part.temperature);
        this.modalPart.querySelector('input[name="acquiered_full"]').checked = part.acquiered_full;


        this.modalPart.querySelector('.btn-ship-part').textContent = Number(part.kind_order) === 2 ? 'Отгрузить' : 'Загрузить';

        this.modalPart.classList.add('is-active');

    }

    // Список емкостей для распределения частей заявок
    updateListTenks(listTanks, tankID = 0) {
        this.modalPart.querySelector('select[name="tankName"]').textContent = '';
        this.modalPart.querySelector('select[name="tankName"]').appendChild(this.setTanks(listTanks));
        this.modalPart.querySelector('select[name="tankName"]').value = tankID;
    }

    modalTankActive(id, name) {
        this.modalTank.dataset.basisId = id;
        this.modalTank.dataset.basisName = name;
        this.modalTank.querySelector('.modal-card-title').textContent = 'Добавить';
        this.modalTank.querySelector('.btn-tank').classList.add('btn-add-tank');
        this.helpers.userRights(this.modalTank);
        this.modalTank.classList.add('is-active');
        // Добавить емкость
    }

    modalTankActiveEdit(tank) {
        console.log('modalview', tank);
        this.modalTank.dataset.tankId = tank.tank.id;
        this.modalTank.dataset.basisName = tank.tank.name_base;
        this.modalTank.dataset.code = tank.tank.code;
        // Имя емскости
        this.modalTank.querySelector('input[name="nameTank"]').value = tank.tank.name;
        // Базис
        this.modalTank.querySelector('input[name="basis"]').value = tank.tank.name_base;
        this.modalTank.querySelector('input[name="basis"]').disabled = true;
        // Вид
        this.modalTank.querySelector('input[name="type"]').dataset.code = tank.tank.type_tank;
        this.modalTank.querySelector('input[name="type"]').disabled = true;
        if (tank.tank.type_tank === 1) {
            this.modalTank.querySelector('input[name="type"]').value = 'Емкость';
        } else {
            this.modalTank.querySelector('input[name="type"]').value = 'Спецификация';
        }
        // Масса
        this.modalTank.querySelector('input[name="weight"]').value = tank.tank.weight;
        // Обьем
        this.modalTank.querySelector('input[name="volume"]').value = Number(tank.tank.volume).toFixed(0);
        // Плотность
        this.modalTank.querySelector('input[name="density"]').value = tank.tank.density;
        if (Number(tank.tank.type_tank) === 2) {
            // Поставщик
            this.modalTank.querySelector('.js-provider').classList.remove('is-invisible');
            this.modalTank.querySelector('input[name="provider"]').value = tank.tank.client.name_client;
            this.modalTank.querySelector('input[name="provider"]').dataset.code = tank.tank.client.code_client;
            this.modalTank.querySelector('.js-date').classList.remove('is-invisible');
            this.modalTank.querySelector('.js-redeemed-volume').classList.remove('is-invisible');
            // Выку-ый объем
            this.modalTank.querySelector('input[name="redeemed-volume"]').value = tank.tank.redeem_volume;
            // Сроки выработки
            this.modalTank.querySelector('input[name="date"]').value = this.helpers.convertDateToInput(tank.tank.date_limitation_redeem);
        }
        // Продукт
        this.modalTank.querySelector('input[name="product"]').value = tank.tank.product.name_product;
        this.modalTank.querySelector('input[name="product"]').dataset.code = tank.tank.product.code_product;
        // Плотность
        // this.modalTank.querySelector('input[name="product"]').value = tank.tank.product.name_product;

        // Управленчиская себестоимость в тоннах
        this.modalTank.querySelector('input[name="cost_management_tonn"]').value = tank.tank.cost_management_tonn;
        // Прайсовая себестоимость (т.)
        this.modalTank.querySelector('input[name="cost_price_tonn"]').value = tank.tank.cost_price_tonn;
        // Управленчиская себестоимость в литрах
        this.modalTank.querySelector('input[name="cost_management_litr"]').value = tank.tank.cost_management_litr;
        // Прайсовая себестоимость (л.)
        this.modalTank.querySelector('input[name="cost_price_litr"]').value = tank.tank.cost_price_litr;

        this.modalTank.querySelector('.modal-card-title').textContent = 'Редактировать емкость';
        this.modalTank.querySelector('.btn-tank').classList.add('btn-update-tank');

        this.helpers.userRights(this.modalTank);

        this.modalTank.classList.add('is-active');
        // this.container.appendChild(modalPart);
    }

    modalClose(btnClose) {
        this.modalTank.dataset.tankId = '';
        this.modalTank.dataset.basisName = '';
        this.modalTank.dataset.code = '';
        // Имя емскости
        this.modalTank.querySelector('input[name="nameTank"]').value = '';
        // Базис
        this.modalTank.querySelector('input[name="basis"]').value = '';
        this.modalTank.querySelector('input[name="basis"]').disabled = false;
        // Вид
        this.modalTank.querySelector('input[name="type"]').value = '';
        this.modalTank.querySelector('input[name="type"]').dataset.code = '';
        // this.modalTank.querySelector('select[name="type"]').disabled = false;
        // Поставщик
        this.modalTank.querySelector('input[name="provider"]').value = '';
        this.modalTank.querySelector('input[name="provider"]').dataset.code = '';
        // Масса
        this.modalTank.querySelector('input[name="weight"]').value = '';
        // Обьем
        this.modalTank.querySelector('input[name="volume"]').value = '';
        // Плотность
        this.modalTank.querySelector('input[name="density"]').value = '';
        // Выку-ый объем
        this.modalTank.querySelector('input[name="redeemed-volume"]').value = '';
        // Сроки выработки
        this.modalTank.querySelector('input[name="date"]').value = '';
        // Продукт
        this.modalTank.querySelector('input[name="product"]').value = '';
        this.modalTank.querySelector('input[name="product"]').dataset.code = '';

        // Управленчиская себестоимость в тоннах
        this.modalTank.querySelector('input[name="cost_management_tonn"]').value = '';
        // Прайсовая себестоимость (т.)
        this.modalTank.querySelector('input[name="cost_price_tonn"]').value = '';
        // Управленчиская себестоимость в литрах
        this.modalTank.querySelector('input[name="cost_management_litr"]').value = '';
        // Прайсовая себестоимость (л.)
        this.modalTank.querySelector('input[name="cost_price_litr"]').value = '';


        // this.modalTank.classList.add('is-active');
        // this.container.appendChild(modalPart);
        const modal = btnClose.target.closest('.modal.is-active');

        this.modalTank.querySelector('.js-date').classList.add('is-invisible');
        this.modalTank.querySelector('.js-redeemed-volume').classList.add('is-invisible');
        this.modalTank.querySelector('.js-provider').classList.add('is-invisible');
        this.modalTank.querySelector('.modal-card-title').textContent = 'Добавить емкость';
        this.modalTank.querySelector('.btn-tank').classList.remove('btn-update-tank');
        this.modalTank.querySelector('.btn-tank').classList.remove('btn-add-tank');

        // скрытие и очистка выпадающих списков
        const dropDownLists = this.modalTank.querySelectorAll('.droplist');
        dropDownLists.forEach(droplist => {
            droplist.textContent = '';
            droplist.classList.add('is-hidden');
        })

        // Очистка отгрузки
        if (modal.classList.contains('modal-part')) {
            const modalPart = modal;
            modalPart.querySelector('.card-part')
                .classList.remove('is-hidden');
            modalPart.querySelector('.card-ship')
                .classList.add('is-hidden');
            modalPart.querySelector('.btn-cancellation-part')
                .classList.add('is-hidden');
            modalPart.querySelector('.btn-ship-part')
                .classList.remove('is-hidden');

            modalPart.querySelector('input[name="volume_fact"]').value = '';
            modalPart.querySelector('input[name="volume_fact"]').disabled = false;
            modalPart.querySelector('input[name="weight_fact"]').value = '';
            modalPart.querySelector('input[name="weight_fact"]').disabled = false;
            modalPart.querySelector('input[name="density_fact"]').value = '';
            modalPart.querySelector('input[name="density_fact"]').disabled = false;
            modalPart.querySelector('input[name="temperature"]').value = '';
            modalPart.querySelector('input[name="temperature"]').disabled = false;
            modalPart.querySelector('input[name="acquiered_full"]').checked = false;
        }



        console.log(modal);
        modal.classList.remove('is-active');
    }

    modalTypeTank(e) {
        // console.log(e);
        // const modalTank = e.target.closest('.modal-tank');
        // const type = e.target.value;
        // const title = modalTank.querySelector('.modal-card-title');
        // const volume = modalTank.querySelector('.js-redeemed-volume');
        // const date = modalTank.querySelector('.js-date');
        // const provider = modalTank.querySelector('.js-provider');
        // if (type === '1') {
        //     title.textContent = 'Добавить емкость';
        //     volume.classList.add('is-invisible');
        //     date.classList.add('is-invisible');
        //     provider.classList.add('is-invisible');

        // } else if (type === '2') {
        //     title.textContent = 'Добавить спецификацию';
        //     volume.classList.remove('is-invisible');
        //     date.classList.remove('is-invisible');
        //     provider.classList.remove('is-invisible');
        // }

    }



    // -------------------------------------------------------------

    setInputValue(selector, value) {
        const element = this.modalPart.querySelector(selector);
        if (element) element.value = value;
    }

    setDatasetValue(selector, value, attribute) {
        const element = this.modalPart.querySelector(selector);
        if (element) element.dataset[attribute] = value;
    }

    setBasiss(basiss) {
        const fragment = document.createDocumentFragment();

        basiss.forEach(basis => {
            const option = document.createElement('option');
            option.value = basis.id;
            option.textContent = basis.name;
            fragment.appendChild(option);
        });

        return fragment;
    }

    setTanks(listTanks, product) {
        console.log('setTanks():', listTanks, product);
        const fragment = document.createDocumentFragment();
        const option = document.createElement('option');

        option.value = 0;
        option.textContent = 'Не распределена';
        fragment.appendChild(option);

        if (listTanks ) {
            listTanks.forEach(tank => {
                console.log(tank.product.name_product, product);
                if (tank.product.name_product === product) {
                    const option = document.createElement('option');
                    option.value = tank.id;
                    option.textContent = tank.name;
                    fragment.appendChild(option);
                }
            });
        }

        return fragment;
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
                    span.classList.add('droplist-item');
                    span.textContent = item.name;
                    span.dataset.supplier = item.supplier;
                    droplist.appendChild(span);
                }
            });

        }
    }

    dropdownPartner(e, listPartner) {
        const droplist = e.target.nextSibling.nextSibling;
        const value = e.target.value;

        if (value.length > 1) {
            droplist.innerHTML = '';
            droplist.classList.remove('is-hidden');

            listPartner.Data.filter(item => {
                // console.log(item);
                const namePartner = item.name_client.toLowerCase();
                if (namePartner.includes(value.toLowerCase())) {
                    const span = document.createElement('span');
                    span.classList.add('droplist-item');
                    span.dataset.code = item.code_client;
                    span.textContent = item.name_client;
                    droplist.appendChild(span);
                }
            });
        }
    }

    dropdownProduct(e, listProduct) {
        // console.log(listProduct);
        const droplist = e.target.nextSibling.nextSibling;
        const value = e.target.value;

        // {name_product: 'БГС', code_product: '000000002'}
        if (value.length > 1) {
            droplist.innerHTML = '';
            droplist.classList.remove('is-hidden');

            listProduct.Data.filter(item => {
                const namePartner = item.name_product.toLowerCase();
                if (namePartner.includes(value.toLowerCase())) {
                    const span = document.createElement('span');
                    span.classList.add('droplist-item');
                    span.dataset.code = item.code_product;
                    span.textContent = item.name_product;
                    droplist.appendChild(span);
                }
            });
        }
    }

    selectAnItem(e) {
        const wrapper = e.target.closest('.droplist-wrapper');
        const input = wrapper.querySelector('input');
        const droplist = wrapper.querySelector('.droplist');
        input.value = e.target.textContent;
        if (e.target.dataset.code) {
            input.dataset.code = e.target.dataset.code;
        }
        if (e.target.dataset.supplier && e.target.closest('.modal-tank')) {
            const modalTank = e.target.closest('.modal-tank');
            const title = modalTank.querySelector('.modal-card-title');
            const type = modalTank.querySelector('input[name="type"]');
            const volume = modalTank.querySelector('.js-redeemed-volume');
            const date = modalTank.querySelector('.js-date');
            const provider = modalTank.querySelector('.js-provider');
            input.dataset.supplier = e.target.dataset.supplier;
            if (e.target.dataset.supplier == 'false') {
                title.textContent = 'Добавить емкость';
                type.value = 'Емкость';
                type.dataset.code = 1;
                volume.classList.add('is-invisible');
                date.classList.add('is-invisible');
                provider.classList.add('is-invisible');
            } else if (e.target.dataset.supplier == 'true') {
                title.textContent = 'Добавить спецификацию';
                type.value = 'Спецификация';
                type.dataset.code = 2;
                volume.classList.remove('is-invisible');
                date.classList.remove('is-invisible');
                provider.classList.remove('is-invisible');
            }

        }
        droplist.classList.add('is-hidden');
        droplist.textContent = '';
    }

    shipPart(modalPart) {
        modalPart.querySelector('.card-part')
            .classList.toggle('is-hidden');
        modalPart.querySelector('.card-ship')
            .classList.toggle('is-hidden');
        modalPart.querySelector('.btn-cancellation-part')
            .classList.toggle('is-hidden');
        modalPart.querySelector('.btn-ship-part')
            .classList.toggle('is-hidden');

        this.modalPart.querySelector('.card-ship .checkbox').classList.remove('is-hidden');

        if (this.modalPart.dataset.kindOrder === '1') {
            const weight = this.modalPart.querySelector('input[name="weight"]').value;
            const volume = this.modalPart.querySelector('input[name="startVolume"]').value;
            const density = this.modalPart.querySelector('input[name="density"]').value;

            this.modalPart.querySelector('input[name="weight_fact"]').value = weight;
            this.modalPart.querySelector('input[name="volume_fact"]').value = volume;
            this.modalPart.querySelector('input[name="density_fact"]').value = density;

            this.modalPart.querySelector('.card-ship .checkbox').classList.add('is-hidden');


        }
    }

    shipPartСalculationDensity() {
        const weight = this.modalPart.querySelector('input[name="weight_fact"]').value;
        const volum = this.modalPart.querySelector('input[name="volume_fact"]').value;
        const density = this.modalPart.querySelector('input[name="density_fact"]');

        if (isNaN(Number(weight))) return console.log('В поле масса введено не коректное значение');
        if (isNaN(Number(volum))) return console.log('В поле объем введено не коректное значение');

        if (!weight || !volum || !density) return console.log('Не все  переменные найдены');

        density.value = (Number(weight) * 1000 / Number(volum)).toFixed(4);
    }

    // Принять полную массу
    fullWeightChecked(e) {
        const modal = e.target.closest('.modal-part');
        const weight = modal.querySelector('input[name="weight"]').value;
        const volume = modal.querySelector('input[name="startVolume"]').value;
        const density = modal.querySelector('input[name="density"]').value;
        if (e.target.checked) {
            modal.querySelector('input[name="weight_fact"]').value = weight;
            modal.querySelector('input[name="volume_fact"]').value = volume;
            modal.querySelector('input[name="density_fact"]').value = density;
        } else {
            modal.querySelector('input[name="weight_fact"]').value = '';
            modal.querySelector('input[name="volume_fact"]').value = '';
            modal.querySelector('input[name="density_fact"]').value = '';
        }
    }

    // Запретить отгрузку части заявки в не емкости
    validationShip() {
        console.log('validationShip');
        const idTank = this.modalPart.querySelector('select[name="tankName"]').value;
        const shipCard = this.modalPart.querySelector('.card-ship').classList.contains('is-hidden');
        const btn = this.modalPart.querySelector('.btn-save-part');
        console.log(idTank, shipCard, btn);
        if (shipCard) {
            console.log(1);
            btn.disabled = false;
        } else if (idTank === '0') {
            console.log(1);
            btn.disabled = true;
        }

    }

    //-----------------------------------------------------

    // Валидация
    isNumber(e) {
        let value;

        if (e.target.value.match(/[0-9,.]/gm)) {
            value = e.target.value.match(/[0-9,.]/gm)
                                .join('')
                                .replace(/^\.+/g, '')
                                .replace(/^0+/g, '0')
                                .replace(/,+/g, '.')
                                .replace(/\.+/g, '.')
                                .replace(/^\./g, '');
        } else {
            value = '';
        }

        if (value.match(/\d+\.\d+\./gm)) {
            value = value.replace(/\.$/gm, '');
        }
        if (value.match(/^0([0-9]\.+)/gm)) {
            value = value.replace(/^0([0-9]\.+)/gm, '$1');
        }
        if (value.match(/^0([0-9])/gm)) {
            value = value.replace(/^0([0-9])/gm, '$1');
        }

        e.target.value = isNaN(parseFloat(value)) ? '' : value;

    }

    // Ограничение дленны ввода числа знаков после запятой
    isNumberTrim(e) {
        console.log('isNumberTrim', e.target.value.replace(/(\d+\.\d{3})\d+/gm, '$1'));
        // if (e.target.value.match(/(\d+\.\d{2}$)/gm)) {
            e.target.value = e.target.value.replace(/(\d+\.\d{3})\d+/gm, '$1');
        // }

    }

    // Расчет Обьем (л.)
    volumeСalculation(e) {
        const modal = e.target.closest('.modal-tank');
        console.log(modal);
        if (modal) {
            const weight = modal.querySelector('input[name="weight"]').value;
            const density = modal.querySelector('input[name="density"]').value || 1;
            const volume = modal.querySelector('input[name="volume"]');
            const costManagementTonn = modal.querySelector('input[name="cost_management_tonn"]').value;
            const costPriceTonn = modal.querySelector('input[name="cost_price_tonn"]').value;
            const costManagementLitr = modal.querySelector('input[name="cost_management_litr"]');
            const costPriceLitr = modal.querySelector('input[name="cost_price_litr"]');
            console.log(weight, density);
            if (Number(density) != 0 || Number(density) != '') {
                volume.value = (Number(weight) / Number(density) * 1000).toFixed(0);
                costManagementLitr.value = (Number(costManagementTonn) * Number(density) / 1000).toFixed(2);
                costPriceLitr.value = (Number(costPriceTonn) * Number(density) / 1000).toFixed(2);
            }
        }
    }

    // Расчет себестоимости в литрах
    costLitrСalculation(e) {
        const modal = e.target.closest('.modal-tank');
        const density = modal.querySelector('input[name="density"]').value || 1;
        console.log('ModalView: costLitrСalculation(e)');
        if (e.target.name === 'cost_management_tonn') {
            const costManagementLitr = modal.querySelector('input[name="cost_management_litr"]');
            if (Number(density) != 0 || Number(density) != '') {
                costManagementLitr.value = (Number(e.target.value) * Number(density) / 1000).toFixed(2);
            }
        } else if (e.target.name === 'cost_price_tonn') {
            const costPriceLitr = modal.querySelector('input[name="cost_price_litr"]');
            if (Number(density) != 0 || Number(density) != '') {
                costPriceLitr.value = (Number(e.target.value) * Number(density) / 1000).toFixed(2);
            }
        }

    }

    // Проверка заполненности поля масса в модальном окне Part
    validationMassFild() {
        const mass = this.modalPart.querySelector('input[name="weight"]').value;
        const btnSave = this.modalPart.querySelector('.btn-ship-part');

        if (mass) {
            btnSave.disabled = false;
        } else {
            btnSave.disabled = true;
        }
    }

    // Изменения плотности и объем для расчета массы
    weightСalculation() {
        const weight = this.modalPart.querySelector('input[name="weight"]');
        const volume = Number(this.modalPart.querySelector('input[name="startVolume"]').value);
        const density = Number(this.modalPart.querySelector('input[name="density"]').value);

        if (density, volume) {
            weight.value = ( Number(volume) * Number(density) / 1000 ).toFixed(3);
        } else {
            weight.value = '';
        }
    }

    // Установка плотности в не распределенной части заявки согласно выбранной емкости
    setDensityPart(tankID, tankDensity, partDensity) {
        console.log('setDensityPart(tankID, tankDensity, partDensity)');
        const densityInput = this.modalPart.querySelector('input[name="density"]');
        const weightInput = this.modalPart.querySelector('input[name="weight"]');
        const volumeInput = this.modalPart.querySelector('input[name="startVolume"]');
        if (tankID != 0) {
            densityInput.value = tankDensity;
            weightInput.value = (volumeInput.value * ((tankDensity || 1) / 1000)).toFixed(3);
        } else {
            densityInput.value = partDensity ? partDensity : '';
            weightInput.value = (volumeInput.value * ((partDensity || 1) / 1000)).toFixed(3);
        }
    }

    // -----------------------------------------------------------

    getContainer() {
        return this.container;
    }

}