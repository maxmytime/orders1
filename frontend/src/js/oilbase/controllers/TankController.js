export class TankController {
    constructor(model, view, index) {
        this.model = model;
        this.view = view;
        this.index = index;
    }

    renderNewTank() {
        this.view.renderNewTank(this.model);
    }

    getObjectCreatTank() {
        console.log('getObjectCreatTank', Number(this.model.model.type_tank));
        return {
            'code': this.model.model.code,  //только для изменений, код емкости, присваивается при создании
            'name': this.model.model.name,
            'type_action_tank': 1, //аналогично type_action_order (1 - новая, 2 - обновить данные)
            'type_tank': Number(this.model.model.type_tank),  //тип емкости, 1 - емкость, 2 - спецификация
            'name_base': this.model.model.name_base,          //аналогично заявке
            'redeem_volume': this.model.model.redeem_volume,  //выкупленный объем, не 0 только для спецификация
            'date_limitation_redeem': this.model.model.date_limitation_redeem,         //срок выборки, не "00010101" только для спецификаций
            'cost_management_tonn': this.model.model.cost_management_tonn,        //управленческая себестоимость т
            'cost_price_tonn': this.model.model.cost_price_tonn,    //прайсовая себестоимость т
            'cost_management_litr': this.model.model.cost_management_litr,    //управленческая себестоимость л
            'cost_price_litr': this.model.model.cost_price_litr,    //прайсовая себестоимость л
            'code_product': this.model.model.product.code_product,  //код продукта
            'code_client': this.model.model.client.code_client,     //код клиента, можно без него, потому что у емкостей как я понимаю клиентов не будет
            'volume': this.model.model.volume,
            'density': this.model.model.density,
            'weight': this.model.model.weight,
            'commentary': "какой-то коммент",
        }
    }

    getObjectUpdateTank() {
        console.log(this.model.model);
        return {
            'code': this.model.model.code,                    //только для изменений, код емкости, присваивается при создании
            'name': this.model.model.name,
            'type_action_tank': 2,                //аналогично type_action_order (1 - новая, 2 - обновить данные)
            'type_tank': this.model.model.type_tank,          //тип емкости, 1 - емкость, 2 - спецификация
            'name_base': this.model.model.name_base,          //аналогично заявке
            'redeem_volume': this.model.model.redeem_volume,  //выкупленный объем, не 0 только для спецификация
            'date_limitation_redeem': this.model.model.date_limitation_redeem,         //срок выборки, не "00010101" только для спецификаций
            'cost_management_tonn': this.model.model.cost_management_tonn,        //управленческая себестоимость т
            'cost_price_tonn': this.model.model.cost_price_tonn,    //прайсовая себестоимость т
            'cost_management_litr': this.model.model.cost_management_litr,    //управленческая себестоимость л
            'cost_price_litr': this.model.model.cost_price_litr,    //прайсовая себестоимость л
            'code_product': this.model.model.product.code_product,  //код продукта
            'code_client': this.model.model.client.code_client,     //код клиента, можно без него, потому что у емкостей как я понимаю клиентов не будет
            'volume': this.model.model.volume,
            'density': this.model.model.density,
            'weight': this.model.model.weight,
            'commentary': "какой-то коммент",
        }
    }

    getObjectDeleteTank() {
        console.log(this.model.model);
        return {
            'code': this.model.model.code,                    //только для изменений, код емкости, присваивается при создании
            'name': this.model.model.name,
            'type_action_tank': 3,                //аналогично type_action_order (1 - новая, 2 - обновить данные)
            'type_tank': this.model.model.type_tank,          //тип емкости, 1 - емкость, 2 - спецификация
            'name_base': this.model.model.name_base,          //аналогично заявке
            'redeem_volume': this.model.model.redeem_volume,  //выкупленный объем, не 0 только для спецификация
            'date_limitation_redeem': this.model.model.date_limitation_redeem,         //срок выборки, не "00010101" только для спецификаций
            'cost_management_tonn': this.model.model.cost_management_tonn,        //управленческая себестоимость т
            'cost_price_tonn': this.model.model.cost_price_tonn,    //прайсовая себестоимость т
            'cost_management_litr': this.model.model.cost_management_litr,    //управленческая себестоимость л
            'cost_price_litr': this.model.model.cost_price_litr,    //прайсовая себестоимость л
            'code_product': this.model.model.product.code_product,  //код продукта
            'code_client': this.model.model.client.code_client,     //код клиента, можно без него, потому что у емкостей как я понимаю клиентов не будет
            'volume': this.model.model.volume,
            'density': this.model.model.density,
            'weight': this.model.model.weight,
            'commentary': "какой-то коммент",
        }
    }

    updateSort() {
        // console.log('updateSort', this.model);
        const listOfDistributedApplications = this.model.model.listOfDistributedApplications;
        // console.log(listOfDistributedApplications);
        let sortList = [];
        const listParts = [...this.view.container.querySelectorAll('.distributed')];
        let objectUpdateSort = [];

        for (const [index, part] of Object.entries(listParts)) {
            sortList.push({'index': Number(index) + 1, 'id': part.dataset.id});;
        }

        sortList.forEach((item) => {
            for (const element of listOfDistributedApplications) {
                if (item.id === element.id) {
                    element.sort_number = item.index;
                    break;
                }
            }
        })

        listOfDistributedApplications.sort((a, b) => a.sort_number - b.sort_number);

        listOfDistributedApplications.forEach(part => {
            objectUpdateSort.push({"number": part.number, "sort_number": part.sort_number});
        });

        listParts.forEach((part, index) => {
            part.querySelector('.part-number').textContent = Number(index) + 1;
        })

        return objectUpdateSort;


    }

    alertTank() {
        this.view.alertTank();
    }

    volumeСalculation() {
        // console.log(this.model.model);
        const objectID = this.view.getObjectID();
        // console.log('objectID:', objectID);
        const partList = this.model.model.listOfDistributedApplications;
        let objectUpdateVolume = {};
        objectUpdateVolume.volume_plan = this.model.model.volume;
        objectUpdateVolume.volume_part = {};
        let kindOrder = false;

        objectID.forEach(id => {
            // console.log(partList);
            const part = partList.find(part => part.id === id.id);
            // console.log(typeof part.kind_order);
            // if (!kindOrder && part) {
            //     kindOrder = Number(part.kind_order) === 2 ? true : false;
            // }


            if (part && part.kind_order == 1) {
                // console.log(objectUpdateVolume.volume_plan, part.volume);
                objectUpdateVolume.volume_part[id.id] = (Number(objectUpdateVolume.volume_plan) - Number(part.volume)).toFixed(3);
                objectUpdateVolume.volume_plan = (Number(objectUpdateVolume.volume_plan) - Number(part.volume)).toFixed(3);
                // console.log(objectUpdateVolume);
                // this.view.updateVolume(objectUpdateVolume);
            } else if (part && part.kind_order == 2) {
                // objectUpdateVolume.volume_part[id.id] = '-';
                // console.log(part);
                objectUpdateVolume.volume_part[id.id] = (Number(objectUpdateVolume.volume_plan) + Number(part.volume)).toFixed(3);
                objectUpdateVolume.volume_plan = (Number(objectUpdateVolume.volume_plan) + Number(part.volume)).toFixed(3);
                // this.view.updateVolume(objectUpdateVolume);
            }

        })
        // console.log(objectUpdateVolume);
        this.view.updateVolume(objectUpdateVolume);

    }

    // Пересчет остатка емкости после отгрузки
    recalculatingBalance(volume, weight, kindOrder) {
        const tank = this.model.model;
        console.log(tank.weight, weight);
        if (kindOrder == 1) {
            tank.volume = Number(tank.volume) - Number(volume);
            tank.volume_plan = Number(tank.volume_plan) - Number(volume);
            tank.weight = (Number(tank.weight) - Number(weight)).toFixed(3);
        } else if (kindOrder == 2) {
            tank.volume = Number(tank.volume) + Number(volume);
            tank.volume_plan = Number(tank.volume_plan) + Number(volume);
            tank.weight = (Number(tank.weight) + Number(weight)).toFixed(3);
        }


        this.view.renderUpdateTank(this.model);
    }

    // --------------------------------------------------

    render() {
        const element = this.view.renderTank(this.model, this.view, this.index);
        return element;
    }

    renderUpdateTank() {
        this.view.renderUpdateTank(this.model);
    }

    renderInit() {
        const element = this.view.renderTank(this.model);
        return element;
    }

}