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
import { SocketService } from '/js/oilbase/services/SocketService.js';
import { NavbarRegionModel } from '/js/oilbase/models/NavbarRegionModel.js';
import { NavbarRegionView } from '/js/oilbase/views/NavbarRegionView.js';
import { NavbarRegionController } from '/js/oilbase/controllers/NavbarRegionController.js';
import { OrderSupplyControllerFactory } from '/js/oilbase/OrderSupplyControllerFactory.js';
import { OrderSupplyModalModel } from '/js/oilbase/models/OrderSupplyModalModel.js';
import { OrderSupplyModalView } from '/js/oilbase/views/OrderSupplyModalView.js';
import { OrderSupplyModalContoller } from '/js/oilbase/controllers/OrderSupplyModalContoller.js';
import { PartDistributedModalModel } from '/js/oilbase/models/PartDistributedModalModel.js';
import { PartDistributedModalView } from '/js/oilbase/views/PartDistributedModalView.js';
import { PartDistributedModalController } from '/js/oilbase/controllers/PartDistributedModalController.js';


export class App {
    constructor(parts, tanks, basiss, distributeParts, suplOrders) {
        this.helpers = new Helpers();
        this.model = new AppModel(parts, tanks, basiss, this.helpers, distributeParts, suplOrders);
        this.basisView = new BasisView(this.helpers);
        this.modalView = new ModalView(this.helpers);
        this.partControllerFactory = new PartControllerFactory(this.helpers);
        this.tankControllerFactory = new TankControllerFactory(this.helpers);
        this.archiveControllerFactory = new ArchiveControllerFactory(this.helpers);
        this.basisControllerFactory = new BasisControllerFactory();
        this.orderSupplyControllerFactory = new OrderSupplyControllerFactory();



        this.socket = new SocketService();


        // Модальное окно распределения заявки в секцию. Открывается из заявки снабжения
        this.partDistributedModalModel = new PartDistributedModalModel();
        this.partDistributedModalView = new PartDistributedModalView();
        this.partDistributedModalController = new PartDistributedModalController(
            this.partDistributedModalModel,
            this.partDistributedModalView
        );

        // Модальное окно сохдания/изменения заявки снабжения
        this.orderSupplyModalView = new OrderSupplyModalView();
        this.orderSupplyModalModel = new OrderSupplyModalModel();
        this.orderSupplyModalContoller = new OrderSupplyModalContoller(
            this.model,
            this.orderSupplyModalModel,
            this.orderSupplyModalView,
            this.partDistributedModalController,
            this.helpers,
            this.socket
        );

        this.modalController = new ModalController(
            this.model,
            this.modalView,
            this.partControllerFactory,
            this.tankControllerFactory,
            this.helpers,
            this.socket
        );

        this.basisController = new BasisController(
            this.model,
            this.basisView,
            this.modalController, // Внедряем зависимость
            this.orderSupplyModalContoller, // Внедряем зависимость
            this.partControllerFactory, // Добавляем фабрику создания части заявки
            this.tankControllerFactory, // Добавляем фабрику создания емкости
            this.orderSupplyControllerFactory, // Добавляем фабрику создания заявки снабжения
            this.helpers,
            this.socket
        );

        this.modalController.basisController = this.basisController;

        // Навигационная панель
        this.navbarModel = new NavbarModel({
            'modalController': this.modalController
        })
        this.navbarView = new NavbarView(this.helpers);
        this.navbarController = new NavbarController(this.navbarModel.model, this.navbarView, this.archiveControllerFactory);

        // Навигационная панель по регионам
        this.navbarRegionModel = new NavbarRegionModel(this.model.getBasissFull());
        this.navbarRegionView = new NavbarRegionView();
        this.navbarRegionController = new NavbarRegionController(this.navbarRegionModel, this.navbarRegionView, this.basisController);
    }



    init() {
        this.orderSupplyModalContoller.init();
        this.partDistributedModalController.init();
        this.modalController.init();
        this.navbarController.init();
        this.basisController.init();
        this.navbarRegionController.init();
    }
}