import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    virtual: false,
    bindingName: 'topmenu'
})
export class TopMenuBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {


        return { controlsDescendantBindings: true };
    }
}