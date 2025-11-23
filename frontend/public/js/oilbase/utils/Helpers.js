export class Helpers {
    getID() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    convertDateToInput(date) {
        const dateString = this.sanitizeString(date);
        if (!dateString) return '';

        try {
            // Проверка формата dd.mm.yyyy
            if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
                throw new Error(`Invalid date format: ${dateString}`);
            }

            const [day, month, year] = dateString.split('.');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } catch (error) {
            console.error('Date conversion error:', error);
            return '';
        }
    }

    convertDateTo1С(date) {
        if (date) {
            const dateString = this.sanitizeString(date);
            // console.log(date);
            if (!dateString) return '';

            try {
                // Проверка формата 2025-09-04
                if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                    throw new Error(`Invalid date format: ${dateString}`);
                }

                const [year, month, day] = dateString.split('-');
                return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
            } catch (error) {
                console.error('Date conversion error:', error);
                return '';
            }
        }
        return '';
    }

    sanitizeString(str) {
        return str.replace(/[^\d.-]/g, ''); // Удаляем все, кроме цифр, точек и дефисов
    }

    userRights(container) {

        const setTextContent = (selector) => {
            const el = container.querySelector(selector);
            if (el) {
                el.textContent = '-';
            } else {
                console.log('Элемент не найден:', selector);
            }
        }

        const setHidden = (selector) => {
            const el = container.querySelector(selector);

            if (el) {
                el.remove();
            } else {
                console.log('setDisabled: Элемент не найден:', selector);
            }
        }


        const userRights = sessionStorage.getItem('user_rights');
        // console.log(userRights);
        if (userRights === '2') {
            setTextContent('.management-сost');
            setTextContent('.management-сost-l');
            container.querySelector('input[name="cost_management_tonn"')
                ?.closest('.field').classList.add('is-hidden');
            container.querySelector('input[name="cost_management_litr"]')
                ?.closest('.field').classList.add('is-hidden');
        } else if (userRights === '3') {
            setTextContent('.management-сost');
            setTextContent('.management-сost-l');
            container.querySelector('input[name="cost_management_tonn"')
                ?.closest('.field').classList.add('is-hidden');
            container.querySelector('input[name="cost_management_litr"]')
                ?.closest('.field').classList.add('is-hidden');
            setHidden('.add-container');
            setHidden('.subtable-row-edit');

        }

        return userRights;
    }
}