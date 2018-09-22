import { _, ko } from '@app/providers';
import { component, IView } from "@app/common/ko";
import { randomId } from '@app/common/id';

var imask = require('imask');

@component({
    name: 'input',
    template: `
        <!-- ko init: {
            $width: ko.toJS($vm.control.$width) || 0,
            $columns: ko.toJS($vm.control.$columns) || ['col-md-12', 'col-md-12']
        } -->
        <!-- ko if: ko.toJS($vm.control.$name) -->
        <div data-bind="css: _.head($columns) || 'col-md-12'">
            <label data-bind="label: $vm.control"></label>
        </div>
        <!-- /ko -->
        <div data-bind="css: _.last($columns) || 'col-md-12',
                        style: {
                            'flex': $width ? '0 0 ' + $width + 'px' : ''
                        }">
            <div class="input-group" 
                    data-bind=" init: { $icons: ko.toJS($vm.control.$icons) || {} }, 
                                css: {
                                    'input-group-transparent': $icons.before || $icons.after
                                }">
                <!-- ko if: $icons.before -->
                <div class="input-group-prepend">
                    <span class="input-group-text" 
                        data-bind=" css: $icons.before.indexOf('#') == -1 && $icons.before,
                                    i18n: $icons.before.indexOf('#') == 0 && $icons.before.replace('#', '')"></span>
                </div>
                <!-- /ko -->
                <!-- ko if: $icons.after -->
                <div class="input-group-append">
                    <span class="input-group-text"
                        data-bind=" css: $icons.after.indexOf('#') == -1 && $icons.after,
                                    i18n: $icons.after.indexOf('#') == 0 && $icons.after.replace('#', '')"></span>
                </div>
                <!-- /ko -->
                <!-- ko if: !ko.toJS($vm.control.$multiline) -->
                <input type="text" class="form-control"
                    data-bind=" hasFocus: $vm.control.$focus,
                                css: { 'is-invalid': $vm.control.hasError },
                                attr: ko.toJS($vm.control.$attr)" />
                <!-- /ko -->
                <!-- ko ifnot: !ko.toJS($vm.control.$multiline) -->
                    <textarea class="form-control"
                        data-bind=" hasFocus: $vm.control.$focus,
                                    css: { 'is-invalid': $vm.control.hasError }, 
                                    attr: ko.toJS($vm.control.$attr)"></textarea>
                <!-- /ko -->
                <div class="invalid-feedback" data-bind="text: $vm.control.validationMessage"></div>
            </div>
        </div>
        <!-- /ko -->`
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
                    id: randomId()
                }
            })
        }

        if (!ko.toJS(self.control.$value)) {
            self.control.extend({
                $value: ko.toJS(self.control)
            });
        }

        if (!ko.isObservable(self.control.$focus)) {
            self.control.extend({
                $focus: false
            });
        }

        self.control.extend({
            $complete: false
        });
    }

    afterRender(): void {
        let self = this,
            input: HTMLElement | null = document.getElementById((ko.toJS(self.control.$attr) || {}).id),
            mask = new imask(input, {
                mask: String
            }).on('complete', () => {
                self.control.extend({ $raw: mask.typedValue, $complete: true });
            });

        if (input) {
            // clear value if not complete imask event
            input.addEventListener('change', () => {
                if (!mask.typedValue || !ko.toJS(self.control.$complete)) {
                    self.control.extend({ $raw: undefined });
                }
            });
        }

        self.control.$focus!.subscribe(f => {
            if (!!f) {
                self.control.extend({ $complete: false });
            } else {

            }
        });

        ko.computed({
            read: () => {
                let value: any = ko.toJS(self.control.$value),
                    unmaskedValue: string = String(value);

                if (unmaskedValue != mask.unmaskedValue) {
                    mask.unmaskedValue = unmaskedValue;
                }

                self.control.extend({
                    $raw: mask.typedValue
                });
            },
            owner: self,
            disposeWhen: () => !self
        });

        ko.computed({
            read: () => {
                mask.updateOptions(ko.toJS(self.control.$type));
            },
            owner: self,
            disposeWhen: () => !self
        });
    }
}