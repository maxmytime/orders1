'use strict'

// Функция отключает прелоадер
const setPreloader = (container) => {
        const preloader = document.querySelector('.' + container);
        preloader.classList.add('is-hidden');
    }

export default setPreloader;
export { setPreloader };