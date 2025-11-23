'use strict';

import settings from '/js/config.js';
import { paymentSchedules, company, row, btnContainer, sum, checkBox, scheduleAlert, buttons } from '/js/template/payment-schedule.js';
import engineHTML from '/js/libs/engine.js';
import setPreloader from '/js/libs/preloader.js';
import { creatBasis, creatAddress, createClient, createOrder, getTemplate } from '/js/libs/create-ordergoods.js';
import orderNew from '/js/libs/order-new.js';
import { vSetFilds, validationForm } from '/js/libs/v.js';
import validationvSet from '/js/libs/v-config.js';
import { blocking, unlocking, setBlock} from '/js/libs/blocking.js';
import { sliderActive, addDot } from '/js/libs/slider.js';

window.addEventListener('DOMContentLoaded', () => {

    // console.log(settings.protocol, settings.host, settings.port);

    const getURL = (settings) => {
        const protocol = settings.protocol;
        const host = settings.host;
        const port = settings.port;
        const url = `${protocol}://${host}:${port}`;
        return url;
    }

    const app = document.querySelector('.js-app');
    const order = getTemplate('order');
    const client = getTemplate('client');

    // ПОЛУЧЕНИЕ ДАННЫХ С СЕРВЕРА
    // Получить заказ
    const urlSearch = new URLSearchParams(window.location.search);
    const number = urlSearch.get('order');

    if (urlSearch.get('order')) {
        fetch(`${getURL(settings)}/GetOrderDetails?OrderID=${number}`)
            .then(response => response.text())
            .then(commits => {

                const data = JSON.parse(commits).Data.OrdersList;

                // Монитруем контейнер ордер
                app.append(createOrder(order, data));
                // Монитруем контейнер клиент
                app.querySelector('form').append(createClient(client, data));
                // Монитруем контейнер адреса
                data.array_addresses.forEach((dataAddress) => {
                    const address = getTemplate('address');
                    app.querySelector('.address-container').append(creatAddress(address, dataAddress));
                    // Монтируем контейнеры базисов
                    dataAddress.array_basises.forEach((dataBasis) => {
                        const basis = getTemplate('basis');
                        address.querySelector('.basis-container').append(creatBasis(basis, dataBasis));
                    })
                })

                activControlPanel(data);

                // Блокировка заявки
                if (setBlock()) {
                    // unlocking();
                    blocking();
                    validationvSet(vSetFilds);
                } else {
                    unlocking();
                    validationvSet(vSetFilds);
                }

                // validationDateBasis();

                sliderActive();

                return data;
            })
    } else {
        // Монитруем контейнер ордер
        app.append(createOrder(order));
        // Монитруем контейнер клиент
        app.querySelector('form').append(createClient(client));
        // Монитруем контейнер адреса
        const address = getTemplate('address');
        app.querySelector('.address-container').append(creatAddress(address));
        // Монтируем контейнеры базисов
        const basis = getTemplate('basis');
        address.querySelector('.basis-container').append(creatBasis(basis));

        // Активация панели управления
        activControlPanel(orderNew);

        // Блокировка заявки
        if (setBlock()) {
            unlocking();
            validationvSet(vSetFilds);
        } else {
            blocking();
        }

        // validationDateBasis();



    }


    // =========================================================================================
    // ПАНЕЛЬ УПРАВЛЕНИЯ
    // =========================================================================================

    // Сбор данных о заявке и клиенте
    function getOrder() {
        const order = document.querySelector('.order'),
              client = order.querySelector('input[name="order-client-name"]').dataset.codeClient,
              date = order.querySelector('input[name="order-client-date"]').value.split(' - '),
              archieved = false;

        // Тип заявки
        function setType(order) {
            const url = new URLSearchParams(window.location.search);

            if (url.get('order')) {
                return 2;
            } else {
                return 1;
            }
        }

        // Конвертируем дату в формат 1С
        function dateConverter() {
            if (document.querySelector('input[name="order-client-doc-date"]').value) {
                const date = document.querySelector('input[name="order-client-doc-date"]').value.split('.');
                console.log(date);
                return `${date[2]}.${date[1]}.${date[0]}`;
            }
            return `00.00.0000`;
        }

        // Конвертируем время в формат 1С
        function timeConverter() {
            if (document.querySelector('input[name="order-client-doc-time"]').value) {
                const data = document.querySelector('input[name="order-client-doc-time"]').value;
                return `${data}:00`;
            }
            return `00:00:00`;
        }

        // Сборка текущих данных в графике платежей
        function сollectionOfData() {

            // Конвертируем дату в формат 1С
            function dataConverter(r) {
                if (r.querySelector('.schedule-row-date-payment').value) {
                    const data = r.querySelector('.schedule-row-date-payment').value.split('-');
                    console.log(data);
                    return `${data[2]}.${data[1]}.${data[0]}`;
                }
                return `00.00.0000`;
            }

            const paymentSchedules = document.querySelectorAll('#payment-schedule .modal-card-body .schedule-company');
            let schedule = [];

            paymentSchedules.forEach(company => {
                let item = {
                    "name_counteragent": company.querySelector('.schedule-company-title').innerHTML,
                    "code_counteragent": company.querySelector('.schedule-company-title').dataset.inn,
                    "type_entity": getPaymentTerms('btn-brand', '.schedule-buttons .button', company),
                    "rows_payments": [],
                };

                const rows = company.querySelectorAll('.schedule-row');

                rows.forEach(row => {
                    let itemRow = {
                        "percent": Number(row.querySelector('.schedule-row-percent').value),
                        "summ": Number(row.querySelector('.schedule-row-sum').value.replace(',', '.')),
                        "type_payment": Number(row.querySelector('.schedule-row-type-payment').value),
                        "date_payment": dataConverter(row),
                        "offset_payment": row.querySelector('.schedule-row-offset-payment').value
                    }

                    item.rows_payments.push(itemRow);
                })

                schedule.push(item);

            });

            return schedule;
        }

        let orderData = {
            // Заявка/Клиент
            "type_action_order": copy || setType(order),
            // "type_action_order": setType(order),
            "action_type": setType(order),
            "code_client": client,
            "name_base": order.querySelector('input[name="order-client-name"]').value,
            "number": order.dataset.number,
            "type_order": Number(document.querySelector('.js-type-order').dataset.typeOrder),
            "kind_order": Number(document.querySelector('.order').dataset.kindOrder),
            "type_operation": Number(document.querySelector('select[name="order-client-type-shipment"]').value),
            "archieved": archieved,
            "renew_docs": '',
            "date_order": {
                "date_range": !(date[0] == date[1]),
                "date_start": date[0],
                "date_end": date[1]
            },
            // "documents": {
            //     "type_docs": Number(order.querySelector('select[name="order-client-document"]').value),
            //     "urgency_docs": Number(order.querySelector('select[name="order-client-urgency"]').value),
            //     "urgency_in_due_docs": Number(order.querySelector('select[name="order-client-term"]').value),
            //     "urgency_until_docs": {
            //         "date": dateConverter(),
            //         "time": timeConverter()
            //     }
            // },
            "payment_schedule": [],
            // "status_buh": Number(document.querySelector('select[name="staus-buh"]').value),
            "status_logistic": Number(document.querySelector('select[name="order-client-status-logistic"]').value),
            "commentary": document.querySelector('.client textarea[name="order-client-comment"]').value,
            "array_addresses": []
        };

        // Добавлем информацию о одресах
        const arrayAddresses = orderData.array_addresses;
        const addreses = order.querySelectorAll('.address');
        addreses.forEach(address => {

            let addressObj = {
                "name_address": address.querySelector('input[name="order-address-select"]').value,
                "array_basises": []
            };

            arrayAddresses.push(addressObj);

            // Добавлем информацию о базисах
            const arrayBasises = addressObj.array_basises;
            const basises = address.querySelectorAll('.basis');
            basises.forEach(basis => {

                // Код номенклатуры
                function codeNomenclature() {
                    if (basis.querySelector('input[name="order-address-basis-nomenclature"]').dataset.product) {
                        return basis.querySelector('input[name="order-address-basis-nomenclature"]').dataset.product;
                    } else {
                        return basis.querySelector('input[name="order-address-basis-nomenclature"]').dataset.nomenclature;
                    }
                }

                // Стоимость доставки
                function costDelivery() {
                    let cost = basis.querySelector('input[name="order-cost-delivery"]').value;

                    if (cost == '') {
                        cost = 0;
                        return cost;
                    } else {
                        return cost;
                    }
                }

                // Дата базиса
                function getBasisData(basis) {
                    // if (basis.querySelector('.js-basis-date-checkbox').checked) {
                    //     const dateSrc = basis.querySelector('input[name="basis-date-range"]').value.split(' - ');
                    //     console.log(dateSrc);
                    //     return {start: dateSrc[0], end: dateSrc[1]};
                    // } else {
                    //     const dateSrc = basis.querySelector('input[name="basis-date"]').value;
                    //     console.log(dateSrc);
                    //     return {start: dateSrc, end: ''};
                    // }

                    const dateSrc = basis.querySelector('input[name="basis-date-range"]').value.split(' - ');
                    // console.log(!dateSrc[0]);
                    // if (!dateSrc[0]) {
                    //     const dateDoc = document.querySelector('input[name="order-client-date"]').value.split(' - ');
                    //     return {start: dateDoc[0], end: dateDoc[1]};
                    // } else {
                    //     return {start: dateSrc[0], end: dateSrc[1]};
                    // }

                    if (!dateSrc[0]) {
                        return {start: '', end: ''};
                    } else {
                        return {start: dateSrc[0], end: dateSrc[1]};
                    }
                }

                let basisObj = {
                    "name_basis": basis.querySelector('input[name="order-basis"]').value,
                    "code_product": basis.querySelector('input[name="order-product"]').dataset.product,
                    "code_nomenclature": basis.querySelector('input[name="order-nomenclature"]').dataset.nomenclature,
                    "volume": {
                        "range_volume": basis.querySelector('input[name="order-volume-range"]').checked,
                        "start_volume": Number(basis.querySelector('input[name="order-start-volume"]').value),
                        "end_volume": Number(basis.querySelector('input[name="order-end-volume"]').value)
                    },
                    "delivery": {
                        "NDS_delivery": basis.querySelectorAll('input[type="radio"]')[0].checked,
                        "cost_delivery": costDelivery(),
                        "cost_type_delivery": basis.querySelector('select[name="order-cost-delivery-unit"]').value
                    },
                    "specification_use": basis.querySelector('.js-basis-date-checkbox').checked,
                    "date_basis": {
                        "date_range": !(getBasisData(basis).start == getBasisData(basis).end),
                        "date_start": getBasisData(basis).start,
                        "date_end": getBasisData(basis).end,
                    },
                    "commentary": basis.querySelector('textarea[name="order-basis-comment"]').value,
                    "array_counteragents": []
                };

                arrayBasises.push(basisObj);

                // Добавляем юридическое лицо
                const arrayСounteragents = basisObj.array_counteragents;
                const counteragents = basis.querySelectorAll('.legal-entity');
                console.log(counteragents);

                counteragents.forEach(counteragent => {
                    let counteragentsObj = {
                        "code_counteragent": counteragent.querySelector('select[name="order-counteragent"]').value,
                        "commentary": '',
                        "volume": counteragent.querySelector('input[name="order-dael-volume"]').value,
                        "weight": counteragent.querySelector('input[name="order-dael-wt"]').value,
                        "cost": counteragent.querySelector('input[name="order-dael-price"]').value,
                        "type_cost": Number(counteragent.querySelector('select[name="order-dael-unit"]').value),
                    };

                    arrayСounteragents.push(counteragentsObj);

                });
            });
        });

        console.log(JSON.stringify(orderData));

        return orderData;
    }

    // Функция отправки заявки (Создание, удаление, копирование)
    function sendOrder(orderData) {
        if (validationForm()) {
            fetch(`${getURL(settings)}/postupdateorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(orderData)
            }).then(response => response.text())
              .then(commits => {
                    console.log(commits);
                    alert('Продолжить?')
                    if (JSON.parse(commits).Status === 'Error') {
                        alert(JSON.parse(commits).Status);
                        run = true;
                    }

                    if (JSON.parse(commits).Status === 'OK') {
                        document.location = 'orders';
                    }
            });
        }
    }

    // Активация панели управления
    function activControlPanel(obj) {
        const createOrder = document.querySelector('.js-create-order');
        const copyOrder = document.querySelector('.js-copy-order');
        const cancelOrder = document.querySelector('.js-cancel-order');
        const deleteOrder = document.querySelector('.js-delete-order');
        const saveOrder = document.querySelector('.js-save-order');
        const openMenu = document.querySelector('.js-open-button-menu');
        const closeMenu = document.querySelector('.js-close-button-menu');
        const url = new URLSearchParams(window.location.search);
        const screenWidth = document.documentElement.clientWidth;

        console.log('zzzzZ');

        if (screenWidth < 940) {
            openMenu.classList.remove('is-hidden');
            closeMenu.classList.remove('is-hidden');

            const checkButton = document.querySelector('.js-check-button');

            checkButton.classList.add('js-check-button-mobile');

            openMenu.addEventListener('click', (e) => {
                checkButton.classList.add('js-check-button-mobile-open');
            })

            closeMenu.addEventListener('click', (e) => {
                checkButton.classList.remove('js-check-button-mobile-open');
            })

            copyOrder.addEventListener('click', (e) => {
                checkButton.classList.remove('js-check-button-mobile-open');
            })
        }

        if (obj.archieved == true) {
            copyOrder.classList.remove('is-hidden');
            cancelOrder.classList.remove('is-hidden');
        } else if (url.get('order') != null) {
            copyOrder.classList.remove('is-hidden');
            cancelOrder.classList.remove('is-hidden');
            deleteOrder.classList.remove('is-hidden');
            saveOrder.classList.remove('is-hidden');
        } else if (url.get('order') == null) {
            createOrder.classList.remove('is-hidden');
            cancelOrder.classList.remove('is-hidden');
        }
    }

    // Контроль функция уже закончила выполнение или нет
    let run = true;
    let copy = false;

    // Кнопки панели управления
    const orderCreate = document.querySelector('.js-create-order');
    const copyOrder = document.querySelector('.js-copy-order');
    const cancelOrder = document.querySelector('.js-cancel-order');
    const deleteOrder = document.querySelector('.js-delete-order');
    // const saveOrder = document.querySelectorAll('.js-save-order-renew-docs-true, .js-save-order-renew-docs-false');
    const saveOrder = document.querySelectorAll('.js-save-order');
    const buttonSaveOrder = document.querySelector('.js-save-order');
    const status = document.querySelector('select[name="staus-buh"]');

    // console.log(status);

    // status.addEventListener('change', e => {
    //     buttonSaveOrder.setAttribute('status', e.target.value);
    // })

    // Активация панели управления
    // activControlPanel();

    // Событие кнопки Создание
    orderCreate.addEventListener('click', (e) => {
        console.log(run);

        if (run) {
            run = false;
            const orderData = getOrder();  // Сбор данных о заявке и клиенте
            console.log(JSON.stringify(orderData));
            // alert('ok');
            sendOrder(orderData);          // Отправка данных на сервер
            run = true;
        } else {
            run = true;
            alert('Заполните обязательные поля');
        }
    })

    // Событие кнопки Сохранить
    saveOrder.forEach(button => {
        button.addEventListener('click', (e) => {
            const orderData = getOrder();  // Сбор данных о заявке и клиенте
            // console.log(document.querySelectorAll('.is-err'));
            sendOrder(orderData);          // Отправка данных на сервер

        })
    })

    // Событие кнопки Удалить
    deleteOrder.addEventListener('click', () => {
        const orderData = getOrder();  // Сбор данных о заявке и клиенте
        orderData.archieved = true;    // Устанавливаем пометку заявке как удаленная
        orderData.status_buh = 3;      // Устанавливаем бух статус отменен
        orderData.status_logistic = 5; // Устанавливаем логистический статус отменен
        sendOrder(orderData);          // Отправка данных на сервер
    })

    // Событие кнопки Отмена
    cancelOrder.addEventListener('click', () => {
        document.location = 'orders';
    })

    // Событие кнопки Копировать
    copyOrder.addEventListener('click', (e) => {
        unlockFields();
        const btn = e.target;
        const dates = document.querySelectorAll('.datetimepicker-dummy-wrapper input');
        const statusLogistic = document.querySelector('select[name="order-client-status-logistic"]');
        const numberOrder = document.querySelector('form');

        buttonSaveOrder.classList.add('is-hidden');
        deleteOrder.classList.add('is-hidden');
        orderCreate.classList.remove('is-hidden');
        btn.setAttribute('disabled', 'disabled');
        dates[0].value = '';
        dates[1].value = '';
        dates[2].setAttribute('value', '');
        statusLogistic.value = 1;
        // numberOrder.dataset.number =
        copy = true;
    })

});