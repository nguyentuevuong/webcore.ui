import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    virtual: true,
    bindingName: 'each',
    validatable: true
})
export class EachBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        return ko.bindingHandlers.foreach.init!(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
    }
    update = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let array = ko.utils.unwrapObservable(valueAccessor().data || valueAccessor());

        ko.bindingHandlers.foreach.update!(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext.extend({
            "$length": array.length,
            "$lastIndex": (array.length || 1) - 1
        }));
    }
}