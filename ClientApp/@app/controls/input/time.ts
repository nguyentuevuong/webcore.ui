var IMask = require('imask');

import { _, $, ko } from '@app/providers';
import { handler } from '@app/common/ko';

import { time, clock } from '@app/common/utils';

@handler({
    bindingName: 'time'
})
export class TimeEditorBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            control: ValidationObservable<any> = valueAccessor(),
            type: { min: number, max: number } = ko.toJS(control.$type);

        $element
            .addClass('form-group row');

        if (!type) {
            type = {
                min: 0,
                max: 4320
            }
        }

        if (!type.min) {
            type.min = 0;
        }

        if (!type.max) {
            type.max = 4320;
        }

        control
            .extend({
                $type: type
            })
            .extend({
                $constraint: `${time.format(type.min)}~${time.format(type.max)}`
            }).extend({
                $type: {
                    mask: 'dd:dd',
                    definitions: {
                        'd': (value: string) => {
                            let mask: { typedValue: string } = control.mask || { typedValue: '' },
                                type: { min: number; max: number; } = ko.toJS(control.$type),
                                raw: string = mask.typedValue;

                            raw = _.padEnd(raw, 2, '9');
                            raw = _.padEnd(raw, 3, '5');
                            raw = _.padEnd(raw, 4, '9');

                            let maxOfMin = time.toInt(raw) || 0;

                            raw = mask.typedValue;
                            raw = _.padEnd(raw, 2, '0');
                            raw = _.padEnd(raw, 3, '0');
                            raw = _.padEnd(raw, 4, '0');

                            let minOfMax = time.toInt(raw) || 0;

                            return !!value.match(/\d/) && type.min <= maxOfMin && minOfMax <= type.max;
                        }
                    },
                    lazy: false
                    /*mask: [
                        {
                            mask: '@#:$$',
                            definitions: {
                                '@': new RegExp('7'),
                                '#': new RegExp('2'),
                                '$': new RegExp('0')
                            }
                        },
                        {
                            mask: 'hh:mm',
                            blocks: {
                                hh: {
                                    mask: IMask.MaskedRange,
                                    from: 0,
                                    to: 71
                                },
                                mm: {
                                    mask: IMask.MaskedRange,
                                    from: 0,
                                    to: 59
                                }
                            }
                        }
                    ]*/
                }
            });

        ko.bindingHandlers.component.init!(element, () => ({ name: 'input', params: { control: valueAccessor() } }), allBindingsAccessor, viewModel, bindingContext);

        ko.computed({
            read: () => {
                let value: number = ko.toJS(control);

                /*if (control.beforeValue != value) {
                    debugger;
                    // validate and rebind value to control at here
                    control.checkError!(value);

                    if (!_.isNil(value) && !_.isNaN(value)) {
                        control.extend({
                            $value: time.format(value)
                        });
                    }
                }*/
            },
            owner: self,
            disposeWhen: () => !control
        });

        // bind value to control from input component
        control.$raw!.subscribe((raw: IMaskRawValue) => {
            if (raw.isComplete) {
                let valid: number | undefined = time.toInt(raw.typedValue);
                console.log(raw);
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