import * as ko from 'knockout';
import * as $ from 'jquery';
import * as _ from 'lodash';

import * as cm from './_ctrl-cm';
import { handler } from '@app/common';

@handler({
    bindingName: 'ntsText'
})
export class TextEditorBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element);

        if (element.tagName != 'DIV') {
            throw 'Only binding this control to DIV.';
        }

        cm.init($element);

        $element
            .addClass('form-group row');
    }
    update = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            access = valueAccessor(),
            label = ko.unwrap(access.label),
            value = ko.unwrap(access.value),
            configs = ko.unwrap(access.configs) || {};

        $element.empty();

        $.extend(configs, {
            'type': configs.type || 'text',
            'length': configs.length || {
                min: 0,
                max: undefined
            },
            'multiline': _.has(configs, 'multiline') ? configs.multiline : false,
            'require': configs.require && _.isBoolean(configs.require) || false,
            'regex': configs.regex || undefined,
            'enable': _.has(configs, 'enable') && _.isBoolean(configs.enable) ? configs.enable : true,
            'readonly': _.has(configs, 'readonly') && _.isBoolean(configs.readonly) ? configs.readonly : false,
            'columns': configs.columns || [
                'col-md-12',
                'col-md-12'
            ],
            'icon': configs.icon || {
                'before': undefined,
                'after': undefined
            }
        });

        let $clb = $('<div>', { 'class': '' }),
            $cip = $('<div>', { 'class': '' }),
            $lbl = $('<label>', { 'class': 'control-label', 'text': label }),
            $ipc = $(`<${configs.multiline ? 'textarea' : 'input'}>`, { 'class': 'form-control' });

        if (configs.require) {
            $lbl.addClass('control-label-danger');
        }

        if (!configs.multiline) {
            $ipc.prop('type', configs.type);
        }

        $ipc.prop('disabled', !configs.enable)
            .prop('readonly', configs.readonly)
            .prop('value', value);

        $clb.append($lbl);
        $cip.append($ipc);

        if (configs.columns.length == 2) {
            $clb.addClass(configs.columns[0]);
            $cip.addClass(configs.columns[1]);
        } else {
            $clb.addClass('col-md-12');
            $cip.addClass('col-md-12');
        }

        if (label) {
            $element.append($clb);
        }

        $element.append($cip);

        $ipc.on('change', () => {
            if (ko.isObservable(access.value)) {
                access.value($ipc.val());
            }

            if ($ipc.val()) {
                $element.data('changed', true);
            }
        });

        if (!$ipc.val() && configs.require && $element.data('changed')) {
            $ipc.addClass('is-invalid');
            $element.addClass('has-danger');
        }

        if (ko.isObservable(access.value)) {
            access.value.subscribe((v: string) => {
                if (v) {
                    $element.data('changed', true);
                }
            })
        }

        $element
            .trigger(cm.SAVE_DATA, [cm.NTS_REQUIRE, configs.require]);
    }
}