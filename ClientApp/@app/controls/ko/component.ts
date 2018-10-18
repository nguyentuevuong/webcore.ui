import * as _ from 'lodash';
import * as ko from 'knockout';

import { handler } from '@app/common/ko';

/*let origC = ko.bindingHandlers.component;

@handler({
    virtual: true,
    bindingName: 'component'
})
export class CustomComponentBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
    
        origC.init!(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}*/