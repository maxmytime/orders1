import { ApiClient } from '/js/oilbase/models/ApiClient.js';

export class NavbarController {
    constructor(model, view, archiveControllerFactory) {
        this.model = model;
        this.view = view;
        this.archiveControllerFactory = archiveControllerFactory;
        this.api = new ApiClient();

        // Контроллер подписыватся на нажатие кнопки "Емкость +"
        this.view.getContainer().addEventListener('click', this.addTank.bind(this));
        // Контроллер подписыватся на нажатие кнопки "Открыть архив"
        this.view.getContainer().addEventListener('click', this.openArchive.bind(this));
        // Контроллер подписыватся на нажатие кнопки "Открыть архив" в новой вкладке
        this.view.getContainer().addEventListener('click', this.openArchiveNewTab.bind(this));
        // Контроллер подписыватся на нажатие кнопки "Выход"
        this.view.getContainer().addEventListener('click', this.exit.bind(this));

    }

    // Открть модальное окно для добавления новой емкости
    addTank(e) {
        if (e.target.classList.contains('bnt-add-container')) {
            e.preventDefault();
            this.model.modalController.openModalAddTank();
        }
    }

    openArchiveNewTab(e) {
        if (e.target.classList.contains('btn-open-archive') && e.ctrlKey) {
            window.open(document.location.origin + `/oilbase?archive=active`, '_blank');
        }
    }

    async openArchive(e) {
        if (e.target.classList.contains('btn-open-archive') && !e.ctrlKey) {
            console.log('Открыть архив');

            this.archiveActive();

        }
    }

    async exit(e) {
        if (e.target.classList.contains('bnt-oilbase-exit')) {
            console.log('exit()');
            const status = this.api.fetchGetData(`/exit`);
            if (status) {
                window.location.href = window.location.origin;
            }
        }
    }

    async archiveActive() {
        document.querySelector('.preloader').classList.remove('is-hidden');

        // const navbar = e.target.closest('.nav-bar');
        const navbar = document.querySelector('.nav-bar-left');
        navbar.querySelector('.bnt-add-container')?.classList.toggle('is-hidden');
        navbar.querySelector('.fa-archive').classList.toggle('is-hidden');
        navbar.querySelector('.fa-times').classList.toggle('is-hidden');

        if (navbar.querySelector('.fa-archive').classList.contains('is-hidden')) {
            // Получаем список всех емкостей
            const dataTankList = await this.api.fetchGetData(`/gettanklist`);
            const tanks = dataTankList.Data.OrdersList;
            // let dataArchive = [];
            const dataArchive = await this.api.fetchGetData(`/gettankhistory`);
            console.log(dataArchive.Data.TankHistory);

            // for (const tank of tanks) {
            //     const history = await this.api.fetchGetData(`/gettankhistory?CodeTank=` + `${tank.code}`);
            //     dataArchive.push(...history.Data.TankHistory);
            //     console.log(dataArchive);
            // }

            const archiveController = this.archiveControllerFactory.create(dataArchive.Data.TankHistory);
            // console.log(archiveController);
            archiveController.openArchive(dataArchive.Data.TankHistory, tanks);
        } else {
            document.querySelector('.archive').remove();
            const oilbasis = document.querySelectorAll('.oilbasis');
            oilbasis.forEach(element => {
                element.classList.toggle('is-hidden');
            });
        }

        document.querySelector('.preloader').classList.add('is-hidden');
    }

    init() {
        this.view.render();
        if (new URLSearchParams(window.location.search).get('archive')) {
            this.archiveActive();
        }
    }

}