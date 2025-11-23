
export class BasisModel {
    name = '';
    listOfUndistributedApplications = []; // Список не распределенных частей заявок
    listOfContainers = [];                // Список емкостей

    constructor(name, helpers) {
        this.helpers = helpers;
        this.id = this.helpers.getID();
        this.name = name;
    }
}