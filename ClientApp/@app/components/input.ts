import { _, ko } from '@app/providers';
import { component, IView } from "@app/common/ko";
import { random } from '@app/common/id';
import { mask } from '@app/common/ui/mask';
import * as template from '@app/templates';

var IMask = require('imask');

@component({
    name: 'input',
    template: template.input,
    resources: {
        en: {
            'field_invalid': '#{name} is invalid',
            'field_required': '#{name} is required'
        },
        vi: {
            'field_invalid': '#{name} có giá trị không hợp lệ',
            'field_required': '#{name} bắt buộc phải có giá trị'
        }
    }
})
export class InputComponent implements IView {
    control: ValidationObservable<string> = ko.observable('')
        .extend({
            $name: '#noname',
            $constraint: '#noconstraint'
        });

    constructor(params: { control: ValidationObservable<any> }, private element: HTMLElement) {
        let self = this;

        if (params.control) {
            self.control = params.control;
        }

        if (!(ko.toJS(self.control.$attr) || {}).id) {
            self.control.extend({
                $attr: {
                    id: random.id
                }
            })
        }

        if (!ko.isObservable(self.control.$focus)) {
            self.control.extend({
                $focus: false
            });
        }

        self.control
            .extend({ $value: undefined })
            .extend({ invalid: true, $complete: false });
    }

    afterRender(): void {
        let self = this,
            input: HTMLInputElement | null = document.getElementById((ko.toJS(self.control.$attr) || {}).id) as HTMLInputElement,
            imask = new IMask(input, ko.toJS(self.control.$type) || {
                mask: String
            }).on('accept', () => {
                self.control.extend({
                    $raw: {
                        value: imask.value,
                        typedValue: imask.typedValue,
                        unmaskedValue: imask.unmaskedValue,
                        isComplete: _.isEmpty(imask.value) || imask.masked.isComplete
                    }
                });
            });

        let inputmask = new mask(input, ko.toJS(self.control.$type))
            .on('accept', (value: string, status: boolean) => {

            });

        self.control.mask = imask;

        // clear value if not complete imask on blur
        self.control.$focus!.subscribe((f: boolean) => {
            if (!f) {
                self.control.extend({
                    $raw: {
                        value: imask.value,
                        typedValue: imask.typedValue,
                        unmaskedValue: imask.unmaskedValue,
                        isComplete: true
                    }
                });
            }
        });

        ko.computed({
            read: () => {
                input!.value = ko.toJS(self.control.$value);
            },
            owner: self,
            disposeWhen: () => !self
        });

        ko.computed({
            read: () => {
                imask.updateOptions(ko.toJS(self.control.$type));
            },
            owner: self,
            disposeWhen: () => !self
        });
    }
}