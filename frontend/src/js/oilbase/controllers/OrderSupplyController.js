export class OrderSupplyController {
  constructor(modal, view) {
    this.model = modal;
    this.view = view;

    // console.log('OrderSupplyController');
    // Контроллер подписывается на событие выбора региона в меню
    // this.view.getContainer().addEventListener('click', this.choosingRegion.bind(this));

  }

  createDetalis(orderSupply, model) {
    const TYPE = {
      OWN_WAREHOUSE: 1, // Свой склад
      DISTRIBUTED: 2    // Распределенный
    }

    const detalis = {
      'type_suplorder': orderSupply.type_suplorder,
      'data': []
    }

    if (Array.isArray(orderSupply.array_sections) && orderSupply.array_sections.length > 0) {
      orderSupply.array_sections.forEach((section) => {

        if (orderSupply.type_suplorder === TYPE.OWN_WAREHOUSE) {

          if (Array.isArray(section.array_tanks) && section.array_tanks.length > 0) {
            section.array_tanks.forEach((tank) => {
              // console.log(tank);
              const tankID = model.getTankIDByNumber(tank.code_tank);
              // console.log(tankID);
              if (tankID) {
                const tankName = model.getTank(tankID).tank.name;
                detalis.data.push({
                  'tank': tankName,
                  ...tank,
                });
              }
            });
          }

        } else if (orderSupply.type_suplorder === TYPE.DISTRIBUTED) {

          if (Array.isArray(section.array_dispatch) && section.array_dispatch.length > 0) {
            section.array_dispatch.forEach((dispatch) => {
              const guidOrderBlock = dispatch.guid_orderblock;
              console.log(model.getPartGuid(guidOrderBlock));
              if (model.getPartGuid(guidOrderBlock)) {
                const part = model.getPartGuid(guidOrderBlock).part;

                detalis.data.push({
                  'dispatch': dispatch.volume_dispatch,
                  'basisDateEnd': part.basisDateEnd,
                  'basisDateStart': part.basisDateStart,
                  'dateEnd': part.dateEnd,
                  'dateStart': part.dateStart,
                  'client': part.client,
                  'counteragent': part.counteragent,
                  'product': part.product,
                });
              }
            });
          }

        }

      });
    }

    return detalis;
  }

  render(orderSupply, model) {
    const detalis = this.createDetalis(orderSupply, model);
    return this.view.render(orderSupply, detalis);
  }

  renderNewOrderSupply(docObject, tankID, index, model) {
    const detalis = this.createDetalis(docObject, model);
    this.view.renderNewOrderSupply(docObject, tankID, index, detalis);
  }

  updateOrderSupply(docObject, modal) {
    const detalis = this.createDetalis(docObject, model);
    this.view.updateOrderSupply(docObject, detalis);
  }

}