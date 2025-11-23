'use strict';

import settings from '/js/config.js';
import { paymentSchedules, company, row, btnContainer, sum, checkBox, scheduleAlert, buttons } from '/js/template/payment-schedule.js';
import engineHTML from '/js/libs/engine.js';
import setPreloader from '/js/libs/preloader.js';
import fias from '/js/libs/fias.js';

window.addEventListener('DOMContentLoaded', () => {

    // console.log(settings.protocol, settings.host, settings.port);

    fias('.input-new-address', '.droplist-new-address');

    const getURL = (settings) => {
        const protocol = settings.protocol;
        const host = settings.host;
        const port = settings.port;
        const url = `${protocol}://${host}:${port}`;
        return url;
    }

    const socket = io();

    // socket.on('save order', (msg) => {
    //     console.log(msg);
    // });


    const orderR = {
        "Status": "OK",
        "Errors": "",
        "Data": {
            "OrdersList": {
                "date": "",
                "time": "",
                "number": "",
                "author": "",
                "client": {
                    "name_client": "",
                    "code_client": "",
                    "type_client": ""
                },
                "type_order": 2,
                "type_operation": '',
                "archieved": false,
                "date_order": {
                    "date_range": false,
                    "date_start": "",
                    "date_end": ""
                },
                "documents": {
                    "type_docs": 0,
                    "urgency_docs": 0,
                    "urgency_in_due_docs": 0,
                    "urgency_until_docs": {
                        "date": "",
                        "time": ""
                    }
                },
                "payment_schedule": [],
                "commentary": "",
                "status_buh": 0,
                "status_logistic": 1,
                "array_addresses": [{
                    "name_address": "",
                    "array_basises": [{
                        "basis": {
                            "name_basis": "",
                            "code_basis": ""
                        },
                        "product": {
                            "name_product": "",
                            "code_product": ""
                        },
                        "nomenclature": {
                            "name_nomenclature": "",
                            "code_nomenclature": ""
                        },
                        "volume": {
                            "range_volume": false,
                            "start_volume": '',
                            "end_volume": ''
                        },
                        "delivery": {
                            "NDS_delivery": true,
                            "cost_delivery": 0,
                            "cost_type_delivery": 0
                        },
                        "specification_use": false,
                        "date_basis": {
                            "date_range": false,
                            "date_start": undefined,
                            "date_end": undefined,
                        },
                        "commentary": "",
                        "array_counteragents": [{
                            "counteragent": {
                                "name_counteragent": "",
                                "code_counteragent": "",
                            },
                            "volume": 0,
                            "weight": 0,
                            "cost": 0,
                            "type_cost": 0
                        }]
                    }]
                }]
            }
        }
    };

    const newOrder = {
        "Status": "OK",
        "Errors": "",
        "Data": {
            "OrdersList": {
                "date": "08.08.2023",
                "time": "16:35:26",
                "number": "000000003",
                "author": "Ермаков Дмитрий Игоревич",
                "client": {
                    "name_client": "Рубин",
                    "code_client": "КА-КА000067",
                    "type_client": "Тип B"
                },
                "type_order": 1,
                "type_operation": 2,
                "archieved": false,
                "date_order": {
                    "date_range": true,
                    "date_start": "08.08.2023",
                    "date_end": "11.08.2023"
                },
                "status_buh": 3,
                "status_logistic": "2",
                "array_addresses": [{
                    "name_address": "630048, Новосибирская обл, Новосибирск г, Титова ул, дом 1, этаж Подвал, помещение 2",
                    "array_basises": [{
                        "basis": {
                            "name_basis": "",
                            "code_basis": ""
                        },
                        "product": {
                            "name_product": "АИ-92 ГОСТ",
                            "code_product": "000000008"
                        },
                        "nomenclature": {
                            "name_nomenclature": "Бензин автомобильный АИ-92-К5, т",
                            "code_nomenclature": "КА-00000051"
                        },
                        "volume": {
                            "range_volume": true,
                            "start_volume": 50000,
                            "end_volume": 50000
                        },
                        "delivery": {
                            "NDS_delivery": true,
                            "cost_delivery": 160000,
                            "cost_type_delivery": 3
                        },
                        "documents": {
                            "type_docs": 3,
                            "urgency_docs": 2,
                            "urgency_in_due_docs": 1,
                            "urgency_until_docs": {
                                "date": "14.08.2023",
                                "time": "16:35"
                            }
                        },
                        "commentary": "Рубин комментарий",
                        "array_counteragents": [{
                            "counteragent": {
                                "name_counteragent": "РУБИН ООО",
                                "code_counteragent": "5404404047"
                            },
                            "array_deals": [{
                                "volume": 20000,
                                "weight": 180,
                                "cost": 100000,
                                "type_cost": 1,
                                "type_payment": 4,
                                "date_payment": "14.08.2023",
                                "offset_payment": 0
                            }
                            ]
                        }]
                    }]
                }]
            }
        }
    };

    // ВАЛИДАЦИЯ
    function validation() {
        let param = true;
        // Валидация поля
        function valid(arr, value) {
            arr.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (elem.value == value) {

                    elem.style.borderColor = '#FF0000';
                    // console.log(elem);
                    // elem.style.zIndex = '2';
                    param = false;
                    elem.addEventListener('input', e => {
                        e.target.style.borderColor = '#dbdbdb';
                    });
                }
            });
        }

        function validVolume(arr, value) {

            function validVolumeBtn(volume, btn, value) {
                volume.forEach(elem => {
                    elem.style.borderColor = '#dbdbdb';
                    btn.style.borderColor = '#dbdbdb';
                    if (elem.value == value) {

                        elem.style.borderColor = '#FF0000';
                        btn.style.borderColor = '#FF0000';
                        // console.log(elem);
                        // elem.style.zIndex = '2';
                        param = false;
                        elem.addEventListener('input', e => {
                            e.target.style.borderColor = '#dbdbdb';
                            btn.style.borderColor = '#dbdbdb';
                        });
                    }
                });
            }

            arr.forEach(volume => {

                const volumCh = volume.querySelector('.js-volume-checkbox');
                const btn = volume.querySelector('.js-button-volume');
                if (volumCh.checked) {
                    const volumeMin = volume.querySelectorAll('input[name="order-address-basis-volume-min"]');
                    validVolumeBtn(volumeMin, btn, '');
                    const volumeMax = volume.querySelectorAll('input[name="order-address-basis-volume-max"]');
                    validVolumeBtn(volumeMax, btn, '');
                } else {
                    const volumeMin = volume.querySelectorAll('input[name="order-address-basis-volume-min"]');
                    validVolumeBtn(volumeMin, btn, '');
                }


            });
        }



        function validDocuments(documents, urgency) {
            if (documents.value == 0) {
                documents.style.borderColor = '#FF0000';
                urgency.setAttribute('disabled', 'disabled');
                param = false;
            } else if (documents.value == 4) {
                urgency.setAttribute('disabled', 'disabled');
            } else {
                valid([urgency], '0');
                isHidden('.js-order-basis-term', 'select[name="order-address-basis-term"]', '0');
                isHidden('.js-order-basis-datetime', 'input[name="order-address-basis-date"]', '');
                isHidden('.js-order-basis-datetime', 'input[name="order-address-basis-time"]', '');
                urgency.removeAttribute('disabled');
            }



            documents.addEventListener('input', e => {
                if (documents.value == 4) {
                    urgency.style.borderColor = '#dbdbdb';
                    documents.style.borderColor = '#dbdbdb';
                    urgency.value = 0;
                    urgency.setAttribute('disabled', 'disabled');
                    const term = document.querySelector('.js-order-basis-term').classList.add('is-hidden');
                    const datetime = document.querySelector('.js-order-basis-datetime').classList.add('is-hidden');
                    // param = true;
                } else if (documents.value == 0) {
                    urgency.style.borderColor = '#dbdbdb';
                    documents.style.borderColor = '#FF0000';
                    param = false;
                    urgency.setAttribute('disabled', 'disabled');
                } else {
                    if (urgency.value == '0') {
                        urgency.style.borderColor = '#FF0000';
                    }
                    documents.style.borderColor = '#dbdbdb';
                    urgency.removeAttribute('disabled');
                    param = false;
                }
            })

            urgency.addEventListener('input', e => {
                if (urgency.value == 0) {
                    urgency.style.borderColor = '#FF0000';
                    param = false;
                } else {
                    urgency.style.borderColor = '#dbdbdb';
                }
            })
        }

        function validClientData(arr, value) {
            arr.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (elem.value == value) {
                    const wrapper = document.querySelector('.datetimepicker-dummy-wrapper');
                    wrapper.style.borderColor = '#FF0000';
                    // console.log(elem);
                    param = false;
                    wrapper.addEventListener('click', e => {
                        wrapper.style.borderColor = '#dbdbdb';
                    });
                }
            });
        }

        function validOneFild(container, name, value) {
            const elem = container.querySelector(name);
            elem.style.borderColor = '#dbdbdb';
            if (elem.value == value) {
                elem.style.borderColor = '#FF0000';
                // console.log(elem);
                param = false;
                elem.addEventListener('input', e => {
                    e.target.style.borderColor = '#dbdbdb';
                });
            }
        }

        function isHidden(className, name, value) {
            const container = document.querySelectorAll(className);
            container.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (!elem.classList.contains('is-hidden')) {
                    validOneFild(elem, name, value);
                }
            });
        }

        function validProduct(arr, value) {
            arr.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (elem.dataset.product == value) {

                    elem.style.borderColor = '#FF0000';
                    param = false;
                    elem.addEventListener('input', e => {

                        if (e.target.value.length > 2) {
                            e.target.style.borderColor = '#dbdbdb';
                        } else {
                            e.target.style.borderColor = '#FF0000';
                            e.target.dataset.product = '';
                            param = false;
                        }

                    });
                }

                elem.addEventListener('input', e => {

                    if (e.target.value.length > 2) {
                        e.target.style.borderColor = '#dbdbdb';
                    } else {
                        e.target.style.borderColor = '#FF0000';
                        e.target.dataset.product = '';
                        param = false;
                    }

                });
            });
        }

        function validWT(daels) {
            daels.forEach(dael => {
                const wt = dael.querySelector('input[name="order-address-basis-legal-entity-dael-wt"]');
                const unit = dael.querySelector('select[name="order-address-basis-legal-entity-dael-unit"]');

                if (unit.value == 0) {
                    unit.style.borderColor = '#FF0000';
                    param = false;
                } else if (unit.value == 2) {
                    if (wt.value == '') {
                        wt.style.borderColor = '#FF0000';
                        param = false;
                    }
                } else if (unit.value == 1) {
                    wt.style.borderColor = '#dbdbdb';
                    unit.style.borderColor = '#dbdbdb';
                    // param = true;
                }

                unit.addEventListener('input', () => {
                    if (unit.value == 0) {
                        unit.style.borderColor = '#FF0000';
                        param = false;
                    } else if (unit.value == 2) {
                        if (wt.value == '') {
                            wt.style.borderColor = '#FF0000';
                            param = false;
                        }
                    } else if (unit.value == 1) {
                        wt.style.borderColor = '#dbdbdb';
                        unit.style.borderColor = '#dbdbdb';
                        // param = true;
                    }
                })

                wt.addEventListener('input', () => {
                    if (wt.value == '' && unit.value == 2) {
                        wt.style.borderColor = '#FF0000';
                    } else {
                        wt.style.borderColor = '#dbdbdb';
                    }

                })
            })
        }

        function validSchedule(scheduleBtn) {
            if (scheduleBtn.classList.contains('schedule-err')) {
                param = false;
            }
        }

        function validPrice(arr) {

            arr.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (!/[0-9]/.test(elem.value)) {

                    elem.style.borderColor = '#FF0000';
                    // console.log(elem);
                    // elem.style.zIndex = '2';
                    param = false;
                    elem.addEventListener('input', e => {
                        e.target.style.borderColor = '#dbdbdb';
                    });
                }
            });
        }

        // function validBasisDate(containers, value) {
        // arr.forEach(elem => {
        //     elem.style.borderColor = '#dbdbdb';
        //     if (elem.value == value) {
        //         const wrapper = document.querySelector('.datetimepicker-dummy-wrapper');
        //         wrapper.style.borderColor = '#FF0000';
        //         // console.log(elem);
        //         param = false;
        //         wrapper.addEventListener('click', e => {
        //             wrapper.style.borderColor = '#dbdbdb';
        //         });
        //     }
        // });
        // containers.forEach(container => {
        //     const checkBox = container.querySelector('.js-basis-date-checkbox');
        //     const dataRngeWrapper = container.querySelector('.js-basis-date-range .datetimepicker-dummy-wrapper');
        //     const inputDateRange = dataRngeWrapper.querySelector('input[name="basis-date-range"]');
        //     const dataWrapper = container.querySelector('.js-basis-date .datetimepicker-dummy-wrapper');
        // const inputDate = dataWrapper.querySelector('input[name="basis-date"]');

        // dataRngeWrapper.addEventListener('click', e => {
        //     dataRngeWrapper.style.borderColor = '#dbdbdb';
        // })

        // dataWrapper.addEventListener('click', e => {
        //     dataWrapper.style.borderColor = '#dbdbdb';
        // })

        //         if (checkBox.checked) {
        //             console.log('диапазон дат');
        //             if (inputDateRange.value == value) {
        //                 dataRngeWrapper.style.borderColor = '#FF0000';
        //                 param = false;
        //             }

        //         } else {

        //             if (inputDate.value == value) {
        //                 dataWrapper.style.borderColor = '#FF0000';
        //                 param = false;
        //             }

        //         }
        //     })

        // }

        // Дата базиса
        // const containersBasisDate = document.querySelectorAll('.js-basis-date-container');
        // validBasisDate(containersBasisDate, '');

        // Дата

        const clientDate = document.querySelectorAll('input[name="order-client-date"]');
        validClientData(clientDate, '');


        // Клиент
        const client = document.querySelectorAll('input[name="order-client-name"]');
        valid(client, '');

        // Тип отгрузки
        const shipment = document.querySelectorAll('select[name="order-client-type-shipment"]');
        valid(shipment, '0');

        // График платежей schedule-err
        const scheduleBtn = document.querySelector('.btn-schedule-open');
        validSchedule(scheduleBtn);

        // Адрес
        const address = document.querySelectorAll('input[name="order-address"]');
        address.forEach(addres => {
            addres.removeAttribute('disabled', 'disabled');
        })
        valid(address, '');

        // Базис
        const basis = document.querySelectorAll('input[name="order-address-basis"]');
        valid(basis, '');

        // Продукт
        const product = document.querySelectorAll('input[name="order-address-basis-product"]');
        // console.log('dataProduct', product.dataset);
        // valid(product, '');
        validProduct(product, '');

        // Номенклатура
        const nomenclature = document.querySelectorAll('input[name="order-address-basis-nomenclature"]');
        validProduct(nomenclature, '');

        // Объем
        const volumes = document.querySelectorAll('.js-volum');
        validVolume(volumes, '');

        // volumes.forEach(volume => {
        //     const volumCh = volume.querySelector('.js-volume-checkbox');
        //     if (volumCh.checked) {
        //         const volumeMin = volume.querySelectorAll('input[name="order-address-basis-volume-min"]');
        //         valid(volumeMin, '');
        //         const volumeMax = volume.querySelectorAll('input[name="order-address-basis-volume-max"]');
        //         valid(volumeMax, '');
        //     } else {
        //         const volumeMin = volume.querySelectorAll('input[name="order-address-basis-volume-min"]');
        //         valid(volumeMin, '');
        //     }
        // });



        // Доставка
        const basisValue = document.querySelectorAll('input[name="order-address-basis-value"]');
        valid(basisValue, '');

        const basisUnit = document.querySelectorAll('select[name="order-address-basis-unit"]');
        valid(basisUnit, '0');

        // Документы
        // const documents = document.querySelectorAll('select[name="order-address-basis-document"]');
        // valid(documents, '0');

        const documents = document.querySelector('select[name="order-address-basis-document"]');
        const urgency = document.querySelector('select[name="order-address-basis-urgency"]');
        validDocuments(documents, urgency);


        // Срочность
        // const urgency = document.querySelectorAll('select[name="order-address-basis-urgency"]');
        // valid(urgency, '0');
        // isHidden('.js-order-basis-term', 'select[name="order-address-basis-term"]', '0');
        // isHidden('.js-order-basis-datetime', 'input[name="order-address-basis-date"]', '');
        // isHidden('.js-order-basis-datetime', 'input[name="order-address-basis-time"]', '');

        // Юридическое лицо
        const le = document.querySelectorAll('select[name="order-address-basis-legal-entity"]');
        valid(le, '');

        // Объем
        const volue = document.querySelectorAll('input[name="order-address-basis-legal-entity-dael-volume"]');
        valid(volue, '');

        // Вес
        // const wt = document.querySelectorAll('input[name="order-address-basis-legal-entity-dael-wt"]');
        // valid(wt, '');

        // Цена
        const price = document.querySelectorAll('input[name="order-address-basis-legal-entity-dael-price"]');
        validPrice(price);

        // const dealUnit = document.querySelectorAll('select[name="order-address-basis-legal-entity-dael-unit"]');
        // valid(dealUnit, '0');
        const daels = document.querySelectorAll('.dael');
        validWT(daels);

        // Тип оплаты
        const paymentType = document.querySelectorAll('select[name="order-address-basis-legal-entity-dael-payment-type"]');
        valid(paymentType, '0');
        isHidden('.js-order-dael-date', 'input[name="order-address-basis-legal-entity-dael-date"]', '');
        isHidden('.js-order-dael-dey', 'input[name="order-address-basis-legal-entity-dael-number-of-days"]', '0');
        // console.log('ok');

        // Отстрочка сдвиг
        const offsetPayment = document.querySelectorAll('.offset-payment');

        offsetPayment.forEach(offset => {

            if (!offset.classList.contains('is-hidden')) {

                const input = offset.querySelector('input[name="schedule-row-offset-payment"]');
                console.log(input.value);
                if (input.value == '0' || input.value == '' || Number(input.value) < 0) {
                    input.style.borderColor = '#FF0000';
                    // console.log(elem);
                    param = false;
                    input.addEventListener('input', e => {
                        e.target.style.borderColor = '#dbdbdb';
                    });
                }
            }
        })

        const dataBasis = validationDateBasis();
        if (param == true && dataBasis == false) param = dataBasis;

        const typeShipment = validationTypeShipment();
        if (param == true && typeShipment == false) param = typeShipment;

        const chPrice = checkingPrice();
        if (param == true && chPrice == false) param = chPrice;

        return param;

    }

    function validation2() {
        let param = true;
        // Валидация поля
        function valid(arr, value) {
            arr.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (elem.value == value) {
                    elem.style.borderColor = '#FF0000';
                    // console.log(elem);
                    // elem.style.zIndex = '2';
                    param = false;
                    elem.addEventListener('input', e => {
                        e.target.style.borderColor = '#dbdbdb';
                    });
                }
            });
        }

        function validClientData(arr, value) {
            arr.forEach(elem => {
                if (elem.value == value) {
                    const wrapper = document.querySelector('.datetimepicker-dummy-wrapper');
                    wrapper.style.borderColor = '#FF0000';
                    // console.log(elem);
                    param = false;
                    wrapper.addEventListener('click', e => {
                        wrapper.style.borderColor = '#dbdbdb';
                    });
                }
            });
        }

        function validOneFild(container, name, value) {
            const elem = container.querySelector(name);
            if (elem.value == value) {
                elem.style.borderColor = '#FF0000';
                // console.log(elem);
                param = false;
                elem.addEventListener('input', e => {
                    e.target.style.borderColor = '#dbdbdb';
                });
            }

        }

        function isHidden(className, name, value) {
            const container = document.querySelectorAll(className);
            container.forEach(elem => {

                if (!elem.classList.contains('is-hidden')) {
                    validOneFild(elem, name, value);
                }
            });
        }

        function validProduct(arr, value) {
            arr.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (elem.dataset.product == value) {

                    elem.style.borderColor = '#FF0000';
                    param = false;
                    elem.addEventListener('input', e => {

                        if (e.target.value.length >= 2) {
                            e.target.style.borderColor = '#dbdbdb';
                        } else {
                            e.target.style.borderColor = '#FF0000';
                            e.target.dataset.product = '';
                            param = false;
                        }

                    });
                }

                elem.addEventListener('input', e => {

                    if (e.target.value.length >= 2) {
                        e.target.style.borderColor = '#dbdbdb';
                    } else {
                        e.target.style.borderColor = '#FF0000';
                        e.target.dataset.product = '';
                        param = false;
                    }

                });
            });
        }

        function validDocuments(documents, urgency) {
            if (documents.value == 0) {
                documents.style.borderColor = '#FF0000';
                urgency.setAttribute('disabled', 'disabled');
                param = false;
            } else if (documents.value == 4) {
                urgency.setAttribute('disabled', 'disabled');
            } else {
                valid([urgency], '0');
                isHidden('.js-order-basis-term', 'select[name="order-address-basis-term"]', '0');
                isHidden('.js-order-basis-datetime', 'input[name="order-address-basis-date"]', '');
                isHidden('.js-order-basis-datetime', 'input[name="order-address-basis-time"]', '');
                urgency.removeAttribute('disabled');
            }



            documents.addEventListener('input', e => {
                if (documents.value == 4) {
                    urgency.style.borderColor = '#dbdbdb';
                    documents.style.borderColor = '#dbdbdb';
                    urgency.value = 0;
                    urgency.setAttribute('disabled', 'disabled');
                    const term = document.querySelector('.js-order-basis-term').classList.add('is-hidden');
                    const datetime = document.querySelector('.js-order-basis-datetime').classList.add('is-hidden');
                    // param = true;
                } else if (documents.value == 0) {
                    urgency.style.borderColor = '#dbdbdb';
                    documents.style.borderColor = '#FF0000';
                    param = false;
                    urgency.setAttribute('disabled', 'disabled');
                } else {
                    if (urgency.value == '0') {
                        urgency.style.borderColor = '#FF0000';
                    }
                    documents.style.borderColor = '#dbdbdb';
                    urgency.removeAttribute('disabled');
                    param = false;
                }
            })

            urgency.addEventListener('input', e => {
                if (urgency.value == 0) {
                    urgency.style.borderColor = '#FF0000';
                    param = false;
                } else {
                    urgency.style.borderColor = '#dbdbdb';
                }
            })
        }

        function validWT(daels) {
            daels.forEach(dael => {
                const wt = dael.querySelector('input[name="order-address-basis-legal-entity-dael-wt"]');
                const unit = dael.querySelector('select[name="order-address-basis-legal-entity-dael-unit"]');

                if (unit.value == 0) {
                    unit.style.borderColor = '#FF0000';
                    param = false;
                } else if (unit.value == 2) {
                    if (wt.value == '') {
                        wt.style.borderColor = '#FF0000';
                        param = false;
                    }
                } else if (unit.value == 1) {
                    wt.style.borderColor = '#dbdbdb';
                    unit.style.borderColor = '#dbdbdb';
                    // param = true;
                }

                unit.addEventListener('input', () => {
                    if (unit.value == 0) {
                        unit.style.borderColor = '#FF0000';
                        param = false;
                    } else if (unit.value == 2) {
                        if (wt.value == '') {
                            wt.style.borderColor = '#FF0000';
                            param = false;
                        }
                    } else if (unit.value == 1) {
                        wt.style.borderColor = '#dbdbdb';
                        unit.style.borderColor = '#dbdbdb';
                        // param = true;
                    }
                })

                wt.addEventListener('input', () => {
                    if (wt.value == '' && unit.value == 2) {
                        wt.style.borderColor = '#FF0000';
                    } else {
                        wt.style.borderColor = '#dbdbdb';
                    }

                })
            })
        }

        function validSchedule(scheduleBtn) {
            if (scheduleBtn.classList.contains('schedule-err')) {
                param = false;
            }
        }

        function validPrice(arr) {
            arr.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                console.log(/[0-9]/.test(elem.value));
                if (!/[0-9]/.test(elem.value)) {

                    elem.style.borderColor = '#FF0000';
                    // console.log(elem);
                    // elem.style.zIndex = '2';
                    param = false;
                    elem.addEventListener('input', e => {
                        e.target.style.borderColor = '#dbdbdb';
                    });
                }
            });
        }







        // Статус бух
        // const statusBuh = document.querySelectorAll('select[name="staus-buh"]');
        // valid(statusBuh, '0');

        // Дата
        const clientDate = document.querySelectorAll('input[name="order-client-date"]');
        validClientData(clientDate, '');

        // Клиент
        const client = document.querySelectorAll('input[name="order-client-name"]');
        valid(client, '');

        // Тип отгрузки
        const shipment = document.querySelectorAll('select[name="order-client-type-shipment"]');
        valid(shipment, '0');

        // График платежей schedule-err
        const scheduleBtn = document.querySelector('.btn-schedule-open');
        validSchedule(scheduleBtn);

        // Адрес
        const address = document.querySelectorAll('input[name="order-address"]');
        valid(address, '+ssdfasdf');
        address.forEach(addres => {
            addres.setAttribute('disabled', 'disabled');
        })

        // Базис
        const basis = document.querySelectorAll('input[name="order-address-basis"]');
        valid(basis, '');

        // Продукт
        const product = document.querySelectorAll('input[name="order-address-basis-product"]');
        validProduct(product, '');

        // Номенклатура
        const nomenclature = document.querySelectorAll('input[name="order-address-basis-nomenclature"]');
        validProduct(nomenclature, '');

        // Объем
        const volumes = document.querySelectorAll('.js-volum');

        volumes.forEach(volume => {
            const volumCh = volume.querySelector('.js-volume-checkbox');
            if (volumCh.checked) {
                const volumeMin = volume.querySelectorAll('input[name="order-address-basis-volume-min"]');
                valid(volumeMin, '');
                const volumeMax = volume.querySelectorAll('input[name="order-address-basis-volume-max"]');
                valid(volumeMax, '');
            } else {
                const volumeMin = volume.querySelectorAll('input[name="order-address-basis-volume-min"]');
                valid(volumeMin, '');
            }
        });

        // Доставка
        const basisValue = document.querySelectorAll('input[name="order-address-basis-value"]');
        valid(basisValue, '+ssdfasdf');

        const basisUnit = document.querySelectorAll('select[name="order-address-basis-unit"]');
        valid(basisUnit, '+ssdfasdf');

        // Документы
        // const documents = document.querySelectorAll('select[name="order-address-basis-document"]');
        // valid(documents, '0');

        // Срочность
        // const urgency = document.querySelectorAll('select[name="order-address-basis-urgency"]');
        // valid(urgency, '0');
        // isHidden('.js-order-basis-term', 'select[name="order-address-basis-term"]', '0');
        // isHidden('.js-order-basis-datetime', 'input[name="order-address-basis-date"]', '');
        // isHidden('.js-order-basis-datetime', 'input[name="order-address-basis-time"]', '');
        const documents = document.querySelector('select[name="order-address-basis-document"]');
        const urgency = document.querySelector('select[name="order-address-basis-urgency"]');
        validDocuments(documents, urgency);

        // Юридическое лицо
        const le = document.querySelectorAll('select[name="order-address-basis-legal-entity"]');
        valid(le, '');

        // Объем
        const volue = document.querySelectorAll('input[name="order-address-basis-legal-entity-dael-volume"]');
        valid(volue, '');

        // Вес
        // const wt = document.querySelectorAll('input[name="order-address-basis-legal-entity-dael-wt"]');
        // valid(wt, '');

        // Цена
        const price = document.querySelectorAll('input[name="order-address-basis-legal-entity-dael-price"]');
        validPrice(price);

        // const dealUnit = document.querySelectorAll('select[name="order-address-basis-legal-entity-dael-unit"]');
        // valid(dealUnit, '0');

        const daels = document.querySelectorAll('.dael');
        validWT(daels);

        // Тип оплаты
        const paymentType = document.querySelectorAll('select[name="order-address-basis-legal-entity-dael-payment-type"]');
        valid(paymentType, '0');
        isHidden('.js-order-dael-date', 'input[name="order-address-basis-legal-entity-dael-date"]', '');
        isHidden('.js-order-dael-dey', 'input[name="order-address-basis-legal-entity-dael-number-of-days"]', '0');

        // Отстрочка сдвиг
        const offsetPayment = document.querySelectorAll('.offset-payment');

        offsetPayment.forEach(offset => {

            if (!offset.classList.contains('is-hidden')) {

                const input = offset.querySelector('input[name="schedule-row-offset-payment"]');
                console.log(input.value);
                if (input.value == '0' || input.value == '' || Number(input.value) < 0) {
                    input.style.borderColor = '#FF0000';
                    // console.log(elem);
                    param = false;
                    input.addEventListener('input', e => {
                        e.target.style.borderColor = '#dbdbdb';
                    });
                }
            }
        })

        const dataBasis = validationDateBasis();
        if (param == true && dataBasis == false) param = dataBasis;

        const typeShipment = validationTypeShipment();
        if (param == true && typeShipment == false) param = typeShipment;

        const checkPrice = checkingPrice();
        if (param == true && checkPrice == false) param = checkPrice;

        return param;

    }

    function validationReservation() {
        let param = true;
        // Валидация поля
        function valid(arr, value) {
            arr.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (elem.value == value) {

                    elem.style.borderColor = '#FF0000';
                    // elem.style.zIndex = '2';
                    // console.log(elem);
                    param = false;
                    elem.addEventListener('input', e => {
                        e.target.style.borderColor = '#dbdbdb';
                    });
                }
            });
        }

        function validClientData(arr, value) {
            arr.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (elem.value == value) {
                    const wrapper = document.querySelector('.datetimepicker-dummy-wrapper');
                    wrapper.style.borderColor = '#FF0000';
                    // console.log(elem);
                    param = false;
                    wrapper.addEventListener('click', e => {
                        wrapper.style.borderColor = '#dbdbdb';
                    });
                }
            });
        }

        function validOneFild(container, name, value) {
            const elem = container.querySelector(name);
            elem.style.borderColor = '#dbdbdb';
            if (elem.value == value) {
                elem.style.borderColor = '#FF0000';
                // console.log(elem);
                param = false;
                elem.addEventListener('input', e => {
                    e.target.style.borderColor = '#dbdbdb';
                });
            }

        }

        function isHidden(className, name, value) {
            const container = document.querySelectorAll(className);
            container.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (!elem.classList.contains('is-hidden')) {
                    validOneFild(elem, name, value);
                }
            });
        }

        function validProduct(arr, value) {
            arr.forEach(elem => {
                elem.style.borderColor = '#dbdbdb';
                if (elem.dataset.product == value) {

                    elem.style.borderColor = '#FF0000';
                    param = false;
                    elem.addEventListener('input', e => {

                        if (e.target.value.length >= 2) {
                            e.target.style.borderColor = '#dbdbdb';
                        } else {
                            e.target.style.borderColor = '#FF0000';
                            e.target.dataset.product = '';
                            param = false;
                        }

                    });
                }

                elem.addEventListener('input', e => {

                    if (e.target.value.length >= 2) {
                        e.target.style.borderColor = '#dbdbdb';
                    } else {
                        e.target.style.borderColor = '#FF0000';
                        e.target.dataset.product = '';
                        param = false;
                    }

                });
            });
        }

        // Статус бух
        // const statusBuh = document.querySelectorAll('select[name="staus-buh"]');
        // valid(statusBuh, '0');

        // Дата
        const clientDate = document.querySelectorAll('input[name="order-client-date"]');
        validClientData(clientDate, '');

        // Клиент
        const client = document.querySelectorAll('input[name="order-client-name"]');
        valid(client, '');

        // Тип отгрузки
        const shipment = document.querySelectorAll('select[name="order-client-type-shipment"]');
        valid(shipment, '0');

        // Адрес
        const address = document.querySelectorAll('input[name="order-address"]');
        valid(address, '+ssdfasdf');

        // Базис
        const basis = document.querySelectorAll('input[name="order-address-basis"]');
        valid(basis, '');

        // Продукт
        const product = document.querySelectorAll('input[name="order-address-basis-product"]');
        validProduct(product, '');

        // Номенклатура
        const nomenclature = document.querySelectorAll('input[name="order-address-basis-nomenclature"]');
        validProduct(nomenclature, '+ssdfasdf');

        // Объем
        const volumes = document.querySelectorAll('.js-volum');

        volumes.forEach(volume => {
            const volumCh = volume.querySelector('.js-volume-checkbox');
            if (volumCh.checked) {
                const volumeMin = volume.querySelectorAll('input[name="order-address-basis-volume-min"]');
                valid(volumeMin, '');
                const volumeMax = volume.querySelectorAll('input[name="order-address-basis-volume-max"]');
                valid(volumeMax, '');
            } else {
                const volumeMin = volume.querySelectorAll('input[name="order-address-basis-volume-min"]');
                valid(volumeMin, '');
            }
        });

        // Доставка
        const basisValue = document.querySelectorAll('input[name="order-address-basis-value"]');
        valid(basisValue, '+ssdfasdf');

        const basisUnit = document.querySelectorAll('select[name="order-address-basis-unit"]');
        valid(basisUnit, '+ssdfasdf');

        // Документы
        const documents = document.querySelectorAll('select[name="order-address-basis-document"]');
        valid(documents, '+ssdfasdf');

        // Срочность
        const urgency = document.querySelectorAll('select[name="order-address-basis-urgency"]');
        valid(urgency, '+ssdfasdf');
        isHidden('.js-order-basis-term', 'select[name="order-address-basis-term"]', '+ssdfasdf');
        isHidden('.js-order-basis-datetime', 'input[name="order-address-basis-date"]', '+ssdfasdf');
        isHidden('.js-order-basis-datetime', 'input[name="order-address-basis-time"]', '+ssdfasdf');

        // Юридическое лицо
        const le = document.querySelectorAll('select[name="order-address-basis-legal-entity"]');
        valid(le, '+ssdfasdf');

        // Объем
        const volue = document.querySelectorAll('input[name="order-address-basis-legal-entity-dael-volume"]');
        valid(volue, '+ssdfasdf');

        // Вес
        const wt = document.querySelectorAll('input[name="order-address-basis-legal-entity-dael-wt"]');
        valid(wt, '+ssdfasdf');

        // Цена
        const price = document.querySelectorAll('input[name="order-address-basis-legal-entity-dael-price"]');
        valid(price, '+ssdfasdf');

        const dealUnit = document.querySelectorAll('select[name="order-address-basis-legal-entity-dael-unit"]');
        valid(dealUnit, '+ssdfasdf');

        // Тип оплаты
        const paymentType = document.querySelectorAll('select[name="order-address-basis-legal-entity-dael-payment-type"]');
        valid(paymentType, '+ssdfasdf');
        isHidden('.js-order-dael-date', 'input[name="order-address-basis-legal-entity-dael-date"]', '+ssdfasdf');
        isHidden('.js-order-dael-dey', 'input[name="order-address-basis-legal-entity-dael-number-of-days"]', '+ssdfasdf');
        param = validationDateBasis();
        return param;

    }

    function validVal() {
        const t = document.querySelector('select[name="order-client-type-shipment"]').value;
        const to = document.querySelector('.js-type-order').dataset.typeOrder;
        // console.log(t); validationReservation()

        if (to === '1') {
            return validationReservation();
        } else {
            if (t === '1' || t === '2') {
                return validation2();
            } else {
                return validation();
            }
        }
    }

    // Валидация ГП
    function validationSchedule() {

        // Кнопка сохранить график платежей
        // function saveSchedule() {
        //     const btnScheduleClose = document.querySelector('.btn-schedule-close');
        //     btnScheduleClose.addEventListener('click', () => {
        //         const btnScheduleOpen = document.querySelector('.btn-schedule-open');
        //         btnScheduleOpen.classList.remove('schedule-err');
        //     })
        // }

        // Редактирование заказа
        function editOrder() {
            const leArr = document.querySelectorAll('select[name="order-address-basis-legal-entity"]');

            if (leArr) {
                leArr.forEach(el => {
                    el.addEventListener('change', () => {
                        const btnScheduleOpen = document.querySelector('.btn-schedule-open');
                        btnScheduleOpen.classList.add('schedule-err');
                    })
                })
            }
        }

        editOrder();
        // saveSchedule();
    }



    function daelsVolume() {

        if (document.querySelector('.js-type-order').dataset.typeOrder === '1') {
            return true;
        }

        const basises = document.querySelectorAll('.basis');
        let param = true;

        function sumCounter(basis) {
            const volume = basis.querySelectorAll('input[name="order-address-basis-legal-entity-dael-volume"]');
            let sum = 0;
            volume.forEach(e => {
                // console.log(e.value);
                sum += Number(e.value.replace(',', '.'));
            });
            return sum;
        }

        for (let i = 0; i < basises.length; i++) {
            const basis = basises[i];
            const checkBox = basis.querySelector('.js-volume-checkbox');
            const min = Number(basis.querySelector('input[name="order-address-basis-volume-min"]').value);
            const max = Number(basis.querySelector('input[name="order-address-basis-volume-max"]').value);
            const dealSum = sumCounter(basis);

            // console.log(min, max, dealSum);

            if (checkBox.checked) {
                if (dealSum >= min && dealSum <= max) {
                    console.log('1');
                    param = true;
                } else {
                    // alert('Объем в базисе не совпадает с суммой объемов в сделках');
                    console.log('2');
                    param = false;
                }
            } else if (dealSum >= (min * 0.9) && dealSum <= (min * 1.1)) {
                console.log('3');
                param = true;
            } else {
                console.log('4');
                // alert('Объем в базисе не совпадает с суммой объемов в сделках');
                param = false;
            }

            if (!param) {
                alert('Объем в базисе не совпадает с суммой объемов в сделках');
                break;
            }
        }

        return param;
    }

    // БЛОКИРОВКА/РАЗБЛОКИРОВКА ПОЛЕЙ В ЗАЯВКЕ
    // Блокировка полей в заявке
    function lockFields() {
        const statusArchive = document.querySelector('.status-archive');
        const order = document.querySelector('.order');
        const fields = document.querySelectorAll('.order input');
        const selected = document.querySelectorAll('.order select');
        const calendar = document.querySelectorAll('.datetimepicker-dummy-wrapper');
        const comments = document.querySelectorAll('textarea');
        const btnCalculate = document.querySelector('.js-btn-calculate-density');
        const buttons = document.querySelectorAll('.order .button');
        const btnOrders = document.querySelector('.js-order');
        const btnReservation = document.querySelector('.js-reservation');


        calendar.forEach(c => {
            c.classList.add('disabled');
        })

        btnCalculate.classList.add('disabled');
        btnOrders.classList.add('disabled');
        btnReservation.classList.add('disabled');

        comments.forEach(comment => {
            comment.classList.add('disabled');
        })

        fields.forEach(field => {
            if (field.type == 'checkbox' || 'radio') {
                field.setAttribute('disabled', 'disabled');
            }
            field.classList.add('disabled');
        })

        selected.forEach(select => {
            select.classList.add('disabled');
        })

        buttons.forEach(button => {
            if (!button.classList.contains('js-btn-unlock')) {
                button.classList.add('disabled');
            }
        })
        // if (statusArchive) {

        // }
        // console.log('OK');
    }

    // Разблокировка полей
    function unlockFields() {
        // const statusArchive = document.querySelector('.status-archive');
        const order = document.querySelector('.order');
        const fields = document.querySelectorAll('.order input');
        const selected = document.querySelectorAll('.order select');
        const calendar = document.querySelectorAll('.datetimepicker-dummy-wrapper');
        const comments = document.querySelectorAll('textarea');
        const btnCalculate = document.querySelector('.js-btn-calculate-density');
        const buttons = document.querySelectorAll('.order .button');
        const btnScheduleOpen = document.querySelector('.btn-schedule-open');
        const stausBuh = document.querySelector('.js-status-buh select');
        const btnOrders = document.querySelector('.js-order');
        const btnReservation = document.querySelector('.js-reservation');

        // btnScheduleOpen.classList.add('schedule-err');
        stausBuh.classList.remove('disabled');

        // statusArchive.remove();
        calendar.forEach(c => {
            c.classList.remove('disabled');
        })

        btnCalculate.classList.remove('disabled');
        btnOrders.classList.remove('disabled');
        btnReservation.classList.remove('disabled');

        comments.forEach(comment => {
            comment.classList.remove('disabled');
        })

        fields.forEach(field => {
            if (field.type == 'checkbox' || 'radio') {
                field.removeAttribute('disabled');
            }
            field.classList.remove('disabled');
        })

        selected.forEach(select => {
            select.classList.remove('disabled');
        })

        buttons.forEach(button => {
            button.classList.remove('disabled');
        })
    }

    // ФУНКЦИИ ВСТАВКИ ЭЛЕМЕНТОВ В ЗАЯВКУ

    // Вставка элемента input
    function insertInput(options) {

        let dataAttribute = '';
        let checked = '';
        let valueDate = options.value;
        let value = options.value.replace('.', ',');

        if (options.value == 0 && options.name != 'order-address-basis-value') {
            value = '';
        }

        if (options.dataAttribute) {
            options.dataAttribute.forEach(item => {
                dataAttribute += `${item.name}="${item.value}"`;
            });
        }

        if (options.checked == 'true') {
            checked = 'checked';
        }

        if (options.type === 'date') {
            const date = valueDate.split('.');
            value = `${date[2]}-${date[1]}-${date[0]}`;

        }

        const input = `<input
                            ${dataAttribute}
                            name="${options.name}"
                            value="${value}"
                            type="${options.type}"
                            class="${options.class}"
                            placeholder="${options.placeholder}"
                            ${checked}
                       >`;
        return input;
    }

    // Вставка элемента textarea
    function insertTextarea(options, rows) {

        let dataAttribute = '';

        if (options.dataAttribute) {
            options.dataAttribute.forEach(item => {
                dataAttribute += `${item.name}="${item.value}"`;
            });
        }

        const textarea = `<textarea rows="${rows}"
                            ${dataAttribute}
                            name="${options.name}"
                            class="${options.class}"
                            placeholder="${options.placeholder}"
                        >${options.value}</textarea>`;
        return textarea;
    }

    // Вставка элемента section
    function insertSelect(options) {
        const values = options.values;
        let option = '';
        let disabled;

        if (options.disabled) {
            disabled = `disabled = ${options.disabled}`;
        }

        for (let i = 0; i < values.length; i++) {
            if (values[i]) {
                // console.log(values[i].value, options.value);
                if (values[i].value == options.value) {
                    option += `<option selected value="${values[i].value}">${values[i].lable}</option>`;
                } else {
                    option += `<option value="${values[i].value}">${values[i].lable}</option>`;
                }
            }
        }

        const select = `<select
                            ${disabled}
                            name="${options.name}"
                            class="${options.class}">
                            ${option}
                        </select>`;
        return select;
    }

    function insertSelectNoValue(options) {
        const value = options.value;
        let option = `<option value="${value}">${value}</option>`;

        const select = `<select
                            name="${options.name}"
                            class="${options.class}">
                            ${option}
                        </select>`;
        return select;
    }

    function insertSelectLE(options) {
        const valueName = options.valueName;
        const valueCode = options.valueCode;
        let option = `<option value="${valueCode}">${valueName}</option>`;

        const select = `<select
                            name="${options.name}"
                            class="${options.class}">
                            ${option}
                        </select>`;
        return select;
    }

    // Функции вставки элементов адрес, базис, ЮЛ, сделка
    function insertElement(className, obj, point, callback) {
        const containers = document.querySelectorAll('.' + className);
        const container = containers[containers.length - 1];
        const element = callback(obj);
        container.insertAdjacentHTML(point, element);
    }

    // Функции вставки элемента radio
    function insertRadio(options) {
        const radioElementes = options.radio;
        const radioValue = options.value;
        const radioName = Math.random();
        let radio = '';

        for (let i = 0; i < radioElementes.length; i++) {
            // console.log(radioElementes[i].checked);
            if (radioElementes[i].checked === true) {
                // console.log(radioElementes[i].checked);
                if (radioValue === 'true') {
                    radio += `<label class="${radioElementes[i].labelClass}">
                          <input type="radio" name="${radioName}" checked>
                          ${radioElementes[i].labelName}
                      </label>`;
                } else {
                    radio += `<label class="${radioElementes[i].labelClass}">
                          <input type="radio" name="${radioName}">
                          ${radioElementes[i].labelName}
                      </label>`;
                }
            } else {
                if (radioValue === 'false') {
                    radio += `<label class="${radioElementes[i].labelClass}">
                          <input type="radio" name="${radioName}" checked>
                          ${radioElementes[i].labelName}
                      </label>`;
                } else {
                    radio += `<label class="${radioElementes[i].labelClass}">
                          <input type="radio" name="${radioName}">
                          ${radioElementes[i].labelName}
                      </label>`;
                }

            }

        }

        const radioContainer = `<div class="${options.containerClass}">
                                    ${radio}
                                </div>`;

        return radioContainer;

    }

    // ФУНКЦИИ ВОЗВРАЩАЮЩИЕ ГОТОВЫЙ ШАБЛОН БЛОКА ДЛЯ ВСТАВКИ НА СТРАНИЦУ
    // Устанавливает архивная заявка или нет
    function getElementArchive(obj) {
        if (obj.archieved == false) {
            return `<p class="control has-text-right">
                        <a class="button is-white js-btn-unlock">
                            <span class="icon is-small">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </span>
                        </a>
                    </p>`;
        } else if (obj.archieved == true) {
            return `<div class="status-archive">
                        <span class="badge has-text-white">Заявка в архиве</span>
                    </div>`;
        }
    }

    // Статус бух disabled="disabled
    function getElementStatusBuh(obj) {
        return `${insertSelect({
            'name': 'staus-buh',
            'disabled': `${obj.allow_edit_logistic ? '' : 'disabled'}`,
            'class': 'width-100 input-order',
            'values': [
                { value: 1, lable: 'Ожидает' },
                { value: 5, lable: 'Отмена' },
                { value: 6, lable: 'Не согласована' },
                { value: 2, lable: 'Согласован' },
                { value: 3, lable: 'Отправлен' },
                { value: 4, lable: 'Подписан' },
                { value: 7, lable: 'Возвращен' },
            ],
            'value': `${obj.status_buh}`
        })}`;
    }

    // Возвращает блок переключатель типа заявка/бронь
    function getElemTypeOrder(obj) {
        let btnActiveOrder = '';
        let btnActiveReservation = '';

        if (obj.type_order === 1) {
            btnActiveOrder = 'is-outlined-brand';
        } else if (obj.type_order === 2) {
            btnActiveReservation = 'is-outlined-brand';
        }

        return `<div data-type-order="${obj.type_order}" class="buttons has-addons is-align-items-center js-type-order">
                    <a class="button is-info is-uppercase has-text-weight-bold btn-orders js-order btn-brand ${btnActiveOrder}">
                        <span class="js-order">Заявка</span>
                    </a>
                    <a class="button is-info is-uppercase has-text-weight-bold btn-orders js-reservation btn-brand ${btnActiveReservation}">
                        <span class="js-reservation">Бронь</span>
                    </a>
                </div>`;
    }

    // Возвращает блок ордер
    function getElemOrder(obj) {
        return `<form data-date="${obj.date}"
                      data-time="${obj.time}"
                      data-number="${obj.number}"
                      data-author="${obj.author}"
                      data-type="${obj.type_order}"
                      data-archieved="${obj.archieved}"
                      data-status-buh="${obj.status_buh}"
                      data-status-logistic="${obj.status_logistic}"
                      class="order">

                    <div class="client">

                        <div class="address-container">



                        </div>
                        <a class="is-hidden button is-info is-uppercase has-text-weight-bold btn-orders js-modal-trigger btn-schedule-open ml-1 mt-1" data-target="payment-schedule" aria-haspopup="true">Условия оплаты</a>

                        <div class="column is-5 p-0 mb-100px">

                            <div id="payment-schedule" class="mb-6" style="max-width: 500px;">
                            <!--  <div class="modal-background"></div> -->
                                <div class="">

                                <header class="modal-card-head">
                                    <p class="modal-card-title">Условия оплаты</p>
                                    <div class="tags are-medium">
                                        <span class="tag is-danger is-hidden make-changes">Внесите изменения</span>
                                    </div>
                                </header>

                                <section class="modal-card-body">


                                </section>

                                <footer class="modal-card-foot is-justify-content-flex-end mb-50px is-hidden">
                                    <a class="button is-info has-text-white is-uppercase has-text-weight-bold btn-schedule-cancel btn-orders">Отмена</a>
                                    <a class="button is-info has-text-white is-uppercase has-text-weight-bold btn-schedule-close btn-orders">Сохранить</a>
                                </footer>

                            </div>
                        </div>

                    </div>
                </form>`;
    }

    // Возвращает блок клиент
    function getElemClient(obj) {
        return `<div class="columns is-mobile is-gapless is-multiline client-panel">
                    <div class="buttons btn-slider-container">
                        <a class="btn-slider is-info has-text-white is-uppercase btn-prev ml-5 btn-orders">
                            <i class="fa fa-chevron-left" aria-hidden="true"></i>
                        </a>
                        <div class="slider-dots">

                        </div>
                        <a class="btn-slider is-info has-text-white is-uppercase btn-next btn-orders">
                            <i class="fa fa-chevron-right" aria-hidden="true"></i>
                        </a>
                    </div>

                <div class="columns is-mobile is-gapless is-multiline order-header">
                    <div class="column is-12 mb-5">
                        ${getElementArchive(obj)}
                    </div>

                    <div class="column is-8-tablet is-12-mobile mb-5">
                        <div class="field mr-2">
                            <label class="label">Дата</label>
                            <div class="control">
                                ${insertInput({
            name: 'order-client-date',
            value: '',
            type: 'date',
            class: 'input js-type-date-is-range input-order',
            placeholder: '',
            dataAttribute: [
                {
                    'name': 'data-start-date',
                    'value': `${obj.date_order.date_start}`
                },
                {
                    'name': 'data-end-date',
                    'value': `${obj.date_order.date_end}`
                },
                {
                    'name': 'autocomplete',
                    'value': 'off'
                }
            ]
        })}
                            </div>
                        </div>
                    </div>

                    <div class="column is-4-tablet is-12-mobile mb-5">
                        <div class="field mr-2">
                            <label class="label">Статус логистический</label>
                            <div class="control">
                                <div class="select width-100">
                                    ${insertSelect({
            'name': 'order-client-status-logistic',
            'disabled': `${obj.allow_edit_logistic ? '' : 'disabled'}`,
            'class': 'width-100 input-order',
            'values': [
                { value: 1, lable: 'Не отгружена' },
                { value: 2, lable: 'Отгружена' },
                { value: 3, lable: 'Отменен' },
            ],
            'value': `${obj.status_logistic}`
        })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="field mr-2 mb-5">
                            <label class="label">Клиент</label>
                            <div class="control">
                                <div class="droplist-wrapper-partner">
                                    ${insertInput({
            name: 'order-client-name',
            value: `${obj.client.name_client}`,
            type: 'text',
            class: 'input input-order',
            placeholder: '',
            dataAttribute: [
                {
                    'name': 'data-code-client',
                    'value': `${obj.client.code_client}`
                },
                {
                    'name': 'autocomplete',
                    'value': 'off'
                }
            ]
        })}
                                    <div class="droplist is-hidden">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column is-2">
                        <div class="field mr-2">
                            <label class="label">Тип</label>
                            <div class="control">
                                ${insertInput({
            name: 'order-client-type',
            value: `${obj.client.type_client}`,
            type: 'text',
            class: 'input input-order',
            placeholder: ''
        })}
                            </div>
                        </div>
                    </div>

                    <div class="column is-4">
                        <div class="field mr-2">
                            <label class="label">Тип отгрузки</label>
                            <div class="control">
                                <div class="select width-100">
                                    ${insertSelect({
            'name': 'order-client-type-shipment',
            'class': 'width-100 input input-order',
            'values': [
                { value: 0, lable: '-' },
                { value: 2, lable: 'Самовывоз' },
                { value: 4, lable: 'Самовывоз СК' },
                { value: 3, lable: 'Доставка' },
                { value: 5, lable: 'С доставкой' },
                { value: 1, lable: 'Перемещение' },
                { value: 6, lable: 'ЖД' },
            ],
            'value': `${obj.type_operation}`
        })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column is-6 is-6-mobile">
                        <!-- Поле Документы -->
                        <div class="field mr-2 mb-5">
                            <label class="label">Документы</label>
                            <p class="control">
                                <span class="select width-100">
                                    ${insertSelect({
            'name': 'order-address-basis-document',
            'class': 'width-100 input-order',
            'values': [
                { value: 0, lable: '-' },
                { value: 1, lable: 'Документы' },
                { value: 2, lable: 'Документы + счет' },
                { value: 3, lable: 'Счет' },
                { value: 4, lable: 'Без документов' },
            ],
            'value': `${obj.documents.type_docs}`
        })}
                                </span>
                            </p>
                        </div>

                    </div>

                    <div class="column is-6 is-6-mobile js-order-basis-urgency-container">
                        <!-- Поле Срочность -->

                        <div class="field">
                            <label class="label">Срочность</label>
                            <p class="control">
                                <span class="select width-100">
                                    ${insertSelect({
            'name': 'order-address-basis-urgency',
            'class': 'width-100 js-order-basis-urgency input-order',
            'values': [
                { value: 0, lable: '-' },
                { value: 1, lable: 'Крайне срочно' },
                { value: 2, lable: 'Срочно в течение' },
                { value: 3, lable: 'До' },
                { value: 4, lable: 'В течение дня' },
            ],
            'value': `${obj.documents.urgency_docs}`
        })}
                                </span>
                            </p>
                        </div>

                    </div>

                    <div class="column is-6 is-4-mobile js-order-basis-term is-hidden">
                        <!-- Поле Срочность -->
                        <label class="label">Срок</label>
                        <div class="field">
                            <p class="control">
                                <span class="select width-100">
                                    ${insertSelect({
            'name': 'order-address-basis-term',
            'class': 'width-100 input-order',
            'values': [
                { value: 0, lable: '-' },
                { value: 1, lable: '30 минут' },
                { value: 2, lable: 'Час' },
                { value: 3, lable: '2 часа' },
                { value: 4, lable: 'До конца рабочего дня' },
                { value: 5, lable: 'Утром следующего дня' },
            ],
            'value': `${obj.documents.urgency_in_due_docs}`
        })}
                                </span>
                            </p>
                        </div>

                    </div>

                    <div class="column is-12 is-4-mobile js-order-basis-datetime is-hidden">
                        <!-- Поле До -->
                        <label class="label">До</label>
                        <div class="is-flex is-justify-content-space-between">
                            <div class="field has-addons width-100 pr-4px">
                                <p class="control width-100">
                                    ${insertInput({
            'name': 'order-address-basis-date',
            'value': `${obj.documents.urgency_until_docs.date}`,
            'class': 'input input-order',
            'type': 'date',
            'placeholder': '',
        })}
                                </p>
                            </div>
                            <div class="field width-100 pl-4px">
                                <p class="control width-100">
                                    ${insertInput({
            'name': 'order-address-basis-time',
            'value': `${obj.documents.urgency_until_docs.time}`,
            'class': 'input input-order',
            'type': 'time',
            'placeholder': '',
        })}
                                </p>
                            </div>
                        </div>

                    </div>

                    <div class="column is-12">
                    <!-- Комментарий -->
                        <div class="field">
                            <label class="label mt-2">Комментарий</label>
                            <div class="control width-100 is-widescreen">
                                ${insertTextarea({
            'name': 'order-address-basis-comment',
            'value': `${obj.commentary}`,
            'class': 'textarea input-order',
            'placeholder': '',
        }, 2)}
                            </div>
                        </div>
                    </div>



                    </div>

                </div>
                </div>`;
    }

    // Возвращает блок адресс
    function getElemAddress(obj) {
        return `<div class="address">

                    <!-- Кнопки добавить удалить адрес -->
                    <div class="field has-addons position-r5-t0">
                        <p class="control mr-3">
                            <!-- Кнопка удалить адрес -->
                            <a class="button is-white js-del-address">
                                <span class="icon ">
                                    <i class="fa fa-minus-square-o fa-lg " aria-hidden="true"></i>
                                </span>
                            </a>
                        </p>
                        <p class="control">
                            <!-- Кнопка добавить адрес -->
                            <a class="button is-white js-add-new-address">
                                <!-- <span class="js-add-new-address">Адрес</span> -->
                                <span class="icon is-small js-add-new-address">
                                    <i class="fa fa-plus-square-o js-add-new-address" aria-hidden="true"></i>
                                </span>
                            </a>
                        </p>
                    </div>

                    <div class="field px-15px border-box">
                        <label class="label">Адрес</label>

                        <div class="control is-flex width-res">
                            <div class="select width-100">
                                ${insertSelectLE({
            'name': 'order-address-select',
            'valueName': `${obj.name_address}`,
            'valueCode': `${obj.name_address}`,
            'class': 'width-100 input-order',
        })}
                            </div>

                            <a class="button is-lite-gray ml-3 js-modal-trigger" data-target="add-new-addres" aria-haspopup="true">
                                Новый
                            </a>

                        </div>

                    </div>

                    <!-- Базис контейнер -->
                    <div class="basis-container">

                        <!-- Базис -->


                    </div>

                </div>`;
    }

    // Возвращает блок базис
    function getElemBasis(obj) {
        return `<div id="" class="basis">

                    <!-- Шаблон базис начало -->
                    <div class="field basis-panel">
                        <label class="label">Базис</label>
                        <div class="control is-flex is-justify-content-space-between">
                            <div class="droplist-wrapper">
                                ${insertInput({
            'name': 'order-address-basis',
            'value': `${obj.basis.name_basis}`,
            'class': 'input',
            'type': 'text',
            'placeholder': '',
            'dataAttribute': [
                {
                    'name': 'autocomplete',
                    'value': 'off'
                }
            ]
        })}
                                <div class="droplist is-hidden">
                                </div>
                            </div>
                            <div class="field is-flex">
                                <p class="control ml-3">
                                    <!-- Кнопка удалить адрес -->
                                    <a class="button is-lite-gray js-btn-basis-del">
                                        <span class="icon">
                                            <i class="fa fa-minus-square-o fa-lg" aria-hidden="true"></i>
                                        </span>
                                    </a>
                                </p>
                                <p class="control ml-3">
                                    <!-- Кнопка добавить адрес -->
                                    <a class="button is-lite-gray js-add-new-basis">
                                        <!-- <span class="js-add-new-basis">Базис</span> -->
                                        <span class="icon is-small js-add-new-basis">
                                            <i class="fa fa-plus-square-o js-add-new-basis" aria-hidden="true"></i>
                                        </span>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="columns is-mobile is-variable is-1 is-multiline">

                        <div class="column is-12 js-basis-date-container">
                            <!-- Дата базиса -->
                            <label class="label">Дата базиса</label>
                            <label class="checkbox is-flex mb-3">
                                <input type="checkbox" class="mr-2 js-basis-date-checkbox" name="">
                                Использовать в спецификации
                            </label>
                            <div class="field is-align-items-end js-basis-date-range">
                                <p class="control width-100">
                                    <input type="date" name="basis-date-range" class="input input-order">
                                </p>
                            </div>
                        </div>




                        <div class="column is-6 is-6-mobile">
                            <!-- Поле продукт -->
                            <div class="field">
                                <label class="label">Продукт</label>
                                <div class="control">
                                    <div class="droplist-wrapper-product">
                                        ${insertInput({
            name: 'order-address-basis-product',
            value: `${obj.product.name_product}`,
            type: 'text',
            class: 'input input-order',
            placeholder: '',
            dataAttribute: [
                {
                    'name': 'data-product',
                    'value': `${obj.product.code_product}`
                },
                {
                    'name': 'autocomplete',
                    'value': 'off'
                }
            ]
        })}
                                        <div class="droplist is-hidden">
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="column is-6 is-6-mobile">
                            <!-- Поле номенклатура -->
                            <label class="label">Номенклатура</label>
                            <div class="field">
                                <div class="control">
                                    <div class="droplist-wrapper-nomenclature">
                                        ${insertInput({
            name: 'order-address-basis-nomenclature',
            value: `${obj.nomenclature.name_nomenclature}`,
            type: 'text',
            class: 'input input-order',
            placeholder: '',
            dataAttribute: [
                {
                    'name': 'data-product',
                    'value': `${obj.nomenclature.code_nomenclature}`
                },
                {
                    'name': 'autocomplete',
                    'value': 'off'
                }
            ]
        })}
                                        <div class="droplist is-hidden">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="column is-6 js-volum">
                            <!-- Поле объем -->
                            <label class="label">Объем</label>
                            <label class="checkbox is-flex mb-3">
                                ${insertInput({
            'name': 'order-address-basis-volume-range',
            'value': `${obj.basis.name_basis}`,
            'class': 'mr-2 js-volume-checkbox',
            'type': 'checkbox',
            'placeholder': '',
            'checked': `${obj.volume.range_volume}`
        })}
                                Диапазон
                            </label>
                            <div class="field has-addons is-align-items-end">
                                <p class="control width-100 js-volume-min">
                                    ${insertInput({
            'name': 'order-address-basis-volume-min',
            'value': `${obj.volume.start_volume}`,
            'class': 'input js-order-basis-volume-min input-order',
            'type': 'text',
            'placeholder': '-',
        })}
                                </p>
                                <p class="control width-100 js-volume-max is-hidden">
                                    ${insertInput({
            'name': 'order-address-basis-volume-max',
            'value': `${obj.volume.end_volume}`,
            'class': 'input input-order',
            'type': 'text',
            'placeholder': 'Максимум',
        })}
                                </p>
                                <p class="control">
                                    <a class="button is-static js-button-volume">
                                        Литр
                                    </a>
                                </p>
                            </div>

                        </div>

                        <div class="column is-6 is-6-mobile">
                            <!-- Поле доставка -->
                            <label class="label">Доставка</label>
                            ${insertRadio({
            containerClass: 'control mb-2 js-order-address-basis-nds',
            value: `${obj.delivery.NDS_delivery}`,
            radio: [
                {
                    'labelClass': 'radio',
                    'labelName': 'C НДС',
                    'checked': true
                },
                {
                    'labelClass': 'radio',
                    'labelName': 'Без НДС',
                    'checked': false
                }
            ]
        })}
                            <div class="field has-addons">
                                <p class="control width-100">
                                    ${insertInput({
            'name': 'order-address-basis-value',
            'value': `${obj.delivery.cost_delivery}`,
            'class': 'input input-order',
            'type': 'text',
            'placeholder': '',
        })}
                                </p>
                                <p class="control">
                                    <span class="select">
                                        ${insertSelect({
            'name': 'order-address-basis-unit',
            'class': 'input-order',
            'values': [
                { value: 1, lable: 'руб/л' },
                { value: 2, lable: 'руб/т' },
                { value: 3, lable: 'руб' },
            ],
            'value': `${obj.delivery.cost_type_delivery}`
        })}
                                    </span>
                                </p>
                            </div>

                        </div>





                    </div>
                    <!-- Шаблон базис конец -->

                    <!-- ЮЛ контейнер -->
                    <div class="legal-entity-container">

                        <!-- Кнопка добавить Юр. лицо -->
                        <a class="button is-white js-add-new-legal-entity position-r0-b-10">
                            <span class="js-add-new-legal-entity">Юр. лицо</span>
                            <span class="icon is-small js-add-new-legal-entity">
                                <i class="fa fa-plus-square-o js-add-new-legal-entity" aria-hidden="true"></i>
                            </span>
                        </a>

                        <!-- Юридическое лицо -->

                    </div>

                    <div class="column is-12">
                    <!-- Комментарий -->
                        <div class="field">
                            <label class="label mt-2">Комментарий</label>
                            <div class="control width-100 is-widescreen">
                                ${insertTextarea({
            'name': 'order-address-basis-comment',
            'value': `${obj.commentary}`,
            'class': 'textarea input-order',
            'placeholder': '',
        }, 1)}
                            </div>
                        </div>
                    </div>

                </div>`;
    }

    // Возвращает блок юридическое лицо
    function getElemEL(obj) {
        return `<div class="legal-entity">

                    <!-- Шаблон ЮЛ начало -->
                    <hr>

                    <div class="field">
                        <label class="label">Юридическое лицо</label>
                        <div class="control is-flex">
                            <span class="select width-100">
                                ${insertSelectLE({
            'name': 'order-address-basis-legal-entity',
            'valueName': `${obj.counteragent.name_counteragent}`,
            'valueCode': `${obj.counteragent.code_counteragent}`,
            'class': 'width-100 input-order',
        })}
                            </span>
                        </div>
                    </div>

                    <!-- Удалить ЮЛ -->
                    <a class="button is-white position-r0-t10 js-btn-le-del">
                        <span class="icon">
                            <i class="fa fa-minus-square-o fa-lg" aria-hidden="true"></i>
                        </span>
                    </a>

                    <div class="columns is-mobile is-multiline is-variable is-1 mt-4">

                        <div class="column is-6-mobile is-3-tablet">
                            <label class="label">Объем, л.</label>
                            <div class="field has-addons">
                                <p class="control width-100">
                                    ${insertInput({
            name: 'order-address-basis-legal-entity-dael-volume',
            value: `${obj.volume}`,
            type: 'text',
            class: 'input input-order',
            placeholder: ''
        })}
                                </p>
                            </div>
                        </div>

                        <div class="column is-6-mobile is-2-tablet">
                            <label class="label">Вес, тн.</label>
                            <div class="field has-addons">
                                <p class="control width-100">
                                    ${insertInput({
            name: 'order-address-basis-legal-entity-dael-wt',
            value: `${obj.weight}`,
            type: 'text',
            class: 'input input-order',
            placeholder: ''
        })}
                                </p>
                            </div>
                        </div>

                        <div class="column is-6-mobile is-3-tablet">
                            <label class="label">Плотность</label>
                            <div class="field has-addons">
                                <div class="control">
                                    <a class="button is-lite-gray js-btn-calculate-density btn-orders">
                                        <i class="fa fa-arrow-left js-btn-calculate-density" aria-hidden="true"></i>
                                    </a>
                                </div>
                                <div class="control">
                                    <input class="input order-address-basis-legal-entity-dael-density input-order" type="text">
                                </div>
                            </div>
                        </div>

                        <div class="column is-6-mobile is-4-tablet">

                            <label class="label">Цена</label>
                            <div class="field has-addons">
                                <p class="control width-100">
                                    ${insertInput({
            name: 'order-address-basis-legal-entity-dael-price',
            value: `${obj.cost}`,
            type: 'text',
            class: 'input input-order',
            placeholder: ''
        })}
                                </p>
                                <p class="control">
                                    <span class="select">
                                        ${insertSelect({
            'name': 'order-address-basis-legal-entity-dael-unit',
            'class': 'input-order',
            'values': [
                { value: 2, lable: 'руб/т' },
                { value: 1, lable: 'руб/л' },
            ],
            'value': `${obj.type_cost}`
        })}
                                    </span>
                                </p>
                            </div>

                        </div>

                    </div>

                    <!-- Шаблон ЮЛ Конец -->
                </div>`;
    }

    // Возвращает блок сделка
    function getElemDael(obj) {
        return `<div class="dael">

                    <a class="button is-white position-r0-t0 js-del-dael">
                        <span class="icon">
                            <i class="fa fa-minus-square-o fa-lg" aria-hidden="true"></i>
                        </span>
                    </a>



                </div>`;
    }

    // ФУНКЦИИ УСТАНОВКИ ПОЛЕЙ В ЗАЯВКЕ
    // Установка полей в базисе в разделе документы
    function settingDocumentMargins() {
        const block = document.querySelector('.client');
        const urgency = block.querySelector('.js-order-basis-urgency'),
            term = block.querySelector('.js-order-basis-term'),
            datetime = block.querySelector('.js-order-basis-datetime');

        if (urgency.value === '2') {
            term.classList.remove('is-hidden');
            datetime.classList.add('is-hidden');
        } else if (urgency.value === '3') {
            datetime.classList.remove('is-hidden');
            term.classList.add('is-hidden');
        } else {
            term.classList.add('is-hidden');
            datetime.classList.add('is-hidden');
        }

        urgency.addEventListener('change', (e) => {
            if (urgency.value === '2') {
                term.classList.remove('is-hidden');
                datetime.classList.add('is-hidden');
            } else if (urgency.value === '3') {
                datetime.classList.remove('is-hidden');
                term.classList.add('is-hidden');
            } else {
                term.classList.add('is-hidden');
                datetime.classList.add('is-hidden');
            }
        });
    }

    // Установка полей в базисе в разделе документы
    function settingVolumeMargins(block) {
        const volumeCheckbox = block.querySelector('.js-volume-checkbox'),
            volumeMin = block.querySelector('.js-volume-min'),
            volumeMax = block.querySelector('.js-volume-max');

        if (volumeCheckbox.checked) {
            volumeMax.classList.remove('is-hidden');
            volumeMin.childNodes[1].setAttribute('placeholder', 'Минимум');
        } else {
            volumeMax.classList.add('is-hidden');
            volumeMin.childNodes[1].setAttribute('placeholder', '-');
        }


        volumeCheckbox.addEventListener('change', e => {
            if (volumeCheckbox.checked) {
                volumeMax.classList.remove('is-hidden');
                volumeMin.childNodes[1].setAttribute('placeholder', 'Минимум');
                // validation();
                validVal();
            } else {
                volumeMax.classList.add('is-hidden');
                volumeMin.childNodes[1].setAttribute('placeholder', '-');
                volumeMax.childNodes[1].value = '';
                // validation();
                validVal();
            }
        });
    }

    // Установка полей в сделке
    function settingDaelMargins(block) {
        const typePayment = block.querySelector('.js-order-dael-payment-type');
        const date = block.querySelector('.js-order-dael-date');
        const dey = block.querySelector('.js-order-dael-dey');
        // console.log(typePayment.value, date, dey);


        if (typePayment.value == '1' || typePayment.value == '4') {
            date.classList.remove('is-hidden');
            dey.classList.add('is-hidden');
        } else if (typePayment.value == '5') {
            dey.classList.remove('is-hidden');
            date.classList.add('is-hidden');
        } else {
            date.classList.add('is-hidden');
            dey.classList.add('is-hidden');
        }

        typePayment.addEventListener('change', e => {
            if (typePayment.value == '1' || typePayment.value == '4') {
                date.classList.remove('is-hidden');
                dey.classList.add('is-hidden');
            } else if (typePayment.value == '5') {
                dey.classList.remove('is-hidden');
                date.classList.add('is-hidden');
            } else {
                date.classList.add('is-hidden');
                dey.classList.add('is-hidden');
            }
        });
    }

    // Возврат последнего контейнера блока
    function getBlockContainer(className) {
        const array = document.querySelectorAll('.' + className);
        const lastElement = array[array.length - 1];
        return lastElement;
    }

    // Получаем условия оплаты по ЮЛ в ГП
    function getPaymentTerms(classTarget, classElements, el) {
        const buttons = el.querySelectorAll(classElements);
        let type;

        buttons.forEach(btn => {
            if (btn.classList.contains(classTarget)) {
                type = Number(btn.dataset.type);
            }
        })

        return type;
    }

    // Добавляем к числу разряды и преобразуем его в строку
    function divideNumberByPieces(x, delimiter) {
        const str = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter || " ")
        console.log(str.replace(".", ","));
        return str.replace(".", ",");
    }

    // Преобразуем строку в число
    function trimSpace(str) {
        let newStr = '';
        str = str.replace(",", ".");
        console.log(str.length);
        for (let i = 0; i < str.length; i++) {
            // console.log(str[i]);
            if (str[i] != ' ') {
                newStr = newStr + str[i];
            }
        }
        // console.log(newStr);
        return newStr;
    }

    // Валидация поля дата в ГП
    function validationDateSchedule(e) {
        if (e.target.name === 'schedule-row-date-payment') {
            console.log('Валидация поля дата в ГП');

            function getDateOrder() {
                const orderClientDate = document.querySelector('input[name="order-client-date"]').value.split('-');
                const [dayA, monthA, yearA,] = orderClientDate[0].split('.').map(Number);
                const dateStart = new Date(yearA, monthA - 1, dayA);
                const [dayB, monthB, yearB,] = orderClientDate[1].split('.').map(Number);
                const dateEnd = new Date(yearB, monthB - 1, dayB);
                console.log(dateStart, dateEnd);
                return { 'dateStart': dateStart, 'dateEnd': dateEnd };
            }

            // getDateOrder();

            const orderDateStart = getDateOrder().dateStart;
            const orderDateEnd = getDateOrder().dateEnd;
            const company = document.querySelectorAll('.schedule-company');
            console.log(company);
            let dates = [];

            for (const payment of company) {
                const sumActive = payment.querySelector('.btn-sum').classList.contains('btn-brand');
                console.log(sumActive);
                const rowsDates = payment.querySelectorAll('input[name="schedule-row-date-payment"]');
                if (sumActive) dates.push(...rowsDates);
            }

            console.log(dates);
            dates.forEach(date => {
                console.log(date.valueAsDate);
                if (date.valueAsDate) {
                    const row = date.closest('.schedule-row');
                    const type = row.querySelector('select[name="schedule-row-type-payment"]').value;
                    if (type === '1') {
                        if (date.valueAsDate > orderDateStart) {
                            date.classList.add('is-err');
                        } else {
                            date.classList.remove('is-err');
                        }
                    } else if (type === '4') {
                        const dateOrder = orderDateStart === orderDateEnd ? orderDateStart : orderDateEnd;
                        if (date.valueAsDate < dateOrder) {
                            date.classList.add('is-err');
                        } else {
                            date.classList.remove('is-err');
                        }
                    }
                }
            });
        }
    }

    document.querySelector('.js-app').addEventListener('change', validationDateSchedule);

    // КОНСТРУКТОР ЗАЯВКИ
    function orderConstructor(orderR) {
        // Вставляем контейнер для ордера

        const appData = orderR.Data.OrdersList;
        activControlPanel(appData);
        insertElement('js-type-order-container', appData, 'afterbegin', getElemTypeOrder);
        insertElement('js-status-buh', appData, 'afterbegin', getElementStatusBuh);
        insertElement('js-app', appData, 'beforeend', getElemOrder);

        // Вставляем клиента
        const clientData = orderR.Data.OrdersList;
        insertElement('client', clientData, 'afterbegin', getElemClient);
        // Активирум поля срочность
        settingDocumentMargins();

        // console.log(appData.payment_schedule[0].array_partersorder);
        if (appData.payment_schedule.length) {
            // console.log('тест', appData.payment_schedule[0].array_partersorder.length);

            if (appData.payment_schedule[0].array_partersorder.length) {
                // console.log(1);
                sessionStorage.setItem('array_partersorder', JSON.stringify(appData.payment_schedule[0].array_partersorder));
            } else {
                // console.log(0);
                sessionStorage.setItem('array_partersorder', '[{"number_partersorder":"","status_partersorder":-1,"contract":{"supply_agreement":false,"surety":false,"add_agreement_BN":false}}]');
            }

        } else {
            sessionStorage.setItem('array_partersorder', '[{"number_partersorder":"","status_partersorder":-1,"contract":{"supply_agreement":false,"surety":false,"add_agreement_BN":false}}]');
        }


        // ГРАФИК ПЛАТЕЖЕЙ
        function scheduleSet(data) {
            const scheduleData = dataGrouping(data);
            // const scheduleData = data;
            const paymentSchedulesContainer = document.querySelector('#payment-schedule .modal-card-body');
            const btnOpenPaymentSchedule = document.querySelector('.btn-schedule-open');
            const btnSavePaymentSchedule = document.querySelector('.btn-schedule-close');
            const btnСancelPaymentSchedule = document.querySelector('.btn-schedule-cancel');
            let stateSchedule;



            // Устанавливаем алерт в заявке
            function setAlert() {
                // Сборка текущих данных в графике платежей
                const paymentSchedules = document.querySelectorAll('#payment-schedule .modal-card-body .schedule-company');
                const btnOpen = document.querySelector('.btn-schedule-open');
                const alertMakeChanges = document.querySelector('.make-changes');
                let err = true;

                paymentSchedules.forEach(company => {
                    const rows = company.querySelectorAll('.schedule-row');
                    const companySum = trimSpace(company.querySelector('.schedule-company-sum').innerHTML);
                    const scheduleAlert = company.querySelector('.schedule-alert');
                    let sum = 0;

                    rows.forEach(row => {
                        const rowPercent = row.querySelector('.schedule-row-percent-col');
                        const percentRow = row.querySelector('.schedule-row-percent').value;
                        const sumRow = row.querySelector('.schedule-row-sum').value;

                        // Проверить суммы или проценты
                        if (rowPercent.classList.contains('is-hidden')) {
                            sum += Number(sumRow.replace(',', '.'));
                        } else {
                            sum += Number(companySum.replace(',', '.')) * (Number(percentRow.replace(',', '.')) / 100);
                        }

                    })

                    if (Number(companySum) === sum) {
                        // scheduleAlert.classList.add('is-hidden');
                        // btnOpen.classList.remove('schedule-err');
                        if (err) {
                            scheduleAlert.classList.add('is-hidden');
                            btnOpen.classList.remove('schedule-err');
                            // alertMakeChanges.classList.add('is-hidden');
                        } else {
                            err = false;
                        }
                    } else if (companySum > sum) {
                        scheduleAlert.classList.remove('is-hidden');
                        scheduleAlert.innerHTML = 'Распределена не вся сумма по ЮЛ';
                        btnOpen.classList.add('schedule-err');
                        err = false;
                    } else if (companySum < sum) {
                        scheduleAlert.classList.remove('is-hidden');
                        scheduleAlert.innerHTML = 'Распределено больше суммы по ЮЛ';
                        btnOpen.classList.add('schedule-err');
                        err = false;
                    }

                })

            }

            // Востанавливаем состояние графика платежей при нажатии кнопки отмены
            function scheduleCancel() {
                clearPaymentSchedules();
                renderSchedule(stateSchedule);
            }

            // Очистить график платежей
            function clearPaymentSchedules() {
                const children = paymentSchedulesContainer.querySelectorAll('.schedule');
                for (let i = 0; i < children.length; ++i) {
                    // console.log(children[i])
                    children[i].remove();
                }
            }

            // Обновление графика платежей
            function scheduleOpen() {

                // Сборка текущих данных в графике платежей
                function сollectionOfData() {
                    const paymentSchedules = document.querySelectorAll('#payment-schedule .modal-card-body .schedule-company');
                    let schedule = [];

                    paymentSchedules.forEach(company => {
                        const rows = company.querySelectorAll('.schedule-row');
                        const companySum = company.querySelector('.schedule-company-sum');
                        const item = {
                            "code_counteragent": company.querySelector('.schedule-company-title').dataset.inn,
                            "code_client": company.querySelector('.schedule-company-title').dataset.code,
                            "type_entity": getPaymentTerms('btn-brand', '.schedule-buttons .button', company),
                            "array_partersorder": company.querySelector('.notification-order').innerHTML,
                            "rows_payments": []
                        };

                        rows.forEach(r => {
                            const row = {
                                "percent": r.querySelector('.schedule-row-percent').value,
                                "summ": r.querySelector('.schedule-row-sum').value,
                                "type_payment": r.querySelector('.schedule-row-type-payment').value,
                                "date_payment": r.querySelector('.schedule-row-date-payment').value,
                                "offset_payment": r.querySelector('.schedule-row-offset-payment').value
                            }

                            item.sum += Number(row.summ);

                            item.rows_payments.push(row);
                        })

                        schedule.push(item);
                        companySum.innerHTML = item.sum;

                    })

                    // console.log(schedule);
                    return schedule;
                }

                // Собираем текущие данные в заявке
                function dataFromOrder() {
                    const legalEntity = document.querySelectorAll('.legal-entity');
                    let dataPay = [];

                    // Перебераем все ЮЛ в заявке
                    legalEntity.forEach(el => {
                        const inn = el.querySelector('select[name="order-address-basis-legal-entity"]').value;
                        // console.log(el.querySelector('select[name="order-address-basis-legal-entity"]'));
                        const daels = el.querySelectorAll('.dael');
                        const daelPrice = el.querySelector('input[name="order-address-basis-legal-entity-dael-price"]');
                        const daelVolume = el.querySelector('input[name="order-address-basis-legal-entity-dael-volume"]');
                        const daelWT = el.querySelector('input[name="order-address-basis-legal-entity-dael-wt"]');
                        const daelUnit = el.querySelector('select[name="order-address-basis-legal-entity-dael-unit"]');
                        let sum = 0;

                        if (daelUnit.value == 1) {
                            sum += Number(daelPrice.value.replace(',', '.')) * Number(daelVolume.value.replace(',', '.'));
                        } else if (daelUnit.value == 2) {
                            sum += Number(daelPrice.value.replace(',', '.')) * Number(daelWT.value.replace(',', '.'));
                            console.log(Number(daelPrice.value.replace(',', '.')) * Number(daelWT.value.replace(',', '.')), sum);
                        }


                        if (dataPay.length) {
                            let index = dataPay.findIndex(item => item.code_counteragent == inn);

                            if (index != -1) {
                                dataPay[index].sum = (Number(dataPay[index].sum) + Number(sum.toFixed(2))).toFixed(2);
                            } else if (inn) {
                                dataPay.push({
                                    "code_counteragent": inn,
                                    "code_client": document.querySelector('input[name="order-client-name"]').dataset.codeClient,
                                    "type_entity": 1,
                                    "sum": sum.toFixed(2),
                                    "rows_payments": []
                                });
                            }

                        } else if (inn) {
                            dataPay.push({
                                "code_counteragent": inn,
                                "code_client": document.querySelector('input[name="order-client-name"]').dataset.codeClient,
                                "type_entity": 1,
                                "sum": sum.toFixed(2),
                                "rows_payments": []
                            });
                        }


                    })

                    console.log(dataPay);

                    return dataPay;
                }

                // Сравниваем текущий график платежей с данными в заявке и при необходимости обновляем
                function updateData(dataSchedul, dataOrder) {
                    // Проверяем есть ли новые данные в заявке и обновляем их для графика платежей
                    if (dataSchedul.length) {
                        dataSchedul.forEach(le => {
                            // Проверяем есть ли элеменнт из ГП в данных в заявке
                            const index = dataOrder.findIndex(item => item.code_counteragent == le.code_counteragent);
                            if (index != -1) { // Элемент из графика присутствует в данных из заявке, обновляем данные заявке
                                dataOrder[index].type_entity = le.type_entity;
                                dataOrder[index].rows_payments = le.rows_payments;
                                dataOrder[index].array_partersorder = le.array_partersorder;
                            }

                        })
                    }


                    // console.log(dataOrder);

                    return dataOrder;

                }

                const paymentSchedulesContainer = document.querySelector('#payment-schedule .modal-card-body');
                let dataSchedul;
                let dataOrder;

                if (paymentSchedulesContainer.hasChildNodes()) {
                    dataSchedul = сollectionOfData();
                    dataOrder = dataFromOrder();
                    // dataOrder = setTimeout(dataFromOrder, 1000);

                    // Проверяем есть ли данные в заказе
                    const newData = updateData(dataSchedul, dataOrder);
                    stateSchedule = newData;
                    clearPaymentSchedules();
                    renderSchedule(newData);
                    setAlert();

                }

            }

            // Группировка данных
            function dataGrouping(data) {
                // console.log(data.payment_schedule);
                let schedule = data.payment_schedule;

                schedule.forEach(counteragent => counteragent.code_client = data.client.code_client);

                return schedule;

            }

            // Функции событий
            function blockBtnSava(input) {
                const paymentSchedulesContainer = document.querySelector('#payment-schedule .modal-card-body');
                const btnSavePaymentSchedule = document.querySelector('.btn-schedule-close');
                const conditions = paymentSchedulesContainer.querySelectorAll('.schedule-row-type-payment');

                for (let i = 0; i < conditions.length; i++) {
                    if (conditions[i].value == '0') {
                        btnSavePaymentSchedule.classList.add('disabled');
                        btnSavePaymentSchedule.setAttribute('disabled', 'disabled');
                        break;
                    } else {
                        btnSavePaymentSchedule.classList.remove('disabled');
                        btnSavePaymentSchedule.removeAttribute("disabled");
                    }
                }

                if (input) {
                    if (input.value == false) {
                        btnSavePaymentSchedule.classList.add('disabled');
                        btnSavePaymentSchedule.setAttribute('disabled', 'disabled');
                    } else {
                        btnSavePaymentSchedule.classList.remove('disabled');
                        btnSavePaymentSchedule.removeAttribute("disabled");
                    }
                }

            }

            // Удалить строку
            function delleteRow(e) {
                const elem = e.currentTarget;
                const company = elem.closest('.schedule-company');
                elem.parentElement.remove();
                setAlert();
                highlightingLine(company);
            }

            // Валидация поля сдвиг
            function validationOffset(e) {
                const value = e.target.value;
                let newValue = '';

                for (let ch of value) {
                    if (ch != '-' && ch != '.' && ch != ',') {
                        newValue += ch;
                    }
                }

                e.target.value = newValue;
            }

            // Подсветка сроки с остатком
            function highlightingLine(company) {
                const rows = [...company.querySelectorAll('.title-row')];
                const sumActive = company.querySelector('.btn-sum').classList.contains('btn-brand');

                rows.forEach(row => row.classList.add('is-hidden'));

                if (rows.length > 1 && sumActive) {
                    // const title = document.createElement('div');
                    rows.at(-1).classList.remove('is-hidden');
                }
            }

            // Добавить строку
            function addRow(e) {
                const elem = e.currentTarget;
                console.log(elem);
                const company = elem.closest('.schedule-company');

                let parent = elem;
                const scheduleRow = engineHTML(row, 'schedule-row'); // Получаем HTML-элемент строки
                const scheduleBtnDel = scheduleRow.querySelector('.schedule-btn-del');
                const scheduleInputPercentr = scheduleRow.querySelector('.schedule-row-percent'); // Получаем объект input проценты
                const scheduleInputSum = scheduleRow.querySelector('.schedule-row-sum'); // Получаем объект input суммы
                const inputOffset = scheduleRow.querySelector('input[name="schedule-row-offset-payment"]'); // Импут отсрочка сдвиг

                scheduleBtnDel.addEventListener('click', delleteRow);
                scheduleInputPercentr.addEventListener('change', setAlert);                  // Событие установка алерта
                scheduleInputSum.addEventListener('change', setAlert);                  // Событие установка алерта
                inputOffset.addEventListener('input', validationOffset);
                settingMargins(scheduleRow);                                           // Устанавливаем поля в строке

                while (!parent.classList.contains('schedule-company')) {
                    parent = parent.parentElement;
                }

                const btn = getPaymentBtn('btn-brand', '.schedule-buttons .button', parent);

                setValueFild(scheduleRow, parent);
                setActiveField(scheduleRow, parent);
                toggleOption(parent, btn);
                elem.parentElement.before(scheduleRow);
                setAlert();
                blockBtnSava();
                highlightingLine(company);
            }

            // Получаем активную кнопку из условий аплаты
            function getPaymentBtn(classTarget, classElements, el) {
                const buttons = el.querySelectorAll(classElements);
                let type;

                buttons.forEach(btn => {
                    if (btn.classList.contains(classTarget)) {
                        type = btn;
                    }
                })

                console.log(type);

                return type;
            }

            // Конвертируем дату из формата 1С в JS
            function dateConvertToJS(value) {
                const date = value.split('.');
                if (date.length == 1) {
                    return date[0];
                } else {
                    return `${date[2]}-${date[1]}-${date[0]}`;
                }
            }

            // Установка полей в сделке
            function settingMargins(block) {
                const typePayment = block.querySelector('.schedule-row-type-payment');
                const datePayment = block.querySelector('.date-payment');
                const offsetPayment = block.querySelector('.offset-payment');
                const disabled = block.querySelector('.disabled');
                const datePaymentRow = datePayment.querySelector('.schedule-row-date-payment');
                const offsetPaymentRow = offsetPayment.querySelector('.schedule-row-offset-payment');

                if (typePayment.value == '1' || typePayment.value == '4') {
                    datePayment.classList.remove('is-hidden');
                    offsetPayment.classList.add('is-hidden');
                    disabled.classList.add('is-hidden');
                    blockBtnSava(datePaymentRow);
                } else if (typePayment.value == '5') {
                    offsetPayment.classList.remove('is-hidden');
                    datePayment.classList.add('is-hidden');
                    disabled.classList.add('is-hidden');
                    blockBtnSava(offsetPaymentRow);
                } else {
                    datePayment.classList.add('is-hidden');
                    offsetPayment.classList.add('is-hidden');
                    disabled.classList.remove('is-hidden');
                    blockBtnSava();
                }

                datePaymentRow.addEventListener('change', e => {
                    if (!datePayment.classList.contains('is-hidden') && datePaymentRow.value == false) {
                        blockBtnSava(e.target);
                    } else {
                        blockBtnSava(e.target);
                    }
                })

                offsetPaymentRow.addEventListener('change', e => {
                    if (!offsetPayment.classList.contains('is-hidden') && offsetPaymentRow.value == false) {
                        blockBtnSava(e.target);
                    } else {
                        blockBtnSava(e.target);
                    }
                })

                typePayment.addEventListener('change', e => {
                    if (typePayment.value == '1' || typePayment.value == '4') {
                        datePayment.classList.remove('is-hidden');
                        offsetPayment.classList.add('is-hidden');
                        disabled.classList.add('is-hidden');
                        blockBtnSava(datePaymentRow);
                    } else if (typePayment.value == '5') {
                        offsetPayment.classList.remove('is-hidden');
                        datePayment.classList.add('is-hidden');
                        disabled.classList.add('is-hidden');
                        blockBtnSava(offsetPaymentRow);
                    } else {
                        datePayment.classList.add('is-hidden');
                        offsetPayment.classList.add('is-hidden');
                        disabled.classList.remove('is-hidden');
                        blockBtnSava();
                    }
                });
            }

            // Устанавливаем начальное положение чек бокса
            function setChecked(el, scheduleButtons) {
                const typeEntity = el.type_entity;
                const buttons = scheduleButtons.querySelectorAll('.button');
                buttons.forEach(btn => {
                    if (Number(btn.dataset.type) == typeEntity) {
                        btn.classList.add('btn-brand');
                    }
                })
            }

            // Установка активного поля сумма или проценты
            function setActiveField(row, el) {
                const activeBtn = getPaymentTerms('btn-brand', '.schedule-buttons .button', el);

                if (activeBtn == 2) {
                    row.querySelector('.schedule-row-sum-col').classList.remove('is-hidden');
                    row.querySelector('.schedule-row-percent-col').classList.add('is-hidden');
                } else if (activeBtn == 1 || activeBtn == 3) {
                    row.querySelector('.schedule-row-sum-col').classList.add('is-hidden');
                    row.querySelector('.schedule-row-percent-col').classList.remove('is-hidden');
                }
            }

            // Устанавка значения суммы/процентов в добавленную строку
            function setValueFild(row, el) {
                const rows = el.querySelectorAll('.schedule-row');
                const sumEL = trimSpace(el.querySelector('.schedule-company-sum').innerHTML);
                const checbox = el.querySelector('input[type="checkbox"]');
                let sumRows = 0;
                let percentRows = 0;
                let newValueForRowSum = 0;
                let newValueForRowPercent = 0;


                // Суммируем значения по в строках
                if (rows.length) {
                    rows.forEach(r => {
                        const sum = r.querySelector('.schedule-row-sum');
                        const percent = r.querySelector('.schedule-row-percent');

                        sumRows += Number(sum.value.replace(',', '.'));
                        percentRows += Number(percent.value.replace(',', '.'));

                    })
                }

                // Проверяем какое значение в строках сумма или проценты и устанавливаем значение для новой строки
                newValueForRowSum = sumEL - sumRows;
                row.querySelector('.schedule-row-sum').value = newValueForRowSum;

                newValueForRowPercent = 100 - percentRows;
                row.querySelector('.schedule-row-percent').value = newValueForRowPercent;



            }

            // скрываем/показываем опции в селекте при переключении
            function toggleOption(parent, elem) {
                const options = parent.querySelectorAll('option');
                if (elem.dataset.type == 3) {
                    console.log(options);
                    options.forEach(option => {
                        if (option.value == 1 || option.value == 4) {
                            option.classList.add('is-hidden');
                        }
                    })
                } else {
                    options.forEach(option => {
                        if (option.value == 1 || option.value == 4) {
                            option.classList.remove('is-hidden');
                        }
                    })
                }
            }

            // Меняем положение чекбокса
            function checked(e) {
                if (e.target.classList.contains('btn-type')) {
                    e.preventDefault();
                    console.log('checked(e)');

                    const elem = e.target;
                    const elemCurrent = e.currentTarget;
                    let elemActive;
                    let parent = elem;
                    const company = elem.closest('.schedule-company');



                    elemCurrent.querySelectorAll('.button').forEach(btn => {
                        if (btn.classList.contains('btn-brand')) {
                            elemActive = btn;
                            btn.classList.remove('btn-brand');
                        }
                    })

                    elem.classList.add('btn-brand');

                    while (!parent.classList.contains('schedule-company')) {
                        parent = parent.parentElement;
                    }

                    toggleOption(parent, elem);

                    if (elemActive.dataset.type != elem.dataset.type) {
                        // console.log(elemActive);
                        // console.log(elem);

                        if (elem.dataset.type == 1) {
                            parent.querySelectorAll('.schedule-row').forEach(row => {
                                const percentCol = row.querySelector('.schedule-row-percent-col');
                                const sumCol = row.querySelector('.schedule-row-sum-col');
                                const percent = percentCol.querySelector('.schedule-row-percent');
                                const sum = sumCol.querySelector('.schedule-row-sum');
                                const scheduleCompanySum = trimSpace(parent.querySelector('.schedule-company-sum').innerHTML);

                                percent.value = Math.round(Number(sum.value) / Number(scheduleCompanySum) * 100) || 0;
                                sum.value = '';

                                percentCol.classList.remove('is-hidden');
                                sumCol.classList.add('is-hidden');
                            });
                        } else if (elem.dataset.type == 2) {
                            parent.querySelectorAll('.schedule-row').forEach(row => {
                                const percentCol = row.querySelector('.schedule-row-percent-col');
                                const sumCol = row.querySelector('.schedule-row-sum-col');
                                const percent = percentCol.querySelector('.schedule-row-percent');
                                const sum = sumCol.querySelector('.schedule-row-sum');
                                const scheduleCompanySum = trimSpace(parent.querySelector('.schedule-company-sum').innerHTML);

                                if (percent.value == '' || percent.value == 0) {
                                    percent.value = (Number(sum.value) / Number(scheduleCompanySum) * 100).toFixed(2);
                                    sum.value = '';
                                } else {
                                    sum.value = (Number(scheduleCompanySum) / 100 * Number(percent.value)).toFixed(2);
                                    percent.value = '';
                                }

                                percentCol.classList.add('is-hidden');
                                sumCol.classList.remove('is-hidden');
                            });
                        } else if (elem.dataset.type == 3) {
                            const rows = parent.querySelectorAll('.schedule-row');

                            for (let i = 1; i < rows.length; i++) {
                                rows[i].remove();
                            }

                            parent.querySelectorAll('.schedule-row').forEach(row => {
                                const percentCol = row.querySelector('.schedule-row-percent-col');
                                const sumCol = row.querySelector('.schedule-row-sum-col');
                                const percent = percentCol.querySelector('.schedule-row-percent');
                                const sum = sumCol.querySelector('.schedule-row-sum');
                                const scheduleCompanySum = trimSpace(parent.querySelector('.schedule-company-sum').innerHTML);

                                percent.value = 100;
                                sum.value = '';

                                percentCol.classList.remove('is-hidden');
                                sumCol.classList.add('is-hidden');
                            });
                        }

                    }

                    parent.querySelectorAll('.schedule-row').forEach(row => {
                        const percentCol = row.querySelector('.schedule-row-percent-col');
                        const sumCol = row.querySelector('.schedule-row-sum-col');
                        const percent = percentCol.querySelector('.schedule-row-percent');
                        const sum = sumCol.querySelector('.schedule-row-sum');
                        const scheduleCompanySum = parent.querySelector('.schedule-company-sum').innerHTML;

                        // if (percentCol.classList.contains('is-hidden')) {
                        //     percent.value = '';
                        // }

                        // if (percent.value == '' || percent.value == 0) {
                        //     percent.value = Math.round(Number(sum.value) / Number(scheduleCompanySum) * 100);
                        //     sum.value = '';
                        // } else {
                        //     sum.value = Math.round(Number(scheduleCompanySum) / 100 * Number(percent.value));
                        //     percent.value = '';
                        // }

                        // percentCol.classList.toggle('is-hidden');
                        // sumCol.classList.toggle('is-hidden');
                    });

                    highlightingLine(company);
                }

            }

            // Получаем список контрагентов
            function getListCountragent(code, inn, scheduleCompanyTitle) {
                fetch(`${getURL(settings)}/GetCatalog?Name=Counteragents&ParentCode=${code}`)
                    .then(response => response.text())
                    .then(commits => {
                        let partnersList = JSON.parse(commits);
                        partnersList.Data.forEach(countragent => {
                            if (countragent.code_counteragent == inn) {
                                scheduleCompanyTitle.innerHTML = countragent.name_counteragent;
                            }
                        })
                    });
            }

            function setPartersorder(partersorder) {
                let tag = '';
                const status = ['Cтатус не выбран', 'Создан', 'Согласован', 'До-ты отправлены', 'Док-ты получены'];

                if (typeof (partersorder) == 'undefined') {
                    partersorder = '';
                }

                if (typeof (partersorder) == 'object') {
                    if (partersorder.length) {
                        partersorder.forEach(order => {
                            tag += `<span class="tag is-warning">Заказ №${order.number_partersorder} (${status[order.status_partersorder]})</span><br>`;
                        })
                    } else {
                        tag += `<span class="tag is-warning">Заказы не созданы</span><br>`;
                    }
                } else {
                    tag = partersorder;
                }

                console.log(tag);

                return tag;
            }

            // Установка приложенных документов
            function attachDocs(schedule) {
                const attachDocs = schedule.querySelector('.attach-docs');
                const supplyAgreement = attachDocs.querySelector('.supply-agreement');
                const surety = attachDocs.querySelector('.surety');
                const addAgreementBN = attachDocs.querySelector('.add_agreement_BN');
                const numberPartersorder = JSON.parse(sessionStorage.getItem('array_partersorder'))[0].status_partersorder;
                const contract = JSON.parse(sessionStorage.getItem('array_partersorder'))[0].contract;


                const inn = schedule.querySelector('.schedule-company-title').dataset.inn;
                const contragent = document.querySelector(`option[value="${inn}"]`);
                console.log(Boolean(contragent.dataset.agreement), contragent.dataset.surety, contragent.dataset.bn);

                // if (numberPartersorder == -1) {
                //     attachDocs.classList.add('is-hidden');
                // }

                if (contract.supply_agreement || contragent.dataset.agreement == 'true') {
                    supplyAgreement.classList.add('is-success');
                    supplyAgreement.classList.remove('is-danger');
                }

                if (contract.surety || contragent.dataset.surety == 'true') {
                    surety.classList.add('is-success');
                    surety.classList.remove('is-danger');
                }

                if (contract.add_agreement_BN || contragent.dataset.bn == 'true') {
                    addAgreementBN.classList.add('is-success');
                    addAgreementBN.classList.remove('is-danger');
                }

            }

            // Валидация
            function isNumber(e) {
                if (e.target.name === 'schedule-row-sum') {
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

            }

            // Изменение суммы в строке графика платежей
            function calculationBalance(e) {
                if (e.target.name === 'schedule-row-sum') {
                    console.log('calculationBalance(e)');
                    const scheduleCompany = e.target.closest('.schedule-company');
                    const scheduleCompanySumStr = scheduleCompany.querySelector('.schedule-company-sum').textContent.replace(',', '.');
                    let scheduleCompanySum = '';
                    // console.log(typeof scheduleCompanySumStr);
                    for (const ch of scheduleCompanySumStr) {
                        if (ch !== ' ') {
                            scheduleCompanySum += ch;
                        }
                        scheduleCompanySum
                    }
                    const rows = scheduleCompany.querySelectorAll('input[name="schedule-row-sum"]');
                    // console.log(scheduleCompanySumStr, Number(scheduleCompanySum), rows);

                    for (let i = 0; i < rows.length - 1; i++) {
                        console.log(rows[i].value);
                        scheduleCompanySum -= Number(rows[i].value);
                        console.log(rows[rows.length - 1].value);
                    }

                    rows[rows.length - 1].value = scheduleCompanySum;
                }
            }

            // Подписываемся на событие  изменения суммы в строке графика платежей
            paymentSchedulesContainer.addEventListener('input', calculationBalance);
            // Подписываемся на событие ввода данных в поле сумма
            paymentSchedulesContainer.addEventListener('input', isNumber);

            // Вешаем событие обновления графика платежей на кнопку открыть график платежей
            btnOpenPaymentSchedule.addEventListener('click', scheduleOpen);

            // Устанавливаем алерты на кнопку сохранить график платежей
            btnSavePaymentSchedule.addEventListener('click', setAlert);

            // Вешаем событие обновления графика платежей на кнопку закрытия график платежей
            btnСancelPaymentSchedule.addEventListener('click', scheduleCancel);

            // Рисуем график платежжей
            function renderSchedule(scheduleData) {
                // console.log(scheduleData);
                scheduleData.forEach(el => {
                    // console.log(el);
                    // Получаем шаблоны элементов
                    const schedule = engineHTML(paymentSchedules, 'schedule');                  // Получаем HTML-элемент графика платежей
                    const scheduleCompanyTitleWrap = engineHTML(company, 'schedule-company-title-wrapper'); // Получаем HTML-элемент название компании
                    const scheduleCompanySumWrap = engineHTML(sum, 'schedule-company-sum-wrapper');         // Получаем HTML-элемент контейнера с суммой
                    const scheduleBtnContainer = engineHTML(btnContainer, 'schedule-btn-container'); // Получаем HTML-элемент контейнера с кнопкой добавить
                    const scheduleCheckBox = engineHTML(checkBox, 'schedule-check-box'); // Получаем HTML-элемент контейнера с кнопкой добавить
                    const scheduleErr = engineHTML(scheduleAlert, 'schedule-alert-container'); // Получаем HTML-элемент контейнера с алертом
                    const scheduleButtons = engineHTML(buttons, 'schedule-buttons'); // Получаем HTML-элемент контейнера с группой кнопок
                    const scheduleCompanySum = scheduleCompanySumWrap.querySelector('.schedule-company-sum');        // Формируем график платежей
                    const scheduleCompanyTitle = scheduleCompanyTitleWrap.querySelector('.schedule-company-title');        // Формируем график платежей

                    // schedule.querySelector('.tag').innerHTML = JSON.stringify(el.array_partersorder);
                    schedule.querySelector('.notification-order').innerHTML = setPartersorder(el.array_partersorder);
                    // setPartersorder(el.array_partersorder);
                    // console.log(schedule.querySelector('.tag'), el);
                    // attachDocs(schedule);

                    // Устанавливаем значения в графике платежей
                    getListCountragent(el.code_client, el.code_counteragent, scheduleCompanyTitle);
                    scheduleCompanyTitle.dataset.code = el.code_client;
                    scheduleCompanyTitle.dataset.inn = el.code_counteragent;
                    scheduleCompanySum.innerHTML = divideNumberByPieces(String(el.sum));

                    // Формуруем график платежей
                    const scheduleCompany = schedule.querySelector('.schedule-company');        // Формируем график платежей
                    const scheduleCompanyHeader = scheduleCompany.querySelector('.schedule-company-header');        // Формируем график платежей
                    scheduleCompanyHeader.prepend(scheduleCompanyTitleWrap); // добавляем заголовок
                    scheduleCompanyHeader.append(scheduleCompanySumWrap);    // Добовляем сумму

                    // Устанавливаем параметры чекбокса
                    setChecked(el, scheduleButtons);
                    scheduleButtons.addEventListener('click', checked);
                    // Добавляем чекбокс в график
                    // scheduleCompany.append(scheduleCheckBox);

                    // Добавляем группу кнопок
                    scheduleCompanyHeader.before(scheduleButtons);


                    // Добавляем алерт в график
                    scheduleCompany.append(scheduleErr);

                    attachDocs(schedule);

                    el.rows_payments.forEach(r => {
                        const scheduleRow = engineHTML(row, 'schedule-row'); // Получаем HTML-элемент строки
                        // console.log(r);
                        // Устанавливаем значения в полях процент, сумма, тип оплаты
                        scheduleRow.querySelector('.schedule-row-percent').value = r.percent;
                        scheduleRow.querySelector('.schedule-row-sum').value = r.summ;
                        scheduleRow.querySelector('.schedule-row-type-payment').value = r.type_payment;
                        scheduleRow.querySelector('.schedule-row-date-payment').value = dateConvertToJS(r.date_payment);
                        scheduleRow.querySelector('.schedule-row-offset-payment').value = r.offset_payment;
                        const inputOffset = scheduleRow.querySelector('input[name="schedule-row-offset-payment"]'); // Импут отсрочка сдвиг
                        // scheduleRow.querySelector('.tag').innerHTML = r.array_partersorder;
                        // console.log(scheduleRow.querySelector('.tag'), r.array_partersorder);

                        inputOffset.addEventListener('input', validationOffset);

                        // Вешаем событие на кнопку удалить строку и добавляем строку
                        const scheduleBtnDel = scheduleRow.querySelector('.schedule-btn-del'); // Получаем объект кнопки
                        const scheduleInputPercentr = scheduleRow.querySelector('.schedule-row-percent'); // Получаем объект input проценты
                        const scheduleInputSum = scheduleRow.querySelector('.schedule-row-sum'); // Получаем объект input суммы
                        scheduleBtnDel.addEventListener('click', delleteRow);                  // Вешаем событие удалить строку
                        scheduleInputPercentr.addEventListener('change', setAlert);                  // Событие установка алерта
                        scheduleInputSum.addEventListener('change', setAlert);                  // Событие установка алерта
                        settingMargins(scheduleRow);                                           // Устанавливаем поля в строке
                        setActiveField(scheduleRow, scheduleCompany);
                        scheduleCompany.append(scheduleRow);                                   // Добавляем сроку в элемент
                    })

                    // Вешаем событие на кнопку добавить строку и добавляем кнопку в график платежей
                    const scheduleBtnAdd = scheduleBtnContainer.querySelector('.schedule-btn-add'); // Получаем объект кнопки
                    scheduleBtnAdd.addEventListener('click', addRow);   // Вешаем событие добавить строку
                    scheduleCompany.append(scheduleBtnContainer);       // Добавляем сроку в элемент

                    // Добавляем раздел компания со всеми элементами в график
                    paymentSchedulesContainer.append(schedule);

                })
            }

            // События изменения значения в цен и объемов в заявке
            const order = document.querySelector('.order');
            order.addEventListener('input', (el) => {
                const btnScheduleOpen = document.querySelector('.btn-schedule-open');
                const alertMakeChanges = document.querySelector('.make-changes');
                if (el.target.name == 'order-address-basis-legal-entity-dael-price') {
                    btnScheduleOpen.classList.add('schedule-err');
                    alertMakeChanges.classList.remove('is-hidden');
                    scheduleOpen();
                } else if (el.target.name == 'order-address-basis-legal-entity-dael-wt') {
                    btnScheduleOpen.classList.add('schedule-err');
                    alertMakeChanges.classList.remove('is-hidden');
                    scheduleOpen();
                } else if (el.target.name == 'order-address-basis-legal-entity-dael-volume') {
                    btnScheduleOpen.classList.add('schedule-err');
                    alertMakeChanges.classList.remove('is-hidden');
                    scheduleOpen();
                }
            })

            order.addEventListener('change', (el) => {
                console.log(el.target.name);
                const btnScheduleOpen = document.querySelector('.btn-schedule-open');
                const alertMakeChanges = document.querySelector('.make-changes');
                if (el.target.name == 'order-address-basis-legal-entity-dael-unit') {
                    btnScheduleOpen.classList.add('schedule-err');
                    alertMakeChanges.classList.remove('is-hidden');
                    scheduleOpen();
                } else if (el.target.name == 'order-address-basis-legal-entity') {
                    console.log(el.target.name);
                    scheduleOpen();
                }
            })

            order.addEventListener('click', el => {

                if (el.target.classList.contains('fa-minus-square-o')) {
                    scheduleOpen();
                } else if (el.target.classList.contains('js-btn-basis-del')) {
                    scheduleOpen();
                } else if (el.target.classList.contains('js-del-address')) {
                    scheduleOpen();
                } else if (el.target.classList.contains('js-btn-le-del')) {
                    scheduleOpen();
                } else if (el.target.classList.contains('js-btn-calculate-density')) {
                    scheduleOpen();
                } else if (el.target.classList.contains('droplist-item')) {
                    setTimeout(scheduleOpen, 1000);
                }
            })

            const btnScheduleClose = document.querySelector('.btn-schedule-close');
            btnScheduleClose.addEventListener('click', () => {
                const alertMakeChanges = document.querySelector('.make-changes');
                alertMakeChanges.classList.add('is-hidden');
            })

            // Сортировка графика платежей
            function sortpaymentSchedules(e) {
                if (e.target.name === 'schedule-row-type-payment' ||
                    e.target.name === 'schedule-row-offset-payment' ||
                    e.target.name === 'schedule-row-date-payment'
                ) {

                    // Сортировка массива по дате
                    function sortDate(arr) {

                        function createDate(date) {
                            if (date) {
                                const [yearA, monthA, dayA] = date.split('-').map(Number);
                                return new Date(yearA, monthA - 1, dayA);
                            } else {
                                return new Date(1, 0, 1);
                            }
                        }

                        arr.sort((a, b) => {
                            return createDate(a.date) - createDate(b.date);
                        });

                        return data;
                    }

                    // Проверка даты

                    console.log('Сортировка графика платежей');
                    const scheduleCompany = e.target.closest('.schedule-company'); // Компания
                    const sumActive = scheduleCompany.querySelector('.btn-sum').classList.contains('btn-brand'); // Статус активности кнопки
                    const rows = scheduleCompany.querySelectorAll('.schedule-row');  // Строки по ЮЛ в ГП
                    const btnContainer = scheduleCompany.querySelector('.schedule-btn-container');  // Элемент перед которым будет выполняться вставка отсортированных строк
                    let sortableArray = new Map([ // Создаем структуру данных для распечатки сортированного графика платежей
                        ['1', []],
                        ['2', []],
                        ['3', []],
                        ['4', []],
                        ['5', []],
                    ]);
                    // Проверяем включена ли кнопка распределения по сумме
                    if (sumActive) {

                        // Перебераем все строки в ГП по компании и распределяем в структуре согласно
                        // правилам сортировки
                        for (const row of rows) {
                            // Берем из строки тип оплаты от может быть от 1 до 5
                            const rowTypePayment = row.querySelector('.schedule-row-type-payment').value;
                            // console.log(rowTypePayment);
                            // Согласно условию помещаем размещаем строку в зависимости от типа оплаты
                            // в структуре согласно правилам сортировки
                            if (rowTypePayment === '1') {          // П/о на дату
                                const date = row.querySelector('input[name="schedule-row-date-payment"]').value;
                                sortableArray.get('1').push({ 'row': row, 'date': date });
                            } else if (rowTypePayment === '2') {   // П/о до отгрузки
                                sortableArray.get('2').push({ 'row': row, 'sortNumber': 2 });
                            } else if (rowTypePayment === '3') {   // По факту отгрузки
                                sortableArray.get('3').push({ 'row': row, 'sortNumber': 3 });
                            } else if (rowTypePayment === '4') {   // Отсрочка на дату
                                const date = row.querySelector('input[name="schedule-row-date-payment"]').value;
                                sortableArray.get('5').push({ 'row': row, 'date': date });
                            } else if (rowTypePayment === '5') {   // Сдвиг
                                const sortNumber = row.querySelector('input[name="schedule-row-offset-payment"]').value;
                                sortableArray.get('4').push({ 'row': row, 'sortNumber': sortNumber });
                            }
                        }

                        console.log(sortableArray);

                        // В объекте map() sortableArray сортируем массивы согласно правилам сортировки
                        for (const key of sortableArray.keys()) { // Итерируем по map(), получаем ключи
                            // По полученному ключу проверяем массив на пустоту,
                            // продолжаем работу только с не пустыми массивами
                            if (sortableArray.get(key).length) {


                                if (key === '1' || key === '5') { // Сортируем по дате
                                    sortDate(sortableArray.get(key));
                                } else if (key === '4') {
                                    sortableArray.get(key).sort((a, b) => {
                                        console.log(a, b);
                                        a.sortNumber = a.sortNumber === '' ? 0 : a.sortNumber;
                                        b.sortNumber = b.sortNumber === '' ? 0 : b.sortNumber;

                                        return a.sortNumber - b.sortNumber;
                                    });
                                }
                                // По ключу получаем массив и сортируем его
                                // sortableArray.get(key).forEach(object => {
                                //     btnContainer.before(object.row);

                                // })
                            }

                        }

                        // console.log(sortableArray);
                        // Очищаем список строк в графике платежей
                        rows.forEach(row => row.remove());

                        // Распечатываем строки списка в том порядке в котором они находятся в структуре
                        for (const key of sortableArray.keys()) { // Итерируем по map(), получаем ключи
                            // По полученному ключу проверяем массив на пустоту,
                            // продалжаем работу только с не пустыми массивами
                            if (sortableArray.get(key).length) {

                                // По ключу получаем массив и из этого массива распечатываем
                                // каждую строку графика платежжей
                                sortableArray.get(key).forEach(object => {
                                    btnContainer.before(object.row);

                                })
                            }

                        }

                    }

                    highlightingLine(scheduleCompany);

                }
            }

            paymentSchedulesContainer.addEventListener('change', sortpaymentSchedules);
            // paymentSchedulesContainer.addEventListener('input', sortpaymentSchedules);

            renderSchedule(scheduleData);
            scheduleOpen();
            document.querySelectorAll('.schedule-company').forEach(company => {
                highlightingLine(company);
            })

        }

        // scheduleSet(appData);

        const addressData = orderR.Data.OrdersList.array_addresses;
        addressData.forEach(address => {
            // Вставляем адрес
            insertElement('address-container', address, 'beforeend', getElemAddress);

            const basisData = address.array_basises;
            basisData.forEach(basis => {
                // Вставляем базис
                insertElement('basis-container', basis, 'beforeend', getElemBasis);

                const lastBasis = getBlockContainer('basis');
                // Активирум поля объем
                settingVolumeMargins(lastBasis);
                // Активирум поля срочность
                // settingDocumentMargins(lastBasis);

                // Активируем поле дата в базисе
                activeBasisDate(lastBasis, basis);



                const lpData = basis.array_counteragents;
                lpData.forEach(counteragent => {
                    // Вставляем юридическое лицо
                    insertElement('legal-entity-container', counteragent, 'beforeend', getElemEL);

                });

            });

        });

        scheduleSet(appData);



        validationSchedule();
        setPreloader('preloader');
    }

    function containerSearchAdd(element, container) {
        let parent = element;

        while (!parent.classList.contains(container)) {
            parent = parent.parentElement;
        }
        return parent;
    }

    // СОБЫТИЯ ДОБАВЛЕНИЯ/УДАЛЕНИЯ БЛОКОВ В ЗАЯВКУ
    function eventOrder(basisList) {
        const order = document.querySelector('.order');
        order.addEventListener('click', (e) => {
            // e.preventDefault();
            const el = e.target;

            const objAddress = orderR.Data.OrdersList.array_addresses[0],
                objBasis = objAddress.array_basises[0],
                objEL = objBasis.array_counteragents[0];
            // objDael = objEL.array_deals[0];

            if (el.classList.contains('js-add-new-address')) {
                const container = containerSearchAdd(el, 'address');

                container.insertAdjacentHTML('afterend', getElemAddress(objAddress));
                const newAddress = container.nextSibling;

                const basisContainer = newAddress.querySelector('.basis-container');
                basisContainer.insertAdjacentHTML('beforeend', getElemBasis(objBasis));
                const b = basisContainer.querySelector('.basis');
                settingVolumeMargins(b);
                // settingDocumentMargins(b);

                // Активация поля дата базиса
                activeBasisDate(b);

                const leContainer = basisContainer.querySelector('.legal-entity-container');
                leContainer.insertAdjacentHTML('beforeend', getElemEL(objEL));


                basisSetWidth();


                // Слайдер
                // ___________________________________________________________
                const basises = document.querySelectorAll('.basis');
                const basis = newAddress.querySelector('.basis');
                const sliderDots = document.querySelector('.slider-dots');
                let dots = sliderDots.querySelectorAll('.slider-dot');

                sliderDots.insertAdjacentHTML('beforeend', '<span class="slider-dot"></span>');
                dots.forEach(dot => {
                    dot.classList.remove('slider-dot-active');
                })

                basises.forEach(basis => {
                    basis.classList.remove('basis-active');
                })

                basis.classList.add('basis-active');

                for (let i = 0; i <= basises.length; i++) {
                    if (basises[i].classList.contains('basis-active')) {
                        dots = sliderDots.querySelectorAll('.slider-dot');
                        dots[i].classList.add('slider-dot-active');
                        break;
                    }
                }

                const position = positionTranslateX();
                const basisWidth = basisElementWidth();
                const clientWidth = clientElementWidth();
                const k = Math.floor(clientWidth / basisWidth);
                const counterBasis = basisNumberOfElements();

                if (clientWidth <= 940) {
                    if (counterBasis <= k && positionTranslateX() == 0) {
                        // console.log(0);
                    } else if (counterBasis == k + 1 && positionTranslateX() == 0) {
                        addressContainer.style.transform = `translate3D(-${basisWidthOfAllElements() - clientElementWidth()}px, 0, 0)`;
                        // console.log(1);
                    } else {
                        addressContainer.style.transform = `translate3D(${positionTranslateX() - basisWidth}px, 0, 0)`;
                        // console.log(2);
                    }
                }

                buttonActive();

                // ___________________________________________________________

                eventAddressDel();
                eventBasisDel();
                eventELDel();
                eventDaelDel();
                dropdownActivationAddress();
                dropdownActivationBasis();
                dropdownActivationProduct();
                dropdownActivationNomenclature();
                getEL('event', newAddress);
                validVal();
                calculateDensity();
                setWidthFildsAdress();
                activeModal();
                addressSelect();
                validationSchedule();
                validationTypeShipment();
                checkingPrice();

            } else if (el.classList.contains('js-add-new-basis')) {
                const container = containerSearchAdd(el, 'basis');

                container.insertAdjacentHTML('afterend', getElemBasis(objBasis));
                const newBasis = container.nextSibling;
                settingVolumeMargins(newBasis);
                // settingDocumentMargins(newBasis);

                // Активация поля дата базиса
                activeBasisDate(newBasis);

                const leContainer = newBasis.querySelector('.legal-entity-container');
                leContainer.insertAdjacentHTML('beforeend', getElemEL(objEL));

                // const daelContainer = leContainer.querySelector('.dael-container');
                // daelContainer.insertAdjacentHTML('beforeend', getElemDael(objDael));
                // const d = daelContainer.querySelector('.dael');
                // settingDaelMargins(d);

                basisSetWidth();

                // Слайдер
                // ___________________________________________________________
                const basises = document.querySelectorAll('.basis');
                const sliderDots = document.querySelector('.slider-dots');
                let dots = sliderDots.querySelectorAll('.slider-dot');

                sliderDots.insertAdjacentHTML('beforeend', '<span class="slider-dot"></span>');
                dots.forEach(dot => {
                    dot.classList.remove('slider-dot-active');
                })

                basises.forEach(basis => {
                    basis.classList.remove('basis-active');
                })

                newBasis.classList.add('basis-active');

                for (let i = 0; i <= basises.length; i++) {
                    if (basises[i].classList.contains('basis-active')) {
                        dots = sliderDots.querySelectorAll('.slider-dot');
                        dots[i].classList.add('slider-dot-active');
                        break;
                    }
                }

                const position = positionTranslateX();
                const basisWidth = basisElementWidth();
                const clientWidth = clientElementWidth();
                const k = Math.floor(clientWidth / basisWidth);
                const counterBasis = basisNumberOfElements();

                if (clientWidth <= 940) {
                    addressContainer.style.transform = `translate3D(-${position - basisWidth}px, 0, 0)`;

                    if (counterBasis <= k && positionTranslateX() == 0) {
                        // console.log(0);
                    } else if (counterBasis == k + 1 && positionTranslateX() == 0) {
                        addressContainer.style.transform = `translate3D(-${basisWidthOfAllElements() - clientElementWidth()}px, 0, 0)`;
                        // console.log(1);
                    } else {
                        addressContainer.style.transform = `translate3D(${positionTranslateX() - basisWidth}px, 0, 0)`;
                        // console.log(2);
                    }
                }

                buttonActive();
                // ___________________________________________________________

                eventBasisDel();
                eventELDel();
                eventDaelDel();
                dropdownActivationBasis();
                dropdownActivationProduct();
                dropdownActivationNomenclature();
                getEL('event', newBasis);
                validVal();
                calculateDensity();
                validationSchedule();
                checkingPrice();

            } else if (el.classList.contains('js-add-new-legal-entity')) {
                const container = containerSearchAdd(el, 'legal-entity-container');

                container.insertAdjacentHTML('beforeend', getElemEL(objEL));
                const ELs = container.querySelectorAll('.legal-entity');
                const EL = ELs[ELs.length - 1];

                // const daelContainer = EL.querySelector('.dael-container');
                // daelContainer.insertAdjacentHTML('beforeend', getElemDael(objDael));
                // const daels = daelContainer.querySelectorAll('.dael');
                // const d = daels[daels.length - 1];
                // settingDaelMargins(d);

                eventELDel();
                // eventDaelDel();
                getEL('event', EL);
                validVal();
                calculateDensity();
                validationSchedule();

            }



            const contragent = document.querySelectorAll('select[name="order-address-basis-legal-entity"]');
            contragent.forEach(e => {
                e.addEventListener('change', e => {
                    validVal();
                });
            });
        });

        // order.addEventListener('input', (el) => {
        //     const btnScheduleOpen = document.querySelector('.btn-schedule-open');
        //     if (el.target.name == 'order-address-basis-legal-entity-dael-price') {
        //         btnScheduleOpen.classList.add('schedule-err');
        //     } else if (el.target.name == 'order-address-basis-legal-entity-dael-wt') {
        //         btnScheduleOpen.classList.add('schedule-err');
        //     } else if (el.target.name == 'order-address-basis-legal-entity-dael-volume') {
        //         btnScheduleOpen.classList.add('schedule-err');
        //     }
        // })

        const addressContainer = document.querySelector('.address-container');
        const offSet = 0;
        let counterBasis = basisNumberOfElements();
        let basisWidth;
        let clientWidth;
        let basisAllWidt;
        let translateX;
        let translateStart;
        let translateEnd;

        const container = document.querySelector('.address-container');
        let moveX, clickX = 0, step = 0;

        container.style.transform = `translate3D(-${offSet}px, 0px, 0px)`;

        // container.addEventListener('pointermove', (e) => {

        //     moveX = e.offsetX;                         // Значие координаты курсора по оси X
        //     counterBasis = basisNumberOfElements();    // Количество элементов базис
        //     basisWidth = basisElementWidth();          // Ширина элемента базис
        //     clientWidth = clientElementWidth();        // Ширина элемента клиент
        //     basisAllWidt = basisWidthOfAllElements();  // Ширина всех элементов базис
        //     // console.log(positionTranslateX());         // Выводим в консоль текущее положение трансформации по оси X

        //     // Если ширина всех элементов базис больше ширины клиента и координата клика не равна 0
        //     if (basisAllWidt > clientWidth && clickX != 0) {
        //         step = positionTranslateX();            // Текущее положение трансформации по оси X

        //         // Вычисляем новое знаечение трансформации по оси Х
        //         // Если координата по осии Х минус координата клика по осии Х плюс текущее положении трансформации по оси Х больше 0
        //         if (moveX - clickX + Number(step) > -offSet) {
        //             translateX = 0;                             // Ставим ограничение движения в право
        //         } else {
        //             translateX = moveX - clickX + Number(step);
        //         }

        //         // Если новое значение трансформации больше чем ширина клиента минус ширина всех базисов
        //         // Ставим ограничение движения в лево
        //         if (translateX > clientWidth - basisAllWidt) {
        //             container.style.transform = `translate3D(${translateX}px, 0, 0)`;
        //         }

        //     }
        // });

        // container.addEventListener('pointerdown', (e) => {
        //     translateStart = positionTranslateX();
        //     clickX = e.offsetX;
        //     container.style.transition = 'none';
        // });

        // container.addEventListener('pointerup', (e) => {

        //     container.style.transition = '0.1s';

        //     if (clientWidth < 900) {
        //         basisWidth = basisElementWidth();          // Ширина элемента базис
        //         translateEnd = positionTranslateX();       // Значение трансформации в момент отпускания клавишиы мыши

        //         if (translateStart > translateEnd) {
        //             translateX = translateStart - basisWidth;
        //             container.style.transform = `translate3D(${translateX}px, 0, 0)`;
        //         } else if (translateStart < translateEnd) {
        //             translateX = translateStart + basisWidth;
        //             container.style.transform = `translate3D(${translateX}px, 0, 0)`;
        //         }
        //     }

        //     clickX = 0;
        // });

        // Возвращает текущее значение трансформ по оси X
        function positionTranslateX() {
            let regexp = /(?<=\()\d+|(?<=\()-\d+/g;
            let t = container.style.transform;
            return Number(t.match(regexp)[0]);
        }

        // Возвращает текущее колличество базисов
        function basisNumberOfElements() {
            return document.querySelectorAll('.basis').length;
        }

        // Возвращает ширину элемента базис
        function basisElementWidth() {
            try {

                return document.querySelector('.basis').offsetWidth;

            } catch (err) {

                // обработка ошибки

            }
        }

        // Возвращает сумму ширин всех элементов базис
        function basisWidthOfAllElements() {
            try {

                const width = document.querySelector('.basis').offsetWidth;
                const count = document.querySelectorAll('.basis').length;
                // return (width + 38) * count;
                return (width) * count;
            } catch (err) {

                // обработка ошибки

            }

        }

        // Возвращает ширину клиента
        function clientElementWidth() {
            return document.querySelector('.client').offsetWidth;
        }

        // Устанавливает ширину элементам .basis и .basis-container
        function basisSetWidth() {
            const cW = clientElementWidth();
            const b = document.querySelectorAll('.basis');

            if (cW < 900) {
                b.forEach(e => {
                    e.style.width = cW + 'px';
                    // e.style.width = '100%';
                });
                // console.log(cW);
            } else {
                b.forEach(e => {
                    e.style.width = `500px`;
                });
            }

        }

        basisSetWidth();

        // СЛАЙДЕР

        function buttonActive() {
            const next = document.querySelector('.btn-next');
            const prev = document.querySelector('.btn-prev');
            const dots = document.querySelectorAll('.slider-dot');

            if (dots[0].classList.contains('slider-dot-active')) {
                prev.classList.add('disabled');
                next.classList.remove('disabled');
            } else if (dots[dots.length - 1].classList.contains('slider-dot-active')) {
                next.classList.add('disabled');
                prev.classList.remove('disabled');
            } else {
                next.classList.remove('disabled');
                prev.classList.remove('disabled');
            }

        }

        function slider() {
            const prev = document.querySelector('.btn-prev');
            const next = document.querySelector('.btn-next');
            const container = document.querySelector('.address-container');

            container.style.transition = '0.3s';

            // Устанавливает точки, активируем первую точку как активную
            function dots() {
                const basises = document.querySelectorAll('.basis');
                const sliderDots = document.querySelector('.slider-dots');

                basises.forEach(basis => {
                    sliderDots.insertAdjacentHTML('beforeend', '<span class="slider-dot"></span>');
                })

                const firstDot = sliderDots.querySelector('.slider-dot');
                firstDot.classList.add('slider-dot-active');

                // <span class="slider-dot slider-dot-active"></span>
                // <span class="slider-dot"></span>
            }

            // Устанавливаем первый базис активным
            function basis() {
                const basises = document.querySelectorAll('.basis');
                basises[0].classList.add('basis-active');
            }

            // Делаем базисс активным и активируем соответствующую ему точку
            // next - слайдер двигается вперед
            // prev - слайдер двигается назад
            function activeDot(step) {
                const movement = step;
                let basises = document.querySelectorAll('.basis');
                const dots = document.querySelectorAll('.slider-dot');

                if (movement == 'next') {

                    for (let i = 0; i < basises.length; ++i) {
                        if (basises[i].classList.contains('basis-active')) {
                            basises = document.querySelectorAll('.basis');
                            if (i + 1 < basises.length) {
                                basises[i].classList.remove('basis-active');
                                dots[i].classList.remove('slider-dot-active');
                                basises[i + 1].classList.add('basis-active');
                                dots[i + 1].classList.add('slider-dot-active');
                                break;
                            }
                        }
                    }

                } else if (movement == 'prev') {

                    for (let i = 0; i < basises.length; ++i) {
                        if (basises[i].classList.contains('basis-active')) {
                            console.log(i - 1);
                            if (i - 1 >= 0) {
                                if (i - 1 <= basises.length) {
                                    basises[i].classList.remove('basis-active');
                                    basises[i - 1].classList.add('basis-active');
                                    dots[i].classList.remove('slider-dot-active');
                                    dots[i - 1].classList.add('slider-dot-active');
                                    break;
                                }
                                break;
                            }
                        }
                    }
                }

            }

            dots();  // Устанавливаем точки
            basis(); // Первому базису ставим пометку "активный"
            buttonActive();

            // Кнопка движение слайдера в перед
            next.addEventListener('click', () => {
                const position = positionTranslateX();
                const basisWidth = basisElementWidth();
                const clientWidth = clientElementWidth();
                const k = Math.floor(clientWidth / basisWidth) * clientWidth
                let newPosition = position - basisWidth;

                if (newPosition >= (0 - (basisWidthOfAllElements() - clientWidth))) {
                    activeDot('next');
                    container.style.transform = `translate3D(${newPosition}px, 0, 0)`;
                } else {
                    activeDot('next');
                    container.style.transform = `translate3D(-${basisWidthOfAllElements() - clientWidth}px, 0, 0)`;
                }

                buttonActive();

            })

            // Кнопка движение слайдера назад
            prev.addEventListener('click', () => {
                const position = positionTranslateX();
                const basisWidth = basisElementWidth();
                const newPosition = position + basisWidth;

                if (newPosition <= 0) {
                    activeDot('prev');
                    container.style.transform = `translate3D(${newPosition}px, 0, 0)`;
                } else {
                    activeDot('prev');
                    container.style.transform = `translate3D(${0}px, 0, 0)`;
                }

                buttonActive();
            })
        }

        slider();

        // Календарь

        const options = {
            color: 'link',
            isRange: true,
            lang: 'ru',
            dateFormat: 'dd.MM.yyyy',
            // displayMode: 'dialog'
            showHeader: 'false'
        };

        // Initialize all input of date type.
        const calendars = new bulmaCalendar('input[name="order-client-date"]', options);

        calendars.on('select', date => {
            // calendars._ui.dummy.wrapper.classList.remove('is-err');
            setTimeout(validationDateBasis, 1000);
        })

        calendars._ui.dummy.clear.addEventListener('click', () => {
            // calendars._ui.dummy.wrapper.classList.add('is-err');
            setTimeout(validationDateBasis, 1000);
        })

        // const calendarBasis = bulmaCalendar.attach('[name="basis-date"]', {
        //     color: 'link',
        //     isRange: false,
        //     lang: 'ru',
        //     dateFormat: 'dd.MM.yyyy',
        // });

        // const calendarBasisRange = bulmaCalendar.attach('[name="basis-date-range"]', {
        //     color: 'link',
        //     isRange: true,
        //     lang: 'ru',
        //     dateFormat: 'dd.MM.yyyy',
        // });

        // Обновляем список точек в навигации
        function setDot() {
            const basises = document.querySelectorAll('.basis');
            const sliderDots = document.querySelector('.slider-dots');

            let dots = document.querySelectorAll('.slider-dot');

            dots.forEach(dot => {
                dot.remove();
            })

            basises.forEach(basis => {
                basis.classList.remove('basis-active');
                sliderDots.insertAdjacentHTML('beforeend', '<span class="slider-dot"></span>');
            })
            basises[0].classList.add('basis-active');
            sliderDots.querySelector('.slider-dot').classList.add('slider-dot-active');
        }



        // Удалить адрес
        function eventAddressDel() {
            const btnAddressDel = document.querySelectorAll('.js-del-address');

            btnAddressDel.forEach(btn => {
                btn.addEventListener('click', e => {
                    let parent = e.target;
                    const addressCoun = document.querySelectorAll('.address').length;
                    const container = containerSearchAdd(parent, 'address');

                    if (addressCoun > 1) {
                        const position = positionTranslateX();
                        const basisWidth = basisElementWidth();
                        const clientWidth = clientElementWidth();
                        const k = Math.floor(clientWidth / basisWidth);
                        const counterBasis = basisNumberOfElements();
                        const client = document.querySelector('.address-container');
                        let newPosition = position - basisWidth;
                        const basises = document.querySelectorAll('.basis');

                        console.log(basises, container);
                        if (counterBasis == k + 1) {
                            console.log(0);
                            client.style.transform = `translate3D(${0}px, 0px, 0px)`;
                        } else if (counterBasis > k) {
                            console.log(e);
                            // client.style.transform = `translate3D(-${basisWidthOfAllElements() - basisWidth * (clientWidth/basisWidth)}px, 0px, 0px)`;
                            client.style.transform = `translate3D(${0}px, 0px, 0px)`;
                        }

                        container.remove();
                        setDot();
                        buttonActive();

                    }


                });
            });
        }

        eventAddressDel();

        // Удалить базис
        function eventBasisDel() {
            const btnBasisDel = document.querySelectorAll('.js-btn-basis-del');

            btnBasisDel.forEach(btn => {
                btn.addEventListener('click', e => {
                    let parent = e.target;

                    const address = containerSearchAdd(parent, 'address');
                    const basisCoun = address.querySelectorAll('.basis').length;
                    const container = containerSearchAdd(parent, 'basis');


                    if (basisCoun > 1) {
                        container.remove();
                        if (basisWidthOfAllElements() < clientElementWidth()) {
                            const client = document.querySelector('.address-container');
                            client.style.transform = `translate3D(0px, 0px, 0px)`;
                            setDot();
                        } else {
                            const client = document.querySelector('.address-container');
                            // client.style.transform = `translate3D(-${basisWidthOfAllElements() - clientElementWidth()}px, 0px, 0px)`;
                            client.style.transform = `translate3D(0px, 0px, 0px)`;
                            setDot();
                        }
                    }

                    buttonActive();

                });
            });
        }

        eventBasisDel();

        // Удалить ЮЛ
        function eventELDel() {
            const btnBasisDel = document.querySelectorAll('.js-btn-le-del');

            btnBasisDel.forEach(btn => {
                btn.addEventListener('click', e => {
                    let parent = e.target;
                    const basis = containerSearchAdd(parent, 'basis');
                    const LECoun = basis.querySelectorAll('.legal-entity').length;
                    const container = containerSearchAdd(parent, 'legal-entity');

                    if (LECoun > 1) {
                        container.remove();
                    }

                });
            });
        }

        eventELDel();

        // Удалить сделку
        function eventDaelDel() {
            const btnBasisDel = document.querySelectorAll('.js-del-dael');

            btnBasisDel.forEach(btn => {
                btn.addEventListener('click', e => {
                    let parent = e.target;
                    const le = containerSearchAdd(parent, 'legal-entity');
                    const daelCoun = le.querySelectorAll('.dael').length;
                    const container = containerSearchAdd(parent, 'dael');

                    if (daelCoun > 1) {
                        container.remove();
                    }

                });
            });
        }

        eventDaelDel();


        // ПОИСК ЗНАЧЕНИЯ ДЛЯ ПОДСТАНОВКИ
        // ЮЛ
        function clearEl() {
            const options = document.querySelectorAll('select[name="order-address-basis-legal-entity"]');
            options.forEach(e => {
                e.style.borderColor = '#dbdbdb';
                let o = e.querySelectorAll('option');
                o.forEach(e => {
                    if (e.value) {
                        e.remove();
                    }
                });
                validVal();
            });
        }

        function getEL(param, elem) {
            const code = document.querySelector('input[name="order-client-name"]').dataset.codeClient;
            // console.log(code);
            fetch(`${getURL(settings)}/GetCatalog?Name=Counteragents&ParentCode=${code}`)
                .then(response => response.text())
                .then(commits => {
                    let partnersList = JSON.parse(commits);
                    let partnersArray = partnersList.Data;
                    let options;

                    console.log(partnersArray);

                    if (param === 'document') {
                        options = document.querySelectorAll('select[name="order-address-basis-legal-entity"]');
                    } else if (param === 'event') {
                        options = options = elem.querySelectorAll('select[name="order-address-basis-legal-entity"]');
                    }


                    options.forEach(item => {
                        item.insertAdjacentHTML('beforeend', `<option value="del"></option>`);
                    })

                    // Наполняем список значениями для выбора
                    options.forEach(item => {
                        // console.log(item);
                        if (typeof (partnersArray) == 'object') {
                            partnersArray.forEach(el => {
                                // console.log(item);
                                if (item.value != el.code_counteragent) {
                                    item.insertAdjacentHTML('beforeend', `<option value="${el.code_counteragent}"
                                                                                  data-bn="${el.default_contract.add_agreement_BN}"
                                                                                  data-agreement="${el.default_contract.supply_agreement}"
                                                                                  data-surety="${el.default_contract.surety}">${el.name_counteragent}</option>`);
                                }
                            });
                        }
                    });
                });
        }

        getEL('document');

        // Адрес
        function addNewAddres() {
            const btn = document.querySelector('.btn-new-address');
            const input = document.querySelector('.input-new-address');

            function sendNewAddres(address, code) {
                console.log(1);
                fetch(`${getURL(settings)}/newaddress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        "code_client": code,
                        "address_client": address
                    })
                }).then(response => response.text())
                    .then(commits => {
                        console.log(commits);
                        if (JSON.parse(commits).Status === 'Error') {
                            alert(JSON.parse(commits).Status);
                        }

                        // if (JSON.parse(commits).Status === 'OK') {
                        //     document.location = 'orders';
                        // }
                    });
            }

            btn.addEventListener('click', (e) => {
                if (confirm('Сохранить новый адрес?')) {
                    if (input.value) {
                        const fieldsAddress = document.querySelectorAll('select[name="order-address-select"]');
                        const code = document.querySelector('input[name="order-client-name"]').dataset.codeClient;

                        fieldsAddress.forEach(select => {
                            select.insertAdjacentHTML('beforeend', `<option value="${input.value}">${input.value}</option>`);
                        })
                        console.log(code);
                        sendNewAddres(input.value, code);

                        input.value = '';
                    }
                }
            })

        }

        addNewAddres();


        function addressSelect(status) {
            const fieldsAddress = document.querySelectorAll('select[name="order-address-select"]');
            const codeClient = document.querySelector('input[name="order-client-name"]').dataset.codeClient;



            if (codeClient != '') {
                fieldsAddress.forEach(select => {

                    fetch(`${getURL(settings)}/GetCatalogAddress?Name=Addresses&ParentCode=${codeClient}`)
                        .then(response => response.text())
                        .then(commits => {
                            let addressList = JSON.parse(commits);
                            let addressArray = addressList.Data;
                            // console.log(addressArray);

                            // select.querySelectorAll('option').forEach(option => {
                            //     option.remove();
                            // })



                            const options = select.value;
                            // console.log()
                            if (status) {
                                select.textContent = '';
                                select.insertAdjacentHTML('beforeend', `<option value=""></option>`);
                            }

                            // if (typeof(partnersArray) == 'object') {
                            addressArray.forEach(addres => {
                                if (options != addres) {
                                    select.insertAdjacentHTML('beforeend', `<option value="${addres}">${addres}</option>`);
                                }
                            });
                            // }

                        });
                });
            }

        }

        addressSelect();

        function dropdownActivationAddress() {
            const wrappers = document.querySelectorAll('.droplist-wrapper-address');
            const code = document.querySelector('input[name="order-client-name"]').dataset.codeClient;

            if (code != '') {
                wrappers.forEach(wrapper => {
                    let input = wrapper.querySelector('.input'),              // Поле для ввода значения
                        list = wrapper.querySelector('.droplist');            // Выподающий список

                    fetch(`${getURL(settings)}/GetCatalogAddress?Name=Addresses&ParentCode=${code}`)
                        .then(response => response.text())
                        .then(commits => {
                            let addressList = JSON.parse(commits);
                            let addressArray = addressList.Data;

                            // Событие ввода значения в поле базис
                            input.addEventListener('input', e => {
                                const value = e.target.value;

                                // Проверяем если введенное значение больше 3х символов выполняем поиск
                                if (value.length >= 2) {
                                    list.classList.remove('is-hidden');  // Делаем выподающий список видимым

                                    // Очещаем выпадающий список
                                    const itemsRemove = list.querySelectorAll('.droplist-item');
                                    itemsRemove.forEach(e => {
                                        e.remove();
                                    });

                                    // Проверяем есть ли значение в качестве подстроки в элементе масива базисов
                                    addressArray.filter(item => {
                                        const nameAddress = item.toLowerCase();
                                        if (nameAddress.includes(value.toLowerCase())) {
                                            list.insertAdjacentHTML('beforeend', `<span class="droplist-item">${item}</span>`);
                                        }
                                    });

                                    // Вешаем событие клика на элемент выподающего списка
                                    // Если был клие значение элемента подставляется целеком в поле для ввода
                                    const items = list.querySelectorAll('.droplist-item');
                                    items.forEach(e => {
                                        e.addEventListener('click', e => {
                                            input.value = e.target.innerHTML;
                                            list.classList.add('is-hidden');
                                        });
                                    });

                                } else {

                                    list.classList.add('is-hidden');

                                }
                            });
                        });

                });
            }
        }

        dropdownActivationAddress();


        // Базис
        function dropdownActivationBasis() {
            const wrappers = document.querySelectorAll('.droplist-wrapper');
            wrappers.forEach(wrapper => {
                let input = wrapper.querySelector('.input'),              // Поле для ввода значения
                    list = wrapper.querySelector('.droplist');              // Выподающий список
                // basisArray = basisList.Data;                            // Массив базисов

                fetch(`${getURL(settings)}/getbasiseslist`)
                    .then(response => response.text())
                    .then(commits => {
                        basisList = JSON.parse(commits);
                        let basisArray = basisList.Data;

                        // Событие ввода значения в поле базис
                        input.addEventListener('input', e => {
                            const value = e.target.value;

                            // Проверяем если введенное значение больше 3х символов выполняем поиск
                            if (value.length >= 2) {
                                list.classList.remove('is-hidden');  // Делаем выподающий список видимым

                                // Очещаем выпадающий список
                                const itemsRemove = list.querySelectorAll('.droplist-item');
                                itemsRemove.forEach(e => {
                                    e.remove();
                                });

                                // Проверяем есть ли значение в качестве подстроки в элементе масива базисов
                                basisArray.filter(item => {
                                    const nameBasis = item.toLowerCase();
                                    if (nameBasis.includes(value.toLowerCase())) {
                                        list.insertAdjacentHTML('beforeend', `<span class="droplist-item">${item}</span>`);
                                    }
                                });

                                // Вешаем событие клика на элемент выподающего списка
                                // Если был клие значение элемента подставляется целеком в поле для ввода
                                const items = list.querySelectorAll('.droplist-item');
                                items.forEach(e => {
                                    e.addEventListener('click', e => {
                                        input.value = e.target.innerHTML;
                                        list.classList.add('is-hidden');
                                    });
                                });

                            } else {

                                list.classList.add('is-hidden');

                            }
                        });
                    });

            });
        }

        dropdownActivationBasis();

        // Клиент
        function dropdownActivationPartner() {
            const wrapperPartner = document.querySelector('.droplist-wrapper-partner');

            const input = wrapperPartner.querySelector('.input'),             // Поле для ввода значения
                list = wrapperPartner.querySelector('.droplist'),           // Выподающий список
                // partnerArray = partnerList.Data,                            // Массив базисов
                clientType = document.querySelector('input[name="order-client-type"]');

            // console.log(clientType.value);

            fetch(`${getURL(settings)}/getpartnerslist`)
                .then(response => response.text())
                .then(commits => {
                    let partnersList = JSON.parse(commits);
                    let partnersArray = partnersList.Data;

                    // Событие ввода значения в поле базис
                    input.addEventListener('input', e => {
                        const value = e.target.value;

                        // Проверяем если введенное значение больше 2х символов выполняем поиск
                        if (value.length >= 2) {
                            list.classList.remove('is-hidden');  // Делаем выподающий список видимым

                            // Очещаем выпадающий список
                            const itemsRemove = list.querySelectorAll('.droplist-item');
                            itemsRemove.forEach(e => {
                                e.remove();
                            });

                            // Проверяем есть ли значение в качестве подстроки в элементе масива базисов
                            partnersArray.filter(item => {
                                // console.log(item);
                                const { name_client, code_client, type_client } = item;
                                const nameClient = name_client.toLowerCase();
                                if (nameClient.includes(value.toLowerCase())) {
                                    list.insertAdjacentHTML('beforeend', `<span data-type="${type_client}" data-code="${code_client}" class="droplist-item">${name_client}</span>`);
                                }
                            });

                            // Вешаем событие клика на элемент выподающего списка
                            // Если был клие значение элемента подставляется целеком в поле для ввода
                            const items = list.querySelectorAll('.droplist-item');
                            items.forEach(e => {
                                e.addEventListener('click', e => {
                                    const item = e.target;
                                    input.value = item.innerHTML;
                                    input.setAttribute('data-code-client', item.dataset.code);
                                    clientType.value = item.dataset.type;
                                    list.classList.add('is-hidden');
                                    // Формируем список ЮЛ
                                    console.log(`${getURL(settings)}/GetCatalog?Name=Counteragents&ParentCode=${item.dataset.code}`);
                                    clearEl();
                                    getEL('document');
                                    dropdownActivationAddress();
                                    addressSelect(1);
                                    validationTypeShipment();
                                });
                            });

                        } else {

                            list.classList.add('is-hidden');

                        }
                    });


                });

        }

        dropdownActivationPartner();

        // Продукт
        function dropdownActivationProduct() {
            const wrappers = document.querySelectorAll('.droplist-wrapper-product');
            wrappers.forEach(wrapper => {


                const input = wrapper.querySelector('.input'),                // Поле для ввода значения
                    list = wrapper.querySelector('.droplist');              // Выподающий список

                fetch(`${getURL(settings)}/getproductslist`)
                    .then(response => response.text())
                    .then(commits => {
                        let productsList = JSON.parse(commits);
                        let productsArray = productsList.Data;

                        // Событие ввода значения в поле базис
                        input.addEventListener('input', e => {
                            const value = e.target.value;

                            // Проверяем если введенное значение больше 3х символов выполняем поиск
                            if (value.length >= 2) {
                                list.classList.remove('is-hidden');  // Делаем выподающий список видимым

                                // Очещаем выпадающий список
                                const itemsRemove = list.querySelectorAll('.droplist-item');
                                itemsRemove.forEach(e => {
                                    e.remove();
                                });

                                // Проверяем есть ли значение в качестве подстроки в элементе масива базисов
                                productsArray.filter(item => {
                                    // console.log(item);
                                    const { name_product, code_product } = item;
                                    const nameProduct = name_product.toLowerCase();
                                    if (nameProduct.includes(value.toLowerCase())) {
                                        list.insertAdjacentHTML('beforeend', `<span data-code="${code_product}" class="droplist-item">${name_product}</span>`);
                                    }
                                });

                                // Вешаем событие клика на элемент выподающего списка
                                // Если был клие значение элемента подставляется целеком в поле для ввода
                                const items = list.querySelectorAll('.droplist-item');
                                items.forEach(e => {
                                    e.addEventListener('click', e => {
                                        const item = e.target;
                                        input.value = item.innerHTML;
                                        input.setAttribute('data-product', item.dataset.code);
                                        list.classList.add('is-hidden');
                                    });
                                });

                            } else {

                                list.classList.add('is-hidden');

                            }
                        });

                    });

            });
        }

        dropdownActivationProduct();

        // Номенклатура
        function dropdownActivationNomenclature() {
            const wrappers = document.querySelectorAll('.droplist-wrapper-nomenclature');
            wrappers.forEach(wrapper => {


                const input = wrapper.querySelector('.input'),                // Поле для ввода значения
                    list = wrapper.querySelector('.droplist');            // Выподающий список

                fetch(`${getURL(settings)}/getnomenclaturelist`)
                    .then(response => response.text())
                    .then(commits => {
                        let nomenclatureList = JSON.parse(commits);
                        let nomenclatureArray = nomenclatureList.Data;

                        // Событие ввода значения в поле базис
                        input.addEventListener('input', e => {
                            const value = e.target.value;

                            // Проверяем если введенное значение больше 3х символов выполняем поиск
                            if (value.length >= 2) {
                                list.classList.remove('is-hidden');  // Делаем выподающий список видимым

                                // Очещаем выпадающий список
                                const itemsRemove = list.querySelectorAll('.droplist-item');
                                itemsRemove.forEach(e => {
                                    e.remove();
                                });

                                // Проверяем есть ли значение в качестве подстроки в элементе масива базисов
                                nomenclatureArray.filter(item => {
                                    const { name_nomenclature, code_nomenclature } = item;
                                    const nameNomenclature = name_nomenclature.toLowerCase();
                                    if (nameNomenclature.includes(value.toLowerCase())) {
                                        list.insertAdjacentHTML('beforeend', `<span data-code="${code_nomenclature}" class="droplist-item">${name_nomenclature}</span>`);
                                    }
                                });

                                // Вешаем событие клика на элемент выподающего списка
                                // Если был клие значение элемента подставляется целеком в поле для ввода
                                const items = list.querySelectorAll('.droplist-item');
                                items.forEach(e => {
                                    e.addEventListener('click', e => {
                                        const item = e.target;
                                        input.value = item.innerHTML;
                                        input.setAttribute('data-product', item.dataset.code);
                                        list.classList.add('is-hidden');
                                    });
                                });

                            } else {

                                list.classList.add('is-hidden');

                            }
                        });

                    });

                // Событие ввода значения в поле базис
                // input.addEventListener('input', e => {
                //     const value = e.target.value;

                //     // Проверяем если введенное значение больше 3х символов выполняем поиск
                //     if (value.length >= 3) {
                //         list.classList.remove('is-hidden');  // Делаем выподающий список видимым

                //         // Очещаем выпадающий список
                //         const itemsRemove = list.querySelectorAll('.droplist-item');
                //         itemsRemove.forEach(e => {
                //             e.remove();
                //         });

                //         // Проверяем есть ли значение в качестве подстроки в элементе масива базисов
                //         nomenclatureArray.filter(item => {
                //             // console.log(item);
                //             const {name_nomenclature, code_nomenclature} = item;
                //             if (name_nomenclature.includes(value)) {
                //                 list.insertAdjacentHTML('beforeend', `<span data-code="${code_nomenclature}" class="droplist-item">${name_nomenclature}</span>`);
                //             }
                //         });

                //         // Вешаем событие клика на элемент выподающего списка
                //         // Если был клие значение элемента подставляется целеком в поле для ввода
                //         const items = list.querySelectorAll('.droplist-item');
                //         items.forEach(e => {
                //             e.addEventListener('click', e => {
                //                 const item = e.target;
                //                 input.value = item.innerHTML;
                //                 input.setAttribute('data-product', item.dataset.code);
                //                 list.classList.add('is-hidden');
                //             });
                //         });

                //     } else {

                //         list.classList.add('is-hidden');

                //     }
                // });

            });
        }

        dropdownActivationNomenclature();

        // Тумблер заявка/бронь
        function typeOrder() {
            const container = document.querySelector('.js-type-order');
            const btnOrder = container.querySelector('.js-order');
            const btnReservation = container.querySelector('.js-reservation');

            container.addEventListener('click', e => {
                console.log(e.target.classList.contains('js-reservation'));
                // Заявка
                if (e.target.classList.contains('js-order')) {
                    container.dataset.typeOrder = 2;
                    btnReservation.classList.add('is-outlined-brand');
                    btnOrder.classList.remove('is-outlined-brand');
                    validation();
                    validVal();
                    // Бронь
                } else if (e.target.classList.contains('js-reservation')) {
                    validationReservation();
                    container.dataset.typeOrder = 1;
                    btnReservation.classList.remove('is-outlined-brand');
                    btnOrder.classList.add('is-outlined-brand');
                }
            });

        }

        typeOrder();

        // Расчет плотности
        function calculateDensity() {
            const daels = document.querySelectorAll('.legal-entity');

            daels.forEach(dael => {
                dael.addEventListener('click', e => {
                    const element = e.target;
                    if (element.classList.contains('js-btn-calculate-density')) {

                        function validationDensity(str) {
                            return str.replace(/,/g, ".");
                        }

                        const density = validationDensity(dael.querySelector('.order-address-basis-legal-entity-dael-density').value);
                        const wt = dael.querySelector('input[name="order-address-basis-legal-entity-dael-wt"]');
                        const volume = dael.querySelector('input[name="order-address-basis-legal-entity-dael-volume"]').value;
                        console.log(typeof (Number(volume)));
                        wt.value = (Number(density) * Number(volume) / 1000).toFixed(3);
                        wt.style.borderColor = '#dbdbdb';
                    }
                })
            });
        }

        calculateDensity();

        // Кнопка разблокировки полей
        // function btnUnlock() {
        const btn = document.querySelector('.js-btn-unlock')
        if (btn) {
            btn.addEventListener('click', (e) => {
                // console.log(e.target);
                unlockFields();
            })
        }
        // }

        // btnUnlock();

        // Установка ширины поля адрес
        function setWidthFildsAdress() {
            const filds = document.querySelectorAll('.width-res');
            const screenWidth = document.documentElement.clientWidth;   // Ширина экрана

            if (screenWidth < 940) {
                filds.forEach(fild => {
                    fild.style.width = `${screenWidth - 60}px`;
                })
            } else {
                filds.forEach(fild => {
                    fild.style.width = '470px';
                })
            }


        }

        setWidthFildsAdress();

        // Модальные окна

        function activeModal() {
            function openModal($el) {
                $el.classList.add('is-active');
            }

            function closeModal($el) {
                $el.classList.remove('is-active');
            }

            function closeAllModals() {
                (document.querySelectorAll('.modal') || []).forEach(($modal) => {
                    closeModal($modal);
                });
            }

            // Add a click event on buttons to open a specific modal
            (document.querySelectorAll('.js-modal-trigger, .modal-button') || []).forEach(($trigger) => {
                const modal = $trigger.dataset.target;
                const $target = document.getElementById(modal);

                $trigger.addEventListener('click', () => {
                    openModal($target);
                });
            });

            // Add a click event on various child elements to close the parent modal
            (document.querySelectorAll('.modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
                const $target = $close.closest('.modal');

                $close.addEventListener('click', () => {
                    closeModal($target);
                });
            });

            // Add a keyboard event to close all modals
            document.addEventListener('keydown', (e) => {
                if (e.key === "Escape") {
                    // closeAllModals();
                }
            });
        }

        activeModal();

        // Событие выбора типа отгрузки
        const clientTypeShipment = document.querySelector('select[name="order-client-type-shipment"]');
        clientTypeShipment.addEventListener('change', () => {
            validationTypeShipment();
        })

        const body = document.querySelector('body');
        body.addEventListener('change', e => {
            if (e.target.name == 'order-address-select') {
                validationTypeShipment();
            }
        })

        //---------------------------------------------------------------------------
        // Сброс old_docs в true при перезагрузке
        resetOldDocsOnReload();

        // Первоначальное сохранение значения
        saveStatusBuh();

        // Получаем элемент
        const selectElement = document.querySelector('select[name="staus-buh"]');

        if (selectElement) {
            // Добавляем обработчик изменения
            selectElement.addEventListener('change', saveStatusBuh);
        }

        // Обработчики для кнопок
        const trueButton = document.querySelector('.old-docs-true');
        const falseButton = document.querySelector('.old-docs-false');

        if (trueButton) {
            trueButton.addEventListener('click', function () {
                updateOldDocs(true, postOrder);
            });
        }

        if (falseButton) {
            falseButton.addEventListener('click', function () {
                updateOldDocs(false, postOrder);
            });
        }

        // Дополнительно: обработчик перед перезагрузкой
        window.addEventListener('beforeunload', resetOldDocsOnReload);

        //-------------------------------------------------------------
        // Валидация поля Объем, л. и Вес, тн.
        const orderDoc = document.querySelector('.order');

        if (orderDoc) {
            orderDoc.addEventListener('input', (e) => {
                if (e.target.name == 'order-address-basis-legal-entity-dael-wt') {
                    checkingPrice();
                } else if (e.target.name == 'order-address-basis-legal-entity-dael-volume') {
                    checkingPrice();
                }
            })

            orderDoc.addEventListener('change', (e) => {
                if (e.target.name == 'order-address-basis-legal-entity-dael-unit') {
                    checkingPrice();
                }
            })
        }

        // Поле тип цены. Получаем тип цены руб/л = 1, руб/т = 2
        // const unit = basis.querySelector('select[name="order-address-basis-legal-entity-dael-unit"]');
        // // Поле Вес, тн.
        // const wt = basis.querySelector('input[name="order-address-basis-legal-entity-dael-wt"]');
        // // Поле Объем, л.
        // const volume = basis.querySelector('input[name="order-address-basis-legal-entity-dael-volume"]');


        //-------------------------------------------------------------



    }

    // ------------------------------------------------------------------------------
    // Валидация поля Объем, л. и Вес, тн.
    // Если указанна Цена = руб/л то поле Объем, л. не должно быть пустым, 0, текст
    // Если указанна Цена = руб/т то поле Вес, тн. не должно быть пустым, 0, текст
    // Если проверка не прошла то подсветить поле красным
    // Проверка должна сработать
    // При загрузки страници
    // При изменении значения Цена (change), Объем, л. (input), Вес, тн. (input)
    // При создании/сохранении заявки
    // При добавлении базиса/адреса
    // Функция возвращает true если все поля прошли проверку, false если хотябы одно поле не прошло проверку

    const checkingPrice = () => {
        console.log('Запуск: checkingPrice');
        let result = true;
        const legalEntity = document.querySelectorAll('.legal-entity');

        legalEntity.forEach(le => {

            // Функция коррекции данных
            const numberСorrection = (el) => {
                let value;

                if (el.value.match(/[0-9,.]/gm)) {
                    value = el.value.match(/[0-9,.]/gm)
                        .join('')
                        .replace(/^\.+/g, '')
                        .replace(/^0+/g, '0')
                        .replace(/,+/g, '.')
                        .replace(/\.+/g, '.')
                        .replace(/^\./g, '');
                } else {
                    value = '';
                }

                console.log(value);

                if (value.match(/\d+\.\d+\./gm)) {
                    value = value.replace(/\.$/gm, '');
                }
                console.log(value);
                if (value.match(/^0([0-9]\.+)/gm)) {
                    value = value.replace(/^0([0-9]\.+)/gm, '$1');
                }
                console.log(value);
                if (value.match(/^0([0-9])/gm)) {
                    value = value.replace(/^0([0-9])/gm, '$1');
                }

                console.log(value);
                // + Добавить
                // Если строка содержит 2 точки то нужно удалить, точку
                // Если строка не содержит точку и строка начитается с 0
                // или нескольких нулей удалить удалить 0-и в начале строки
                el.value = isNaN(parseFloat(value)) ? '' : value;
            }

            // Поле тип цены. Получаем тип цены руб/л = 1, руб/т = 2
            const unit = le.querySelector('select[name="order-address-basis-legal-entity-dael-unit"]');
            // Поле Вес, тн.
            const wt = le.querySelector('input[name="order-address-basis-legal-entity-dael-wt"]');
            // Поле Объем, л.
            const volume = le.querySelector('input[name="order-address-basis-legal-entity-dael-volume"]');
            volume.removeAttribute('style');

            // console.log(unit, wt, volume);

            console.log(parseFloat(volume.value));

            numberСorrection(volume);
            numberСorrection(wt);

            if (unit.value == '1') {            // тип цены руб/л = 1
                wt.classList.remove('is-err'); // Убераем красную подсветку у поля

                if (parseFloat(volume.value)) {
                    volume.classList.remove('is-err');
                } else {
                    volume.classList.add('is-err');
                    result = false;
                }

            } else if (unit.value == '2') {     // тип цены руб/т = 2
                volume.classList.remove('is-err'); // Убераем красную подсветку у поля

                if (parseFloat(wt.value)) {
                    wt.classList.remove('is-err');
                } else {
                    wt.classList.add('is-err');
                    result = false;
                }
            }


            result = result == false ? false : true;
        })

        return result;
    }

    // ------------------------------------------------------------------------------

    // Дата базиса
    // Проверка коректности заполнения полей дата в клиенте и дата в базисе
    const validationDateBasis = () => {
        const dateDocument = document.querySelector('.js-type-date-is-range');
        const dateBasiss = document.querySelectorAll('.basis');
        let param = true;
        // Получаем дату
        const getDate = (element) => {
            const srcDate = element.value;

            if (srcDate.includes('-')) {
                const arrDate = srcDate.split(' - ');
                let date = new Array();

                arrDate.forEach(d => {
                    const day = d.split('.')[0];
                    const month = d.split('.')[1];
                    const year = d.split('.')[2];

                    date.push(new Date(year, +month - 1, +day));
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
                console.log(1);
                wrapperDataBasis.classList.add('is-err');
                param = false;
            } else if (!dataBasis) {
                wrapperDataBasis.classList.remove('is-err');
            } else if (!(dataBasis[0] >= dataDoc[0] && dataBasis[1] <= dataDoc[1])) {
                // console.log('dataBasis', dataBasis);
                // console.log('dataDoc', dataDoc);
                console.log(2);
                wrapperDataBasis.classList.add('is-err');
                param = false;
            } else if (dataBasis[0] >= dataDoc[0] && dataBasis[1] <= dataDoc[1]) {
                console.log(3);
                wrapperDataBasis.classList.remove('is-err');
            }

            if (specificationUse && !dataBasis) {
                wrapperDataBasis.classList.add('is-err');
                console.log(33);
                param = false;
            } else if (!specificationUse && !dataBasis) {
                wrapperDataBasis.classList.remove('is-err');
            }




        })
        console.log(param);
        return param;
        // console.log(getDate(dateDocument));
        // console.log(dateBasiss);
    }

    const activeBasisDate = (basis, data = orderR.Data.OrdersList.array_addresses[0].array_basises[0]) => {
        const container = basis.querySelector('.js-basis-date-container');
        const checbox = container.querySelector('.js-basis-date-checkbox');
        const basisDateRange = container.querySelector('.js-basis-date-range');
        const inputCalendarRange = basisDateRange.querySelector('.input');

        // Активация чекбокса
        checbox.checked = data.specification_use;

        checbox.addEventListener('change', () => {
            setTimeout(validationDateBasis, 1000);
        })

        const calendarBasisRange = new bulmaCalendar(inputCalendarRange, {
            type: 'date',
            color: 'link',
            isRange: true,
            lang: 'ru',
            dateFormat: 'dd.MM.yyyy',
            startDate: data.hasOwnProperty('date_basis') ? data.date_basis.date_start : undefined,
            endDate: data.hasOwnProperty('date_basis') ? data.date_basis.date_end : undefined,
            showClearButton: false,
            showTodayButton: false,
            showHeader: false,
            cancelLabel: 'Закрыть',
            // displayMode: 'dialog'
        });

        calendarBasisRange.on('select', date => {
            // calendarBasisRange._ui.dummy.wrapper.classList.remove('is-err');
            setTimeout(validationDateBasis, 1000);
        })

        calendarBasisRange._ui.dummy.clear.addEventListener('click', () => {
            // calendarBasisRange._ui.dummy.wrapper.classList.add('is-err');
            setTimeout(validationDateBasis, 1000);
        })

    }

    // Проверка корректности заполнения поля "Тип отгрузки"
    const validationTypeShipment = () => {
        let param = true;
        const clientTypeShipment = document.querySelector('select[name="order-client-type-shipment"]').value;
        const addresses = document.querySelectorAll('select[name="order-address-select"]');

        if (clientTypeShipment == '3' || clientTypeShipment == '5' || clientTypeShipment == '6') {
            addresses.forEach(address => {
                if (address.value == '' || address.value == '-') {
                    address.classList.add('is-err');
                    param = false;
                } else {
                    address.classList.remove('is-err');
                }
            })
        } else {
            addresses.forEach(address => {
                address.classList.remove('is-err');
            })
        }

        return param;

    }

    // Изменение бух статуса с "Возвращен" на "Согласован"
    // Получаем текущий бух статуст и сохраняем его в SessionStorage
    // ввидет объекта statusBuh {'status': value, 'old_docs': boolean}
    // вешаем событие на поле бухгалтерского статуса, при изменении статуста
    // если статуст меняется с Возвращен (7) на Согласован (2)
    // Показываем модальное окно с сообщением "Оставить предыдущие документы?"
    // По нажатию кнопок Да/Нет
    // Если да то 'old_docs': false, если нет то 'old_docs': true (по умолчанию 'old_docs': true)
    // Функция для сохранения значения в sessionStorage
    function saveStatusBuh() {
        const selectElement = document.querySelector('select[name="staus-buh"]');
        const formElement = document.querySelector('.order');

        if (selectElement) {
            const newValue = selectElement.value;
            const oldValue = formElement.dataset.statusBuh;
            const sessionData = sessionStorage.getItem('statusBuh');

            // Инициализируем объект для хранения данных
            let statusBuh = sessionData
                ? JSON.parse(sessionData)
                : { old_status: oldValue, status: '', old_docs: false };

            // Проверяем переход от 7 к 2
            // if (statusBuh.status === '7' && newValue === '2') {
            //     console.log("Оставить предыдущие документы?");

            //     // Находим элемент с классом .old-docs
            //     const oldDocsElement = document.querySelector('.old-docs');
            //     if (oldDocsElement) {
            //         // Добавляем класс .is-active
            //         oldDocsElement.classList.add('is-active');
            //     } else {
            //         console.warn('Элемент .old-docs не найден');
            //     }
            // }

            // Обновляем статус
            statusBuh.status = newValue;

            // Сохраняем обновленный объект
            sessionStorage.setItem('statusBuh', JSON.stringify(statusBuh));
        }
    }

    // Функция для обновления значения old_docs
    function updateOldDocs(value, cb) {
        const sessionData = sessionStorage.getItem('statusBuh');

        if (sessionData) {
            const statusBuh = JSON.parse(sessionData);

            // Обновляем только old_docs
            statusBuh.old_docs = value;

            // Сохраняем обратно
            sessionStorage.setItem('statusBuh', JSON.stringify(statusBuh));

            // Скрываем блок с кнопками
            // const oldDocsElement = document.querySelector('.old-docs');
            // if (oldDocsElement) {
            //     oldDocsElement.classList.remove('is-active');
            // }
            cb();
            // console.log(`old_docs установлен в: ${value}`);
        }
    }

    function postOrder() {
        return sendOrder(getOrder());
    }

    // Функция для сброса old_docs в false при перезагрузке
    function resetOldDocsOnReload() {
        // const sessionData = sessionStorage.getItem('statusBuh');

        // if (sessionData) {
        //     const statusBuh = JSON.parse(sessionData);

        //     // Сбрасываем только old_docs
        //     statusBuh.old_docs = false;

        //     // Сохраняем обновленный объект
        //     sessionStorage.setItem('statusBuh', JSON.stringify(statusBuh));

        // }
        sessionStorage.removeItem('statusBuh');
    }


    // Инициализация после загрузки DOM
    // document.addEventListener('DOMContentLoaded', function() {

    // });

    // ПОЛУЧЕНИЕ ДАННЫХ С СЕРВЕРА
    // Получить заказ
    const urlSearch = new URLSearchParams(window.location.search);
    const number = urlSearch.get('order');

    if (urlSearch.get('order')) {
        fetch(`${getURL(settings)}/GetOrderDetails?OrderID=${number}`)
            .then(response => response.text())
            .then(commits => {
                const order = JSON.parse(commits);
                // order.Data.OrdersList.payment_schedule[0].array_partersorder.push({
                //     "number_partersorder": "0000-001796",
                //     "status_partersorder": 1,
                //     "contract": {
                //         "supply_agreement": true,
                //         "surety": true,
                //         "add_agreement_BN": true
                //     }
                // });
                // console.log(JSON.parse(commits).Data.OrdersList.payment_schedule[0].array_partersorder);
                console.log(order);
                orderConstructor(order);
                // const btn = document.querySelector('.js-create-order').innerHTML = `Сохранить`;
            })
            .then(() => {
                // console.log('OK');
                eventOrder();
                // getEL('document');
                // validation();
                // validation2();
                validVal();

                const typeShipment = document.querySelector('select[name="order-client-type-shipment"]');
                typeShipment.addEventListener('change', e => {
                    validVal();
                });

                const el = document.querySelector('select[name="order-address-basis-legal-entity"]');
                el.addEventListener('change', e => {
                    validVal();
                });
                lockFields();
                sessionStorage.setItem('downloadedData', JSON.stringify(getOrder()));
            });
    } else {
        orderConstructor(orderR);
        eventOrder();
        validVal();
        // validation();

        const typeShipment = document.querySelector('select[name="order-client-type-shipment"]');
        typeShipment.addEventListener('change', e => {
            validVal();
        });

        const el = document.querySelector('select[name="order-address-basis-legal-entity"]');
        el.addEventListener('change', e => {
            validVal();
        });
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
        function dataConverter() {
            if (order.querySelector('input[name="order-address-basis-date"]').value) {
                const data = document.querySelector('input[name="order-address-basis-date"]').value.split('-');
                return `${data[2]}.${data[1]}.${data[0]}`;
            }
            return `00.00.0000`;
        }

        // Конвертируем время в формат 1С
        function timeConverter() {
            if (order.querySelector('input[name="order-address-basis-time"]').value) {
                const data = document.querySelector('input[name="order-address-basis-time"]').value;
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
                    "name_counteragent": '',
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



            // "payment_schedule": [
            //     {
            //         "name_counteragent": "ГАЗПРОМНЕФТЬ-АЭРО НОВОСИБИРСК АО",
            //         "code_counteragent": "5448106217",
            //         "type_entity": 0,
            //         "rows_payments": [
            //             {
            //                 "percent": 100,
            //                 "summ": 5000,
            //                 "type_payment": 1,
            //                 "date_payment": "01.04.2024",
            //                 "offset_payment": 0
            //             }
            //         ]
            //     }
            // ]



            // paymentSchedules.forEach(company => {
            //     const rows = company.querySelectorAll('.schedule-row');
            //     // console.log(rows);

            //     rows.forEach(r => {
            //         const item = {
            //             "code_counteragent": company.querySelector('.schedule-company-title').dataset.inn,
            //             "percent": Number(r.querySelector('.schedule-row-percent').value),
            //             "summ": Number(r.querySelector('.schedule-row-sum').value),
            //             "type_payment": Number(r.querySelector('.schedule-row-type-payment').value),
            //             "date_payment": dataConverter(r),
            //             "offset_payment": r.querySelector('.schedule-row-offset-payment').value
            //         }

            //         schedule.push(item);
            //     })



            // })

            // console.log(schedule);
            return schedule;
        }

        let orderData = {
            // Заявка/Клиент
            "type_action_order": copy || setType(order),
            // "type_action_order": setType(order),
            "action_type": setType(order),
            "code_client": client,
            "number": order.dataset.number,
            "type_order": Number(document.querySelector('.js-type-order').dataset.typeOrder),
            "type_operation": Number(document.querySelector('select[name="order-client-type-shipment"]').value),
            "archieved": archieved,
            "renew_docs": '',
            "old_docs": JSON.parse(sessionStorage.getItem('statusBuh')).old_docs,
            "date_order": {
                "date_range": !(date[0] == date[1]),
                "date_start": date[0],
                "date_end": date[1]
            },
            "documents": {
                "type_docs": Number(order.querySelector('select[name="order-address-basis-document"]').value),
                "urgency_docs": Number(order.querySelector('select[name="order-address-basis-urgency"]').value),
                "urgency_in_due_docs": Number(order.querySelector('select[name="order-address-basis-term"]').value),
                "urgency_until_docs": {
                    "date": dataConverter(),
                    "time": timeConverter()
                }
            },
            "payment_schedule": сollectionOfData(),
            "status_buh": Number(document.querySelector('select[name="staus-buh"]').value),
            "status_logistic": Number(document.querySelector('select[name="order-client-status-logistic"]').value),
            "commentary": document.querySelector('.client textarea[name="order-address-basis-comment"]').value,
            "array_addresses": []
        };

        // Добавлем информацию о одресах
        const arrayAddresses = orderData.array_addresses;
        const addreses = order.querySelectorAll('.address');
        addreses.forEach(address => {

            let addressObj = {
                "name_address": address.querySelector('select[name="order-address-select"]').value,
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
                    let cost = basis.querySelector('input[name="order-address-basis-value"]').value;

                    if (cost == '') {
                        cost = 0;
                        return cost;
                    } else {
                        return cost;
                    }
                }

                // Дата базиса

                function getBasisData(basis) {
                    const dateSrc = basis.querySelector('input[name="basis-date-range"]').value.split(' - ');
                    // console.log(!dateSrc[0]);
                    // if (!dateSrc[0]) {
                    //     const dateDoc = document.querySelector('input[name="order-client-date"]').value.split(' - ');
                    //     return {start: dateDoc[0], end: dateDoc[1]};
                    // } else {
                    //     return {start: dateSrc[0], end: dateSrc[1]};
                    // }

                    if (!dateSrc[0]) {
                        return { start: '', end: '' };
                    } else {
                        return { start: dateSrc[0], end: dateSrc[1] };
                    }
                }

                let basisObj = {
                    "name_basis": basis.querySelector('input[name="order-address-basis"]').value,
                    "code_product": basis.querySelector('input[name="order-address-basis-product"]').dataset.product,
                    "code_nomenclature": codeNomenclature(),
                    "volume": {
                        "range_volume": basis.querySelector('input[name="order-address-basis-volume-range"]').checked,
                        "start_volume": Number(basis.querySelector('input[name="order-address-basis-volume-min"]').value),
                        "end_volume": Number(basis.querySelector('input[name="order-address-basis-volume-max"]').value)
                    },
                    "delivery": {
                        "NDS_delivery": basis.querySelectorAll('input[type="radio"]')[0].checked,
                        "cost_delivery": costDelivery(),
                        "cost_type_delivery": basis.querySelector('select[name="order-address-basis-unit"]').value
                    },
                    "specification_use": basis.querySelector('.js-basis-date-checkbox').checked,
                    "date_basis": {
                        "date_range": !(getBasisData(basis).start == getBasisData(basis).end),
                        "date_start": getBasisData(basis).start,
                        "date_end": getBasisData(basis).end,
                    },
                    "commentary": basis.querySelector('textarea[name="order-address-basis-comment"]').value,
                    "array_counteragents": []
                };

                arrayBasises.push(basisObj);

                // Добавляем юридическое лицо
                const arrayСounteragents = basisObj.array_counteragents;
                const counteragents = basis.querySelectorAll('.legal-entity');
                // console.log(counteragents);

                counteragents.forEach(counteragent => {
                    let counteragentsObj = {
                        "code_counteragent": counteragent.querySelector('select[name="order-address-basis-legal-entity"]').value,
                        "commentary": '',
                        "volume": counteragent.querySelector('input[name="order-address-basis-legal-entity-dael-volume"]').value,
                        "weight": counteragent.querySelector('input[name="order-address-basis-legal-entity-dael-wt"]').value,
                        "cost": counteragent.querySelector('input[name="order-address-basis-legal-entity-dael-price"]').value,
                        "type_cost": Number(counteragent.querySelector('select[name="order-address-basis-legal-entity-dael-unit"]').value),
                    };

                    arrayСounteragents.push(counteragentsObj);

                });
            });
        });

        // console.log(orderData);
        // alert('stop');

        return orderData;
    }

    // Функция отправки заявки (Создание, удаление, копирование)
    function sendOrder(orderData) {
        // console.log(JSON.stringify(orderData));
        // alert('stop');
        fetch(`${getURL(settings)}/postupdateorder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(orderData)
        }).then(response => response.text())
            .then(commits => {
                console.log(commits);
                // alert('Продолжить?');
                if (JSON.parse(commits).Status === 'Error') {
                    alert(JSON.parse(commits).Status);
                    run = true;
                }

                if (JSON.parse(commits).Status === 'OK') {
                    // socket.emit('save order', 'записан заказ');
                    document.location = 'orders';
                }
            });
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
    const createOrder = document.querySelector('.js-create-order');
    const copyOrder = document.querySelector('.js-copy-order');
    const cancelOrder = document.querySelector('.js-cancel-order');
    const deleteOrder = document.querySelector('.js-delete-order');
    const saveOrderSend = document.querySelectorAll('.js-save-order-renew-docs-true, .js-save-order-renew-docs-false');
    const saveOrder = document.querySelector('.js-save-order');
    const buttonSaveOrder = document.querySelector('.js-save-order');
    const status = document.querySelector('select[name="staus-buh"]');

    console.log(status);

    // status.addEventListener('change', e => {
    //     buttonSaveOrder.setAttribute('status', e.target.value);
    // })

    // Активация панели управления
    // activControlPanel();

    // Событие кнопки Создание
    createOrder.addEventListener('click', (e) => {
        const validation = validVal();
        const validationVolume = daelsVolume();

        if (run && validation && validationVolume) {
            run = false;
            const orderData = getOrder();  // Сбор данных о заявке и клиенте
            console.log(JSON.stringify(orderData));
            // alert('ok');
            sendOrder(orderData);          // Отправка данных на сервер
            // socket.emit('save order', 'записан заказ');
            socket.emit('save');
        } else if (!validation) {
            alert('Заполните обязательные поля');
        }
    })

    // Событие кнопки Сохранить
    saveOrderSend.forEach(button => {
        button.addEventListener('click', (e) => {

            const orderData = getOrder();
            // alert('Проверь');
            if (e.target.classList.contains('js-save-order-renew-docs-true')) {
                orderData.renew_docs = true;
            } else if (e.target.classList.contains('js-save-order-renew-docs-false')) {
                orderData.renew_docs = false;
            }

            // console.log(JSON.stringify(orderData));
            sendOrder(orderData);          // Отправка данных на сервер
            // alert('STOP');
            // socket.emit('save', 'записан заказ');
            socket.emit('save');

        })
    })

    saveOrder.addEventListener('click', (e) => {
        const validation = validVal();
        const validationVolume = daelsVolume();

        if (validationVolume && validation) {
            const orderData = getOrder();  // Сбор данных о заявке и клиенте

            const compareOrders = (order) => {
                const orderOld = JSON.parse(sessionStorage.getItem('downloadedData'));
                const buhStatus = JSON.parse(sessionStorage.getItem('statusBuh'));
                const orderNew = order;
                console.log(buhStatus.old_status);
                if (buhStatus.old_status == '7' && buhStatus.status == '2') {
                    // Находим элемент с классом .old-docs

                    const oldDocsElement = document.querySelector('.old-docs');
                    if (oldDocsElement) {
                        // Добавляем класс .is-active
                        oldDocsElement.classList.add('is-active');
                    } else {
                        console.warn('Элемент .old-docs не найден');
                    }

                } else if (JSON.stringify(orderOld) != JSON.stringify(orderNew)) {
                    delete orderOld.status_buh;
                    delete orderOld.status_logistic;
                    delete orderNew.status_buh;
                    delete orderNew.status_logistic;

                    if (JSON.stringify(orderOld) != JSON.stringify(orderNew)) {
                        console.log('Изменились что то в заявке');
                        document.querySelector('.renew-docs').classList.add('is-active');

                    } else {
                        console.log('Изменились только логистические статусы');
                        sendOrder(getOrder());
                        socket.emit('save order', 'записан заказ');
                    }
                } else {
                    console.log('В заявке не чего не изменилось');
                    sendOrder(getOrder());
                    socket.emit('save order', 'записан заказ');
                }
            }

            compareOrders(orderData);

        } else if (!validation) {
            alert('Заполните обязательные поля');
        }
    })

    // Событие кнопки Удалить
    deleteOrder.addEventListener('click', () => {
        const orderData = getOrder();  // Сбор данных о заявке и клиенте
        orderData.archieved = true;    // Устанавливаем пометку заявке как удаленная
        orderData.status_buh = 3;      // Устанавливаем бух статус отменен
        orderData.status_logistic = 5; // Устанавливаем логистический статус отменен
        sendOrder(orderData);          // Отправка данных на сервер
        socket.emit('delete');
    })

    // Событие кнопки Отмена
    cancelOrder.addEventListener('click', () => {
        document.location = 'orders';
        socket.emit('save order', 'записан заказ');
    })

    // Событие кнопки Копировать
    copyOrder.addEventListener('click', (e) => {
        unlockFields();
        const btn = e.target;
        const dates = document.querySelectorAll('.datetimepicker-dummy-wrapper input');
        const statusLogistic = document.querySelector('select[name="order-client-status-logistic"]');
        const statusBuh = document.querySelector('select[name="staus-buh"]');
        const numberOrder = document.querySelector('form');

        buttonSaveOrder.classList.add('is-hidden');
        deleteOrder.classList.add('is-hidden');
        createOrder.classList.remove('is-hidden');
        btn.setAttribute('disabled', 'disabled');
        dates[0].value = '';
        dates[1].value = '';
        dates[2].setAttribute('value', '');
        statusLogistic.value = 1;
        statusBuh.value = 1;
        // numberOrder.dataset.number =
        copy = true;
    })

});