export class NavbarRegionModel {
    constructor(model) {
        this.model = model;
        this.filter = new Set();
    }

    setFilters(filter) {
        if (this.filter.has(filter)) return false;
        this.filter.add(filter);
        return true;
    }

    getFilters() {
        return this.filter;
    }
}