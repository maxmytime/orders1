'use strict'

// Шаблон новой заявки
const orderNew = {
    "date": "",
    "time": "",
    "number": "",
    "author": "",
    "name_base": "",
    "client": {
        "name_client": "",
        "code_client": "КА-КА000503",
        "type_client": ""
    },
    "type_order": 2,
    "kind_order": 2,
    "type_operation": '',
    "archieved": false,
    "date_order": {
        "date_range": false,
        "date_start": "",
        "date_end": ""
    },
    "documents": {
        "type_docs": 0,
        "urgency_docs": 0,
        "urgency_in_due_docs": 0,
        "urgency_until_docs": {
            "date": "",
            "time": ""
        }
    },
    "payment_schedule": [],
    "commentary": "",
    "status_buh": 1,
    "status_logistic": 1,
    "allow_edit_logistic": false,
    "array_addresses": [{
        "name_address": "-",
        "array_basises": [{
            "basis": {
                "name_basis": "",
                "code_basis": ""
            },
            "product": {
                "name_product": "",
                "code_product": ""
            },
            "nomenclature": {
                "name_nomenclature": "",
                "code_nomenclature": ""
            },
            "volume": {
                "range_volume": false,
                "start_volume": '',
                "end_volume": ''
            },
            "delivery": {
                "NDS_delivery": true,
                "cost_delivery": 0,
                "cost_type_delivery": 1
            },
            "specification_use": false,
            "date_basis": {
                "date_range": false,
                "date_start": undefined,
                "date_end": undefined,
            },
            "commentary": "",
            "array_counteragents": [{
                "counteragent": {
                    "name_counteragent": "",
                    "code_counteragent": "-",
                },
                "volume": '',
                "weight": '',
                "cost": '',
                "type_cost": 2
            }]
        }]
    }]
}

export default orderNew;
export { orderNew };