export class ArchiveModel {
    constructor(model) {
        this.model = this.sort(model);
    }

    getDataByBaseName(basisName) {
        return this.model.filter(tank => tank.text_basis === basisName);
    }

    sort(data) {
        data.sort((a, b) => {
            // Преобразуем дату и время в объекты Date
            const parseDate = (dateStr, timeStr) => {
                const [day, month, year] = dateStr.split('.').map(Number);
                const [hours, minutes, seconds] = timeStr.split(':').map(Number);
                return new Date(year, month - 1, day, hours, minutes, seconds);
            };

            const dateA = parseDate(a.date, a.time);
            const dateB = parseDate(b.date, b.time);

            return dateB - dateA;
        });

        return data;
    }
}