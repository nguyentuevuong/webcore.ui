import { _, ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'check',
    template: `
    <!-- ko init: { $columns: ko.toJS($vm.control.$columns) || ['col-md-12', 'col-md-12'] } -->
    <!-- ko if: ko.toJS($vm.control.$name) -->
    <div data-bind="css: _.head($columns) || 'col-md-12'">
        <label data-bind="label: $vm.control"></label>
    </div>
    <!-- /ko -->
    <div class="btn-group btn-group-toggle" data-bind="css: _.last($columns) || 'col-md-12'">
        <label class="btn btn-primary active">
            <input type="checkbox" checked="" autocomplete="off">
            Active
        </label>
        <label class="btn btn-primary">
            <input type="checkbox" autocomplete="off">
            Check
        </label>
        <label class="btn btn-primary">
            <input type="checkbox" autocomplete="off">
            Check
        </label>
    </div>
    <!-- /ko -->`
})
export class CheckComponent {
    control: KnockoutObservableSelection = ko.observableSelection('')
        .extend({
            $name: '#noname',
            $constraint: '#noconstraint'
        });

    constructor(params: { control: KnockoutObservableSelection }, element: HTMLElement) {
        let self = this;

        if (params.control) {
            self.control = params.control;
        }

        debugger;
    }
}