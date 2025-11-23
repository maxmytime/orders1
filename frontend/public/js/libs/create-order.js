'use strict'

import settings from '/js/config.js';
import orderNew from '/js/libs/order-new.js';

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

// Проверка значения в поле инпут. Доспустимы только цифры
const checkForNumber = (input) => {
    const a = input.target.value.replace(',','.');
    const b = a.replace(',','.');
    const c = b.replace(/[^0-9.0-9]/g,'');
    const d = c.replace(/\.\1/g,'');
    input.target.value = d;
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

// Установка списка доступных ЮЛ
const listOfCounteragent = (select, codeCounteragent = '-') => {
    const codeClient = document.querySelector('input[name="order-client-name"]').dataset.codeClient;

    if (codeClient) {

        fetch(`${getURL(settings)}/GetCatalog?Name=Counteragents&ParentCode=${codeClient}`)
        .then(response => response.text())
        .then(commits => {
            let partnersList = JSON.parse(commits).Data;
            select.innerHTML = '';
            select.insertAdjacentHTML('beforeend', `<option value="-">-</option>`);


            partnersList.forEach(pl => {
                select.insertAdjacentHTML('beforeend', `<option value="${pl.code_counteragent}">${pl.name_counteragent}</option>`);
            });

            select.value = codeCounteragent;

            // Валидация при обновлении
            if (codeCounteragent == '-') {
                select.classList.add('is-err');
            } else {
                select.classList.remove('is-err');
            }
        });

    }
}

// Обновить список доступных ЮЛ при изменении клиента
const updateCounteragentList = () => {
    const list = document.querySelectorAll('select[name="order-counteragent"]');

    list.forEach(counteragent => {
        counteragent.innerHTML = '';
        counteragent.insertAdjacentHTML('beforeend', `<option value="-">-</option>`);

        listOfCounteragent(counteragent);
    })
}

// Валидация поля объем
const checkVolumeField = (e) => {
    if (e.target.classList.contains('js-order-dael-volume') ||
        e.target.classList.contains('js-order-basis-volume-min') ||
        e.target.classList.contains('js-order-basis-volume-max')) {
        const volumes = e.currentTarget.querySelectorAll('.js-order-dael-volume');
        const volumeRange = e.currentTarget.querySelector('.js-volume-checkbox').checked;
        const volumeMin = e.currentTarget.querySelector('.js-order-basis-volume-min').value;
        const volumeMax = e.currentTarget.querySelector('.js-order-basis-volume-max').value;
        let daelVolumeSum = 0;

        volumes.forEach(volume => {
            daelVolumeSum += Number(volume.value);
        })

        if (volumeRange) {

            if (daelVolumeSum >= volumeMin && daelVolumeSum <= volumeMax) {
                volumes.forEach(volume => {
                    if (volume.value) {
                        volume.classList.remove('is-err');
                    }
                })
            } else {
                volumes.forEach(volume => {
                    volume.classList.add('is-err');
                })
            }

        } else {

            if (daelVolumeSum >= (volumeMin * 0.9) && daelVolumeSum <= (volumeMin * 1.1)) {
                volumes.forEach(volume => {
                    if (volume.value) {
                        volume.classList.remove('is-err');
                    }
                })
            } else {
                volumes.forEach(volume => {
                    volume.classList.add('is-err');
                })
            }

        }

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
        } else if (e.target.classList.contains('js-reservation')) {
            btnOrder.classList.add('is-outlined-brand');
            btnReservation.classList.remove('is-outlined-brand');
            e.currentTarget.dataset.typeOrder = 1;
        }
    }

    orderType.addEventListener('click', checkedTypeOrder);

    orderTypeContainer.append(orderType);

    // Установка бухгалтерского статуса --------------------
    // const statusBuhContainer = document.querySelector('.status-buh-container');
    // const statusBuh = getTemplate('status-buh');
    // const statusBuhSelect = statusBuh.querySelector('select[name="staus-buh"]');

    // statusBuhSelect.value = data.status_buh;
    // statusBuhSelect.setAttribute('disabled', data.allow_edit_logistic);

    // statusBuhContainer.append(statusBuh);

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

    return template;
}

// Функция формирует клиента
const createClient = (template, data = orderNew) => {

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
    // Валидация поля даты
    if (!data.date_order.date_start || !data.date_order.date_end) {
        calendars._ui.dummy.wrapper.classList.add('is-err');
    }

    calendars.on('select', date => {
        calendars._ui.dummy.wrapper.classList.remove('is-err');
    })

    calendars._ui.dummy.clear.addEventListener('click', () => {
        calendars._ui.dummy.wrapper.classList.add('is-err');
    })

    // Устанавливаем Статус логистический ------------------
    template.querySelector('select[name="order-client-status-logistic"]').value = data.status_logistic;

    // Устанавливаем Клиента ------------------
    const client = template.querySelector('input[name="order-client-name"]');
    // Имя клиента
    client.value = data.client.name_client;
    // Код клиента
    client.dataset.codeClient = data.client.code_client;
    // Валидация поля имя клиента
    if (!data.client.name_client) {
        client.classList.add('is-err');
    }

    client.addEventListener('input', (c) => {
        if (c.target.value.length == 0) {
            c.target.classList.add('is-err');
        } else {
            c.target.classList.remove('is-err');
        }
    })

    // Выпадающий список подбора клиента
    const clientList = (e) => {
        const wrapper = template.querySelector('.droplist-wrapper-partner'),     // Контейнер с выпадающим списком
              input = wrapper.querySelector('input[name="order-client-name"]'),  // Поле ввода
              list = wrapper.querySelector('.droplist'),
              value = input.value;

        // Получаем список клиентов с сервера
        fetch(`${getURL(settings)}/getpartnerslist`)
            .then(response => response.text())
            .then(commits => {
                let partnersList = JSON.parse(commits).Data;

                if (value.length >= 2) {
                    list.classList.remove('is-hidden'); // Делаем выподающий список видимым
                    list.innerHTML = '';                // Очищаем список клиентов

                    // Проверяем есть ли значение в качестве подстроки и если да то добавляем его в список выбора
                    partnersList.filter(item => {
                        const { name_client, code_client, type_client } = item;
                        const nameClient = name_client.toLowerCase();
                        if (nameClient.includes(value.toLowerCase())) {
                            list.insertAdjacentHTML('beforeend', `<span data-type="${type_client}"
                                                                        data-code="${code_client}"
                                                                        class="droplist-item">${name_client}</span>`);
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
            // inputType.value = item.dataset.type;

            list.classList.add('is-hidden'); // Скрываем выпадающий список
            updateAddressList(); // Обновляем список доступных адресов в блоке адрес
            updateCounteragentList(); // Обновляем список доступных ЮЛ в блоке ЮЛ
        }

    })

    // Устанавливаем Тип клиента ------------------
    // const clientType = template.querySelector('input[name="order-client-type"]');
    // clientType.value = data.client.type_client;

    // Устанавливаем Тип отгрузки ------------------
    const clientTypeShipment = template.querySelector('select[name="order-client-type-shipment"]');
    // Тип отгрузки
    clientTypeShipment.value = data.type_operation;
    // Валидация поля тип отгрзки
    if (!data.type_operation) {
        clientTypeShipment.classList.add('is-err');
    }

    clientTypeShipment.addEventListener('change', (o) => {
        const value = Number(o.target.value);

        if (value) {
            clientTypeShipment.classList.remove('is-err');
        } else {
            clientTypeShipment.classList.add('is-err');
        }
    })

    // Устанавливаем Документы ------------------
    // const clientDocument = template.querySelector('select[name="order-client-document"]');
    // Документы
    // clientDocument.value = data.documents.type_docs;
    // Валидация поля документы
    // if (!data.documents.type_docs) {
    //     clientDocument.classList.add('is-err');
    // }

    // clientDocument.addEventListener('change', (o) => {
    //     const value = Number(o.target.value);

    //     if (value) {
    //         clientDocument.classList.remove('is-err');
    //     } else {
    //         clientDocument.classList.add('is-err');
    //     }
    // })

    // Устанавливаем Срочность ------------------
    // const clientUrgency = template.querySelector('select[name="order-client-urgency"]');
    // Срочность
    // clientUrgency.value = data.documents.urgency_docs;
    // Валидация срочности
    // if (!data.documents.urgency_docs) {
    //     clientUrgency.classList.add('is-err');
    // }

    // clientUrgency.addEventListener('change', (o) => {
    //     const value = Number(o.target.value);

    //     if (value) {
    //         clientUrgency.classList.remove('is-err');
    //     } else {
    //         clientUrgency.classList.add('is-err');
    //     }
    // })

    // Устанавливаем Срок ------------------
    // const clientTerm = template.querySelector('select[name="order-client-term"]');
    // Срок
    // clientTerm.value = data.documents.urgency_in_due_docs;
    // Валидация поля срок
    // if (!data.documents.urgency_in_due_docs) {
    //     clientTerm.classList.add('is-err');
    // }

    // clientTerm.addEventListener('change', (o) => {
    //     const value = Number(o.target.value);

    //     if (value) {
    //         clientTerm.classList.remove('is-err');
    //     } else {
    //         clientTerm.classList.add('is-err');
    //     }
    // })

    // Устанавливаем До ------------------
    // До - дата
    // const clientDocDate = template.querySelector('input[name="order-client-doc-date"]');
    // clientDocDate.dataset.startDate = data.documents.urgency_until_docs.date;
    // const calendarClientDocDate = new bulmaCalendar(clientDocDate, {
    //     color: 'link',
    //     isRange: false,
    //     lang: 'ru',
    //     dateFormat: 'dd.MM.yyyy',
    //     showClearButton: false,
    //     showTodayButton: false,
    //     showHeader: false,
    //     cancelLabel: 'Закрыть',
    //     displayMode: 'dialog'
    // });
    // Валидация поля даты
    // if (!data.documents.urgency_until_docs.date) {
    //     calendarClientDocDate._ui.dummy.wrapper.classList.add('is-err');
    // }

    // calendarClientDocDate.on('select', date => {
    //     calendarClientDocDate._ui.dummy.wrapper.classList.remove('is-err');
    // })

    // calendarClientDocDate._ui.dummy.clear.addEventListener('click', () => {
    //     calendarClientDocDate._ui.dummy.wrapper.classList.add('is-err');
    // })

    // До - время
    // const clientDocTime = template.querySelector('input[name="order-client-doc-time"]');
    // Время
    // clientDocTime.dataset.startTime = convertTime1CToBulma(data.documents.urgency_until_docs.time);
    // const calendarclientDocTime = new bulmaCalendar(clientDocTime, {
    //     color: 'link',
    //     lang: 'ru',
    //     showClearButton: true,
    //     showTodayButton: false,
    //     showHeader: false,
    //     validateLabel: 'Установить',
    //     clearLabel: 'Очистить',
    //     cancelLabel: 'Закрыть',
    //     displayMode: 'dialog'
    // });

    // При нажатии кнопки "Закрыть" диалоговое окно установки выремяни закрывается
    // calendarclientDocTime._ui.footer.cancel.addEventListener('click', (c) => {
    //     calendarclientDocTime._ui.dummy.wrapper.classList.remove('is-active');
    //     calendarclientDocTime._ui.modal.classList.remove('is-active');
    // })

    // Валидация поля даты
    // if (!data.documents.urgency_until_docs.date) {
    //     calendarclientDocTime._ui.dummy.wrapper.classList.add('is-err');
    // }

    // calendarclientDocTime.on('select', date => {
    //     calendarclientDocTime._ui.dummy.wrapper.classList.remove('is-err');
    // })

    // calendarclientDocTime._ui.dummy.clear.addEventListener('click', () => {
    //     calendarclientDocTime._ui.dummy.wrapper.classList.add('is-err');
    // })

    // calendarclientDocTime._ui.footer.validate.addEventListener('click', (c) => {
    //     const time = clientDocTime.value;
    //     if (time == '00:00') {
    //         calendarclientDocTime._ui.dummy.wrapper.classList.add('is-err');
    //     }
    // })

    // Устанавливаем Комментарий ------------------
    const clientComment = template.querySelector('textarea[name="order-client-comment"]');
    // Комментарий
    clientComment.value = data.commentary;

    // ФУНКЦИИ ДЕЙСТВИЕ, КОТОРЫХ РАСПРОСТРАНЯЕТСЯ НА ВЕСЬ РАЗДЕЛ КЛИЕНТ

    // Поле Документы -------------------------------------------------
    // От выбора в разделе "докуметы" зависит доступность поля "срочность"
    // const selectionOfDocuments = () => {
    //     const docVal = template.querySelector('select[name="order-client-document"]').value;
    //     const clientUrgency = template.querySelector('select[name="order-client-urgency"]');
    //     const term = template.querySelector('.js-order-client-term');
    //     const docDateTime = template.querySelector('.js-order-doc-datetime');

    //     if (docVal == 0) {
    //         clientUrgency.value = 0;
    //         clientUrgency.classList.remove('is-err');
    //         clientUrgency.setAttribute('disabled', 'disabled');
    //         term.classList.add('is-hidden');
    //         docDateTime.classList.add('is-hidden');
    //     } else if (docVal == 4) {
    //         clientUrgency.value = 0;
    //         clientUrgency.classList.remove('is-err');
    //         clientUrgency.setAttribute('disabled', 'disabled');
    //         term.classList.add('is-hidden');
    //         docDateTime.classList.add('is-hidden');
    //     } else {
    //         clientUrgency.removeAttribute('disabled');
    //         if (clientUrgency.value == 0) {
    //             clientUrgency.classList.add('is-err')
    //         }
    //     }
    // }

    // Устанавливаем зависимость поля Срочность от поля Документы
    // при первичном формировании заявки
    // selectionOfDocuments();

    // Вешаем событие при изменении поля документы меняется доступность
    // поля срочность
    // const doc = template.querySelector('select[name="order-client-document"]');
    // doc.addEventListener('change', selectionOfDocuments);

    // После Срочность -------------------------------------------------
    // От выбора в разделе "срочность" зависит доступность полей "Срок", "До"
    // const selectionOfUrgency = () => {
    //     const urgencyVal = template.querySelector('select[name="order-client-urgency"]').value;
    //     const term = template.querySelector('.js-order-client-term');
    //     const docDateTime = template.querySelector('.js-order-doc-datetime');

    //     if (urgencyVal == 0) {
    //         term.classList.add('is-hidden');
    //         docDateTime.classList.add('is-hidden');
    //     } else if (urgencyVal == 1) {
    //         term.classList.add('is-hidden');
    //         docDateTime.classList.add('is-hidden');
    //     } else if (urgencyVal == 2) {
    //         term.classList.remove('is-hidden');
    //         docDateTime.classList.add('is-hidden');
    //     } else if (urgencyVal == 3) {
    //         term.classList.add('is-hidden');
    //         docDateTime.classList.remove('is-hidden');
    //     } else if (urgencyVal == 4) {
    //         term.classList.add('is-hidden');
    //         docDateTime.classList.add('is-hidden');
    //     }

    // }

    // Устанавливаем зависимость полей "Срок", "До" от поля Срочность
    // при первичном формировании заявки
    // selectionOfUrgency();

    // Вешаем событие при изменении поля "Срочность" меняется доступность
    // полей "Срок", "До"
    // const urgency = template.querySelector('select[name="order-client-urgency"]');
    // urgency.addEventListener('change', selectionOfUrgency);

    // console.log();

    return template;
}

// Функция формирует адрес
const creatAddress = (template, data = newAddress) => {

    // Установка адреса-------------------------------------
    const address = template.querySelector('select[name="order-address-select"]');
    // Адрес
    // address.insertAdjacentHTML('beforeend', `<option value=${data.name_address}>${data.name_address}</option>`);
    listOfAddresses(address, data.name_address);
    // Валидация поля адрес
    if (data.name_address == '-') {
        address.classList.add('is-err');
    }

    address.addEventListener('change', (a) => {
        if (a.target.value == '-') {
            address.classList.add('is-err');
        } else {
            address.classList.remove('is-err');
        }
    })

    // Модальное окно вызывается по кнопке "Новый"
    const modalAddNewAddress = template.querySelector('#add-new-addres'),
          buttonClose = modalAddNewAddress.querySelector('.js-close'),
          buttonAdd = modalAddNewAddress.querySelector('.btn-new-address'),
          input = modalAddNewAddress.querySelector('.input-new-address');

    const openModal = () => {
        modalAddNewAddress.classList.add('is-active');
    }

    const closeModal = () => {
        modalAddNewAddress.classList.remove('is-active');
    }

    const addNewAddresModal = () => {
        if (input.value) {
            saveAddress(input.value, address, closeModal);
            closeModal();
        }
    }

    // Открыть модальное окно
    const buttonNewAddress = template.querySelector('.js-add-new-addres');
    buttonNewAddress.addEventListener('click', openModal);
    // Закрыыть модальное окно
    buttonClose.addEventListener('click', closeModal);
    // Добавить новый адрес
    buttonAdd.addEventListener('click', addNewAddresModal);

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
    // Валидация поля базис
    if (!data.basis.name_basis) {
        basis.classList.add('is-err');
    }

    basis.addEventListener('input', (c) => {
        if (c.target.value.length == 0) {
            c.target.classList.add('is-err');
        } else {
            c.target.classList.remove('is-err');
        }
    })

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

    // Установка поля продукт -------------------------------------
    const product = template.querySelector('input[name="order-product"]');
    // Продукт
    product.value = data.product.name_product;            // Значение в поле input
    product.dataset.product = data.product.code_product;  // код в дата атребуте
    // Валидация поля продукт
    if (!data.product.code_product) {
        product.classList.add('is-err');
    }

    product.addEventListener('input', (c) => {
        if (c.target.value.length == 0) {
            c.target.classList.add('is-err');
        } else {
            c.target.classList.remove('is-err');
        }
    })

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
    // Валидация поля номенклатура
    if (!data.nomenclature.name_nomenclature) {
        nomenclature.classList.add('is-err');
    }

    nomenclature.addEventListener('input', (c) => {
        if (c.target.value.length == 0) {
            c.target.classList.add('is-err');
        } else {
            c.target.classList.remove('is-err');
        }
    })

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
    // Валидация поля минималный объем
    if (!data.volume.start_volume) {
        startVolume.classList.add('is-err');
    }

    startVolume.addEventListener('input', (c) => {
        if (c.target.value.length == 0) {
            c.target.classList.add('is-err');
        } else {
            c.target.classList.remove('is-err');
        }
    })

    startVolume.addEventListener('input', checkForNumber);

    // Максимальный объем
    const endVolume = template.querySelector('input[name="order-end-volume"]');
    endVolume.value = data.volume.end_volume;
    // Валидация поля минималный объем
    if (!data.volume.end_volume) {
        endVolume.classList.add('is-err');
    }

    endVolume.addEventListener('input', (c) => {
        if (c.target.value.length == 0) {
            c.target.classList.add('is-err');
        } else {
            c.target.classList.remove('is-err');
        }
    })

    endVolume.addEventListener('input', checkForNumber);

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
    // Валидация поля стоимости доставки
    if (!data.delivery.cost_delivery) {
        costDelivery.classList.add('is-err');
    }

    costDelivery.addEventListener('input', (c) => {
        if (c.target.value.length == 0) {
            c.target.classList.add('is-err');
        } else {
            c.target.classList.remove('is-err');
        }
    })

    costDelivery.addEventListener('input', checkForNumber);

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
    // Вешаем событие на блок базис. Отслеживаем нажатие кнопки добавить ЮЛ.
    template.querySelector('.legal-entity-container').addEventListener('click', addLE);
    // Валидация поля объем
    template.addEventListener('input', checkVolumeField);
    // console.log(template.querySelector('.button.js-add-new-legal-entity'));
    return template;
}

// Функция формирует юридическое лицо
const creatLE = (template, data = newLE) => {

    // Установка контрагента-------------------------------------
    const counteragent = template.querySelector('select[name="order-counteragent"]');

    listOfCounteragent(counteragent, data.counteragent.code_counteragent);
    // Валидация поля контрагент
    if (data.counteragent.code_counteragent == '-') {
        counteragent.classList.add('is-err');
    }

    counteragent.addEventListener('change', (c) => {
        if (c.target.value == '-') {
            counteragent.classList.add('is-err');
        } else {
            counteragent.classList.remove('is-err');
        }
    })

    // Установка объема в контрагенте -------------------------------------
    const daelVolume = template.querySelector('input[name="order-dael-volume"]');
    // Контрагент
    daelVolume.value = data.volume;
    // Валидация поля контрагент
    if (!data.volume) {
        daelVolume.classList.add('is-err');
    }

    daelVolume.addEventListener('input', (c) => {
        if (c.target.value.length == 0) {
            c.target.classList.add('is-err');
        } else {
            c.target.classList.remove('is-err');
        }
    })

    daelVolume.addEventListener('input', checkForNumber);

    // Установка веса в контрагенте -------------------------------------
    const daelWT = template.querySelector('input[name="order-dael-wt"]');
    // Вес
    daelWT.value = data.weight;
    // Валидация поля вес
    // console.log(String(data.weight).length > 0);
    if (!(String(data.weight).length > 0)) {
        daelWT.classList.add('is-err');
    }

    daelWT.addEventListener('input', (c) => {
        if (c.target.value.length == 0) {
            c.target.classList.add('is-err');
        } else {
            c.target.classList.remove('is-err');
        }
    })

    daelWT.addEventListener('input', checkForNumber);

    // Установка цены в контрагенте -------------------------------------
    const daelPrice = template.querySelector('input[name="order-dael-price"]');
    // Цена
    daelPrice.value = data.cost;
    // Валидация поля цена
    if (!data.cost) {
        daelPrice.classList.add('is-err');
    }

    daelPrice.addEventListener('input', (c) => {
        if (c.target.value.length == 0) {
            c.target.classList.add('is-err');
        } else {
            c.target.classList.remove('is-err');
        }
    })

    daelPrice.addEventListener('input', checkForNumber);

    // Установка поля плотность -------------------------------------
    const daelDensity = template.querySelector('.order-dael-density');
    // Валидация поля плотность
    daelDensity.addEventListener('input', checkForNumber);

    // Установка едениц измерения в поле цена ------------------------------------
    const daelUnit = template.querySelector('select[name="order-dael-unit"]');
    daelUnit.value = data.type_cost;

    // ФУНКЦИИ ДЕЙСТВИЕ, КОТОРЫХ РАСПРОСТРАНЯЕТСЯ НА ВЕСЬ РАЗДЕЛ КЛИЕНТ
    // Пересчет веса в зависимости от плотности
    const calculateDaelWT = () => {
        const wt = template.querySelector('input[name="order-dael-wt"]'),
              density = template.querySelector('.order-dael-density'),
              volume = template.querySelector('input[name="order-dael-volume"]');

        wt.value = (density.value * volume.value / 1000).toFixed(3);

    }

    template.querySelector('.js-btn-calculate-density').addEventListener('click', calculateDaelWT);

    // Вешаем событие на блок ЮЛ. Отслеживаем нажатие кнопки удалить блок ЮЛ.
    template.addEventListener('click', dellLE);

    // console.log(counteragent);
    return template;
}

// ДОБАВЛЕНИЕ И УДАЛЕНИЕ НОВЫХ ЭЛЕМЕНТОВ В ЗАЯВКЕ АДРЕС, БАЗИС, ЮЛ

// Добавить адрес
const addAddress = (a) => {
    if (a.target.classList.contains('js-add-new-address')) {
        const address = creatAddress(getTemplate('address'));
        const basis = creatBasis(getTemplate('basis'));
        const counteragent = creatLE(getTemplate('legal-entity'));

        address.querySelector('.basis-container').append(basis);
        address.querySelector('.legal-entity-container').append(counteragent);

        a.currentTarget.after(address);
    }
}

// Удалить адрес
const dellAddress = (a) => {
    const length = document.querySelectorAll('.address-container .address').length;

    if (length > 1) {
        if (a.target.classList.contains('js-del-address')) {
            a.currentTarget.remove();
        }
    }

}

// Добавить базис
const addBasis = (b) => {
    if (b.target.classList.contains('js-add-new-basis')) {
        console.log(b);
        const basis = creatBasis(getTemplate('basis'));
        const counteragent = creatLE(getTemplate('legal-entity'));

        // address.querySelector('.basis-container').append(basis);
        basis.querySelector('.legal-entity-container').append(counteragent);

        b.currentTarget.after(basis);
    }
}

// Удалить базис
const dellBasis = (b) => {
    const length = b.currentTarget.parentNode.querySelectorAll('.basis').length;

    if (length > 1) {
        if (b.target.classList.contains('js-btn-basis-del')) {
            b.currentTarget.remove();
        }
    }

}

// Добавить ЮЛ
const addLE = (le) => {
    if (le.target.classList.contains('js-add-new-legal-entity')) {
        const counteragent = creatLE(getTemplate('legal-entity'));
        le.currentTarget.append(counteragent);
    }
}

// Удалить ЮЛ
const dellLE = (le) => {
    const length = le.currentTarget.parentNode.querySelectorAll('.legal-entity').length;

    if (length > 1) {
        if (le.target.classList.contains('js-btn-le-del')) {
            le.currentTarget.remove();
        }
    }
}

export default { creatLE, creatBasis, creatAddress, createClient, createOrder, getTemplate };
export { creatLE, creatBasis, creatAddress, createClient, createOrder, getTemplate };