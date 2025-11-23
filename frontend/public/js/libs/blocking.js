'use strict'

// Блокировка заявки
const blocking = () => {
    const inputs = document.querySelectorAll('input');
    const select = document.querySelectorAll('select');
    const textarea = document.querySelectorAll('textarea');
    const buttons = document.querySelectorAll('.order .button, .type-order-container .button');
    const calendars = document.querySelectorAll('.datetimepicker-dummy-wrapper');

    // Блокировка input
    inputs.forEach(input => {
        if (input.type == 'checkbox' || 'radio') {
            input.setAttribute('disabled', 'disabled');
        }

        input.classList.add('disabled');
    })

    // Блокировка select
    select.forEach(s => {
        s.classList.add('disabled');
    })

    // Блокировка textarea
    textarea.forEach(t => {
        t.classList.add('disabled');
    })

    // Блокировка calendar
    calendars.forEach(calendar => {
        calendar.classList.add('disabled');
    })

    // Блокировка button
    buttons.forEach(button => {
        if (!button.classList.contains('js-btn-unlock')) {
            button.classList.add('disabled');
        }
    })

}

// Разблокировка заявки
const unlocking = () => {
    const inputs = document.querySelectorAll('input');
    const select = document.querySelectorAll('select');
    const textarea = document.querySelectorAll('textarea');
    const buttons = document.querySelectorAll('.button');
    const calendars = document.querySelectorAll('.datetimepicker-dummy-wrapper');

    // Разблокировка input
    inputs.forEach(input => {
        if (input.type == 'checkbox' || 'radio') {
            input.removeAttribute('disabled', 'disabled');
        }

        input.classList.remove('disabled');
    })

    // Разблокировка select
    select.forEach(s => {
        s.classList.remove('disabled');
    })

    // Разблокировка textarea
    textarea.forEach(t => {
        t.classList.remove('disabled');
    })

    // Разблокировка calendar
    calendars.forEach(calendar => {
        calendar.classList.remove('disabled');
    })

    // Разблокировка button
    buttons.forEach(button => {
        if (!button.classList.contains('js-btn-unlock')) {
            button.classList.remove('disabled');
        }
    })

}

const btnClick = () => {
    const order = document.querySelector('form.order');
    console.log('123');
    if (order.dataset.bloking == 'true') {
        order.dataset.bloking = false;
        unlocking();
    } else if (order.dataset.bloking == 'false') {
        order.dataset.bloking = true;
        blocking();
    }
}

// Статус заявки заблокированна/разблокирована
const setBlock = () => {
    const order = document.querySelector('form.order');
    const btn = document.querySelector('.js-btn-unlock');

    btn.addEventListener('click', btnClick);

    order.setAttribute('data-bloking', '');

    if (order.dataset.number) {
        order.dataset.bloking = true;
    } else {
        order.dataset.bloking = false;
    }



    return Boolean(order.dataset.bloking);
}


export default { blocking, unlocking, setBlock };
export { blocking, unlocking, setBlock };