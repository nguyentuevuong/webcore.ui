
import { ko } from '@app/providers';
import { handler } from '@app/common/ko';
import { fxtable } from '@app/common/utils/table';

@handler({
    virtual: false,
    bindingName: 'fxtable'
})
export class FixedTableBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let newAccessor = () => ({ afterRender: () => { new fxtable(element); } });

        ko.bindingHandlers.template.init!(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);
        ko.bindingHandlers.template.update!(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}