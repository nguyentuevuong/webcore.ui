import * as ko from 'knockout';
import * as $ from 'jquery';
import * as _ from 'lodash';

import * as cm from './_ctrl-cm';
import { handler } from '@app/common/ko';
import { randomId, random } from '@app/common/id';

@handler({
    virtual: true,
    bindingName: 'ntsCheck'
})
export class CheckboxBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element);

        cm.init($element);

        $element
            .addClass('row')
            .trigger(cm.SAVE_DATA, [cm.NTS_ID, random.id]);

        if (!$element.parent().hasClass('form-group')) {
            $element.addClass('form-group');
        }
    }
    update = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            access = valueAccessor(),
            configs = _.has(access, 'configs') ? ko.unwrap(access.configs) : {},
            options = _.has(access, 'options') ? ko.unwrap(access.options) : {},
            key = _.has(access, 'key') ? ko.unwrap(access.key) : 'key',
            text = _.has(access, 'text') ? ko.unwrap(access.text) : 'text',
            value = _.has(access, 'value') ? ko.unwrap(access.value) : '',
            group = _.isArray(options),
            // col label
            $clb = $('<div>', { 'class': '' }),
            // col input
            $cip = $('<div>', { 'class': '' }),
            // label text
            $lbl = $('<label>', { 'class': 'control-label' });

        // remove old html
        $element.empty();

        if (!options) {
            return;
        }

        if (!group) {
            options = [options];
        }

        $.extend(configs, {
            type: configs.type || (_.isArray(value) ? 'checkbox' : 'radio'),
            mode: configs.mode || (_.isArray(value) ? 'checkbox' : 'radio'),
            enable: _.has(configs, 'enable') ? configs.enable : true,
            inline: _.has(configs, 'inline') ? configs.inline : false,
            require: _.has(configs, 'require') ? configs.require : false,
            columns: configs.columns || [
                'col-md-12',
                'col-md-12'
            ]
        });

        if (configs.type == 'radio') {
            if (_.isArray(value)) {
                value = value[0] || options[0][key];
                access.value(value);
            } else if (_(options).map(x => x[key]).indexOf(value) == -1) {
                value = options[0][key];
                access.value(value);
            }
        }

        if (!_.isArray(value)) {
            value = [value];
        }

        if (!_.isArray(configs.disabled)) {
            configs.disabled = [configs.disabled];
        }

        $clb.append($lbl);

        if (configs.label) {
            $lbl.text(configs.label);
            $element.append($clb);
        }

        if (configs.require) {
            $lbl.addClass('control-label-danger');
        }

        if (configs.columns.length == 2) {
            $clb.addClass(configs.columns[0]);
            $cip.addClass(configs.columns[1]);

            if (configs.columns[0].lastIndexOf('12') == -1 && configs.mode == 'button') {
                $lbl.addClass('control-label-flex');
            }
        } else {
            $clb.addClass('col-md-12');
            $cip.addClass('col-md-12');
        }

        $element.append($cip);

        if (configs.mode == 'button') {
            $cip.addClass('btn-group btn-group-toggle');
        }

        _.each(options, option => {
            let id = random.id,
                $fc = $('<div>', {
                    'class': `${configs.mode == 'button' ? '' : 'form-check'} ${configs.mode != 'button' && configs.inline ? 'form-check-inline checkbox-inline' : ''}`
                }),
                $fcl = $('<label>', {
                    'for': id,
                    'class': `${configs.mode == 'button' ? `btn btn-${value.indexOf(option[key]) > -1 ? 'primary' : 'secondary'}` : `form-check-label form-check-default ${configs.mode == 'radio' ? 'form-check-circle' : ''}`}`
                }),
                $fci = $('<input>', {
                    'id': id,
                    'class': `${configs.mode == 'button' ? 'd-none' : 'form-check-input'}`,
                    'type': configs.type,
                    'name': $element.data('name'),
                    'data-key': option[key]
                }),
                $fcs = $('<span>', { 'text': option[text] });

            $fcl.append($fci).append($fcs);

            if (configs.mode == 'button') {
                $cip.append($fcl);

                $fcl
                    .on('click', (evt) => {
                        if (configs.type == 'checkbox') {
                            $fci.trigger('click', [option[key]]);
                        } else if (!$fci.is(':checked')) {
                            $fci.trigger('click', [option[key]]);
                        }
                    });
            } else {
                $fc.append($fcl);
                $cip.append($fc);
            }

            if (group && value.indexOf(option[key]) > -1) {
                $fci.prop('checked', true);
            } else if (_.first(value) == option[key]) {
                $fci.prop('checked', true);
            } else {
                $fci.prop('checked', false);
            }

            if (configs.disabled.length == 1 && _.isBoolean(configs.disabled[0])) {
                if (configs.mode == 'button') {
                    $fcl.prop('disabled', configs.disabled[0]);
                    $fci.prop('disabled', configs.disabled[0]);
                } else {
                    $fci.prop('disabled', configs.disabled[0]);
                }
            } else if (configs.disabled.indexOf(option[key]) > -1) {
                if (configs.mode == 'button') {
                    $fcl.prop('disabled', true);
                    $fci.prop('disabled', true);
                } else {
                    $fci.prop('disabled', true);
                }
            }

            if ($element.data('focus') == option[key]) {
                if (configs.mode == 'button') {
                    $fcl.focus();
                } else {
                    $fci.focus();
                }
                $element.data('focus', null);
            }

            $fci.on('change', () => {
                if (ko.isObservable(access.value) && configs.type == 'checkbox') {
                    if (group) {
                        let selecteds: Array<any> = [];
                        _($element.find(`input[type=${configs.type}]`))
                            .each(ctrl => {
                                let $ctrl = $(ctrl);
                                if ($ctrl.is(':checked')) {
                                    selecteds.push($ctrl.data('key'));
                                }
                            });
                        access.value(selecteds);
                    }
                    else {
                        if ($fci.is(':checked')) {
                            access.value(option[key]);
                        } else if (option[key] == true) {
                            access.value(false);
                        } else {
                            access.value(undefined);
                        }
                    }
                }
            }).on('click', (evt, v) => {
                $element.data('focus', option[key]);
                if (ko.isObservable(access.value) && configs.type == 'radio') {
                    if ($fci.is(':checked')) {
                        access.value(option[key]);
                    } else {
                        access.value(v || undefined);
                    }
                }
            });
        });
    }
}