export class CalculatorsOrderSupply {
    calculatorsDensity(container) {
        const volume = Number(container.querySelector('input[name="os-volume_fact"]').value);
        const weight = Number(container.querySelector('input[name="os-weight_fact"]').value);
        const density = container.querySelector('input[name="os-density_fact"]');

        density.value = ((weight * 1000) / volume ).toFixed(4);
    }
}