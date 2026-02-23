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
    let sectionsWeight = 0;

    // Секции
    const sections = modal.querySelectorAll('.order-supply-section');
    sections.forEach(section => {
      const dispatchSection = section.querySelector('input[name="order-supply-distributed"]');
      const densitySectionFact = section.querySelector('input[name="os-density_fact"]');
      const weightSectionFact = section.querySelector('input[name="os-weight_fact"]');
      const volumeSectionFact = section.querySelector('input[name="os-volume_fact"]');
      volumeSectionFact.value = dispatchSection.value;
      weightSectionFact.value = this.calculationWeight(volumeSectionFact.value, densitySectionFact.value);
      console.log(weightSectionFact.value);
      sectionsWeight += Number(Number(weightSectionFact.value).toFixed(3));
      console.log(sectionsWeight);

      // Блоки
      const blocks = section.querySelectorAll('.order-supply-distributed-part');
      blocks.forEach(block => {
        const partRemainder = block.querySelector('.part-remainder').textContent;
        const densityDispatchFact = block.querySelector('input[name="os-density_fact"]');
        const weightDispatchFact = block.querySelector('input[name="os-weight_fact"]');
        const volumeDispatchFact = block.querySelector('input[name="os-volume_fact"]');
        volumeDispatchFact.value = partRemainder;
        weightDispatchFact.value = this.calculationWeight(volumeDispatchFact.value, densityDispatchFact.value);

      })

    });

    if (sectionsWeight.toFixed(3) !== orderSupplyWeight.value) {
      // console.log(sectionsWeight);
      orderSupplyWeight.classList.add('is-err');
    } else {
      orderSupplyWeight.classList.remove('is-err');
    }
  }

}