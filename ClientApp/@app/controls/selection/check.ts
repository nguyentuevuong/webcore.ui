import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'check'
})
export class CheckBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {

        element.className = "row";

        ko.bindingHandlers.component.init!(element, () => ({
            name: 'check',
            params: {
                control: valueAccessor()
            }
        }), allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}