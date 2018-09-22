
var IMask = require('imask');

import { $, ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'time'
})
export class TimeEditorBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            control: ValidationObservable<any> = valueAccessor();

        $element
            .addClass('form-group row');

        control
            .extend({
                $raw: ko.toJS(control),
                $value: ko.toJS(control)
            })
            .extend({
                $icons: {
                    after: 'fa fa-clock-o'
                },
                $width: 130
            })
            .extend({
                $type: {
                    mask: 'hh:mm',
                    blocks: {
                        hh: {
                            mask: IMask.MaskedRange,
                            from: 0,
                            to: 23
                        },
                        mm: {
                            mask: IMask.MaskedRange,
                            from: 0,
                            to: 60
                        },
                    }
                }
            });

        ko.bindingHandlers.component.init!(element, () => ({ name: 'input', params: { control: valueAccessor() } }), allBindingsAccessor, viewModel, bindingContext);

        control.$raw!.subscribe((raw: any) => {
            if (ko.toJS(control.$complete)) {
                // validate and rebind value to control at here
                control.checkError!(raw);

                if (!control.hasError!()) {
                }
            }
        });

        return { controlsDescendantBindings: true };
    }
}