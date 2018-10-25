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
export class ListBoxBindingHandler implements KnockoutBindingHandler {
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
            } = ko.toJS(allBindingsAccessor().configs) || {
                width: 0,
                displayRow: 10,
                fixedColumn: 0,
                columns: [100, 200]
            },
            childContext = bindingContext.createChildContext({
                $$dataSources: dataSources,
                $$beforeRemove: (el: HTMLTableRowElement, index: number, record: any) => {
                    el.parentElement!.removeChild(el);

                    setTimeout(() => {
                        if (fxtable) {
                            fxtable.initLayout();
                        }
                    }, 10);
                },
                $$afterRender: (el: HTMLTableRowElement, record: any) => {
                    if (!fxtable && ko.utils.arrayIndexOf(dataSources(), record) == dataSources().length - 1) {
                        fxtable = new fxTable(element, options);
                        domData.set(element, ki, fxtable);
                    } else {
                        if (fxtable) {
                            fxtable.initLayout();
                        }
                    }
                }
            });

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
                width: ko.toJS(ko.unwrap((allBindings.configs || {}).width)),
                displayRow: ko.toJS(ko.unwrap((allBindings.configs || {}).displayRow)),
                fixedColumn: ko.toJS(ko.unwrap((allBindings.configs || {}).fixedColumn)),
                columns: ko.toJS(ko.unwrap((allBindings.configs || {}).columns))
            };

        if (fxtable) {
            // update option of fxtable
            delete (configs.width);
            delete (configs.fixedColumn);

            fxtable.updateOption(configs);

            fxtable.initLayout();
        }
    }
}