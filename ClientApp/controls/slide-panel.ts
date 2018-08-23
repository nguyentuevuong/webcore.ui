import * as $ from 'jquery';

import { handler } from '../decorator/binding';

@handler({
    virtual: false,
    bindingName: 'slidePanel'
})
export class SlidePanelBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element);

        $element.addClass('panel-container');
        
        $(document).on('click', evt => {
            console.log(evt.target);
        });
    }
}