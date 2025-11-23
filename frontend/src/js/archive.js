'use strict';

// import { basis } from './template/archive-table';
import settings from '/js/config.js';
// import { row, basis, date } from '/js/template/archive-table.js';
// import engineHTML from '/js/libs/engine.js';
import setPreloader from '/js/libs/preloader.js';
import {saveArchive, getArchive} from '/js/libs/archive-save-data.js';

window.addEventListener('DOMContentLoaded', () => {

    // console.log(settings.protocol, settings.host, settings.port);

    const getURL = (settings) => {
        const protocol = settings.protocol;
        const host = settings.host;
        const port = settings.port;
        const url = `${protocol}://${host}:${port}`;
        return url;
    }

    // Возвращает текущую дату в формате dd-mm-yyyy
    function getDate() {
        const endDate = new Date();
        let startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());

        // Проверка, был ли день скорректирован из-за несуществующей даты
        if (startDate.getDate() !== endDate.getDate()) {
            startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        }

        // Форматирование даты в строку DD-MM-YYYY
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}-${month}-${year}`;
        };

        return {
            start: formatDate(startDate),
            end: formatDate(endDate)
        };

    }

    // Получаем список заказов с сервера
    function getOrderList() {

        // console.log(getDate());

        const tableArchive = document.querySelector('.table-archive');
        tableArchive.innerHTML = '';

        preloaderTable();
        // noOrders();

        // console.log(`${getURL(settings)}/orderlistarchieved?archieved=true&StartDate=${getDate().start}&EndDate=${getDate().end}`);

        // fetch(`${getURL(settings)}/orderlistarchieved?archieved=true&StartDate=${getDate().start}&EndDate=${getDate().end}`)
        fetch(`${getURL(settings)}/orderlistarchieved?archieved=true&StartDate=${getDate().start}&EndDate=`)
        .then(response => response.text())
        .then(commits => {
            // console.log(commits);
            console.log(JSON.parse(commits).Data.OrdersList);
            const data = JSON.stringify(JSON.parse(commits).Data.OrdersList);
            saveArchive(data, 1);
            // console.log(JSON.parse(commits).Data.OrdersList, JSON.parse(data));
            setTable(sortData(JSON.parse(commits).Data.OrdersList));
            preloaderTable();
            setPreloader('preloader');
        }).then(() => {

            fetch(`${getURL(settings)}/orderlistarchieved?archieved=true&EndDate=${getDate().start}`)
            .then(response => response.text())
            .then(commits => {
                // console.log(JSON.parse(commits).Data.OrdersList);
                const data = JSON.stringify(JSON.parse(commits).Data.OrdersList);
                saveArchive(data, 2);
                // console.log(getArchive());
                setTable(sortData(JSON.parse(commits).Data.OrdersList), 0);
                // preloaderTable();
                // setPreloader('preloader');
            })

        })
    }

    // Обновлени таблицы из архива
    function updataTable() {
        const tableArchive = document.querySelector('.table-archive');
        tableArchive.innerHTML = '';
        preloaderTable();
        // noOrders();
        // setTable(sortData(getArchive()));
        getOrderList();
    }

    // Влючение отключение прелоада в таблице
    function preloaderTable() {
        const tfoot = document.querySelector('tfoot tr.preloader-table-wrapper');
        tfoot.classList.toggle('is-hidden');
    }

    // Влючение отключение прелоада
    function noOrders(size = 1) {
        const tfoot = document.querySelector('tfoot tr.no-orders');

        if (size) {
            tfoot.classList.add('is-hidden');
        } else {
            tfoot.classList.remove('is-hidden');
        }
    }

    function getAuthorList() {
        const authors = document.querySelector('.author');

        fetch(`${getURL(settings)}/getAuthorList`)
        .then(response => response.text())
        .then(commits => {
            const data = JSON.parse(commits).Data;

            data.forEach((item, index) => {
                authors.insertAdjacentHTML('beforeend', `<option value="${item.name_author}">${item.name_author}</option>`);
            })
        })
    }

    getOrderList();
    getAuthorList();

    // Сортируем массив данных полученный от сервера
    function sortData(data) {

        function corrector(date) {
            const arr = date.split('.');

            return new Date(arr[2], arr[1] - 1, arr[0]);
        }

        // console.log(data);

        data.sort((a, b) => {
            // console.log(b.date_order.date_start, a.date_order.date_start);
            return corrector(b.date_order.date_start) - corrector(a.date_order.date_start);
        });

        return data;
    }

    // Рисуем таблицу
    function setTable(data, clear = 1) {

        // Формируем объект для отбора архивных заказов по критериям поиска
        const getParamSearch = () => {
            return {
                'client': document.querySelector('.search').value,
                'date': {
                    'start': calendars[0].date.start,
                    'end': calendarsEnd[0].date.start
                },
                'author': document.querySelector('.author').value
            }
        }

        // Отбираем архивные заявки по критериям поиска
        const orderSelection = (data, param) => {

            // Отбор по клиенту
            if (param.client.length >= 3) {
                data.forEach((value, key, map) => {
                    value.forEach((item, index, arr) => {
                        // console.log(item.author, param.author);
                        if (!item.client.name_client.toLowerCase().includes(param.client.toLowerCase())) {
                            // console.log(item.author, param.author);
                            delete arr[index];
                            // arr.splice(index, 1);
                            // console.log(arr);
                        }
                    })

                    if (!value.join('')) {
                        // console.log('OK');
                        data.delete(key);
                    }
                })
            }

            // Отбор по дате начало
            if (param.date.start) {
                data.forEach((value, key, map) => {
                    const dateArr = key.split('.');
                    const date = new Date(Number(dateArr[2]), Number(dateArr[1]) - 1, Number(dateArr[0]));

                    if (date < new Date(param.date.start)) {
                        data.delete(key);
                    }
                })
            }

            // Отбор по дате конец
            if (param.date.end) {
                data.forEach((value, key, map) => {
                    const dateArr = key.split('.');
                    const date = new Date(Number(dateArr[2]), Number(dateArr[1]) - 1, Number(dateArr[0]));

                    if (date > new Date(param.date.end)) {
                        data.delete(key);
                    }
                })
            }

            // Отбор по автору
            if (param.author) {
                data.forEach((value, key, map) => {
                    value.forEach((item, index, arr) => {
                        // console.log(item.author, param.author);
                        if (param.author != item.author) {
                            // console.log(item.author, param.author);
                            delete arr[index];
                            // arr.splice(index, 1);
                            // console.log(arr);
                        }
                    })

                    if (!value.join('')) {
                        // console.log('OK');
                        data.delete(key);
                    }
                })
            }

            // console.log(data);

            return data;
        }

        // Группировка данных по датам
        const groupByDates = (data) => {
            let map = new Map();

            // Формируем Map с уникальными датами
            data.forEach(row => {
                if (!map.has(row.date_order.date_start)) {
                    map.set(row.date_order.date_start, []);
                }
            })

            // Наполняем Map с уникальными датами архивными заявками
            data.forEach(row => {
                // console.log(map.get(row.date_order.date_start));
                map.get(row.date_order.date_start).push(row);
            })

            // console.log(map);

            return map;

        }

        // Шаблон группировки по датам
        const groupTable = (group) => {

            return `<tr>
                        <td colspan="7" class="has-background-light"><div class="divider is-left divider-custom">${group}</div></td>
                    </tr>`;
        }

        // Шаблон строки
        const rowTable = (row) => {

            // Функция возвращает логистический статус
            function getStatusLogistic(status) {
                if (status == '1') {
                    return '<span class="orders-order-item-status-state" style="background-color: red;"></span>';
                } else {
                    return '<span class="orders-order-item-status-state" style="background-color: green;"></span>';
                }
            }

            // Функция возвращает бухгалтерский статус
            function getStatusBuh(status) {
                if (status == '0') {
                    return '<span class="orders-order-item-status-state" style="background-color: white;"></span>';
                } else if (status == '1') {
                    return '<span class="orders-order-item-status-state" style="background-color: grey;"></span>';
                } else if (status == '2') {
                    return '<span class="orders-order-item-status-state" style="background-color: white;"></span>';
                } else if (status == '3') {
                    return '<span class="orders-order-item-status-state" style="background-color: yellow;"></span>';
                } else if (status == '4') {
                    return '<span class="orders-order-item-status-state" style="background-color: green;"></span>';
                } else if (status == '5') {
                    return '<span class="orders-order-item-status-state" style="background-color: black;"></span>';
                } else if (status == '6') {
                    return '<span class="orders-order-item-status-state" style="background-color: red ;"></span>';
                } else if (status == '7') {
                    return '<span class="orders-order-item-status-state" style="background-color: orange ;"></span>';
                }
            }

            return `<tr class="row-table">
                        <td><div class="data-style"><span class="date_start">${row.date_order.date_start}</span> - <span>${row.date_order.date_end}</span></div></td>
                        <td>${getStatusBuh(row.status_buh)}</td>
                        <td>${getStatusLogistic(row.status_logistic)}</td>
                        <td class="td-width"><span data-number="${row.number}" class="archive-name-client">${row.client.name_client}</span></td>
                        <td>
                            <table class="table no-border is-fullwidth">
                                <tbody class="table-basis">
                                    ${basisTable(row)}
                                </tbody>
                            </table>
                        </td>
                        <td>${row.author}</td>
                    </tr>`;
        }

        // Шаблон базиса
        const basisTable = (row) => {

            // Функция возвращает способ доставки
            function getTypeOperation(typeOperation) {
                const operation = ['-', 'Перемещение', 'Самовывоз', 'Доставка', 'Самовывоз СК', 'С доставкой', 'ЖД'];
                return operation[typeOperation];
            }

            let basiss = '';                        // Массив базисов
            const addresses = row.array_addresses;  // Массив адресов

            addresses.forEach(address => {                    // Берем каждый адрес из масива адресов
                address.array_basises.forEach(basis => {      // В каждом адесе перебераем все адреса и выводим их в таблице
                    basiss += `<tr class="basis-table">
                                    <td class="deliver"><span>${getTypeOperation(row.type_operation)}</span></td>
                                    <td>${address.name_address}</td>
                                    <td>${basis.name_basis}</td>
                                    <td>${basis.name_product}</td>
                                    <td>${basis.volume.start_volume}</td>
                                </tr>`;
                })
            })

            return basiss;
        }

        // Таблица архивных заявок
        const groupData = orderSelection(groupByDates(data), getParamSearch());
        const tableArchive = document.querySelector('.table-archive');
        if (clear) {
            tableArchive.innerHTML = '';
        }

        // console.log(groupData.size);
        // noOrders(groupData.size);

        groupData.forEach((value, key, map) => {
            tableArchive.insertAdjacentHTML('beforeend', groupTable(key));
            value.forEach(row => {
                tableArchive.insertAdjacentHTML('beforeend', rowTable(row));
            })
        })

    }

    // Календарь
    const calendars = bulmaCalendar.attach('[name="archive-date"]', {
        color: 'link',
        isRange: false,
        lang: 'ru',
        dateFormat: 'dd.MM.yyyy',
        weekStart: 1
    });

    const calendarsEnd = bulmaCalendar.attach('[name="archive-date-end"]', {
        color: 'link',
        isRange: false,
        lang: 'ru',
        dateFormat: 'dd.MM.yyyy',
        weekStart: 1
    });

    // Кнопка выход
    const btnExit = document.querySelector('.orders-exit');

    btnExit.addEventListener('click', () => {

        if (confirm('Вы действительно хотите выйти?')) {
            fetch(`${window.location.origin}/exit`)
                .then(response => response.text())
                .then(commits => {
                    window.location.href = window.location.origin;
                })
        }
    })

    // Открытие заказа в новой вкладке
    const containerTable = document.querySelector('.js-open-order');

    containerTable.addEventListener('click', (e) => {
        console.log(e.target);
        if (e.target.dataset.number) {
            const url = getURL(settings) + `/order?order=${e.target.dataset.number}`;
            window.open(url, '_blank');
        }
    })

    // Отбор заказов по строке поиск
    const client = document.querySelector('.search');
    const dateClear = document.querySelector('.date-start .datetimepicker-clear-button');
    const dateClearEnd = document.querySelector('.date-end .datetimepicker-clear-button');
    const author = document.querySelector('.author');

    // Событие выбора дат начало в календаре
    calendars[0].on('select', date => {
        // console.log(date.data.date.start, date.data.date.end);
        const tagDates = document.querySelector('.tag-dates span');
        const tag = document.querySelector('.tag-dates');
        const start = new Date(date.data.date.start)
        // const end = new Date(date.data.date.end)
        tag.classList.remove('is-hidden');
        tagDates.innerHTML = `${start.getDate()}.${start.getMonth() + 1}.${start.getFullYear()}`;
        // getOrderList();
        // updataTable();
        setTimeout(updataTable, 1700);
    });

    // Событие выбора дат конец в календаре
    calendarsEnd[0].on('select', date => {
        console.log(date.data.date.start, date.data.date.end);
        const tagDates = document.querySelector('.tag-dates-end span');
        const tag = document.querySelector('.tag-dates-end');
        const end = new Date(date.data.date.start)
        tag.classList.remove('is-hidden');
        tagDates.innerHTML = `${end.getDate()}.${end.getMonth() + 1}.${end.getFullYear()}`;
        // getOrderList();
        // updataTable();
        setTimeout(updataTable, 1700);
    });

    // Событие выбора автора
    author.addEventListener('change', (data) => {
        const tagAuthor = document.querySelector('.tag-author span');
        const tag = document.querySelector('.tag-author');
        if (data.target.value) {
            tag.classList.remove('is-hidden');
        } else {
            tag.classList.add('is-hidden');
        }
        tagAuthor.innerHTML = data.target.value;
        // getOrderList();
        // updataTable();
        setTimeout(updataTable, 1700);
    })

    // Событие удаления дат
    dateClear.addEventListener('click', () => {
        const tagDates = document.querySelector('.tag-dates span');
        const tag = document.querySelector('.tag-dates');
        tagDates.innerHTML = '';
        tag.classList.add('is-hidden');
        // getOrderList();
        // updataTable();
        setTimeout(updataTable, 1700);
    })

    // Событие удаления дат
    dateClearEnd.addEventListener('click', () => {
        const tagDates = document.querySelector('.tag-dates-end span');
        const tag = document.querySelector('.tag-dates-end');
        tagDates.innerHTML = '';
        tag.classList.add('is-hidden');
        // getOrderList();
        // updataTable();
        setTimeout(updataTable, 1700);
    })

    // Событие ввода имени клиента
    client.addEventListener('input', (data) => {
        // console.log(getParamSearch());
        const tagClient = document.querySelector('.tag-client span');
        const tag = document.querySelector('.tag-client');
        if (data.target.value) {
            tag.classList.remove('is-hidden');
        } else {
            tag.classList.add('is-hidden');
        }
        tagClient.innerHTML = data.target.value;
        // getOrderList();
        setTimeout(updataTable, 1700);
        // updataTable();
    })

    // Удалить тег
    // Удалить тег Клиент и очистить поле клиент
    const tagClientDel = document.querySelector('.tag-client-del');

    tagClientDel.addEventListener('click', () => {
        const tagClient = document.querySelector('.tag-client span');
        const tag = document.querySelector('.tag-client');
        tag.classList.add('is-hidden');
        tagClient.innerHTML = '';
        client.value = '';
        // getOrderList();
        // updataTable();
        setTimeout(updataTable, 1700);
    })

    // Удалить тег Даты и очистить поле даты
    const tagDatesDel = document.querySelector('.tag-dates-del');

    tagDatesDel.addEventListener('click', () => {
        const tagDates = document.querySelector('.tag-dates span');
        const tag = document.querySelector('.tag-dates');
        tag.classList.add('is-hidden');
        tagDates.innerHTML = '';
        calendars[0].clear()
        // getOrderList();
        // updataTable();
        setTimeout(updataTable, 1700);
    })

    const tagDatesEndDel = document.querySelector('.tag-dates-end-del');

    tagDatesEndDel.addEventListener('click', () => {
        const tagDates = document.querySelector('.tag-dates-end span');
        const tag = document.querySelector('.tag-dates-end');
        tag.classList.add('is-hidden');
        tagDates.innerHTML = '';
        calendarsEnd[0].clear()
        // getOrderList();
        // updataTable();
        setTimeout(updataTable, 1700);
    })

    // Удалить тег автор и очистить поле автор
    const tagAuthorDel = document.querySelector('.tag-author-del');

    tagAuthorDel.addEventListener('click', () => {
        const tagDates = document.querySelector('.tag-author span');
        const tag = document.querySelector('.tag-author');
        tag.classList.add('is-hidden');
        author.value = '';
        tagDates.innerHTML = '';
        // getOrderList();
        // updataTable();
        setTimeout(updataTable, 1700);
    })

    // Обновление списка заказов если один из
    // пользователей сайта отправил заявку в архив
    const socket = io();

    socket.on('refreshArchive', (msg) => {
        console.log('OK');
        sessionStorage.removeItem('data');
        updataTable();
    });

});