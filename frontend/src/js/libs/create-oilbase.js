'use strict';

// Функция получает шаблон элемента
const getTemplate = (nameTemplate) => {
    const templateFragment = document.querySelector('#' + nameTemplate).content.cloneNode(true);
    const template = templateFragment.querySelector('.' + nameTemplate);

    return template;
}

const createTank = (template) => {
    console.log('Создать емкость');
    return template;
}

export default { createTank, getTemplate };
export { createTank, getTemplate };