import { _, ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'input',
    template: `
        <!-- ko init: { $columns: ko.toJS($vm.control.$columns) || ['col-md-12', 'col-md-12'] } -->
        <div data-bind="css: _.head($columns)">
            <label data-bind="label: $vm.control"></label>
        </div>
        <div data-bind="css: _.last($columns)">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">$</span>
                </div>
                <!-- ko ifnot: ko.toJS($vm.control.$multiline) -->
                    <input type="text" class="form-control" data-bind="value: $vm.control, css: { 'is-invalid': $vm.control.hasError }">
                <!-- /ko -->
                <!-- ko if: ko.toJS($vm.control.$multiline) -->
                    <textarea class="form-control" data-bind="value: $vm.control, css: { 'is-invalid': $vm.control.hasError }"></textarea>
                <!-- /ko -->
                <div class="input-group-append">
                    <span class="input-group-text">.00</button>
                </div>
                <div class="invalid-feedback" data-bind="text: $vm.control.validationMessage"></div>
            </div>
        </div>
        <!-- /ko -->`
})
export class InputComponent {
    control: KnockoutObservable<string> = ko.observable('')
        .extend({
            $name: '#noname',
            $constraint: '#noconstraint'
        });

    constructor(params: { control: KnockoutObservable<any> }, element?: HTMLElement) {
        let self = this;

        if (params.control) {
            self.control = params.control;
        }
    }
}