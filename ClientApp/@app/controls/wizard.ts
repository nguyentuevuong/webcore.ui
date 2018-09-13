import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';

import { handler } from '@app/common/ko';
import { getText } from '@app/common/lang';

@handler({
    virtual: false,
    bindingName: 'wizard'
})
export class WizardBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let bindings = allBindingsAccessor();

        ko.bindingHandlers.component.init!(element, () => ({
            name: 'wizard',
            params: {
                steps: valueAccessor(),
                selected: bindings.selected,
                disableds: bindings.disableds,
                configs: bindings.configs
            }
        }), allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}

interface IBindings {
    selected: KnockoutObservable<string> | string;
    disableds?: KnockoutObservableArray<string> | Array<string>;
    configs?: IConfigs
}

interface IConfigs {
    icon?: KnockoutObservable<string> | string;
    title?: KnockoutObservable<string> | string;
    showFooter?: KnockoutObservable<boolean> | boolean;
    selectable?: KnockoutObservable<boolean> | boolean;
}