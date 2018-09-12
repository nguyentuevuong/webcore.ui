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

@component({
    name: 'label',
    template: `
    <label class="control-label control-label-block mb-1">
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

export interface IParam {
    configs: IConfigs | undefined;
    text: KnockoutObservable<string> | undefined;
    constraint?: KnockoutObservable<string> | undefined;
}

export interface IConfigs {
    css?: KnockoutObservable<string> | undefined;
    inline?: KnockoutObservable<boolean> | undefined;
    require?: KnockoutObservable<boolean> | undefined;
}