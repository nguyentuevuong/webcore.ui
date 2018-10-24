import { ko } from '@app/providers';
import { handler } from '@app/common/ko';
import { fxTable } from '@app/common/utils/fxtable';
import { Selectables } from '@app/common/ui/selectable';

let ki = '__fxlistbox__',
    domData = ko.utils.domData;

@handler({
    virtual: false,
    bindingName: 'listbox'
})
export class FixedTableBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLTableElement, valueAccessor: () => KnockoutObservableSelectionStatic, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let accessor = valueAccessor(),
            body = element.querySelector('tbody'),
            dataSources = accessor.dataSources,
            fxtable: fxTable | undefined = undefined,
            options: {
                width: number;
                displayRow: number;
                fixedColumn: number;
                columns: Array<number>;
            } = allBindingsAccessor().configs || {
                width: 0,
                displayRow: 10,
                fixedColumn: 0,
                columns: [100, 200]
            },
            childContext = bindingContext.createChildContext({
                $$dataSources: dataSources,
                $$afterRender: (el: HTMLTableRowElement, record: any) => {
                    if (ko.utils.arrayIndexOf(dataSources(), record) == dataSources().length - 1) {
                        if (!fxtable) {
                            delete options.width;
                            delete options.fixedColumn;

                            fxtable = new fxTable(element, options);
                            domData.set(element, ki, fxtable);
                        } else {
                            fxtable.initLayout();
                        }
                    }
                }
            })

        if (body) {
            body.setAttribute('data-bind', "foreach: { data: $$dataSources, as: '$record', afterRender: $$afterRender }");
        }

        if (!element.className) {
            element.className = 'fx-selection noselect';
        } else {
            element.classList.add('noselect');
            element.classList.add('fx-selection');
        }

        ko.bindingHandlers.template.init!(element, () => ({}), allBindingsAccessor, {}, childContext);
        ko.bindingHandlers.template.update!(element, () => ({}), allBindingsAccessor, {}, childContext);

        return { controlsDescendantBindings: true };
    }
    update = (element: HTMLTableElement, valueAccessor: () => KnockoutObservableSelection, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let fxtable: fxTable = domData.get(element, ki),
            allBindings = allBindingsAccessor(),
            configs = allBindings.configs || {
                width: ko.unwrap((allBindings.configs || {}).width),
                displayRow: ko.unwrap((allBindings.configs || {}).displayRow),
                fixedColumn: ko.unwrap((allBindings.configs || {}).fixedColumn),
                columns: ko.unwrap((allBindings.configs || {}).columns)
            };

        if (fxtable) {
            // update option of fxtable
            delete configs.width;
            delete configs.fixedColumn;

            fxtable.updateOption(configs);

            fxtable.initLayout();
        }
    }
}