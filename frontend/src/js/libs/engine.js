'use strict'

// Функция преобразует текстове представление HTML-шаблон в HTML-элемент
const engineHTML = (template, classElement) => {
        const parser = new DOMParser();                             // Создаем объект парсера
        const tpl = parser.parseFromString(template, "text/html");  // Создаем HTML-элемент
        const element = tpl.querySelector('.' + classElement);       // Получаем готовый элемент

        return element.cloneNode(true)                               // Возвращаем HTML-элемент
    }

export default engineHTML;
export { engineHTML };