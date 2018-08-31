import * as ko from 'knockout';
import { handler } from '@app/common';

@handler({
    virtual: true,
    bindingName: 'let'
})
export class LetBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        // Make a modified binding context, with extra properties, and apply it to descendant elements
        ko.applyBindingsToDescendants(bindingContext.extend(valueAccessor), element);

        return { controlsDescendantBindings: true };
    }
}