// Функция вызывает правила валидации
const v = {
    "isTextLength": (el) => {

        const criterion = el.dataset.criterion;

        if (el.value.length < criterion) {
            el.classList.add('is-err');
        } else {
            el.classList.remove('is-err');
        }

    },
    "isNumber": (el) => {
        const criterion = el.dataset.criterion;

        el.value = el.value.replace(/[,]/gm, '.');
        el.value = el.value.replace(/[\s]/gm, '');
        el.value = el.value.replace(/[a-zA-Zа-яА-Я/\\]/gm, '');
        el.value = el.value.replace(/[.]+/gm, '.');
        el.value = el.value.replace(/[-]+/gm, '');

        if (el.value > criterion) {
            el.classList.remove('is-err');
        } else {
            el.classList.add('is-err');
        }
    },
    "isSelect": (el) => {
        const value = Number(el.value);

        if (value) {
            el.classList.remove('is-err');
        } else {
            el.classList.add('is-err');
        }
    },
    "isCalendar": (el) => {
        const input = el.querySelector('input[name="order-client-date"]');
        // console.log(input);
        if (input == null) {
            return;
        }

        if (input.value) {
            el.classList.remove('is-err');
        } else {
            el.classList.add('is-err');
        }
        // const calendars =
    },
    "isCalendarDateBasis": (el) => {
        console.log(el);
        const input = el.querySelector('input[name="basis-date"]');
        // console.log(input);
        if (input == null) {
            return;
        }

        if (input.value) {
            el.classList.remove('is-err');
        } else {
            el.classList.add('is-err');
        }
    },
    "isCalendarDateBasisRange": (el) => {
        const input = el;
        // console.log(el);
        if (input == null) {
            return;
        }

        if (input.value) {
            el.parentNode.classList.remove('is-err');
        } else {
            el.parentNode.classList.add('is-err');
        }
    },
    "isChecked": (el) => {
        const maxVolume = el.parentNode.parentNode.querySelector('input[name="order-end-volume"]');

        if (el.checked) {
            v.isNumber(maxVolume);
        } else {
            maxVolume.classList.remove('is-err');
            maxVolume.value = '';
        }
    },
    "isCheckedBasisDate": (el) => {
        // console.log(el.checked);
        const inputDate = el.parentNode.parentNode.querySelector('input[name="basis-date"]');
        const inputDateRange = el.parentNode.parentNode.querySelector('input[name="basis-date-range"]');
        const inputDateWrapper = el.parentNode.parentNode.querySelector('.js-basis-date .datetimepicker-dummy-wrapper');
        const inputDateRangeWrapper = el.parentNode.parentNode.querySelector('.js-basis-date-range .datetimepicker-dummy-wrapper');

        if (el.checked) {
            v.isCalendarDateBasisRange(inputDateRange);
        } else {
            // console.log(inputDateRangeWrapper, inputDateRange)
            inputDateRangeWrapper.classList.remove('is-err');
            // inputDateRange.value = '';
        }
    }
}

// Действия при добавлении нового правила валидации
// 1. Добавляем новое правило в объект v
// 2. Добавляем новый элемент для валидации в файл конфигурации
// 3. Добавляем новое правило валидации в функции установке полей для валидации vSetFilds(param)
// 4. Добавляем событие в функцию отслеживания событий изминения поля vEvent()
// 5. Добавляем элемент в функцию реет vReset()


// Установка полей для валидации
const vSetFilds = (param) => {
    console.log(param);
    param.forEach(field => {
        const elements = document.querySelectorAll(field.element);

        elements.forEach(element => {
            if (field.rule == 'isTextLength') {
                element.classList.add('v-is-text-length');
                element.setAttribute('data-criterion', field.criterion);
                v[field.rule](element);
            } else if (field.rule == 'isSelect') {
                element.classList.add('v-is-select');
                element.setAttribute('data-criterion', field.criterion);
                v[field.rule](element);
            } else if (field.rule == 'isCalendar') {
                const wrapper = element.querySelector('.datetimepicker-dummy-wrapper');
                element.classList.add('v-is-calender');
                v[field.rule](wrapper);
            } else if (field.rule == 'isNumber') {
                element.classList.add('v-is-number');
                element.setAttribute('data-criterion', field.criterion);
                v[field.rule](element);
            } else if (field.rule == 'isChecked') {
                element.classList.add('v-is-checked');
                element.setAttribute('data-criterion', field.criterion);
                v[field.rule](element);
            } // else if (field.rule == 'isCalendarDateBasis') {
            //     const wrapper = element.querySelector('.js-basis-date .datetimepicker-dummy-wrapper');
            //     element.classList.add('v-is-calender');
            //     v[field.rule](wrapper);
            // } else if (field.rule == 'isCalendarDateBasisRange') {
            //     const wrapper = element.querySelector('.js-basis-date-range .datetimepicker-dummy-wrapper');
            //     element.classList.add('v-is-calender');
            //     v[field.rule](wrapper);
            // } else if (field.rule == 'isCheckedBasisDate') {
            //     element.classList.add('v-is-checked-basis-date');
            //     element.setAttribute('data-criterion', field.criterion);
            //     v[field.rule](element);
            // }

        })

    })
}

// Установка события валидации поля
const vEvent = () => {
    const body = document.querySelector('body');

    body.addEventListener('input', (e) => {
        if (e.target.classList.contains('v-is-text-length')) {
            v.isTextLength(e.target);
        } else if (e.target.classList.contains('v-is-number')) {
            v.isNumber(e.target);
        }
    })

    body.addEventListener('change', (e) => {
        if (e.target.classList.contains('v-is-select')) {
            v.isSelect(e.target);
        } else if (e.target.classList.contains('v-is-checked')) {
            v.isChecked(e.target);
        } else if (e.target.classList.contains('v-is-checked-basis-date')) {
            v.isCheckedBasisDate(e.target);
        }
    })


}

// Валидация полей формы
const  validationForm = () => {
    const err = document.querySelectorAll('.is-err');
    // const

    if (err.length) {
        alert('Заполните обязательные поля!');
        return false;
    } else {
        return true;
    }

}

// // Проверка коректности заполнения полей дата в клиенте и дата в базисе
// const validationDateBasis = () => {



//     const dateDocument = document.querySelector('.js-type-date-is-range');
//     const dateBasiss = document.querySelectorAll('input[name="basis-date-range"]');

//     console.log(dateDocument.value);
//     console.log(dateBasiss);
// }

vEvent();

export default { vSetFilds, validationForm };
export { vSetFilds, validationForm };