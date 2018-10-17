import * as _ from 'lodash';
import * as ko from 'knockout';

import { handler } from '@app/common/ko';

let origC = ko.bindingHandlers.component;

@handler({
    virtual: true,
    bindingName: 'component'
})
export class CustomComponentBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        //let newAccessor = () => ({ $afterRender: (viewModel.afterRender || function () { }).bind(viewModel || {}) });

        //ko.bindingHandlers.init.init!(element, () => ({ $vm: viewModel || {} }), allBindingsAccessor, viewModel, bindingContext);

        //ko.bindingHandlers.template.init!(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);
        //ko.bindingHandlers.template.update!(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);

        origC.init!(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}