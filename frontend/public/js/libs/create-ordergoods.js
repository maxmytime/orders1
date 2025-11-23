'use strict'

import settings from '/js/config.js';
import orderNew from '/js/libs/order-new.js';
import { vSetFilds, validationForm } from '/js/libs/v.js';
import validationvSet from '/js/libs/v-config.js';
import { sliderActive, addDot, removeDot } from '/js/libs/slider.js';

const newAddress = orderNew.array_addresses[0];
const newBasis = orderNew.array_addresses[0].array_basises[0];
const newLE = orderNew.array_addresses[0].array_basises[0].array_counteragents[0];

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИЕ

// Функция получает URL
const getURL = (settings) => {
    const protocol = settings.protocol;
    const host = settings.host;
    const port = settings.port;
    const url = `${protocol}://${host}:${port}`;
    return url;
}

// Функция получает шаблон элемента
const getTemplate = (nameTemplate) => {
    const templateFragment = document.querySelector('#' + nameTemplate).content.cloneNode(true);
    const template = templateFragment.querySelector('.' + nameTemplate);

    return template;
}

// Функция конвертации времяни из формата 1С в формат Bulma
const convertTime1CToBulma = (time) => {
    const bulmaTime = time.split(':');
    return `${bulmaTime[0]}:${bulmaTime[1]}`;
}

// ФУНКЦИЕ ЗАТРАГИВАЮЩИЕ РАБОТУ НЕСКОЛЬКИХ БЛОКОВ

// Установка списка доступных адресов
const listOfAddresses = (select, address = '-') => {
    const codeClient = document.querySelector('input[name="order-client-name"]').dataset.codeClient;

    if (codeClient) {

        fetch(`${getURL(settings)}/GetCatalogAddress?Name=Addresses&ParentCode=${codeClient}`)
            .then(response => response.text())
            .then(commits => {
                let addressList = JSON.parse(commits).Data;
                select.innerHTML = '';
                select.insertAdjacentHTML('beforeend', `<option value="-">-</option>`);

                addressList.forEach(a => {
                    select.insertAdjacentHTML('beforeend', `<option value="${a}">${a}</option>`);
                });

                select.value = address;

                if (address == '-') {
                    select.classList.add('is-err');
                } else {
                    select.classList.remove('is-err');
                }
            });

    }
}

// Обновить список доступных адресов при изменении клиента
const updateAddressList = () => {
    const list = document.querySelectorAll('select[name="order-address-select"]');

    list.forEach(address => {
        address.innerHTML = '';
        address.insertAdjacentHTML('beforeend', `<option value="-">-</option>`);

        listOfAddresses(address);
    })
}

// Добавить новый адрес и обновить список доступных адресов
const saveAddress = (address, select) => {
    const codeClient = document.querySelector('input[name="order-client-name"]').dataset.codeClient;

    fetch(`${getURL(settings)}/newaddress`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
                                "code_client": codeClient,
                                "address_client": address
                            })
    }).then(response => response.text())
      .then(commits => {
          console.log(commits);
          if (JSON.parse(commits).Status === 'Error') {
            alert(JSON.parse(commits).Status);
          }

    }).then(() => {
        const list = document.querySelectorAll('select[name="order-address-select"]');
        list.forEach(item => {
            // console.log(address == select);
            if (item == select) {
                listOfAddresses(select, address);
            } else {
                listOfAddresses(item, item.value);
            }
        })
    });


}

// Обновляем список адресов для прихода
const updateAddressOrdergoods = (address) => {
    const list = document.querySelectorAll('input[name="order-address-select"]');

    list.forEach(input => {

        input.value = address;
        // select.innerHTML = '';
        // select.insertAdjacentHTML('beforeend', `<option value="-">-</option>`);
        // select.insertAdjacentHTML('beforeend', `<option value="${address}">${address}</option>`);
        // select.value = address;
    })


}

// Проверка коректности заполнения полей дата в клиенте и дата в базисе
const validationDateBasis = () => {
    const dateDocument = document.querySelector('.js-type-date-is-range');
    // const dateBasiss = document.querySelectorAll('input[name="basis-date-range"]');
    const dateBasiss = document.querySelectorAll('.basis');

    // Получаем дату
    const getDate = (element) => {
		const srcDate = element.value;

		if (srcDate.includes('-')) {
            const arrDate =  srcDate.split(' - ');
            let date = new Array();

            arrDate.forEach(d => {
                const day = d.split('.')[0];
                const month = d.split('.')[1];
                const year = d.split('.')[2];

                date.push(new Date(year, +month-1, +day));
            })

            return date;
		} else {
			return false;
		}
	}

    // Валидируем поля
    dateBasiss.forEach(db => {

        const srcDataBasis = db.querySelector('input[name="basis-date-range"]');
        const wrapperDataBasis = db.querySelector('.datetimepicker-dummy-wrapper');
        const specificationUse = db.querySelector('.js-basis-date-checkbox').checked;
        const dataBasis = getDate(srcDataBasis);
        const dataDoc = getDate(dateDocument);

        if (!dataDoc) {
            // console.log(1);
            wrapperDataBasis.classList.add('is-err');
        } else if (!dataBasis) {
            wrapperDataBasis.classList.remove('is-err');
        } else if (!(dataBasis[0] >= dataDoc[0] && dataBasis[1] <= dataDoc[1])) {
            // console.log('dataBasis', dataBasis);
            // console.log('dataDoc', dataDoc);
            // console.log(2);
            wrapperDataBasis.classList.add('is-err');
        } else if (dataBasis[0] >= dataDoc[0] && dataBasis[1] <= dataDoc[1]) {
            // console.log(3);
            wrapperDataBasis.classList.remove('is-err');
        }

        if (specificationUse && !dataBasis) {
            wrapperDataBasis.classList.add('is-err');
        } else if (!specificationUse && !dataBasis) {
            wrapperDataBasis.classList.remove('is-err');
        }


    })

    // console.log(getDate(dateDocument));
    // console.log(dateBasiss);
}

// Проверка корректности заполнения поля "Тип отгрузки"
const validationTypeShipment = () => {
    const clientTypeShipment = document.querySelector('select[name="order-client-type-shipment"]').value;
    const addresses = document.querySelectorAll('input[name="order-address-select"]');

    if (clientTypeShipment == '3' || clientTypeShipment == '5' || clientTypeShipment == '6') {
        addresses.forEach(address => {
            if (address.value == '' || address.value == '-') {
                address.classList.add('is-err');
            } else {
                address.classList.remove('is-err');
            }
        })
    } else {
        addresses.forEach(address => {
            address.classList.remove('is-err');
        })
    }

}

// ФУНКЦИЕ СОЗДАНИЯ БЛОКОВ

// Функция формирует заявку
const createOrder = (template, data = orderNew) => {
    // console.log(data);

    // Установка типа заявки-------------------------
    const orderTypeContainer = document.querySelector('.type-order-container');
    const orderType = getTemplate('type-order');

    orderType.dataset.typeOrder = data.type_order;

    const checkedTypeOrder = (e) => {
        const btnOrder = e.currentTarget.querySelector('.js-order');
        const btnReservation = e.currentTarget.querySelector('.js-reservation');

        if (e.target.classList.contains('js-order')) {
            btnOrder.classList.remove('is-outlined-brand');
            btnReservation.classList.add('is-outlined-brand');
            e.currentTarget.dataset.typeOrder = 2;
            validationvSet(vSetFilds);
        } else if (e.target.classList.contains('js-reservation')) {
            btnOrder.classList.add('is-outlined-brand');
            btnReservation.classList.remove('is-outlined-brand');
            e.currentTarget.dataset.typeOrder = 1;
            validationvSet(vSetFilds);
        }
    }

    orderType.addEventListener('click', checkedTypeOrder);

    orderTypeContainer.append(orderType);

    // Дата создания заказа----------------------------
    template.dataset.date = data.date;
    // Время создания заказа
    template.dataset.time = data.time;
    // Номер заказа
    template.dataset.number = data.number;
    // Автор заказа
    template.dataset.author = data.author;
    // Тип заявки
    template.dataset.type = data.type_order;
    // Статус заявки архивная/не архивная
    template.dataset.archieved = data.archieved;
    // Статус бухгалтерский
    template.dataset.statusBuh = data.status_buh;
    // Статус логистический
    template.dataset.statusLogistic = data.status_logistic;
    // Статус kind_order
    template.dataset.kindOrder = data.kind_order;

    console.log('order');

    return template;
}

// Функция формирует клиента
const createClient = (template, data = orderNew) => {

    console.log(data);

    // Устанавливаем архивный статус ----------------------
    const statusArchive = template.querySelector('.status-archive');
    if (data.archieved) {
        statusArchive.classList.remove('is-hidden');
    }

    // Устанавливаем кнопку разблокировки заявки ----------------------
    const buttonUnlock = template.querySelector('.js-unlock');
    if (!data.archieved) {
        buttonUnlock.classList.remove('is-hidden');
    }

    // Устанавливаем даты заявки ------------------
    // Дата начало
    template.querySelector('input[name="order-client-date"]').dataset.startDate = data.date_order.date_start;
    // Дата конец
    template.querySelector('input[name="order-client-date"]').dataset.endDate = data.date_order.date_end;
    // Активируем календарь
    const calendars = new bulmaCalendar(template.querySelector('input[name="order-client-date"]'), {
        color: 'link',
        isRange: true,
        lang: 'ru',
        dateFormat: 'dd.MM.yyyy',
        showClearButton: false,
        showTodayButton: false,
        showHeader: false,
        cancelLabel: 'Закрыть',
        displayMode: 'dialog'
    });

    calendars.on('select', date => {
        calendars._ui.dummy.wrapper.classList.remove('is-err');
        setTimeout(validationDateBasis, 1000);
    })

    calendars._ui.dummy.clear.addEventListener('click', () => {
        calendars._ui.dummy.wrapper.classList.add('is-err');
        setTimeout(validationDateBasis, 1000);
    })


    // Устанавливаем Статус логистический ------------------
    const statusLogistic = template.querySelector('select[name="order-client-status-logistic"]');
    statusLogistic.value = data.status_logistic;
    if (!data.allow_edit_logistic) {
        statusLogistic.setAttribute('disabled', 'disabled');
    }

    // Устанавливаем Клиента ------------------
    const client = template.querySelector('input[name="order-client-name"]');
    // Имя клиента
    client.value = data.name_base;
    // Код клиента
    client.dataset.codeClient = data.client.code_client;


    // Выпадающий список подбора клиента
    const clientList = (e) => {
        const wrapper = template.querySelector('.droplist-wrapper-partner'),     // Контейнер с выпадающим списком
              input = wrapper.querySelector('input[name="order-client-name"]'),  // Поле ввода
              list = wrapper.querySelector('.droplist'),
              value = input.value;

        // Получаем список клиентов с сервера
        fetch(`${getURL(settings)}/getsupplybases`)
            .then(response => response.text())
            .then(commits => {
                let partnersList = JSON.parse(commits).Data;

                if (value.length >= 2) {
                    list.classList.remove('is-hidden'); // Делаем выподающий список видимым
                    list.innerHTML = '';                // Очищаем список клиентов

                    // Проверяем есть ли значение в качестве подстроки и если да то добавляем его в список выбора
                    partnersList.filter(item => {
                        const { name, address, code_client, type_client } = item;
                        const nameClient = name.toLowerCase();
                        if (nameClient.includes(value.toLowerCase())) {
                            list.insertAdjacentHTML('beforeend', `<span data-type="${type_client}"
                                                                        data-code="${code_client}"
                                                                        data-address="${address}"
                                                                        class="droplist-item">${name}</span>`);
                        }
                    });

                } else {
                    list.classList.add('is-hidden'); // Скрываем выпадающий список
                }

            })


    }

    client.addEventListener('input', clientList);

    // Выбор клиента из выпадающего списка
    const wrapper = template.querySelector('.droplist-wrapper-partner');  // Контейнер с выпадающим списком

    wrapper.addEventListener('click', (i) => {
        const item = i.target,
              inputClient = wrapper.querySelector('input[name="order-client-name"]'),
              list = wrapper.querySelector('.droplist');
            //   inputType = template.querySelector('input[name="order-client-type"]');

        if (item.classList.contains('droplist-item')) {
            inputClient.value = item.innerHTML;
            inputClient.dataset.codeClient = item.dataset.code;
            inputClient.dataset.address = item.dataset.address;

            list.classList.add('is-hidden'); // Скрываем выпадающий список
            updateAddressOrdergoods(item.dataset.address); // Обновляем список доступных адресов в блоке адрес
            validationTypeShipment(); // Проверяем корректность заполнения поля адрес доставки
        }

    })

    // Устанавливаем Тип отгрузки ------------------
    const clientTypeShipment = template.querySelector('select[name="order-client-type-shipment"]');
    // Тип отгрузки
    clientTypeShipment.value = data.type_operation;

    // Событие изминенния типа отгрузки
    clientTypeShipment.addEventListener('change', () => {
        validationTypeShipment();
    })

    // Устанавливаем Комментарий ------------------
    const clientComment = template.querySelector('textarea[name="order-client-comment"]');
    // Комментарий
    clientComment.value = data.commentary;

    // ФУНКЦИИ ДЕЙСТВИЕ, КОТОРЫХ РАСПРОСТРАНЯЕТСЯ НА ВЕСЬ РАЗДЕЛ КЛИЕНТ

    return template;
}

// Функция формирует адрес
const creatAddress = (template, data = newAddress) => {

    // Установка адреса-------------------------------------
    const address = template.querySelector('input[name="order-address-select"]');

    // Адрес
    address.value = data.name_address;

    // Проверяем корректность заполнения поля адрес доставки
    address.addEventListener('input', () => {
        validationTypeShipment();
    })

    //Добавляем адрес в базу
    const basa = document.querySelector('input[name="order-client-name"]');
    basa.dataset.address = data.name_address;

    // Вешаем событие на блок адрес. Отследиваем нажатие кнопки добавить новый блок адрес.
    template.addEventListener('click', addAddress);
    // Вешаем событие на блок адрес. Отследиваем нажатие кнопки удалить блок адрес.
    template.addEventListener('click', dellAddress);

    return template;
}

// Функция формирует базис
const creatBasis = (template, data = newBasis) => {

    // Установка базиса -------------------------------------
    const basis = template.querySelector('input[name="order-basis"]');
    // Базиса
    basis.value = data.basis.name_basis;

    // Выпадающий список подбора базиса
    const basisList = (e) => {
        const wrapper = template.querySelector('.droplist-wrapper'),               // Контейнер с выпадающим списком
                input = wrapper.querySelector('input[name="order-basis"]'),  // Поле ввода
                list = wrapper.querySelector('.droplist'),
                value = input.value;

        // Получаем список клиентов с сервера
        fetch(`${getURL(settings)}/getbasiseslist`)
            .then(response => response.text())
            .then(commits => {
                let partnersList = JSON.parse(commits).Data;

                if (value.length >= 2) {
                    list.classList.remove('is-hidden'); // Делаем выподающий список видимым
                    list.innerHTML = '';                // Очищаем список клиентов

                    // Проверяем есть ли значение в качестве подстроки и если да то добавляем его в список выбора
                    partnersList.filter(item => {
                        const nameClient = item.toLowerCase();
                        if (nameClient.includes(value.toLowerCase())) {
                            list.insertAdjacentHTML('beforeend', `<span class="droplist-item">${item}</span>`);
                        }
                    });

                } else {
                    list.classList.add('is-hidden'); // Скрываем выпадающий список
                }

            })


    }

    basis.addEventListener('input', basisList);

    // Выбор базиса из выпадающего списка
    const wrapper = template.querySelector('.droplist-wrapper');              // Контейнер с выпадающим списком

    wrapper.addEventListener('click', (i) => {
        const item = i.target,
              inputBasis = wrapper.querySelector('input[name="order-basis"]'),
              list = wrapper.querySelector('.droplist');

        if (item.classList.contains('droplist-item')) {
            inputBasis.value = item.innerHTML;

            list.classList.add('is-hidden'); // Скрываем выпадающий список
        }

    })

    // Устанавливаем даты базиса ------------------
    // Диапазон чек бокс
    const checkedDateRange = template.querySelector('.js-basis-date-checkbox');
    checkedDateRange.checked = data.specification_use;

    checkedDateRange.addEventListener('change', () => {
        setTimeout(validationDateBasis, 1000);
    })

    // Дата базиса диапазон
    const inputCalendarRange = template.querySelector('.js-basis-date-range .input');
    const calendarBasisRange = new bulmaCalendar(inputCalendarRange, {
        type: 'date',
        color: 'link',
        isRange: true,
        lang: 'ru',
        dateFormat: 'dd.MM.yyyy',
        startDate: data.hasOwnProperty('date_basis') ?  data.date_basis.date_start : undefined,
        endDate: data.hasOwnProperty('date_basis') ?  data.date_basis.date_end : undefined,
        showClearButton: false,
        showTodayButton: false,
        showHeader: false,
        cancelLabel: 'Закрыть',
        displayMode: 'dialog'
    });

    calendarBasisRange.on('select', date => {
        // calendarBasisRange._ui.dummy.wrapper.classList.remove('is-err');
        setTimeout(validationDateBasis, 1000);
    })

    calendarBasisRange._ui.dummy.clear.addEventListener('click', () => {
        // calendarBasisRange._ui.dummy.wrapper.classList.add('is-err');
        setTimeout(validationDateBasis, 1000);
    })

    // Установка поля продукт -------------------------------------
    const product = template.querySelector('input[name="order-product"]');
    // Продукт
    product.value = data.product.name_product;            // Значение в поле input
    product.dataset.product = data.product.code_product;  // код в дата атребуте


    // Выпадающий список подбора продукта
    const clientProduct = (e) => {
        const wrapper = template.querySelector('.droplist-wrapper-product'),     // Контейнер с выпадающим списком
                input = wrapper.querySelector('input[name="order-product"]'),    // Поле ввода
                list = wrapper.querySelector('.droplist'),
                value = input.value;

        // Получаем список продуктов с сервера
        fetch(`${getURL(settings)}/getproductslist`)
            .then(response => response.text())
            .then(commits => {
                let productList = JSON.parse(commits).Data;

                if (value.length >= 2) {
                    list.classList.remove('is-hidden'); // Делаем выподающий список видимым
                    list.innerHTML = '';                // Очищаем список клиентов

                    // Проверяем есть ли значение в качестве подстроки и если да то добавляем его в список выбора
                    productList.filter(item => {
                        const { name_product, code_product } = item;
                        const nameClient = name_product.toLowerCase();
                        if (nameClient.includes(value.toLowerCase())) {
                            list.insertAdjacentHTML('beforeend', `<span data-code="${code_product}"
                                                                        class="droplist-item">${name_product}</span>`);
                        }
                    });

                } else {
                    list.classList.add('is-hidden'); // Скрываем выпадающий список
                }

            })


    }

    product.addEventListener('input', clientProduct);

    // Выбор продукта из выпадающего списка
    const wrapperProduct = template.querySelector('.droplist-wrapper-product');  // Контейнер с выпадающим списком

    wrapperProduct.addEventListener('click', (i) => {
        const item = i.target,
              inputProduct = wrapperProduct.querySelector('input[name="order-product"]'),
              list = wrapperProduct.querySelector('.droplist');

        if (item.classList.contains('droplist-item')) {
            inputProduct.value = item.innerHTML;
            inputProduct.dataset.product = item.dataset.code;

            list.classList.add('is-hidden'); // Скрываем выпадающий список
        }

    })

    // Установка поля номенклатура -------------------------------------
    const nomenclature = template.querySelector('input[name="order-nomenclature"]');
    // Номенклатура
    nomenclature.value = data.nomenclature.name_nomenclature;                   // Значение в поле input
    nomenclature.dataset.nomenclature = data.nomenclature.code_nomenclature;    // код в дата атребуте

    // Выпадающий список подбора номенклатуры
    const clientNomenclature = (e) => {
        const wrapper = template.querySelector('.droplist-wrapper-nomenclature'),     // Контейнер с выпадающим списком
                input = wrapper.querySelector('input[name="order-nomenclature"]'),    // Поле ввода
                list = wrapper.querySelector('.droplist'),
                value = input.value;

        // Получаем список продуктов с сервера
        fetch(`${getURL(settings)}/getnomenclaturelist`)
            .then(response => response.text())
            .then(commits => {
                let productNomenclature = JSON.parse(commits).Data;

                if (value.length >= 2) {
                    list.classList.remove('is-hidden'); // Делаем выподающий список видимым
                    list.innerHTML = '';                // Очищаем список клиентов

                    // Проверяем есть ли значение в качестве подстроки и если да то добавляем его в список выбора
                    productNomenclature.filter(item => {
                        const { name_nomenclature, code_nomenclature } = item;
                        const nameNomenclature = name_nomenclature.toLowerCase();
                        if (nameNomenclature.includes(value.toLowerCase())) {
                            list.insertAdjacentHTML('beforeend', `<span data-code="${code_nomenclature}"
                                                                        class="droplist-item">${name_nomenclature}</span>`);
                        }
                    });

                } else {
                    list.classList.add('is-hidden'); // Скрываем выпадающий список
                }

            })


    }

    nomenclature.addEventListener('input', clientNomenclature);

    // Выбор номенклатуры из выпадающего списка
    const wrapperNomenclature = template.querySelector('.droplist-wrapper-nomenclature');  // Контейнер с выпадающим списком

    wrapperNomenclature.addEventListener('click', (i) => {
        const item = i.target,
              inputNomenclature = wrapperNomenclature.querySelector('input[name="order-nomenclature"]'),
              list = wrapperNomenclature.querySelector('.droplist');

        if (item.classList.contains('droplist-item')) {
           inputNomenclature.value = item.innerHTML;
           inputNomenclature.dataset.nomenclature = item.dataset.code;

            list.classList.add('is-hidden'); // Скрываем выпадающий список
        }

    })

    // Установка поля объем в базисе -------------------------------------
    // Чек бокс
    const checkedVolume = template.querySelector('input[name="order-volume-range"]');
    checkedVolume.checked = data.volume.range_volume;

    // Минимальный объем
    const startVolume = template.querySelector('input[name="order-start-volume"]');
    startVolume.value = data.volume.start_volume;


    // Максимальный объем
    const endVolume = template.querySelector('input[name="order-end-volume"]');
    endVolume.value = data.volume.end_volume;


    // Событие переключения чекбокса объем и установка зависимости
    // минимального и максимального объема
    const volumeInclusion = () => {
        const checked = template.querySelector('input[name="order-volume-range"]').checked;
        const volumeMax = template.querySelector('.js-volume-max');

        if (checked) {
            volumeMax.classList.remove('is-hidden');
        } else {
            volumeMax.classList.add('is-hidden');
        }
    }

    volumeInclusion();

    checkedVolume.addEventListener('change', volumeInclusion);

    // Установка поля доставка -------------------------------------
    // Радио кнопка переключающая доставка с НДС или без НДС
    const ndsTrue = template.querySelector('.nds-true');
    const ndsFalse = template.querySelector('.nds-false');
    const name = Math.random();
    ndsTrue.name = name;
    ndsFalse.name = name;
    ndsTrue.checked = data.delivery.NDS_delivery;
    ndsFalse.checked = !data.delivery.NDS_delivery;

    // Поля стоимости доставки
    const costDelivery = template.querySelector('input[name="order-cost-delivery"]');
    costDelivery.value = data.delivery.cost_delivery;


    // Еденицы измерения
    const costDeliveryUnit = template.querySelector('select[name="order-cost-delivery-unit"]');
    costDeliveryUnit.value = data.delivery.cost_type_delivery;

    // Установка поля комментарий в базисе -------------------------------------
    const comment = template.querySelector('textarea[name="order-basis-comment"]');
    comment.innerHTML = data.commentary;

    // Вешаем событие на блок базис. Отследиваем нажатие кнопки добавить новый блок базис.
    template.addEventListener('click', addBasis);
    // Вешаем событие на блок базис. Отследиваем нажатие кнопки удалить блок базис.
    template.addEventListener('click', dellBasis);

    return template;
}


// ДОБАВЛЕНИЕ И УДАЛЕНИЕ НОВЫХ ЭЛЕМЕНТОВ В ЗАЯВКЕ АДРЕС, БАЗИС, ЮЛ

// Добавить адрес
const addAddress = (a) => {
    if (a.target.classList.contains('js-add-new-address')) {
        const oldAddress = document.querySelector('input[name="order-client-name"]').dataset.address;
        const basa = document.querySelector('input[name="order-client-name"]');
        const address = creatAddress(getTemplate('address'));
        const basis = creatBasis(getTemplate('basis'));

        address.querySelector('.basis-container').append(basis);

        a.currentTarget.after(address);

        updateAddressOrdergoods(oldAddress);
        basa.dataset.address = oldAddress;


        validationvSet(vSetFilds);
        setTimeout(validationDateBasis, 1000);
        validationTypeShipment(); // Проверяем корректность заполнения поля адрес доставки
        addDot(basis);
    }
}

// Удалить адрес
const dellAddress = (a) => {
    const length = document.querySelectorAll('.address-container .address').length;

    if (length > 1) {
        if (a.target.classList.contains('js-del-address')) {
            a.currentTarget.remove();
            removeDot();
        }
    }

}

// Добавить базис
const addBasis = (b) => {
    if (b.target.classList.contains('js-add-new-basis')) {
        // console.log(b);
        const basis = creatBasis(getTemplate('basis'));
        b.currentTarget.after(basis);

        validationvSet(vSetFilds);
        setTimeout(validationDateBasis, 1000);
        addDot(basis);
        // sliderPosition(basis);
    }
}

// Удалить базис
const dellBasis = (b) => {
    const length = b.currentTarget.parentNode.querySelectorAll('.basis').length;

    if (length > 1) {
        if (b.target.classList.contains('js-btn-basis-del')) {
            b.currentTarget.remove();
            removeDot();
        }
    }

}


export default { creatBasis, creatAddress, createClient, createOrder, getTemplate };
export { creatBasis, creatAddress, createClient, createOrder, getTemplate };