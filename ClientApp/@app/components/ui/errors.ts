import { _, ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'errors',
    template: `
    <!-- ko if: ko.toJS(ko.errors.showDialog) -->
    <a class="errors-dialog" data-bind="click: $vm.showDialog"></a>
    <!-- /ko -->`
})
export class LabelComponent {

    constructor(params: { control: KnockoutObservable<any> }, element: HTMLElement) {
        // remove attr role (no need display)
        element.removeAttribute('role');
    }

    showDialog() {

    }
}