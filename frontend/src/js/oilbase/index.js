'use strict';
import settings from '/js/config.js';
import { App } from '/js/oilbase/App.js';
import { ApiClient } from '/js/oilbase/models/ApiClient.js';

window.addEventListener('DOMContentLoaded', () => {

    const getURL = (settings) => {
        const protocol = settings.protocol;
        const host = settings.host;
        const port = settings.port;
        const url = `${protocol}://${host}:${port}`;
        return url;
    }

    // user rights
    // sessionStorage.setItem('user_rights', 1);

    // Функция инициализации приложения
    const initApp = async () => {
        const api = new ApiClient();  // Инициализация экземпляра класса с роутами
        const dataOrders = await api.fetchGetData(`/orderlist?archieved=false`);                    // Получаем данные от сервиса
        const dataAllBases = await api.fetchGetData(`/getbasises`);
        const dataTankList = await api.fetchGetData(`/gettanklist`);
        const dataDispatchList = await api.fetchGetData(`/getdispatchlist`);
        console.log(dataDispatchList);

        const undistributeParts = dataOrders.Data.OrdersList;
        const distributeParts = dataDispatchList.Data.OrdersList;
        const tanks = dataTankList.Data.OrdersList;
        const basiss = dataAllBases.Data;

        const app = new App(undistributeParts, tanks, basiss, distributeParts);  // Создаем экземпляр модели приложения "AppModel"
        app.init();         // Инициализация приложения
    }

    // Инициализация приложения
    initApp();

    // const updateApp = () => {
    //     const appOld = document.querySelector('.app-oilbase');
    //     appOld.textContent = '';
    //     const appNew = appOld.cloneNode(true);
    //     appOld.parentNode.replaceChild(appNew, appOld);


    //     initApp();
    // }
    // setInterval(updateApp, 60000);
});