'use strict';

import settings from '/js/config.js';
import setPreloader from '/js/libs/preloader.js';

window.addEventListener('DOMContentLoaded', () => {

    // console.log(settings.protocol, settings.host, settings.port);

    const getURL = (settings) => {
        const protocol = settings.protocol;
        const host = settings.host;
        const port = settings.port;
        const url = `${protocol}://${host}:${port}`;
        return url;
    }

    const socket = io();

    socket.on('refreshKanban', (msg) => {
        // console.log(msg);
        upDateOrder();
    });

    // Функция получает шаблон элемента
    const getTemplate = (nameTemplate) => {
        const templateFragment = document.querySelector('#' + nameTemplate).content.cloneNode(true);
        const template = templateFragment.querySelector('.' + nameTemplate);

        return template;
    }

    console.log(`${getURL(settings)}/orderlist`);

    // Формируем объект для отбора архивных заказов по критериям поиска
    const getParamSearch = () => {
        return {
            'status': document.querySelector('.status-buh').value,
            'author': document.querySelector('.author').checked ? sessionStorage.getItem('author') : ''
        }
    }

    // Отбираем заявки по критериям поиска
    const orderSelection = (data, param) => {

        console.log(param.author);
        // Отбор по автору
        if (param.author) {
            // console.log(data);
            data.forEach((item, index, arr) => {
                if (param.author != item.author) {
                    console.log(arr[index]);
                    delete arr[index];
                }
            })
        }

        // Отбор по бухгалтерскому статусу
        if (Number(param.status)) {
            // console.log(data);
            data.forEach((item, index, arr) => {
                // if (param.status != item.status_buh) {
                //     delete arr[index];
                // }
                if (Number(param.status) == 2) {

                    if ('6' != item.status_buh && '7' != item.status_buh && '1' != item.status_buh) {
                        delete arr[index];
                    }

                } else if (Number(param.status) == 3) {
                    if ('2' != item.status_buh && '3' != item.status_buh && '4' != item.status_buh) {
                        delete arr[index];
                    }
                }
            })
        }

        console.log(data);

        return data;
    }

    fetch(`${getURL(settings)}/orderlist?archieved=false`)
        .then(response => response.text())
        .then(commits => {
            console.log(commits);
            console.log(getParamSearch());
            constructorCard(JSON.parse(commits).Data.OrdersList);
            // constructorCard(otest);
            setPreloader('preloader');
        })
        .then(() => {

            const orders = document.querySelectorAll('.orders-order');

            orders.forEach(order => {
                order.addEventListener('click', (e) => {
                    const urlOrder = document.location.origin + '/order';
                    const urlOrderGoods = document.location.origin + '/ordergoods';
                    const orderNumber = order.getAttribute('data-number');

                    if (order.getAttribute('data-kind-order') == 2) {

                        if (e.ctrlKey) {
                            window.open(urlOrderGoods + `?order=${orderNumber}`, '_blank');
                        } else {
                            document.location = urlOrderGoods + `?order=${orderNumber}`;
                        }

                    } else {

                        if (e.ctrlKey) {
                            window.open(urlOrder + `?order=${orderNumber}`, '_blank');
                        } else {
                            document.location = urlOrder + `?order=${orderNumber}`;
                        }

                    }

                });
            });

        });


    function upDateOrder() {
        fetch(`${getURL(settings)}/orderlist?archieved=false`)
        .then(response => response.text())
        .then(commits => {
            // console.log(commits);
            const columns = document.querySelectorAll('.orders-day-body');

            columns.forEach(column => {
                column.innerHTML = '';
            })

            // console.log(getParamSearch());
            const data = JSON.parse(commits).Data.OrdersList;

            constructorCard(orderSelection(data, getParamSearch()));
            // constructorCard(otest);
            setPreloader('preloader');
        })
        .then(() => {

            const orders = document.querySelectorAll('.orders-order');

            orders.forEach(order => {
                order.addEventListener('click', (e) => {
                    const urlOrder = document.location.origin + '/order';
                    const urlOrderGoods = document.location.origin + '/ordergoods';
                    const orderNumber = order.getAttribute('data-number');

                    if (order.getAttribute('data-kind-order') == 2) {

                        if (e.ctrlKey) {
                            window.open(urlOrderGoods + `?order=${orderNumber}`, '_blank');
                        } else {
                            document.location = urlOrderGoods + `?order=${orderNumber}`;
                        }

                    } else {

                        if (e.ctrlKey) {
                            window.open(urlOrder + `?order=${orderNumber}`, '_blank');
                        } else {
                            document.location = urlOrder + `?order=${orderNumber}`;
                        }

                    }

                });
            });

        });
    }

    document.addEventListener('visibilitychange', () => {
        upDateOrder();
    });

    // setInterval(upDateOrder, 180000);



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

    // Кнопка создать
    // const btnCreat = document.querySelector('.dropdown-creat-btn');

    // btnCreat.addEventListener('click', (e) => {
    //     e.currentTarget.classList.toggle('is-active');
    // });

    const dayTpl = `<div class="orders-day">
                        <div class="orders-day-head">
                            <span class="orders-day-date"></span>
                        </div>
                        <div class="orders-day-body">

                        </div>
                        <!--
                        <div class="orders-day-footer">
                            <div class="orders-day-footer-title is-flex is-justify-content-space-between">
                                <div>
                                    <i class="fa fa-chevron-down pr-2" aria-hidden="true"></i>
                                    <h5 class="title is-5 mb-0">Архив</h5>
                                </div>
                                <span class="order-counter ml-5"></span>
                            </div>
                            <div class="orders-day-footer-container is-hidden">

                            </div>
                        </div>
                        -->
                    </div>`;

    // Функция построения канбана
    function kanban(template, numberOfColumns) {
        const overdueDeliveries = document.querySelector('.kanban-overdue-deliveries'); // Неотгруженные заявки
        const futureDeliveries = document.querySelector('.kanban-future-deliveries');   // Будущие заявки
        const ordersDays = document.querySelector('.orders-days');                      // Заявки по дням
        const screenWidth = document.documentElement.clientWidth;                       // Ширина экрана
        const screenHeight = document.documentElement.clientHeight;                     // Высота экрана
        let columnWidth = Number((screenWidth/numberOfColumns).toFixed(3));           // Ширина колонки
        const numberOfDays = numberOfColumns - 2;                                       // Количество дней

        // Функция возвращает HTML-шаблон колонки
        function returnColumn(template) {
            const parser = new DOMParser();                             // Создаем объект парсера
            const tpl = parser.parseFromString(template, "text/html");  // Создаем HTML-элемент колонки
            const column = tpl.querySelector('.orders-day');            // Получаем готовый элемент колонки

            return column.cloneNode(true)                               // Возвращаем клон элемента колонки
        }

        // Установка параметров мобильного канбан
        function setMobileKanban(screenWidth) {
            const kanban = document.querySelector('.kanban');
            kanban.classList.remove('kanban-mobile');

            if (screenWidth < 940) {
                kanban.classList.add('kanban-mobile');
                console.log(screenWidth);

                // Устанавливаем ширину колонки канбана равной ширине экрана
                columnWidth = screenWidth;

                const btnNext = document.querySelector('.button-next'),
                      btnPrev = document.querySelector('.button-prev');

                console.log(btnNext, btnPrev);

                btnNext.addEventListener('click', (e) => {
                    console.log(kanban.scrollLeft, );
                    if (kanban.scrollWidth - columnWidth > kanban.scrollLeft) {
                        kanban.scrollLeft += columnWidth + 1;
                    }

                })

                btnPrev.addEventListener('click', (e) => {
                    console.log(kanban.scrollLeft);
                    kanban.scrollLeft -= columnWidth + 1;
                })


                // let scrollPosition = 0; // Позиция скрола при старте
                // let steps = [];         // Массив с шагами скрола
                // let track = 0;          // Длинна пути которую проделал скрол при движении
                // let range = 0;          // Диапазон в котором остановился скрол

                // Наполняем массив с шагами для скрола значениями
                // Один шаг = ширине экрана
                // for (let i = 0; i < numberOfColumns; i++) {
                //     steps.push(i * screenWidth);
                // }



                // Устанавлиаем значении скрола в начале движения
                // kanban.addEventListener('touchstart', (e) => {
                //     scrollPosition = kanban.scrollLeft;
                // })

                // Событие окончания движения скрола
                // kanban.addEventListener('touchend', (e) => {

                    // Определяем в каком диапазоне остановился скрол
                    // function rangeKanban() {
                    //     let range;

                    //     for (let i = 0; i < steps.length; i++) {
                    //         if (kanban.scrollLeft >= steps[i] && kanban.scrollLeft <= steps[i + 1]) {
                    //             range = [steps[i], steps[i + 1]];
                    //             break;
                    //         }
                    //     }

                    //     return range;
                    // }

                    // Определяем движение движение скрола было в право или в лево
                    // if (kanban.scrollLeft > scrollPosition) {
                    //     range = rangeKanban();
                    //     track = range[1] - kanban.scrollLeft;

                    //     // Выполняем плавную прокрутку скрола в право
                    //     if (track > (screenWidth * 0.3)) {
                    //         kanban.scrollTo({top: 0, left: range[1], behavior: 'smooth'});
                    //     }

                    // } else {
                    //     range = rangeKanban();
                    //     track = kanban.scrollLeft - range[0];

                    //     // Выполняем плавную прокрутку скрола в лево
                    //     if (track > (screenWidth * 0.3)) {
                    //         kanban.scrollTo({top: 0, left: range[0], behavior: 'smooth'});
                    //     }

                    // }
                // })
            }
        }


        // Установка высоту канбана
        function setHeightKanban() {
            const kanban = document.querySelector('.kanban');
            // if (screenWidth < 940) {
            //     // kanban.style.height = `${screenHeight - 107}px`;
            // } else {
            //     const container = document.querySelector('.filter-desktop-container');
            //     container.append(getTemplate('.filter-desktop'));
            //     // kanban.style.height = `${screenHeight - 55}px`;
            // }
            kanban.style.height = `100vh`;
        }

        // Устанавливаем активную колонку в канбане
        function setActiveColumn(screenWidth) {
            if (screenWidth < 940) {
                const kanban = document.querySelector('.kanban');
                kanban.scrollLeft = screenWidth * 2;
            }
        }

        // Функция вставки колонки в канбан
        // container - контейнер для вставки
        // template - шаблон элемента
        // columnWidth - ширина колонки
        // title - заголовок колонки
        function insertСolumn(container, template, columnWidth, title) {
            const column = returnColumn(template);
            const titleColumn = column.querySelector('.orders-day-date');

            column.style.width = `${columnWidth}px`;
            titleColumn.innerHTML = title;
            container.append(column);
        }

        // Слайдер
        function slider() {
            const days = document.querySelector('.orders-days');         // Контейнер сладера
            const btnPrev = document.querySelector('.orders-btn-prev');  // Кнопка назад
            const btnNext = document.querySelector('.orders-btn-next');  // Кнопка вперед

            days.style.transform = 'translate3d(0px, 0px, 0px)';         // Устанавлеваем начальное значение слайдера

            // Обрабочик события нажата кнопка назад
            btnPrev.addEventListener('click', btn => {
                const regexp = /(?<=\()\d+.\d+|(?<=\()-\d+.\d+|(?<=\()\d+|(?<=\()-\d+/g;  // Регулярное выражение для поиска текущего значения трансформации
                const valueTransformPresent = days.style.transform;                       // Строка для поиска текущего значения трансформации
                const valueTransformNew = Number(valueTransformPresent.match(regexp)[0]) + columnWidth;  // Новое значение трансформации

                days.style.transform = `translate3d(${valueTransformNew}px, 0px, 0px)`;  // Устанавливаем новое значение трансформации
            });

            // Обрабочик события нажата кнопка вперед
            btnNext.addEventListener('click', btn => {
                const regexp = /(?<=\()\d+.\d+|(?<=\()-\d+.\d+|(?<=\()\d+|(?<=\()-\d+/g;  // Регулярное выражение для поиска текущего значения трансформации
                const valueTransformPresent = days.style.transform;                       // Строка для поиска текущего значения трансформации
                const valueTransformNew = Number(valueTransformPresent.match(regexp)[0]) - columnWidth;  // Новое значение трансформации

                days.style.transform = `translate3d(${valueTransformNew}px, 0px, 0px)`;  // Устанавливаем новое значение трансформации
            });
        }

        // Активация архива
        function archiveActivation() {
            const archives = document.querySelectorAll('.orders-day-footer');

            archives.forEach(archive => {
                archive.addEventListener('click', (e) => {
                    const btn = e.currentTarget;
                    const container = btn.querySelector('.orders-day-footer-container');

                    btn.classList.toggle('is-height-100');
                    container.classList.toggle('is-hidden');
                });
            })
        }

        // Устанавливаем мобильный канбан
        setMobileKanban(screenWidth);

        // Устанавливаем высоту канбану
        setHeightKanban();

        // Вставляем колонку Неотгруженные заявки
        insertСolumn(overdueDeliveries, template, columnWidth, 'Неотгруженные заявки');

        // Встаялем колонку будущие заявки
        insertСolumn(futureDeliveries, template, columnWidth, 'Будущие заявки');

        // Встаялем колонки заявки по дням
        for (let i = 0; i < numberOfDays; i++) {
            const date = new Date();                // Создаем текущую дату
            const options = {                       // Опции вывода даты
                weekday: 'short',
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            }

            date.setDate(date.getDate() - 1 + i);   // Получаем дату колонки
            insertСolumn(ordersDays, template, columnWidth, date.toLocaleDateString('ru-RU', options));
        }

        // Активируем раздел архив
        // archiveActivation();

        // Устанавливаем активную калонку
        setActiveColumn(screenWidth);
    }

    // Строим канбан
    kanban(dayTpl, 6);

    // Панель сортировки
    const screenWidth = document.documentElement.clientWidth;                       // Ширина экрана

    if (screenWidth < 940) {
        const container = document.querySelector('.filter-mobile-container');
        document.querySelector('.filter-desktop-container').classList.add('is-hidden');
        container.append(getTemplate('filter-mobile'));
    } else {
        const container = document.querySelector('.filter-desktop-container');
        container.append(getTemplate('filter-desktop'));
    }

    // Событие изменения автора
    document.querySelector('.author').addEventListener('change', () => {
        upDateOrder();
    })

    // Событие изменения бух статуса
    document.querySelector('.status-buh').addEventListener('change', () => {
        upDateOrder();
    })

    function getDate(start, end) {
        const startDate = start.split('.');
        const endDate = end.split('.');
        if (start === end) {
            return `<span class="">${startDate[0]}.${startDate[1]}</span>`;
        } else {
            return `<span class="">${startDate[0]}.${startDate[1]}</span>
                    -
                    <span class="">${endDate[0]}.${endDate[1]}</span>`;
        }
    }

    function getWidth(range, basis) {
        if (range) {
            return `<div class="orders-order-item-volume-wrapper">
                        <span class="orders-order-item-volume-min">${basis.volume.start_volume}</span>
                        <span>-</span>
                        <span class="orders-order-item-volume-max">${basis.volume.end_volume}</span>
                    </div>`;
        } else {
            return `<div class="orders-order-item-volume-wrapper">
                        <span class="orders-order-item-volume-min">${basis.volume.start_volume}</span>
                    </div>`;
        }
    }

    function dateConvertor(date) {
        const dateArr = date.split('.');

        for (let i = 0; i < dateArr.length; i++) {
            if (dateArr[i][0] === '0') {
                dateArr[i] = dateArr[i][1];
            }
        }

        // console.log(date, Date(dateArr[2], dateArr[1]-1, dateArr[0]));

        return new Date(dateArr[2], dateArr[1]-1, dateArr[0]-1);
    }

    // Функция распределения заказов по датам
    function distributor(date, order, orderObj) {
        // Получаем все колонки с датами
        const columns = document.querySelectorAll('.orders-day');

        // Перебераем каждую массив с колонка и для каждой колонки устанавливаем параметры
        columns.forEach(column => {
            // const dateCol = column.querySelector('.orders-day-date').textContent.slice(3); // Дата колонки
            const regexp = /\d\d.\d\d.\d\d\d\d/gm;
            let dateCol = column.querySelector('.orders-day-date').textContent.match(regexp); // Дата колонки
            dateCol = dateCol ? dateCol[0] : '00.00.0000';
            const datecurrent = new Date();         // Текущая дата
            const options = {                       // Опции вывода даты
                weekday: 'short',
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            }

            // Если текущая дата равна дате колонки то обозначаем эту колонку цветом #AFE1AF
            // Это значит, что в колонке находятся заявки на сегодня
            if (dateCol === datecurrent.toLocaleDateString('ru-RU', options).match(regexp)[0]) {
                column.querySelector('.orders-day-head').style.backgroundColor = '#AFE1AF';
            }

            const dateFirst = columns[1].querySelector('.orders-day-date').textContent; // Дата первой колонки
            const dateLast = columns[columns.length - 2].querySelector('.orders-day-date').textContent;  // Дата последней колонки

            // Дата заказа меньше даты в первой колонке, добавляем заказ
            // в колонку "Неотгруженные заявки"
            if (dateConvertor(date) < dateConvertor(dateFirst.match(regexp)[0])) {
                const columnBody = columns[0].querySelector('.orders-day-body'); // Переменна тело колонки
                const columnFooter = columns[0].querySelector('.orders-day-footer-container'); // Переменна подвал колонки
                // console.log(orderObj);
                if (orderObj.status_logistic === 2 || orderObj.status_logistic === 3 || orderObj.archieved === true) {
                    columnFooter.insertAdjacentElement('beforeend', order);
                } else {
                    columnBody.insertAdjacentElement('beforeend', order);
                }

                // Добавить еще переменную архив
                // дописать функционал для каждого IF
                // Если статус логистик = 1 то добавляем в архив
            }

            // Дата заказа больше даты в последней колонке, добавляем заказ
            // в колонку "Будущие заявки"
            if (dateConvertor(date) > dateConvertor(dateLast.match(regexp)[0])) {
                const columnBody = columns[columns.length - 1].querySelector('.orders-day-body');
                const columnFooter = columns[columns.length - 1].querySelector('.orders-day-footer-container');
                // console.log(date);
                if (orderObj.status_logistic === 2 || orderObj.status_logistic === 3 || orderObj.archieved === true) {
                    columnFooter.insertAdjacentElement('beforeend', order);
                } else {
                    // console.log(orderObj);
                    columnBody.insertAdjacentElement('beforeend', order);
                }
            }

            // Если дата заказа равна дате текущей колонки, добавляем заказ в эту колонку
            if (dateCol === date) {
                const columnBody = column.querySelector('.orders-day-body');
                const columnFooter = column.querySelector('.orders-day-footer-container'); // Переменна подвал колонки
                if (orderObj.status_logistic === 2 || orderObj.status_logistic === 3 || orderObj.archieved === true) {
                    columnFooter.insertAdjacentElement('beforeend', order);
                } else {
                    columnBody.insertAdjacentElement('beforeend', order);
                }
            }


        });
    }

    function getStatusLogistic(status) {
        // console.log(status);
        if (status == '1') {
            return '<span class="orders-order-item-status-state" style="background-color: red;"></span>';
        } else if (status == '2') {
            return '<span class="orders-order-item-status-state" style="background-color: green;"></span>';
        } else if (status == '3') {
            return '<span class="orders-order-item-status-state" style="background-color: black;"></span>';
        }
    }

    function getStatusBuh(status) {
        // console.log(status);
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

    function getTypeOrder(typeorder) {
        if (typeorder === 1) {
            return `#83b2fc`;
        } else if (typeorder === 2) {
            return `#ffb39c`;
        }
        // console.log('OK');
    }

    function sortOverdueDeliveries() {
        const sort = (container, list, orders) => {
            orders.sort(function(a, b) {
                return dateConvertor(b.dataset.date) - dateConvertor(a.dataset.date);
            });

            list.forEach(e => {
                e.remove();
            });

            orders.forEach(e => {
                container.appendChild(e);
            });
            // console.log('Сортировка');
        }

        const containerDay = document.querySelector('.kanban-overdue-deliveries .orders-day-body');
        const listDay = document.querySelectorAll('.kanban-overdue-deliveries .orders-day-body .orders-order');
        let ordersDay = Array.from(document.querySelectorAll('.kanban-overdue-deliveries .orders-day-body .orders-order'));
        sort(containerDay, listDay, ordersDay);

        const containerArch = document.querySelector('.kanban-overdue-deliveries .orders-day-footer-container');
        const listArch = document.querySelectorAll('.kanban-overdue-deliveries .orders-day-footer-container .orders-order');
        let ordersArch = Array.from(document.querySelectorAll('.kanban-overdue-deliveries .orders-day-footer-container .orders-order'));
        sort(containerArch, listArch, ordersArch);
        // orders.sort(function(a, b) {
        //     return dateConvertor(b.dataset.date) - dateConvertor(a.dataset.date);
        // });

        // nodeList.forEach(e => {
        //     e.remove();
        // });

        // orders.forEach(e => {
        //     container.appendChild(e);
        // });
    }

    function sortFutureDeliveries() {
        const sort = (container, list, orders) => {
            orders.sort(function(a, b) {
                return dateConvertor(a.dataset.date) - dateConvertor(b.dataset.date);
            });

            list.forEach(e => {
                e.remove();
            });

            orders.forEach(e => {
                container.appendChild(e);
            });
        }

        const containerDay = document.querySelector('.kanban-future-deliveries .orders-day-body');
        const listDay = document.querySelectorAll('.kanban-future-deliveries .orders-day-body .orders-order');
        let ordersDay = Array.from(document.querySelectorAll('.kanban-future-deliveries .orders-day-body .orders-order'));
        sort(containerDay, listDay, ordersDay);

        const containerArch = document.querySelector('.kanban-future-deliveries .orders-day-footer-container');
        const listArch = document.querySelectorAll('.kanban-future-deliveries .orders-day-footer-container .orders-order');
        let ordersAr = Array.from(document.querySelectorAll('.kanban-future-deliveries .orders-day-footer-container .orders-order'));
        sort(containerArch, listArch, ordersAr);

    }

    function sortCurrentOrders() {
        const sort = (container, list, orders) => {
            orders.sort(function(a, b) {
                return a.dataset.number - b.dataset.number;
            });

            list.forEach(e => {
                e.remove();
            });

            orders.forEach(e => {
                container.appendChild(e);
            });
        }

        const containersDay = document.querySelectorAll('.kanban-current-orders .orders-day');
        containersDay.forEach(day => {
            const containerDay = day.querySelector('.orders-day-body');
            const listDay = day.querySelectorAll('.orders-day-body .orders-order');
            let ordersDay = Array.from(day.querySelectorAll('.orders-day-body .orders-order'));
            sort(containerDay, listDay, ordersDay);
        });

        const containersArch = document.querySelectorAll('.kanban-current-orders .orders-day');
        containersArch.forEach(day => {
            const containerArch = day.querySelector('.orders-day-footer-container');
            const listArch = day.querySelectorAll('.orders-day-footer-container .orders-order');
            let ordersArch = Array.from(day.querySelectorAll('.orders-day-footer-container .orders-order'));
            sort(containerArch, listArch, ordersArch);
        });


    }

    function getTypeOperation(typeOperation) {
        const operation = ['-', 'Перемещение', 'Самовывоз', 'Доставка', 'Самовывоз СК', 'С доставкой', 'ЖД'];
        return operation[typeOperation];
    }

    function orderCounter() {
        const footers = document.querySelectorAll('.orders-day-footer');

        footers.forEach(footer => {
            const counter = footer.querySelector('.order-counter');
            const quantity = footer.querySelectorAll('.orders-order').length || '';
            if (quantity) {
                counter.classList.add('order-counter-style');
            }
            counter.innerHTML = quantity;
        })
    }

    const otest = {
        "Status": "OK",
        "Errors": "",
        "Data": {
            "OrdersList": [{
                    "date": "03.10.2023",
                    "time": "20:22:06",
                    "number": "000000047",
                    "author": "site",
                    "client": {
                        "name_client": "СИБ-ПСМ",
                        "code_client": "КА-КА000048",
                        "type_client": "Тип B"
                    },
                    "type_order": 2,
                    "type_operation": 2,
                    "archieved": false,
                    "date_order": {
                        "date_range": true,
                        "date_start": "02.10.2023",
                        "date_end": "03.10.2023"
                    },
                    "status_buh": 1,
                    "status_logistic": 2,
                    "array_addresses": [{
                        "name_address": "630102, г Новосибирск, ул Зыряновская, д 63, офис 514",
                        "array_basises": [{
                                "name_basis": "Сокур",
                                "name_product": "АИ-95 ТУ",
                                "volume": {
                                    "range_volume": true,
                                    "start_volume": 1,
                                    "end_volume": 2
                                }
                            },
                            {
                                "name_basis": "Сокур",
                                "name_product": "АИ-80",
                                "volume": {
                                    "range_volume": false,
                                    "start_volume": 1,
                                    "end_volume": 1
                                }
                            }
                        ]
                    },
                    {
                        "name_address": "630102, г Новосибирск, ул Зыряновская, д 63, офис 514",
                        "array_basises": [{
                                "name_basis": "Сокур",
                                "name_product": "АИ-95 ТУ",
                                "volume": {
                                    "range_volume": true,
                                    "start_volume": 1,
                                    "end_volume": 2
                                }
                            }
                        ]
                    }]
                }
            ]
        }
    };

    function constructorCard(ordersList) {
        // console.log(ordersList);
        ordersList.forEach(order => {
            let ordersOrder = document.createElement('div');
                ordersOrder.setAttribute('class', 'orders-order');
                ordersOrder.setAttribute('data-number', order.number);
                ordersOrder.setAttribute('data-kind-order', order.kind_order);
                // ordersOrder.setAttribute('data-status-logistic', order.status_logistic);
                ordersOrder.setAttribute('data-date', order.date_order.date_start);
                ordersOrder.style.border = `solid 2px ${getTypeOrder(order.type_order)}`;
                // ordersOrder.style.backgroundColor = `${order.status_logistic === 2 || order.archieved === true ? 'transparent' : '#ffffff'}`

            let orderTest = document.createElement('div');

            if (order.kind_order == 2) {
                ordersOrder.classList.add('kind-order');
            }

            order.array_addresses.forEach(address => {


                address.array_basises.forEach(basis => {

                    let startDate = order.date_order.date_start;
                    let endDate = order.date_order.date_end;
                    let typeOperation = order.type_operation;
                    let range = basis.volume.range_volume;

                    // console.log(order.status_buh, order.status_logistic);

                    let item = `<div class="orders-order-item">
                                    <div class="orders-order-item-volume mr-2">
                                        <div>${getDate(startDate, endDate)}</div>

                                        <div class="orders-order-item-status">
                                            ${getStatusBuh(order.status_buh)}

                                            ${getStatusLogistic(order.status_logistic)}
                                        </div>

                                    </div>
                                    <div class="orders-order-item-body">
                                        <div class="mb-3px">
                                            <span class="orders-order-item-basis">${basis.name_basis}</span>
                                            <span> | </span>
                                            <span class="orders-order-item-product">${basis.name_product}</span>
                                            <span> | </span>
                                            <span class="orders-order-item-compani">${order.client.name_client} ${order.name_base}</span>
                                        </div>
                                        <div>

                                            <span class="orders-order-item-addres" style="overflow: hidden;display: block;">${address.name_address}</span>
                                        </div>
                                        <div>
                                            <span class="orders-order-item-fotter">
                                                ${getWidth(range, basis)}
                                                <span class="orders-order-item-type-order">${getTypeOperation(typeOperation)}</span>
                                            </span>
                                        </div>
                                    </div>

                                </div>`;

                    // console.log()
                    ordersOrder.insertAdjacentHTML('afterbegin', item);

                });


            const dayTest = document.querySelector('.orders-day-body-test');
            // console.log(order.date_order.date_start);
            distributor(order.date_order.date_start, ordersOrder, order);

            });

        });

        sortOverdueDeliveries();
        sortFutureDeliveries();
        sortCurrentOrders();
        orderCounter();

    }




});
