export class AppModel { // Выполняет инициализацию приложения и формирует список базисов
  #listBasiss = [];   // Список базисов
  listPartsOriginal = [] // Список оригинальный частей заявок

  constructor(parts, tanks, basiss, helpers, distributeParts, suplOrders) {
    this.helpers = helpers;
    this.#initBasiss(parts, tanks, basiss, distributeParts, suplOrders);
  }

  // Метод наполняет список ListBasiss частями заявок
  #initBasiss(parts, tanks, basiss, distributeParts, suplOrders) {
    // console.log(parts);

    this.#listBasiss = basiss;
    const listParts = this.getListPart(parts);
    const listTanks = tanks;
    const listDistributeParts = distributeParts;
    const listSuplOrders = suplOrders;
    this.listPartsOriginal = structuredClone(listParts);
    this.listSuplOrders = suplOrders;
    console.log(listSuplOrders);
    console.log(listTanks);
    // this.listSuplOrders[0].code_tank = '000000060';

    // Добавляем к базисам недоставющие поля
    this.#listBasiss.forEach(basis => {
      basis.id = this.helpers.getID();
      basis.listOfUndistributedApplications = [];
      basis.listOfTanks = [];
      basis.visible = false;
    })

    // Добавляем в список частей заявок распределенный объем
    listSuplOrders.forEach(suplOrder => {
      suplOrder.array_sections.forEach(section => {
        section.array_dispatch?.forEach(block => {
          listParts.forEach(part => {
            if (block.guid_orderblock === part.guid) {
              // console.log(part.guid);
              // console.log(block.guid_orderblock);
              part.volume_distributed = part.volume_distributed + Number(block.volume_dispatch);
            }
          })
        })
      })
    })

    // Добавляем в базисы не распределенные заявки
    this.#listBasiss.forEach(basis => {
      // console.log(basis.name);
      listParts.forEach(part => {
        if (basis.name === part.nameBasis) {
          const partObj = this.sortParts(basis.listOfUndistributedApplications, part);
          // basis.listOfUndistributedApplications.push(part);
          basis.listOfUndistributedApplications.splice(partObj.index, 0, partObj.part);
        }
      })
    })

    // Добавляем емкости в базисы
    this.#listBasiss.forEach(basis => {
      listTanks.forEach(tank => {
        if (basis.name === tank.name_base) {
          if (tank.type_tank != 0) {
            tank.id = this.helpers.getID();
            tank.listOfDistributedApplications = [];
            tank.listOfOrderSupply = [];
            basis.listOfTanks.push(tank);
          }
        }
      })
    })

    // Добавляем распределенные части заявок в емкости
    this.#listBasiss.forEach(basis => {
      basis.listOfTanks.forEach(tank => {
        listDistributeParts.forEach(distributePart => {
          if (tank.code == distributePart.code_tank && distributePart.id) {
            const partObj = this.sortParts(tank.listOfDistributedApplications, distributePart);
            tank.listOfDistributedApplications.splice(partObj.index, 0, partObj.part);
          }
        })
        tank.listOfDistributedApplications.sort((a, b) => a.sort_number - b.sort_number);
      })
    })

    // Добавляем заявки снабжения в емкости
    this.#listBasiss.forEach(basis => {
      basis.listOfTanks.forEach(tank => {
        // console.log(listSuplOrders);
        listSuplOrders.forEach(order => {
          if (order.code_tank === tank.code) {
            order.id = this.helpers.getID();

            if (order.type_suplorder === 1) {
              order.array_sections.forEach(section => {
                section.array_tanks.forEach(tank => {
                  const orderWarehouse = {
                    'id': order.id,
                    "code_tank": tank.code_tank,
                    "date_income": tank.date_income,
                    "product": order.product,
                    "volume_dispatch": tank.volume_dispatch,
                    "warehouse_part": true,
                  }

                  this.addOrderSupply(orderWarehouse);
                })
              })
            };

            tank.listOfOrderSupply.push(order);
          }
        });
        tank.listOfOrderSupply.sort((a, b) => {
          return this.helpers.parseDate(a.date_income) - this.helpers.parseDate(b.date_income);
        }
        );
      })
    })
  }

  // Метод поддержания списка частей заявок в отсортерованном виде
  sortParts(array, part) {
    // console.log(part.nameBasis);
    if (array.length === 0) {
      // console.log(part.basisDateStart);
      return { 'part': part, 'index': 0 };
    }

    for (const [index, element] of array.entries()) {

      // Дата из части заявки, которая уже находится в массиве
      // console.log(index, element);
      const [yearA, monthA, dayA] = element.date_dispatch.split('-').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);

      // Дата из части заявки, которая будет вставлена в массив
      const [yearB, monthB, dayB] = part.date_dispatch.split('-').map(Number);
      const dateB = new Date(yearB, monthB - 1, dayB);
      if (dateB < dateA) {
        return { 'part': part, 'index': index };
      } else if (array.length - 1 === index) {
        return { 'part': part, 'index': index + 1 };
      }
    }
  }

  // Сравниваем 2 объекта и проверяем есть ли в их значения отличия
  findDifferences(obj1, obj2) {
    // console.log(obj2.num_address, obj2.num_basis, obj2.id_order);
    // console.log(this.listPartsOriginal);
    const differences = [];
    const obj3 = this.getPartOriginal(obj2.id);
    const stack = [{ val1: obj1, val2: obj3, path: '' }];

    while (stack.length > 0) {
      const { val1, val2, path } = stack.pop();

      // Используем Object.entries() для итерации по первому объекту
      for (const [key, value1] of Object.entries(val1)) {
        const currentPath = path ? `${path}.${key}` : key;
        const value2 = val2[key];

        // Если оба значения являются объектами
        if (typeof value1 === 'object' && value1 !== null) {
          stack.push({ val1: value1, val2: value2, path: currentPath });
        }
        // Если значения различаются
        else if (value1 != value2) {
          differences.push(currentPath);
        }
      }
    }

    // console.log(differences);
    const index = differences.findIndex(fild => fild === "client.name_client");

    // Если заявка найдена, заменяем её
    if (index !== -1) {
      differences.splice(index, 1);
    }

    // Очистка поля датадиспатч
    const indexDispatch = differences.findIndex(fild => fild === "date_dispatch");

    // Если заявка найдена, заменяем её
    if (indexDispatch !== -1) {
      // console.log(obj1.date_dispatch, obj1.basisDateStart, obj1.basisDateEnd);
      differences.splice(indexDispatch, 1);

      // date_dispatch
      const [yearA, monthA, dayA] = obj1.date_dispatch.split('-').map(Number);
      const dateDispatch = new Date(yearA, monthA - 1, dayA);

      // basisDateStart
      const [yearB, monthB, dayB] = obj1.basisDateStart.split('-').map(Number);
      const basisDateStart = new Date(yearB, monthB - 1, dayB);

      // basisDateEnd
      const [yearC, monthC, dayC] = obj1.basisDateEnd.split('-').map(Number);
      const basisDateEnd = new Date(yearC, monthC - 1, dayC);

      if (dateDispatch < basisDateStart || dateDispatch > basisDateEnd) {
        differences.push('date_dispatch');
      }


    }



    // if (obj1.volume !== obj2.startVolume) {
    //     differences.push('volume');
    // }

    return differences;
  };

  // Получаем базис по имени
  getBasis(nameBasis) {
    for (const basis of this.#listBasiss) {
      // console.log(basis.name, nameBasis);
      if (basis.name === nameBasis) {
        console.log(basis);
        return basis;
      }
    }
    return false;
  }

  // Получаем список всех базисов
  getBasiss() {
    const basiss = [];

    this.#listBasiss.forEach(basis => {
      basiss.push({
        'name': basis.name,
        'id': basis.id,
      })
    })
    return basiss;
  }

  // Получаем список всех базисов
  getBasissFull() {
    const basiss = [];

    this.#listBasiss.forEach(basis => {
      basiss.push(basis);
    })
    return basiss;
  }

  // Обновить емкость
  updateTank(tank, tankID) {
    // console.log(this.#listBasiss);
    // console.log(part);
    // Проходим по каждой станции в массиве
    for (const basis of this.#listBasiss) {
      // Проверяем наличие массива заявок у станции
      if (basis.listOfTanks) {
        // Ищем индекс заявки с совпадающим id
        const index = basis.listOfTanks.findIndex(
          app => app.id === tankID
        );

        // Если заявка найдена, заменяем её
        if (index !== -1) {
          console.log(basis);
          const oldTank = basis.listOfTanks[index];
          oldTank.code = tank.code;
          oldTank.name = tank.name;
          oldTank.type_action_tank = tank.type_action_tank;
          oldTank.type_tank = tank.type_tank;
          oldTank.name_base = tank.name_base;
          oldTank.redeem_volume = tank.redeem_volume;
          oldTank.date_limitation_redeem = tank.date_limitation_redeem;
          oldTank.cost_management_tonn = tank.cost_management_tonn;
          oldTank.cost_price_tonn = tank.cost_price_tonn;
          oldTank.cost_management_litr = tank.cost_management_litr;
          oldTank.cost_price_litr = tank.cost_price_litr;
          oldTank.product.code_product = tank.product.code_product;
          oldTank.product.name_product = tank.product.name_product;
          oldTank.client.code_client = tank.client.code_client;
          oldTank.client.name_client = tank.client.name_client;
          oldTank.volume = tank.volume;
          oldTank.density = tank.density;
          oldTank.weight = tank.weight;
          console.log(basis);
          return oldTank;
        }
      }
    }
    return false;
  }

  // Получаем список емкостей в базисе по ID базиса
  getListTanks(basisID) {
    for (const basis of this.#listBasiss) {
      if (basis.id === basisID) return basis.listOfTanks;
    }
    return null;
  }

  // Получаем список емкостей в базисе по ID базиса
  getListUndistributedParts(basisID) {
    for (const basis of this.#listBasiss) {
      if (basis.id === basisID) return basis.listOfUndistributedApplications;
    }
    return null;
  }

  // Получаем ибя базиса
  getBasisName(basisID) {
    for (const basis of this.#listBasiss) {
      if (basis.id === basisID) return basis.name;
    }
    return null;
  }

  getListTanksName(basisName) {
    for (const basis of this.#listBasiss) {
      if (basis.name === basisName) return basis.listOfTanks;
    }
    return null;
  }

  // Добавить емкость
  addTank(tank, basisID) {
    for (const basis of this.basiss) {
      if (basisID === basis.id) {
        basis.listOfTanks.push(tank);
        console.log(basis);
        return true;
      }
    }

    return false;
  }

  // Получить емкость по ID
  getTank(targetId) {
    for (const basis of this.#listBasiss) {

      if (basis.listOfTanks) {
        const tank = basis.listOfTanks.find(
          app => app.id === targetId
        );

        if (tank) {
          // console.log(basis);
          return {
            'tank': tank,
            'basisID': basis.id,
            // 'listTanks': basis.listOfTanks,
            // 'tankID': tank.id
          };
        }
      }
    }
    return null;
  }

  // Получаем список всех частей заявок сформированных из выдачи для канбана
  getListPart(parts) {
    let listParts = [];

    parts.forEach(order => {                          // Перебераем изначальный список заявок
      // console.log(order.kind_order);
      order.array_addresses.forEach(addres => {     // В заявке находим список адресов и перебераем его
        addres.array_basises.forEach(basis => {   // В адресе находим список базисов и перебераем его
          // console.log(basis.array_counteragents);
          basis.array_counteragents.forEach(counteragent => {
            if (basis.status_logistic != 2) { // basis.status_logistic не пропускаем отгруженые заявки
              // console.log(counteragent.counteragent.name_counteragent);
              listParts.push({
                "id": this.helpers.getID(),
                "guid": counteragent.guid,
                "counteragent": counteragent.counteragent.name_counteragent,
                "number": '',
                "type_dispatch": '',
                "code_tank": '',
                "date_income": "",
                "date_dispatch": "",
                "client": {
                  "name_client": order.kind_order === 2 ? 'ООО "ТК ГЛАДОС"' : order.client.name_client,
                  "code_client": order.kind_order === 2 ? '00-00000181' : order.client.code_client,
                  "type_client": ""
                },
                "product": {
                  "name_product": basis.name_product,
                  "code_product": basis.code_product
                },
                "id_order": order.number,
                "num_address": addres.num_address,
                "num_basis": basis.num_basis,
                // "startVolume": basis.volume.start_volume,
                "volume": basis.volume.start_volume,
                "volume_distributed": 0,
                "endVolume": basis.volume.end_volume,
                "weight": basis.weight,
                "density": basis.density,
                "nameBasis": order.kind_order === 2 ? order.name_base : basis.name_basis,
                "dateStart": this.helpers.convertDateToInput(order.date_order.date_start),
                "dateEnd": this.helpers.convertDateToInput(order.date_order.date_end),
                "basisDateStart": this.helpers.convertDateToInput(basis.date_basis.date_start),
                "basisDateEnd": this.helpers.convertDateToInput(basis.date_basis.date_end),
                "kind_order": order.kind_order,
                "commentary": "",
                "author": "site",
                "type_order": order.type_order,
              });
            }
          })



          // console.log(basis.status_logistic);
          // if (order.kind_order === 2) console.log(order.kind_order);
        })
      })
    })

    // console.log(listParts);
    return listParts;
  }

  // Получаем часть заявки по ID
  getPart(targetId) {
    for (const basis of this.#listBasiss) {
      if (basis.listOfUndistributedApplications) {
        const foundApplication = basis.listOfUndistributedApplications.find(
          app => app.id === targetId
        );
        if (foundApplication) {
          console.log(basis);
          return {
            'part': foundApplication,
            'basisID': basis.id,
            'listTanks': basis.listOfTanks,
            'tankID': 0,
            'basisSupplier': basis.supplier
          };
        }
      }

      if (basis.listOfTanks) {
        for (const tank of basis.listOfTanks) {
          const foundApplication = tank.listOfDistributedApplications.find(
            app => app.id === targetId
          );

          if (foundApplication) {
            // console.log(tank.id);
            return {
              'part': foundApplication,
              'basisID': basis.id,
              'listTanks': basis.listOfTanks,
              'tankID': tank.id,
              'basisSupplier': basis.supplier
            };
          }
        }

      }
    }
    return null;
  }

  // Получаем часть заявки по ID
  getPartGuid(guid) {
    for (const basis of this.#listBasiss) {
      if (basis.listOfUndistributedApplications) {
        const foundApplication = basis.listOfUndistributedApplications.find(
          app => app.guid === guid
        );
        if (foundApplication) {
          // console.log(basis);
          return {
            'part': foundApplication
          };
        }
      }

      if (basis.listOfTanks) {
        for (const tank of basis.listOfTanks) {
          const foundApplication = tank.listOfDistributedApplications.find(
            app => app.guid === guid
          );

          if (foundApplication) {
            // console.log(tank.id);
            return {
              'part': foundApplication,
            };
          }
        }

      }
    }
    return null;
  }

  // Получаем часть заявки по ID из оригинального списка
  getPartOriginal(targetId) {
    const part = this.listPartsOriginal.find(
      app => app.id === targetId
    );
    if (part) {
      // console.log(basis.id);
      return part;
    }
  }

  // Удаляем часть заявки по ID
  deletePart(targetId) {
    // Проходим по каждой станции в массиве
    for (const basis of this.#listBasiss) {
      // Проверяем наличие массива заявок у станции
      if (basis.listOfUndistributedApplications && Array.isArray(basis.listOfUndistributedApplications)) {
        // Ищем индекс заявки с совпадающим id
        const index = basis.listOfUndistributedApplications.findIndex(
          app => app.id === targetId
        );

        // Если заявка найдена, заменяем её
        if (index !== -1) {
          basis.listOfUndistributedApplications.splice(index, 1);
          return true;
        }
      }

      if (basis.listOfTanks) {
        for (const tank of basis.listOfTanks) {
          const index = tank.listOfDistributedApplications.findIndex(
            app => app.id === targetId
          );

          // Если заявка найдена, заменяем её
          if (index !== -1) {
            tank.listOfDistributedApplications.splice(index, 1);
            return true;
          }
        }

      }
    }
    return false;
  }

  // Удаляем емкость по ID
  deleteTank(id) {
    for (const basis of this.#listBasiss) {
      if (basis.listOfTanks.length > 0) {
        const index = basis.listOfTanks.findIndex(tank => tank.id === id);
        if (index !== -1) {
          basis.listOfTanks.splice(index, 1);
          return true;
        }
      }
    }

    return false;
  }

  getAddressPart(targetId) {
    for (const basis of this.#listBasiss) {
      if (basis.listOfUndistributedApplications) {
        const foundApplication = basis.listOfUndistributedApplications.find(
          app => app.id === targetId
        );
        if (foundApplication) {
          // console.log(basis.id);
          return {
            'partID': foundApplication.id,
            'basisName': basis.name,
            'tankID': 0
          };
        }
      }

      if (basis.listOfTanks) {
        for (const tank of basis.listOfTanks) {
          const foundApplication = tank.listOfDistributedApplications.find(
            app => app.id === targetId
          );

          if (foundApplication) {
            // console.log(tank.id);
            return {
              'partID': foundApplication.id,
              'basisName': basis.name,
              'tankID': tank.id
            };
          }
        }

      }
    }
    return null;
  }

  // Добавить часть заявки в емкость
  addPart(part, basisName, tankID = 0) {
    console.log('addPart()', part, basisName, tankID);
    if (tankID != '0') {
      for (const basis of this.basiss) {
        for (const tank of basis.listOfTanks) {
          if (tankID === tank.id) {
            const partObj = this.sortParts(tank.listOfDistributedApplications, part);
            tank.listOfDistributedApplications.splice(partObj.index, 0, partObj.part);
            return partObj.index;
          }
        }
      }
    } else {
      for (const basis of this.basiss) {
        if (basisName === basis.name) {
          const partObj = this.sortParts(basis.listOfUndistributedApplications, part);
          basis.listOfUndistributedApplications.splice(partObj.index, 0, partObj.part);
          console.log(basis.name);
          return partObj.index;
        }
      }
    }
  }

  movePart(array, fromIndex, toIndex) {
    // Создаем копию массива чтобы избежать мутации исходных данных
    // const newArray = [...array];

    // Проверяем валидность индексов
    if (fromIndex < 0 || fromIndex >= array.length ||
      toIndex < 0 || toIndex >= array.length) {
      throw new Error('Индексы выходят за границы массива');
    }

    // Если индексы одинаковые - возвращаем копию без изменений
    if (fromIndex === toIndex) {
      return null;
    }

    // Удаляем элемент из исходной позиции и сохраняем его
    const [movedElement] = array.splice(fromIndex, 1);

    // Вставляем элемент на новую позицию
    array.splice(toIndex, 0, movedElement);

    return array;
  }

  // Получаем заявку снабжения по ID
  getSupplyOrder(id) {
    for (const basis of this.basiss) {
      for (const tank of basis.listOfTanks) {
        for (const orderSupply of tank.listOfOrderSupply) {
          if (orderSupply.id === id) return orderSupply;
        }
      }
    }
    // return this.listSuplOrders.find(supplyOrder => supplyOrder.id === id);
    return false;
  }

  // --------------------------------------
  // Метод поддержания списка ЗС в отсортерованном виде
  sortOrderSupply(listOfOrderSupply, docObject) {
    if (listOfOrderSupply.length === 0) {
      return 0;
    }

    for (const [index, element] of listOfOrderSupply.entries()) {

      // Дата из части заявки, которая уже находится в массиве
      const [dayA, monthA, yearA] = element.date_income.split('.').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);

      // Дата из части заявки, которая будет вставлена в массив
      const [dayB, monthB, yearB] = docObject.date_income.split('.').map(Number);
      const dateB = new Date(yearB, monthB - 1, dayB);
      if (dateB < dateA) {
        return index;
      } else if (listOfOrderSupply.length - 1 === index) {
        return index + 1;
      }
    }
  }

  // Добавить новую заявку снабжения в емкость
  addOrderSupply(docObject) {
    for (const basis of this.basiss) {
      for (const tank of basis.listOfTanks) {
        // console.log(tank);
        if (tank.code === docObject.code_tank) {
          const index = this.sortOrderSupply(tank.listOfOrderSupply, docObject);
          tank.listOfOrderSupply.splice(index, 0, docObject);
          // console.log(index, docObject);
          return [tank.id, index];
        }
      }
    }

    return false;
  }
  // --------------------------------------

  // Обновить новую заявку снабжения в емкости
  updateOrderSupply(docObject) {
    for (const basis of this.basiss) {
      for (const tank of basis.listOfTanks) {
        // console.log(tank);
        if (tank.code === docObject.code_tank) {
          for (const [index, orderSupply] of tank.listOfOrderSupply.entries())
            if (orderSupply.id === docObject.id) {
              tank.listOfOrderSupply.splice(index, 1);
              const [tankID, indexNew] = this.addOrderSupply(docObject);
              console.log(orderSupply);
              return [tankID, indexNew];
            }
        }
      }
    }

    return false;
  }

  // Удалить заявку снабжения из модели
  deleteOrderSupply(id) {
    for (const basis of this.basiss) {
      for (const tank of basis.listOfTanks) {
        // console.log(tank);
        for (const [index, orderSupply] of tank.listOfOrderSupply.entries()) {
          if (orderSupply.id === id) {
            console.log(id);
            tank.listOfOrderSupply.splice(index, 1);
            return true;
          }
        }
      }
    }

    return false;
  }



  get basiss() {
    return this.#listBasiss;
  }


  deletePartNew(basisID, tankID, partID) {
    // Перебераем массив с базисами и ищем нужный базис по ID
    for (const basis of this.#listBasiss) {
      if (basisID === basis.id) {
        // Проверяем является ли кусок заявки распределенным
        // если tankID === 0 то кусок заявки не распределен
        if (tankID === 0) {
          const index = basis.listOfUndistributedApplications.findIndex(
            part => part.id === partID
          );

          // Если кусок заявки найдена, заменяем её
          if (index !== -1) {
            basis.listOfUndistributedApplications.splice(index, 1);
            // Прерываем цикл после первой замены (предполагая уникальность id)
            console.log(basis.listOfUndistributedApplications);
            return true;
          }
        }
      }
    }
  }


}


