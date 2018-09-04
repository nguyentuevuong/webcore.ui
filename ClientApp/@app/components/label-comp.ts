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
    name: 'nts-label',
    template: `
    <label class="control-label control-label-block mb-1" data-bind="css: $vm.configs.css">
        <!-- ko if: ko.toJS($vm.text) -->
        <span data-bind="text: $vm.text"></span>
        <!-- /ko -->
        <!-- ko if: ko.toJS($vm.constraint) -->
        <span data-bind="text: $vm.constraint"></span>
        <!-- /ko -->
    </label>`
})
export class LabelComponent {
    text: KnockoutObservable<string> = ko.observable('');
    constraint: KnockoutObservable<string> = ko.observable('');

    configs: IConfigs = {
        css: ko.observable(''),
        inline: ko.observable(false),
        require: ko.observable(false)
    };

    constructor(params: IParam, element: HTMLElement) {
        let self = this;

        // remove attr role (no need display)
        element.removeAttribute('role');

        ko.computed({
            read: () => {
                let label: Element | undefined = _(element.children).map(m => m).first();

                self.text(ko.toJS(params.text));
                self.constraint(ko.toJS(params.constraint));

                self.configs!.css!(ko.toJS(params.configs!.css) || '');
                self.configs!.inline!(ko.toJS(params.configs!.inline) || false);
                self.configs!.require!(ko.toJS(params.configs!.require) || false);

                if (label) {
                    if (ko.toJS(self.configs.inline)) {
                        label.classList.add('control-label-inline');
                    } else {
                        label.classList.remove('control-label-inline');
                    }

                    if (ko.toJS(self.configs.require)) {
                        label.classList.add('control-label-warning');
                    } else {
                        label.classList.remove('control-label-warning');
                    }

                    label.setAttribute('title', `${ko.toJS(params.text)}. ${ko.toJS(params.constraint)}`);
                }
            }
        });
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