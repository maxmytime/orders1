'use strict'

const sliderActive = () => {

    const addressContainer = document.querySelector('.address-container');
    const offSet = 0;
    let counterBasis = basisNumberOfElements();
    let basisWidth;
    let clientWidth;
    let basisAllWidt;
    let translateX;
    let translateStart;
    let translateEnd;

    const container = document.querySelector('.address-container');
    let moveX, clickX = 0, step = 0;

    container.style.transform = `translate3D(-${offSet}px, 0px, 0px)`;


    // Возвращает текущее значение трансформ по оси X
    function positionTranslateX() {
        let regexp = /(?<=\()\d+|(?<=\()-\d+/g;
        let t = container.style.transform;
        return Number(t.match(regexp)[0]);
    }

    // Возвращает текущее колличество базисов
    function basisNumberOfElements() {
        return document.querySelectorAll('.basis').length;
    }

    // Возвращает ширину элемента базис
    function basisElementWidth() {
        try {

            return document.querySelector('.basis').offsetWidth;

        } catch (err) {

            // обработка ошибки

        }
    }

    // Возвращает сумму ширин всех элементов базис
    function basisWidthOfAllElements() {
        try {

            const width = document.querySelector('.basis').offsetWidth;
            const count = document.querySelectorAll('.basis').length;
            // return (width + 38) * count;
            return (width) * count;
        } catch (err) {

            // обработка ошибки

        }

    }

    // Возвращает ширину клиента
    function clientElementWidth() {
        return document.querySelector('.client').offsetWidth;
    }

    // Устанавливает ширину элементам .basis и .basis-container
    function basisSetWidth() {
        const cW = clientElementWidth();
        const b = document.querySelectorAll('.basis');

        if (cW < 900) {
            b.forEach(e => {
                e.style.width = cW + 'px';
                // e.style.width = '100%';
            });
            // console.log(cW);
        } else {
            b.forEach(e => {
                e.style.width = `500px`;
            });
        }

    }

    basisSetWidth();

    // СЛАЙДЕР

    function buttonActive() {
        const next = document.querySelector('.btn-next');
        const prev = document.querySelector('.btn-prev');
        const dots = document.querySelectorAll('.slider-dot');

        if (dots[0].classList.contains('slider-dot-active')) {
            prev.classList.add('disabled');
            next.classList.remove('disabled');
        } else if (dots[dots.length - 1].classList.contains('slider-dot-active')) {
            next.classList.add('disabled');
            prev.classList.remove('disabled');
        } else {
            next.classList.remove('disabled');
            prev.classList.remove('disabled');
        }

    }

    function slider() {
        const prev = document.querySelector('.btn-prev');
        const next = document.querySelector('.btn-next');
        const container = document.querySelector('.address-container');

        container.style.transition = '0.3s';

        // Устанавливает точки, активируем первую точку как активную
        function dots() {
            const basises = document.querySelectorAll('.basis');
            const sliderDots = document.querySelector('.slider-dots');

            basises.forEach(basis => {
                sliderDots.insertAdjacentHTML('beforeend', '<span class="slider-dot"></span>');
            })

            const firstDot = sliderDots.querySelector('.slider-dot');
            firstDot.classList.add('slider-dot-active');

            // <span class="slider-dot slider-dot-active"></span>
            // <span class="slider-dot"></span>
        }

        // Устанавливаем первый базис активным
        function basis() {
            const basises = document.querySelectorAll('.basis');
            basises[0].classList.add('basis-active');
        }

        // Делаем базисс активным и активируем соответствующую ему точку
        // next - слайдер двигается вперед
        // prev - слайдер двигается назад
        function activeDot(step) {
            const movement = step;
            let basises = document.querySelectorAll('.basis');
            const dots = document.querySelectorAll('.slider-dot');

            if (movement == 'next') {

                for (let i = 0; i < basises.length; ++i) {
                    if (basises[i].classList.contains('basis-active')) {
                        basises = document.querySelectorAll('.basis');
                        if (i + 1 < basises.length) {
                            basises[i].classList.remove('basis-active');
                            dots[i].classList.remove('slider-dot-active');
                            basises[i + 1].classList.add('basis-active');
                            dots[i + 1].classList.add('slider-dot-active');
                            break;
                        }
                    }
                }

            } else if (movement == 'prev') {

                for (let i = 0; i < basises.length; ++i) {
                    if (basises[i].classList.contains('basis-active')) {
                        console.log(i - 1);
                        if (i - 1 >= 0) {
                            if (i - 1 <= basises.length) {
                                basises[i].classList.remove('basis-active');
                                basises[i - 1].classList.add('basis-active');
                                dots[i].classList.remove('slider-dot-active');
                                dots[i - 1].classList.add('slider-dot-active');
                                break;
                            }
                            break;
                        }
                    }
                }
            }

        }

        dots();  // Устанавливаем точки
        basis(); // Первому базису ставим пометку "активный"
        buttonActive();

        // Кнопка движение слайдера в перед
        next.addEventListener('click', () => {
            const position = positionTranslateX();
            const basisWidth = basisElementWidth();
            const clientWidth = clientElementWidth();
            const k = Math.floor(clientWidth/basisWidth) * clientWidth
            let newPosition = position - basisWidth;

            if (newPosition >= (0 - (basisWidthOfAllElements() - clientWidth))) {
                activeDot('next');
                container.style.transform = `translate3D(${newPosition}px, 0, 0)`;
            } else {
                activeDot('next');
                container.style.transform = `translate3D(-${basisWidthOfAllElements() - clientWidth}px, 0, 0)`;
            }

            buttonActive();

        })

        // Кнопка движение слайдера назад
        prev.addEventListener('click', () => {
            const position = positionTranslateX();
            const basisWidth = basisElementWidth();
            const newPosition = position + basisWidth;

            if (newPosition <= 0) {
                activeDot('prev');
                container.style.transform = `translate3D(${newPosition}px, 0, 0)`;
            } else {
                activeDot('prev');
                container.style.transform = `translate3D(${0}px, 0, 0)`;
            }

            buttonActive();
        })
    }

    slider();
}

const buttonActive = () => {
    const next = document.querySelector('.btn-next');
    const prev = document.querySelector('.btn-prev');
    const dots = document.querySelectorAll('.slider-dot');

    if (dots[0].classList.contains('slider-dot-active')) {
        prev.classList.add('disabled');
        next.classList.remove('disabled');
    } else if (dots[dots.length - 1].classList.contains('slider-dot-active')) {
        next.classList.add('disabled');
        prev.classList.remove('disabled');
    } else {
        next.classList.remove('disabled');
        prev.classList.remove('disabled');
    }

}

const addDot = (basis) => {
    const basises = document.querySelectorAll('.basis');
    let sliderDots = document.querySelectorAll('.slider-dot');
    const sliderDot = document.querySelector('.slider-dots');
    let dots = document.querySelectorAll('.slider-dot');
    const container = document.querySelector('.address-container');
    const width = document.querySelector('.client').offsetWidth;
    let position = 0;

    // Возвращает текущее значение трансформ по оси X
    function positionTranslateX() {
        let regexp = /(?<=\()\d+|(?<=\()-\d+/g;
        let t = container.style.transform;
        return Number(t.match(regexp)[0]);
    }

    dots.forEach(dot => {
        dot.remove();
    })

    basises.forEach((basis, index) => {

        if (basis.classList.contains('basis-active')) {
            basis.classList.remove('basis-active');
            console.log(index);
            position = index + 1;
        }

        sliderDot.insertAdjacentHTML('beforeend', '<span class="slider-dot"></span>');
    })

    basises[position].classList.add('basis-active');
    sliderDot.querySelectorAll('.slider-dot')[position].classList.add('slider-dot-active');

    if (width <= 940) {
        container.style.transform = `translate3D(${positionTranslateX() - width}px, 0, 0)`;
    }

    console.log(document.querySelector('.client').offsetWidth, positionTranslateX());

    buttonActive();
}

const removeDot = () => {
    const basises = document.querySelectorAll('.basis');
    let sliderDots = document.querySelectorAll('.slider-dot');
    const sliderDot = document.querySelector('.slider-dots');
    let dots = document.querySelectorAll('.slider-dot');
    const container = document.querySelector('.address-container');
    const width = document.querySelector('.client').offsetWidth;
    let position = 0;

    // Возвращает текущее значение трансформ по оси X
    function positionTranslateX() {
        let regexp = /(?<=\()\d+|(?<=\()-\d+/g;
        let t = container.style.transform;
        return Number(t.match(regexp)[0]);
    }

    dots.forEach(dot => {
        dot.remove();
    })

    basises.forEach((basis, index) => {
        basis.classList.remove('basis-active');
        sliderDot.insertAdjacentHTML('beforeend', '<span class="slider-dot"></span>');
    })

    basises[0].classList.add('basis-active');
    sliderDot.querySelectorAll('.slider-dot')[0].classList.add('slider-dot-active');

    if (width <= 940) {
        container.style.transform = `translate3D(-${width}px, 0, 0)`;
    }

    console.log(document.querySelector('.client').offsetWidth, positionTranslateX());

    buttonActive();
}

const sliderPosition = () => {
    // Слайдер
    // ___________________________________________________________
    const basises = document.querySelectorAll('.basis');
    const basis = newAddress.querySelector('.basis');
    const sliderDots = document.querySelector('.slider-dots');
    let dots = sliderDots.querySelectorAll('.slider-dot');

    sliderDots.insertAdjacentHTML('beforeend', '<span class="slider-dot"></span>');
    dots.forEach(dot => {
        dot.classList.remove('slider-dot-active');
    })

    basises.forEach(basis => {
        basis.classList.remove('basis-active');
    })

    basis.classList.add('basis-active');

    for (let i = 0; i <= basises.length; i++) {
        if (basises[i].classList.contains('basis-active')) {
            dots = sliderDots.querySelectorAll('.slider-dot');
            dots[i].classList.add('slider-dot-active');
            break;
        }
    }

    const position = positionTranslateX();
    const basisWidth = basisElementWidth();
    const clientWidth = clientElementWidth();
    const k = Math.floor(clientWidth/basisWidth);
    const counterBasis = basisNumberOfElements();

    if (clientWidth <= 940) {
        if (counterBasis <= k && positionTranslateX() == 0) {
            // console.log(0);
        } else if (counterBasis == k + 1 && positionTranslateX() == 0) {
            addressContainer.style.transform = `translate3D(-${basisWidthOfAllElements() - clientElementWidth()}px, 0, 0)`;
            // console.log(1);
        } else {
            addressContainer.style.transform = `translate3D(${positionTranslateX() - basisWidth}px, 0, 0)`;
            // console.log(2);
        }
    }

    buttonActive();
}



export default { sliderActive, addDot, removeDot };
export { sliderActive, addDot, removeDot };
