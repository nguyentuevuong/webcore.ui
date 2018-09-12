import * as ko from 'knockout';
import * as $ from 'jquery';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'label'
})
export class LabelControlBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        ko.bindingHandlers.component.init!(element, () => ({ name: 'label', params: valueAccessor() }), allBindingsAccessor, viewModel, bindingContext);
        
        return { controlsDescendantBindings: true };
    }
}