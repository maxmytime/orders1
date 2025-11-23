import { AppModel } from '/js/oilbase/models/AppModel.js';
import { BasisView } from '/js/oilbase/views/BasisView.js';
import { BasisController } from '/js/oilbase/controllers/BasisController.js';
import { ModalModel } from '/js/oilbase/models/ModalModel.js';
import { ModalView } from '/js/oilbase/views/ModalView.js';
import { ModalController } from '/js/oilbase/controllers/ModalController.js';
import { PartControllerFactory } from '/js/oilbase/PartControllerFactory.js';
import { TankControllerFactory } from '/js/oilbase/TankControllerFactory.js';
import { ArchiveControllerFactory } from '/js/oilbase/ArchiveControllerFactory.js';
import { Helpers } from '/js/oilbase/utils/Helpers.js';
import { NavbarModel } from '/js/oilbase/navbar/NavbarModel.js';
import { NavbarController } from '/js/oilbase/navbar/NavbarController.js';
import { NavbarView } from '/js/oilbase/navbar/NavbarView.js';
import { BasisControllerFactory } from '/js/oilbase/BasisControllerFactory.js';


export class App {
    constructor(parts, tanks, basiss, distributeParts) {
        this.helpers = new Helpers();
        this.model = new AppModel(parts, tanks, basiss, this.helpers, distributeParts);
        this.basisView = new BasisView(this.helpers);
        this.modalView = new ModalView(this.helpers);
        this.partControllerFactory = new PartControllerFactory(this.helpers);
        this.tankControllerFactory = new TankControllerFactory(this.helpers);
        this.archiveControllerFactory = new ArchiveControllerFactory(this.helpers);
        // this.basisControllerFactory = new BasisControllerFactory();


        this.modalController = new ModalController(
            this.model,
            this.modalView,
            this.partControllerFactory,
            this.tankControllerFactory,
            this.helpers
        );

        this.basisController = new BasisController(
            this.model,
            this.basisView,
            this.modalController, // Внедряем зависимость
            this.partControllerFactory, // Добавляем фабрику создания части заявки
            this.tankControllerFactory, // Добавляем фабрику создания емкости
            this.helpers
        );

        this.modalController.basisController = this.basisController;

        // Навигационная панель
        this.navbarModel = new NavbarModel({
            'modalController': this.modalController
        })
        this.navbarView = new NavbarView(this.helpers);
        this.navbarController = new NavbarController(this.navbarModel.model, this.navbarView, this.archiveControllerFactory);
    }



    init() {
        this.modalController.init();
        this.navbarController.init();
        this.basisController.init();
    }
}