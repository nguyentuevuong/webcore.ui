import { handler } from '@app/common/ko';

@handler({
    virtual: false,
    bindingName: 'clickOut'
})
export class ClickOutBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {

    }
}