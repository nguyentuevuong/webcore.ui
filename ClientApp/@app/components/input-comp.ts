import { component } from "@app/common/ko";
import * as ko from 'knockout';
import * as _ from 'lodash';

import {
    INumberConstraint,
    IStringConstraint,
    TypeOfConstraint,
    TypeOfNumber,
    TypeOfString
} from '@app/common';

import { BaseComponentControl } from "./_base-comp";

@component({
    name: 'nts-input',
    template: `
    <div class="row form-group" data-bind="let: {
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
export class InputComponent extends BaseComponentControl {
    value: KnockoutObservable<string | number | Date | undefined> = ko.observable();

    constructor(params: any, element?: HTMLElement) {
        super(params, element);

        let self = this;

        ko.utils.extend(self, {
            value: params.value
        });
    }
}