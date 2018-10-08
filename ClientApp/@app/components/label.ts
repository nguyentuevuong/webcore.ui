import { _, ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'label',
    template: `
    <!-- ko if: ko.toJS($vm.control.$name) -->
    <span data-bind="i18n: $vm.control.$name"></span>
    <!-- ko if: ko.toJS($vm.control.$constraint) -->
    <span data-bind="i18n: $vm.control.$constraint"></span>
    <!-- /ko -->
    <!-- /ko -->`
})
export class LabelComponent {
    control: KnockoutObservable<string> = ko.observableOrig('')
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