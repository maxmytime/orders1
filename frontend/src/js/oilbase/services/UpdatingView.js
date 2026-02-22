export class UpdatingView {
    deleteElementByID(id) {
        document.querySelector(`div[data-id="${id}"]`).remove();
    }
}