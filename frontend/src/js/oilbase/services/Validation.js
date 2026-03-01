export class Validation {

  // --- Валидация распределенного обьема по секциям и блокам/складам --- 
  validationDistributedVolume(modal) {

    // --- Вспомогательные функции (локальные) ---
    const $ = (selector, root = modal) => root.querySelector(selector);
    const $$ = (selector, root = modal) => root.querySelectorAll(selector);
    // --- Процесс валидации полей ---
    const _processValidation = (selector, elements, fieldToCheck) => {
      const totalVolumeBySection = [...elements].reduce((total, section) => {
        const field = $(selector, section);

        if (!field) {
          console.warn('validationDistributedVolume: Поле не найдено в секции');
          return total;
        }

        return total += Number(field.value);
      }, 0)

      if (Number(fieldToCheck.value) !== totalVolumeBySection) {
        fieldToCheck.classList.add('is-err');
      } else {
        fieldToCheck.classList.remove('is-err');
      }
    }
    // --- Получение полей для валидации ---
    const _getFields = (selector, node) => {

      // --- Проверка наличия обязательных полей ---
      const volume = $('input[name="os-volume_fact"]', node);
      const weight = $('input[name="os-weight_fact"]', node);

      if (!volume || !weight) {
        console.warn('validationDistributedVolume: не найдены основные поля веса и объёма');
        return;
      }

      // Обход по секциям на выходе получаем сумму объемов и весов
      // если есть расхождения с объемом и весом в шапке то подсвечиваем их
      const elements = $$(selector, node);

      if (elements.length === 0) {
        console.warn('validationDistributedVolume: в заявке отстутствуют секции/блоки/склады');
        return;
      }
      return [elements, volume, weight];
    }

    // --- Определяем тип ЗС true - на свой склад, false - под клиента ---
    const typeOrderSupplyWarehous = $('.warehous') ? true : false;

    // --- Получаем поля для валидации ---
    const [sections, mainVolume, mainWeight] = _getFields('.order-supply-section', modal);
    // --- Валидация фактического объема в ЗС ---
    _processValidation('input[name="os-volume_fact"]', sections, mainVolume);
    // --- Валидация фактического веса в ЗС ---
    _processValidation('input[name="os-weight_fact"]', sections, mainWeight);

    // --- Валидация фактического объема и веса в секции ---
    sections.forEach(section => {
      if (typeOrderSupplyWarehous) {
        // --- Свои склады ---
        // --- Получаем поля для валидации ---
        const [warehouses, sectionVolume, sectionWeight] = _getFields('.order-supply-warehous-shipping', section);
        // Валидация объема в секции
        _processValidation('input[name="os-volume_fact"]', warehouses, sectionVolume);
        // Валидация веса в секции
        _processValidation('input[name="os-weight_fact"]', warehouses, sectionWeight);

      } else {
        // --- Блоки ---
        // --- Получаем поля для валидации ---
        const [blocks, sectionVolume, sectionWeight] = _getFields('.order-supply-distributed-part-shipping', section);
        // Валидация объема в секции
        _processValidation('input[name="os-volume_fact"]', blocks, sectionVolume);
        // Валидация веса в секции
        _processValidation('input[name="os-weight_fact"]', blocks, sectionWeight);
      }
    });

    return !($$('.is-err').length === 0);
  }
}