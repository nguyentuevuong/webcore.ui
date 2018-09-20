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
    control: KnockoutObservable<string> = ko.observable('')
        .extend({
            $name: '#noname',
            $constraint: '#noconstraint'
        });

    constructor(params: { control: KnockoutObservable<any> }, private element: HTMLElement) {
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
            })
        }
    }

    afterRender(): void {
        let self = this,
            input: HTMLElement | null = document.getElementById((ko.toJS(self.control.$attr) || {}).id),
            mask = new imask(input, ko.toJS(self.control.$type) || {
                mask: String
            }).on('complete', () => {
                self.control(mask.typedValue);
                self.control.$value!(mask.typedValue);
            });

        ko.computed({
            read: () => {
                let value: any = ko.toJS(self.control.$value),
                    unmaskedValue: string = String(value);

                if (unmaskedValue != mask.unmaskedValue) {
                    mask.unmaskedValue = unmaskedValue;
                }

                self.control(mask.typedValue);
            },
            owner: self,
            disposeWhen: () => !input
        });
    }
}