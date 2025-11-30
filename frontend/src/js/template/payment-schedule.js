'use strict'

const paymentSchedules = `<div class="schedule columns is-mobile is-gapless is-multiline">
                            <div class="column is-12 schedule-company">
                                <div class="columns is-mobile is-gapless is-multiline schedule-company-header mb-0">

                                </div>
                                <div class="tags notification-order are-medium mb-0">
                                    <span class="tag-order"></span>
                                </div>
                                <div class="tags are-medium mb-0 attach-docs">
                                    <span class="tag is-danger supply-agreement">Дог. пост.</span>
                                    <span class="tag is-danger surety">Поруч.</span>
                                    <span class="tag is-danger is-success add_agreement_BN">Согл. БН</span>
                                </div>
                            </div>
                          </div>`;

const row = `<div class="columns is-mobile is-gapless is-multiline mb-2 schedule-row is-justify-content-space-between">

                    <div class="column is-12 title-row is-hidden">
                        <h5 class="title is-5 mb-1">Остаток</5>
                    </div>

                    <div class="column is-4-mobile schedule-row-percent-col">
                        <div class="field has-addons is-align-items-end">
                            <p class="control width-100">
                                <input name="schedule-row-percent" value="" type="text" class="input input-order border-radius-left-4px schedule-row-percent">
                            </p>
                            <p class="control">
                                <a class="button is-static border-radius-0 js-button-volume">%</a>
                            </p>
                        </div>
                    </div>

                    <div class="column is-4-mobile schedule-row-sum-col">
                        <div class="field has-addons is-align-items-end">
                            <p class="control width-100">
                                <input name="schedule-row-sum" value="" type="text" class="input input-order border-radius-left-4px schedule-row-sum">
                            </p>
                            <p class="control">
                                <a class="button is-static border-radius-0 js-button-volume">&#8381</a>
                            </p>
                        </div>
                    </div>

                    <div class="column is-3 is-3-mobile">
                        <p class="control">
                            <span class="select width-100">
                                <select name="schedule-row-type-payment" class="width-100 input-order border-left-none schedule-row-type-payment">
                                    <option value="1">П/о на дату</option>
                                    <option value="2">П/о до отгрузки </option>
                                    <option value="3">По факту отгрузки</option>
                                    <option value="4" disabled="true">Отсрочка на дату</option>
                                    <option value="5" disabled="true">Сдвиг</option>
                                </select>
                            </span>
                        </p>
                    </div>

                    <div class="column is-4 is-4-mobile disabled background-color-none">
                        <div class="field has-addons">
                            <p class="control is-flex is-justify-content-space-between">
                                <input name="" value="1111-11-11" type="text" class="input color-none input-order border-radius-right-4px border-left-none width-119" placeholder="">
                            </p>
                        </div>
                    </div>

                    <div class="column is-4 is-4-mobile date-payment is-hidden">
                        <div class="field has-addons">
                            <p class="control width-100">
                                <input name="schedule-row-date-payment" value="" type="date" class="input input-order border-radius-right-4px border-left-none width-auto schedule-row-date-payment width-100">
                            </p>
                        </div>
                    </div>

                    <div class="column is-4 is-4-mobile offset-payment is-hidden">
                        <div class="field has-addons">
                            <p class="control is-flex is-justify-content-space-between">
                                <input name="schedule-row-offset-payment" value="" type="text" class="input input-order border-radius-right-4px width-119 border-left-none schedule-row-offset-payment" placeholder="">
                            </p>
                        </div>
                    </div>

                    <div class="text-right schedule-btn-del ml-2">
                        <a class="button is-light is-uppercase has-text-weight-bold btn-orders">
                            <span class="icon">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                        </a>
                    </div>

                </div>`;

const company = `<div class="column is-mobile is-gapless is-multiline schedule-company-title-wrapper">
                    <h6 data-code="" data-inn="" class="title is-6 color-title-blue mb-3 schedule-company-title"></h6>
                </div>`;

const sum = `<div class="column is-mobile is-gapless is-multiline schedule-company-sum-wrapper has-text-right">
                <span class="title is-6 color-title-blue schedule-company-sum"></span>
            </div>`;

const btnContainer = `<div class="column has-text-right m-0 p-0 mt-4 schedule-btn-container">
                          <a class="button is-light is-uppercase has-text-weight-bold btn-orders schedule-btn-add">Добавить +</a>
                      </div>`;

const checkBox = `<div class="field schedule-check-box ml-6">
                    <label  class="mr-2">Процент</label>
                    <input type="checkbox" class="switch" checked="checked">
                    <label>Сумма</label>
                  </div>`;

const buttons = `<div class="column is-6 schedule-buttons pl-0">
                    <div class="buttons has-addons">
                        <a data-type="1" class="button btn-orders btn-percent is-outlined-brand btn-type">Процент</a>
                        <a data-type="2" class="button btn-orders btn-sum is-outlined-brand btn-type">Сумма</a>
                        <a data-type="3" class="button btn-orders btn-general is-outlined-brand btn-type">Общие</a>
                    </div>
                </div>`;

const scheduleAlert = `<div class="columns is-mobile is-gapless is-multiline mb-2 schedule-alert-container">
                            <div class="column">
                                <div class="notification is-danger is-hidden schedule-alert is-light"></div>
                            </div>
                        </div>`;

export default { paymentSchedules, company, row, btnContainer, sum, checkBox, scheduleAlert, buttons };
export { paymentSchedules, company, row, btnContainer, sum, checkBox, scheduleAlert, buttons };