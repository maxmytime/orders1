export class CalculatorsOrderSupply {
  // Расчет плотности
  calculatorDensity(container) {
    const volume = Number(container.querySelector('input[name="os-volume_fact"]').value);
    const weight = Number(container.querySelector('input[name="os-weight_fact"]').value);
    const density = container.querySelector('input[name="os-density_fact"]');

    density.value = ((weight * 1000) / volume).toFixed(4);
  }

  // Расчет веса топлива
  calculationWeight(volume, density) {
    return (Number(volume) * Number(density) / 1000).toFixed(3);
  }

  // Расчет фактически отгружаемого ГСМ
  distributionFact(modal) {
    const orderSupplyWeight = modal.querySelector('input[name="os-weight_fact"]');
    const orderSupplyVolume = modal.querySelector('input[name="os-volume_fact"]');
    const densityFact = modal.querySelector('.order-supply-parametrs input[name="os-density_fact"]');
    let sectionsWeight = 0;

    orderSupplyWeight.value = this.calculationWeight(orderSupplyVolume.value, densityFact.value);

    // Все поля фактической емкости в секциях и распределенных блоках
    const densityFilds = modal.querySelectorAll('.order-supple-sections input[name="os-density_fact"]');
    // Устанавливаем во всех полях фактической емкости плотность указанную в параметрах заявки
    densityFilds.forEach(densityFild => {
      densityFild.value = densityFact.value;
    })

    // Определяем тип ЗС true - на свой склад, false - под клиента
    const typeOrderSupplyWarehous = modal.querySelector('.warehous') ? true : false;



    // Секции
    const sections = modal.querySelectorAll('.order-supply-section');
    sections.forEach(section => {
      let dispatchWeight = 0;
      const dispatchSection = section.querySelector('input[name="order-supply-distributed"]');
      const densitySectionFact = section.querySelector('input[name="os-density_fact"]');
      const weightSectionFact = section.querySelector('input[name="os-weight_fact"]');
      const volumeSectionFact = section.querySelector('input[name="os-volume_fact"]');
      // volumeSectionFact.value = dispatchSection.value;
      weightSectionFact.value = this.calculationWeight(volumeSectionFact.value, densitySectionFact.value);
      sectionsWeight += Number(Number(weightSectionFact.value).toFixed(3));

      // Если тип отгрузки ЗС клиенту выполняется первая ветка
      // Если тип отгрузки ЗС на свой склад выполняется вторая ветка
      if (!typeOrderSupplyWarehous) { // Первая ветка
        // Блоки
        const blocks = section.querySelectorAll('.order-supply-distributed-part');
        blocks.forEach(block => {
          const partRemainder = block.querySelector('.part-remainder').textContent;
          const densityDispatchFact = block.querySelector('input[name="os-density_fact"]');
          const weightDispatchFact = block.querySelector('input[name="os-weight_fact"]');
          const volumeDispatchFact = block.querySelector('input[name="os-volume_fact"]');
          // volumeDispatchFact.value = partRemainder;
          weightDispatchFact.value = this.calculationWeight(volumeDispatchFact.value, densityDispatchFact.value);
          dispatchWeight += Number(Number(weightDispatchFact.value).toFixed(3));
        })

        // Валидируем поля веса в блоках
        if (dispatchWeight.toFixed(3) !== weightSectionFact.value) {
          weightSectionFact.classList.add('is-err');
        } else {
          weightSectionFact.classList.remove('is-err');
        }

      } else if (typeOrderSupplyWarehous) { // Вторая ветка 
        // Свой склад
        const warehouses = section.querySelectorAll('.order-supply-warehous');
        warehouses.forEach(warehous => {
          const warehousVolume = warehous.querySelector('input[name="warehouse_volume"]').value;
          const densityDispatchFact = warehous.querySelector('input[name="os-density_fact"]');
          const weightDispatchFact = warehous.querySelector('input[name="os-weight_fact"]');
          const volumeDispatchFact = warehous.querySelector('input[name="os-volume_fact"]');
          // volumeDispatchFact.value = partRemainder;
          weightDispatchFact.value = this.calculationWeight(volumeDispatchFact.value, densityDispatchFact.value);
          dispatchWeight += Number(Number(weightDispatchFact.value).toFixed(3));
        })

        // Валидируем поля веса в блоках
        if (dispatchWeight.toFixed(3) !== weightSectionFact.value) {
          weightSectionFact.classList.add('is-err');
        } else {
          weightSectionFact.classList.remove('is-err');
        }
      }



    });

    // Валидируем поля веса в секциях
    if (sectionsWeight.toFixed(3) !== orderSupplyWeight.value) {
      orderSupplyWeight.classList.add('is-err');
    } else {
      orderSupplyWeight.classList.remove('is-err');
    }
  }
}