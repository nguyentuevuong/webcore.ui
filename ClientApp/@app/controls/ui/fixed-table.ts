
import { ko } from '@app/providers';
import { handler } from '@app/common/ko';
import { fxTable } from '@app/common/utils/fxtable';

@handler({
    virtual: false,
    bindingName: 'fxtable'
})
export class FixedTableBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLTableElement, valueAccessor: () => { width: number; displayRow: number; fixedColumn: number; }, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let newAccessor = () => ({ afterRender: () => { new fxTable(element, ko.toJS(valueAccessor())); } });

        ko.bindingHandlers.template.init!(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);
        ko.bindingHandlers.template.update!(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}