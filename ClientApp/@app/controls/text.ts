import * as ko from 'knockout';
import * as $ from 'jquery';
import * as _ from 'lodash';

import * as cm from './_ctrl-cm';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'input'
})
export class TextEditorBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element);

        if (element.tagName != 'DIV') {
            throw 'Only binding this control to DIV.';
        }

        $element
            .addClass('form-group row');
    }
    update = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            value: InputObservable<string> = valueAccessor(),
            columns: Array<string> = _.map(ko.toJS(value.columns), m => m) || ['col-md-12', 'col-md-12'],
            $clb = $('<div>', { 'class': columns[0] || 'col-md-12' }),
            $cip = $('<div>', { 'class': columns[1] || 'col-md-12' }),
            $lbl = $('<label>', { 'class': 'control-label' }),
            $ipc = $(`<${ko.toJS(value.multiline) ? 'textarea' : 'input'}>`, { 'class': 'form-control' }),
            subscribe: KnockoutObservable<string> = ko.observable(ko.toJS(value));

        if (value.$require) {
            ko.computed({
                read: () => {
                    let require = ko.toJS(value.$require);
                    if (require) {
                        $lbl.addClass('control-label-danger');
                    } else {
                        $lbl.removeClass('control-label-danger');
                    }
                },
                disposeWhen: () => !value
            })
        }

        $element
            .empty()
            .append($clb)
            .append($cip);

        $clb.append($lbl);
        $cip.append($ipc);

        ko.bindingHandlers.i18n.init!($lbl[0], () => value.$name, allBindingsAccessor, viewModel, bindingContext);

        ko.bindingHandlers.value.init!($ipc[0], () => subscribe, allBindingsAccessor, viewModel, bindingContext);
        ko.bindingHandlers.value.update!($ipc[0], () => subscribe, allBindingsAccessor, viewModel, bindingContext);
    }
}