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

    // --- Вспомогательные функции (локальные) ---
    const $ = (selector, root = modal) => root.querySelector(selector);
    const $$ = (selector, root = modal) => root.querySelectorAll(selector);

    // --- Процесс распределения объема в секции
    const _processVolumeDistribution = (section, selector) => {
      const volumeDistributed = $(selector, section);
      const volumeFact = $('input[name="os-volume_fact"]', section);
      const weightFact = $('input[name="os-weight_fact"]', section);
      const densityFact = $('input[name="os-density_fact"]', section);

      if (!volumeDistributed || !volumeFact || !weightFact || !densityFact) {
        console.log('_processVolumeDistributionInTheSection: Не найдены основные поля');
        return;
      }
      console.log(volumeDistributed.value);
      volumeFact.value = volumeDistributed.value || volumeDistributed.textContent;
      weightFact.value = this.calculationWeight(volumeFact.value, densityFact.value);
    }

    // Определяем тип ЗС true - на свой склад, false - под клиента
    const typeOrderSupplyWarehous = modal.querySelector('.warehous') ? true : false;

    // --- Проверка наличия обязательных полей ---
    const orderSupplyWeight = $('input[name="os-weight_fact"]');
    const orderSupplyVolume = $('input[name="os-volume_fact"]');
    const densityFact = $('.order-supply-parametrs input[name="os-density_fact"]');
    let sectionsWeight = 0;

    if (!orderSupplyWeight || !orderSupplyVolume || !densityFact) {
      console.warn('distributionFact: не найдены основные поля веса, объёма или плотности');
      return;
    }

    // -- Устанавливаем одинаковую плотность во всех секциях и блоках/складах ---
    $$('.order-supple-sections input[name="os-density_fact"]').forEach(densityFild => {
      densityFild.value = densityFact.value;
    })

    // --- Распределяем обьем в секциях/складах/блоках ---
    // --- Валидируем объемы по секциям/складам/блокам ---
    // --- Валидируем вес по секциям/складам/блокам ---

    // Секции
    const sections = $$('.order-supply-section');
    sections.forEach(section => {
      _processVolumeDistribution(section, 'input[name="order-supply-distributed"]');

      if (typeOrderSupplyWarehous) {
        // Свой склад
        const warehouses = $$('.order-supply-warehous', section);
        warehouses.forEach(warehouse => {
          _processVolumeDistribution(warehouse, 'input[name="warehouse_volume"]');

        })

      } else {
        const blocks = $$('.order-supply-distributed-part', section);
        blocks.forEach(block => {
          console.log(block);
          _processVolumeDistribution(block, '.part-remainder');
        })

        // Свой склад
        const warehouses = $$('.order-supply-warehous', section);
        warehouses.forEach(warehouse => {
          _processVolumeDistribution(warehouse, 'input[name="warehouse_volume"]');

        })

      }


    })
  }
}