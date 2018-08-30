import * as ko from 'knockout';
import * as $ from 'jquery';
import * as _ from 'lodash';
import * as moment from 'moment';

import "jqueryui";
import '@chenfengyuan/datepicker';

import * as cm from './_ctrl-cm';
import { handler } from '../common/binding';

const MSG_ERROR = "msg_error";

@handler({
    virtual: true,
    bindingName: 'ntsDatepicker'
})
export class DatepickerBindingHandler implements KnockoutBindingHandler {
    init = function (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) {
        let $element = $(element);

        $element
            .on(cm.SAVE_DATA, (evt: JQuery.Event<HTMLElement>, key: string, value: any) => {
                let data = $element.data(cm.DATA_KEY) || {};

                data[key] = value;
                $element.data(cm.DATA_KEY, data);
            })
            .on(cm.CLEAR, (evt: JQuery.Event<HTMLElement>) => {
                $element
                    .removeClass('has-error')
                    .find('.form-control')
                    .removeClass('is-invalid');
            })
            .on(cm.VALIDATE, (evt: JQuery.Event<HTMLElement>) => {
                let data = $element.data(cm.DATA_KEY) || {};

                if (data[cm.NTS_REQUIRE] && !data[cm.NTS_VALUE]) {
                    let $input = $element
                        .addClass('has-error')
                        .find('.form-control');

                    if (!$input.is('[readonly]') && !$input.is('[disabled]')) {
                        $input.addClass('is-invalid');
                    }

                    $element
                        .find('.btn')
                        .removeClass('btn-secondary')
                        .addClass('btn-danger')
                } else {
                    $element
                        .trigger(cm.CLEAR);
                }
            })
            .data('changed', false)
            .addClass('form-group row');
    }
    update = function (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) {
        let regex = /[-\/:\\]/gi,
            $element = $(element),
            access = valueAccessor(),
            value: Date = ko.unwrap(access.value),
            configs = ko.unwrap(access.configs),
            options = ko.unwrap(access.options) || {},
            format = options.format
                .replace(/(d+|D+)/g, 'DD')
                .replace(/(m+|M+)/g, 'MM')
                .replace(/(y+|Y+)/g, 'YYYY'),
            nformat = format.replace(regex, ''),
            label = (configs || {}).label || undefined,
            $clb = $('<div>', { 'class': '' }),
            $cip = $('<div>', { 'class': '' }),
            $ipg = $('<div>', { 'class': 'input-group' }),
            $lbl = $('<label>', { 'class': 'control-label', 'text': label }),
            $ipc = $('<input>', {
                'type': 'text',
                'class': 'form-control'
            }),
            $ipgc = $('<div>', { 'class': 'input-group-append' }),
            $ipb = $('<button>', { 'class': 'btn btn-secondary', 'tabindex': -1 }),
            $ipbi = $('<i>', { 'class': 'fa fa-calendar' }),
            $ft = $('<small>', { 'class': 'form-text text-danger' }),
            show_error = (msg: string = '') => {
                debugger;
                $element.trigger('validate');
                return;

                /*if ($element.data('changed')) {
                    $element.data(MSG_ERROR, msg);

                    if (!!msg) {
                        $ft.text(msg);
                    }

                    $ipc.addClass('is-invalid');
                    $element.addClass('has-danger');
                    $ipb.removeClass('btn-secondary').addClass('btn-danger');
                } else {
                    $element.data('changed', true);
                }*/
            },
            setDate = (date: Date) => {
                let startDate: Date = options.startDate,
                    endDate: Date = options.endDate;

                $element.data('changed', true);

                date.setHours(0);

                if (startDate) {
                    startDate.setHours(0);
                }

                if (endDate) {
                    endDate.setHours(0);
                }

                if (ko.isObservable(access.value)) {
                    if (date && !_.isNaN(date.getDate())) {
                        if (startDate && endDate) {
                            if (startDate <= date && date <= endDate) {
                                access.value(date);
                            } else {
                                access.value(undefined);
                                $ipc.val('');
                                show_error("OUT_OF_DATE_RANGE");
                            }
                        } else if (startDate) {
                            if (startDate <= date) {
                                access.value(date);
                            } else {
                                access.value(undefined);
                                $ipc.val('');
                                show_error("BEFORE_START_DATE");
                            }
                        } else if (endDate) {
                            if (date <= endDate) {
                                access.value(date);
                            } else {
                                access.value(undefined);
                                $ipc.val('');
                                show_error("AFTER_END_DATE");
                            }
                        } else {
                            access.value(date);
                        }
                    } else {
                        access.value(undefined);
                        $ipc.val('');
                    }
                }
            };

        $element.empty();

        if (label) {
            $clb.append($lbl);
            $element.append($clb);
        }

        $element.append($cip);

        $ipb.append($ipbi);
        $ipgc.append($ipb);
        $ipg.append($ipc).append($ipgc);
        $cip.append($ipg);

        $cip.append($ft);

        $.extend(configs, {
            'require': configs.require && _.isBoolean(configs.require) || false,
            'enable': _.has(configs, 'enable') && _.isBoolean(configs.enable) ? configs.enable : true,
            'readonly': _.has(configs, 'readonly') && _.isBoolean(configs.readonly) ? configs.readonly : false,
            'columns': configs.columns || [
                'col-md-12',
                'col-md-12'
            ],
            'icon': _.has(configs, "icon") && _.isString(configs.icon) ? configs.icon : 'fa fa-calendar'
        });

        $.extend(options, {
            date: _.has(options, 'date') ? options.date : value,
            autoHide: _.has(options, 'autoHide') ? options.autoHide : true,
            autoPick: _.has(options, 'autoPick') ? options.autoPick : false,
            format: _.has(options, 'format') ? options.format : 'dd/mm/yyyy',
        });

        if (options.startDate && _.isString(options.startDate)) {
            $.extend(options, {
                startDate: moment(options.startDate.replace(regex, ''), nformat).toDate()
            });
        }

        if (options.endDate && _.isString(options.endDate)) {
            $.extend(options, {
                endDate: moment(options.endDate.replace(regex, ''), nformat).toDate()
            });
        }

        if (options.startDate || options.endDate) {
            let constraint = `(${options.startDate ? moment(options.startDate).format(format) : format.toLowerCase()}${options.startDate && options.endDate ? ' ~ ' : ' < '}${options.endDate ? moment(options.endDate).format(format) : format.toLowerCase()})`,
                lbl = $lbl[0],
                ntsLabel = {
                    text: label,
                    constraint: constraint,
                    'require': configs.require
                };

            let labelHandler = ko.bindingHandlers["ntsLabel"];
            if (labelHandler && labelHandler.init && labelHandler.update) {
                labelHandler.init(lbl, () => (ntsLabel), allBindingsAccessor, viewModel, bindingContext);
                labelHandler.update(lbl, () => (ntsLabel), allBindingsAccessor, viewModel, bindingContext);
            }
        }

        if (configs.require) {
            $lbl.addClass('control-label-danger');
        }

        if (!configs.enable || configs.readonly) {
            $ipb.prop('disabled', true);
        }

        if (!configs.showbtn) {
            $ipgc.addClass('d-none');
        }

        $ipc.prop('disabled', !configs.enable)
            .prop('readonly', !!configs.readonly);


        if (configs.columns.length == 2) {
            $clb.addClass(configs.columns[0]);
            $cip.addClass(configs.columns[1]);
        } else {
            $clb.addClass('col-md-12');
            $cip.addClass('col-md-12');
        }

        if (configs.enable && !configs.readonly) {
            $ipc.datepicker(options)
                .on('focus', (evt: any) => {
                    $ipc.data('keydown', false);
                })
                .on('blur', (evt: any) => {
                    if ($ipc.data('keydown')) {
                        setTimeout(() => {
                            $ipc.trigger('hide.datepicker', ['blur']);
                        }, 0);
                    }
                })
                .on('keydown', (evt: any) => {
                    $ipc.data('keydown', true);
                    if (evt.which == 9) {
                        setTimeout(() => {
                            $ipc.trigger('hide.datepicker', ['keydown']);
                        }, 0);
                    }
                })
                .on('keypress', (evt: any) => {
                    $ipc.data('keydown', true);
                    if (evt.which == 13) {
                        $ipc.trigger('hide.datepicker', ['keypress']);
                        setTimeout(() => {
                            $element.find('input').focus();
                        }, 0);
                    }
                })
                .on('pick.datepicker', (evt: any) => {
                    setTimeout(() => {
                        let date = moment(evt.date).toDate();

                        if (format.indexOf('D') > -1) {
                            date.setDate(date.getDate());
                        } else {
                            date.setDate(2);
                        }

                        if (format.indexOf('M') == -1) {
                            date.setMonth(0);
                        }
                        setDate(date);
                    }, 0);
                })
                .on('hide.datepicker', (evt: any, frk: string) => {
                    if (frk && ko.isObservable(access.value)) {
                        let str: string = ($ipc.val() || '').toString();

                        if (str) {
                            str = str.replace(regex, '');
                        }

                        if (str) {
                            let date = moment(str, nformat).toDate();
                            setDate(date);
                        } else {
                            access.value(undefined);
                        }
                    }
                });

            $ipb.on('click', () => {
                setTimeout(() => {
                    $element.find('input').focus();
                }, 0);
            });
        }

        setTimeout(() => {
            if (!value) {
                $ipc.val('');

                if (configs.require) {
                    show_error("REQUIRED_VALUE");
                }
            } else if (_.isDate(value)) {
                $ipc.val(moment(value).format(format));
                $element.data(MSG_ERROR, null);
            }
        }, 0);

        if (ko.isObservable(access.value)) {
            access.value.subscribe((v: Date) => {
                if (!v && !!configs.require) {
                    show_error("REQUIRED_VALUE");
                } else {
                    $element.data('changed', true);
                }
            });
        }
    }
}