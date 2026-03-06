export class Preloader {

  // Создание прелоада
  #createPreloader() {
    const icon = document.createElement('i');
    icon.className = 'preloader-spinner fa fa-circle-o-notch fa-spin ml-3';
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  // Активация прелоада
  activatePreload(element) {
    const preloader = this.#createPreloader();
    element.disabled = true;
    element.append(preloader);
  }

  // Деактивация прелоада
  deactivatePreload(element) {
    const icon = element.querySelector('i.preloader-spinner');
    if (icon) {
      element.disabled = false;
      icon.remove();
    }
  }
}