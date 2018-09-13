import { _, ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'label',
    template: `
    <label class="control-label control-label-block mb-1" data-bind="css: { 'control-label-danger': ko.toJS($vm.control.$require) }">
        <!-- ko if: ko.toJS($vm.control.$name) -->
        <span data-bind="i18n: $vm.control.$name"></span>
        <!-- /ko -->
        <!-- ko if: ko.toJS($vm.control.$constraint) -->
        <span data-bind="i18n: $vm.control.$constraint"></span>
        <!-- /ko -->
    </label>`
})
export class LabelComponent {
    control: KnockoutObservable<string> = ko.observable('')
        .extend({
            $name: '#noname',
            $constraint: '#noconstraint'
        });

    constructor(params: { control: KnockoutObservable<any> }, element: HTMLElement) {
        let self = this;

        if (params.control) {
            self.control = params.control;
        }

        // remove attr role (no need display)
        element.removeAttribute('role');
    }
}