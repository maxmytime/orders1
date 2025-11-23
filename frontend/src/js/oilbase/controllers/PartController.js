export class PartController {
    constructor(model, view, index) {
        this.model = model;
        this.view = view;
        this.index = index;
        // Контроллер подписывается на события
        // this.view.getContainer().addEventListener('click', this.openModal.bind(this));
        // console.log(model);

    }

    // Инициализация части заявки
    initPart() {
        this.view.renderPart(this.model, this.index);
    }

    render() {
        const element = this.view.renderPart(this.model, this.index);
        return element; // Возвращаем созданный элемент
    }

    renderDistributed() {
        const element = this.view.renderPartDistributed(this.model, this.index);
        return element; // Возвращаем созданный элемент
    }

    updateUndistributedPart() {
        this.view.updateUndistributedPart(this.model, this.view.container);
    }

    updateDistributedPart() {
        console.log("updateDistributedPart");
        this.view.updateDistributedPart(this.model, this.view.container);
    }

    deletePart() {
        this.view.deletePart(this.view.container);
    }

    updateSerialNumber(wrapper) {
        this.view.updateSerialNumber(wrapper);
    }
}