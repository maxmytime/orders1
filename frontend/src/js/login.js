'use strict';

import settings from '/js/config.js';

window.addEventListener('DOMContentLoaded', () => {


    // console.log(settings.protocol, settings.host, settings.port);

    const getURL = (settings) => {
        const protocol = settings.protocol;
        const host = settings.host;
        const port = settings.port;
        const url = `${protocol}://${host}:${port}`;
        return url;
    }

    const inputPass = document.querySelector('input[name="password"]'),
          iconEyeSlash = document.querySelector('.pass-icon-eye-slash'),
          iconEye = document.querySelector('.pass-icon-eye');

    // console.log( document.cookie );

    iconEyeSlash.addEventListener('click', (e) => {
        iconEyeSlash.classList.add('is-hidden');
        iconEye.classList.remove('is-hidden');
        inputPass.setAttribute('type', 'text');
    });

    iconEye.addEventListener('click', (e) => {
        iconEyeSlash.classList.remove('is-hidden');
        iconEye.classList.add('is-hidden');
        inputPass.setAttribute('type', 'password');
    });

    const btnEntrance = document.querySelector('.js-entrance'),
          alert = document.querySelector('.js-alert');

    btnEntrance.addEventListener('click', (e) => {
        e.preventDefault();
        btnEntrance.innerHTML = `<i class="fa fa-spinner fa-spin fa-lg"></i>`;
        const login = document.querySelector('input[name="login"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const lp = Base64.encode(`${login}:${password}`);
        const user = {
            lp: lp,
            name: login
        };



        const hostName = getURL(settings) + '/login';
        console.log(hostName);

        alert.classList.add('is-hidden');

        fetch(hostName, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        }).then(response => {
            if (response.ok) {
                btnEntrance.innerHTML = `Вход`;
                // console.log(response.text());
                response.text().then(result => {
                    // confirm(document.location + result);
                    console.log(result);
                    sessionStorage.setItem('author', result.split(',')[2]);
                    sessionStorage.setItem('user_rights', result.split(',')[3]);
                    // alert('Продолжить');
                    const orders = document.querySelector('.orders');
                    const oilbase = document.querySelector('.oilbase');

                    if (orders.checked) {
                        document.location = document.location + result.split(',')[0];
                    } else if (oilbase.checked) {
                        document.location = document.location + result.split(',')[1];
                    }

                });
                // console.log(result);
                // document.location = response.url;
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        }).catch ((e) => {
            alert.classList.remove('is-hidden');
            btnEntrance.innerHTML = `Вход`;
        });

    });

    // Выбор сервиса ---------------------------
    const title = document.querySelector('.title-service');
    const services = document.querySelectorAll('input[name="service"]');
    console.log(services);

    services.forEach(service => {
        service.addEventListener('change', e => {
            console.log(e.target);
            if (e.target.classList.contains('orders')) {
                title.textContent = 'Заказы';
            } else if (e.target.classList.contains('oilbase')) {
                title.textContent = 'Нефтебазы';
            }
        })
    })

    // -----------------------------------------

});