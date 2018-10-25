import { ko } from '@app/providers';
import { handler } from '@app/common/ko';
import { fxTable } from '@app/common/utils/fxtable';

let ki = '__fxtable__',
    extend = ko.utils.extend,
    domData = ko.utils.domData,
    unwrapObs = ko.utils.unwrapObservable;

@handler({
    virtual: false,
    bindingName: 'table'
})
export class FixedTableBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLTableElement, valueAccessor: () => KnockoutObservableArray<any>, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let dataSources = valueAccessor(),
            body = element.querySelector('tbody'),
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
            body.setAttribute('data-bind', "foreach: { data: $$dataSources, as: '$record', afterRender: $$afterRender, beforeRemove: $$beforeRemove }");
        }

        ko.bindingHandlers.template.init!(element, () => ({}), allBindingsAccessor, {}, childContext);
        ko.bindingHandlers.template.update!(element, () => ({}), allBindingsAccessor, {}, childContext);

        return { controlsDescendantBindings: true };
    }
    update = (element: HTMLTableElement, valueAccessor: () => KnockoutObservableArray<any>, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
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
            fxtable.updateOption(configs);

            fxtable.initLayout();
        }
    }
}