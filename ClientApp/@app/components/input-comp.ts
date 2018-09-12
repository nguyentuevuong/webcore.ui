import { _, ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'input',
    template: `
    <div class="row form-group" data-bind="init: {
        $label: ko.toJS($vm.configs.label),
        $columns: ko.toJS($vm.configs.columns)
    }">
        <!-- ko if: !!$label.text -->
        <div data-bind="css: $columns.label, component: { name: 'nts-label', params: $label }"></div>
        <!-- /ko -->
        <div data-bind="css: ko.computed(function() { return $columns.control; })">
            <div class="input-group mb-3">
                <!--<div class="input-group-prepend">
                    <span class="input-group-text">$</span>
                </div>-->
                <input type="text" class="form-control" data-bind="value: $vm.value, enable: !ko.toJS($vm.configs.disabled)">
                <!--<div class="input-group-append">
                    <button class="btn btn-secondary">.00</button>
                </div>-->
            </div>
        </div>
    </div>
    `
})
export class InputComponent {
    value: KnockoutObservable<string> = ko.observable('');

    constructor(params: ValidationObservable<any>, element?: HTMLElement) {
        let self = this;

        ko.utils.extend(self, {
            value: params
        });
    }
}