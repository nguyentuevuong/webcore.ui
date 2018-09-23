
var IMask = require('imask');

import { _, $, ko } from '@app/providers';
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
                $raw: {
                    unmaskedValue: ko.toJS(control)
                }
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
                            to: 59
                        }
                    }
                }
            }).extend({
                $constraint: '(00:00-23:59)'
            });

        ko.bindingHandlers.component.init!(element, () => ({ name: 'input', params: { control: valueAccessor() } }), allBindingsAccessor, viewModel, bindingContext);

        ko.computed({
            read: () => {
                let value: number = ko.toJS(control);

                if (!_.isNil(value) && !_.isNaN(value)) {
                    let hour: number = Math.floor(value / 60),
                        minute: number = Math.floor(value % 60),
                        unmaskedValue: string = _.padStart(hour.toString(), 2, '0') + _.padStart(minute.toString(), 2, '0');

                    control.extend({
                        $value: unmaskedValue
                    });
                }
            },
            owner: self,
            disposeWhen: () => !control
        });

        // bind value to control from input component
        control.$raw!.subscribe((raw: IMaskRawValue) => {
            if (raw.isComplete) {
                let value: number = Number(raw.typedValue),
                    hour: number = Math.floor(value / 100),
                    minute: number = Math.floor(value % 100),
                    valid: number = hour * 60 + minute;

                // validate and rebind value to control at here
                control.checkError!(raw.typedValue ? valid : undefined);

                if (!!raw.typedValue && !control.hasError!()) {
                    if (!_.isNaN(valid)) {
                        control(valid);
                    } else {
                        control(undefined);
                    }
                } else {
                    control(undefined);
                }
            } else {
                control(undefined);
            }

            control.checkError!();
        });

        return { controlsDescendantBindings: true };
    }
}