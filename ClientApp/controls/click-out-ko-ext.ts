import * as $ from 'jquery';

import { handler } from '../decorator/binding';

@handler({
    virtual: false,
    bindingName: 'clickOut'
})
export class ClickOutBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        $(document).on('click', evt => {
            console.log(evt.target);
        });
    }
}