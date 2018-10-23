import { ko } from '@app/providers';
import { handler } from '@app/common/ko';
import { fxTable } from '@app/common/utils/fxtable';

let ki = '__fxlistbox__',
    extend = ko.utils.extend,
    domData = ko.utils.domData,
    unwrapObs = ko.utils.unwrapObservable;

@handler({
    virtual: false,
    bindingName: 'listbox'
})
export class FixedTableBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLTableElement, valueAccessor: () => { width: number; displayRow: number; fixedColumn: number; columns: Array<number>; }, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let asr = valueAccessor(),
            newAccessor = () => ({
                afterRender: () => {
                    domData.set(element, ki, new fxTable(element, ko.toJS(asr)));
                }
            });

        ko.bindingHandlers.template.init!(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);
        ko.bindingHandlers.template.update!(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
    update = (element: HTMLTableElement, valueAccessor: () => { width: number; displayRow: number; fixedColumn: number; columns: Array<number>; }, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let accessor = valueAccessor(),
            fxt: fxTable = domData.get(element, ki),
            options = {
                width: 0,
                columns: unwrapObs(accessor.columns),
                displayRow: unwrapObs(accessor.displayRow),
                fixedColumn: 0
            };

        if (fxt) {
            extend(fxt.options, options);

            fxt.initLayout();
        }
    }
}