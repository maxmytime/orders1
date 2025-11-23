'use strict'

const date = `<tr>
                <td colspan="7"><span class="tag is-danger is-medium">26.04.2024</span></td>
              </tr>`;

const row = `<table>
                <tr class="row-table">
                    <td><span class="date_start">22.04.2024</span> - <span>26.04.2024</span></td>
                    <td><span class="orders-order-item-status-state" style="background-color: black;"></span></td>
                    <td><span class="orders-order-item-status-state" style="background-color: red;"></span></td>
                    <td>ЭкоНива-Семена ООО</td>
                    <td>
                        <table class="table is-fullwidth">
                            <tbody class="table-basis">

                            </tbody>
                        </table>
                    </td>
                    <td>Шлыков Максим Владимирович</td>
                </tr>
            </table>`;

const basis = `<tr class="basis-table">
                    <td>Стрежтрансервис</td>
                    <td>ДТе-К5 Орск</td>
                    <td>ЭкоНива-Семена ООО</td>
                    <td>Маслянинский р-н, Елбань</td>
                    <td>32 110</td>
                    <td>Самовывоз</td>
                </tr>`;



export default { row, basis, date };
export { row, basis, date };