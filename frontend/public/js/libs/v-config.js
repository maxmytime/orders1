// Конфигурация валидации полей для "Прихода"
const orderFields = [{
    // Валидация поля БАЗА
    'element': 'input[name="order-client-name"]',
    'rule': 'isTextLength',
    'criterion': 2
},
{   // Валидация поля БАЗИС
    'element': 'input[name="order-basis"]',
    'rule': 'isTextLength',
    'criterion': 2
},
{   // Валидация поля ПРОДУКТ
    'element': 'input[name="order-product"]',
    'rule': 'isTextLength',
    'criterion': 2
},
{   // Валидация поля НОМЕНКЛАТУРА
    'element': 'input[name="order-nomenclature"]',
    'rule': 'isTextLength',
    'criterion': 2
},
{
    // Валидация поля ТИП ОТГРУЗКИ
    'element': 'select[name="order-client-type-shipment"]',
    'rule': 'isSelect',
    'criterion': 0
},
{
    // Валидация поля ДАТА
    'element': '.datetimepicker-dummy',
    'rule': 'isCalendar',
    'criterion': false
},
{
    // Валидация поля ДАТА БАЗИСА
    'element': '.js-basis-date .datetimepicker-dummy-wrapper',
    'rule': 'isCalendarDateBasis',
    'criterion': false
},
{
    // Валидация поля ДАТА БАЗИСА Диапазон
    'element': '.js-basis-date-range .datetimepicker-dummy-wrapper',
    'rule': 'isCalendarDateBasisRange',
    'criterion': false
},
{
    // Валидация поля МИНИМАЛЬНЫЙ ОБЪЕМ
    'element': 'input[name="order-start-volume"]',
    'rule': 'isNumber',
    'criterion': 0
},
{
    // Валидация поля МИНИМАЛЬНЫЙ ОБЪЕМ
    'element': 'input[name="order-end-volume"]',
    'rule': 'isNumber',
    'criterion': 0
},
{
    // Валидация поля ДОСТАВКА
    'element': 'input[name="order-cost-delivery"]',
    'rule': 'isTextLength',
    'criterion': 1
},
{
    // Валидация поля ДОСТАВКА ЧЕКБОКС + ДОСТАВКА МАКСИМАЛЬНЫЙ ОБЪЕМ
    'element': 'input[name="order-volume-range"]',
    'rule': 'isChecked',
    'criterion': 0
},
{
    // Валидация поля ЧЕКБОКС ДАТА БАЗИСА
    'element': '.js-basis-date-checkbox',
    'rule': 'isCheckedBasisDate',
    'criterion': 0
}]

// Конфигурация валидации полей для "Брони прихода"
const orderReservation = [{   // Валидация поля БАЗА
    'element': 'input[name="order-client-name"]',
    'rule': 'isTextLength',
    'criterion': 2
},
{   // Валидация поля БАЗИС
    'element': 'input[name="order-basis"]',
    'rule': 'isTextLength',
    'criterion': 2
},
{   // Валидация поля ПРОДУКТ
    'element': 'input[name="order-product"]',
    'rule': 'isTextLength',
    'criterion': 2
},
{   // Валидация поля НОМЕНКЛАТУРА
    'element': 'input[name="order-nomenclature"]',
    'rule': 'isTextLength',
    'criterion': 2
},
{
    // Валидация поля ТИП ОТГРУЗКИ
    'element': 'select[name="order-client-type-shipment"]',
    'rule': 'isSelect',
    'criterion': 0
},
{
    // Валидация поля ДАТА
    'element': '.datetimepicker-dummy',
    'rule': 'isCalendar',
    'criterion': false
},
{
    // Валидация поля МИНИМАЛЬНЫЙ ОБЪЕМ
    'element': 'input[name="order-start-volume"]',
    'rule': 'isNumber',
    'criterion': 0
},
{
    // Валидация поля МИНИМАЛЬНЫЙ ОБЪЕМ
    'element': 'input[name="order-end-volume"]',
    'rule': 'isNumber',
    'criterion': 0
},
{
    // Валидация поля ДОСТАВКА
    'element': 'input[name="order-cost-delivery"]',
    'rule': 'isTextLength',
    'criterion': 1
},
{
    // Валидация поля ДОСТАВКА ЧЕКБОКС + ДОСТАВКА МАКСИМАЛЬНЫЙ ОБЪЕМ
    'element': 'input[name="order-volume-range"]',
    'rule': 'isChecked',
    'criterion': 0
}]

// Сброс полей валидации
const vReset = (param) => {
    param.forEach(field => {
        const elements = document.querySelectorAll(field.element);

        elements.forEach(element => {
            if (element.classList.contains('v-is-text-length')) {
                element.classList.remove('v-is-text-length');
                element.classList.remove('is-err');
                element.removeAttribute('data-criterion');
            } else if (element.classList.contains('v-is-select')) {
                element.classList.remove('v-is-select');
                element.classList.remove('is-err');
                element.removeAttribute('data-criterion');
            } else if (element.classList.contains('v-is-calender')) {
                const wrapper = element.querySelector('.datetimepicker-dummy-wrapper');
                element.classList.remove('v-is-calender');
                wrapper.classList.remove('is-err');
                wrapper.removeAttribute('data-criterion');
            } else if (element.classList.contains('v-is-number')) {
                element.classList.remove('v-is-number');
                element.classList.remove('is-err');
                element.removeAttribute('data-criterion');
            } else if (element.classList.contains('v-is-checked')) {
                element.classList.remove('v-is-checked');
                element.classList.remove('is-err');
                element.removeAttribute('data-criterion');
            }

        })

    })
}

// Устанавляиваем поля валидации при смене типа заявки
const vSet = (cb) => {
    const type = document.querySelector('.js-type-order').dataset.typeOrder;

    if (type == 2) {
        vReset(orderReservation);
        cb(orderFields);
    } else if (type == 1) {
        vReset(orderFields);
        cb(orderReservation);
    }

}

export default vSet;
export { vSet };