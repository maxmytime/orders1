export class AppView {

    getTemplate(nameTemplate) {
        // Добавляем проверку существования шаблона
        const templateElement = document.querySelector('#' + nameTemplate);
        if (!templateElement) {
            throw new Error(`Шаблон c ID "${nameTemplate}" не найден`);
        }

        const templateFragment = templateElement.content.cloneNode(true);
        const template = templateFragment.querySelector('.' + nameTemplate);

        // Проверяем найден ли элемент внутри шаблона
        if (!template) {
            throw new Error(`Элемент с классом "${nameTemplate}" не найден`);
        }

        return template;
    }
}