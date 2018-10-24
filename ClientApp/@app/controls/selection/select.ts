import { _, ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'select'
})
export class CheckBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => KnockoutObservable<any>, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let obser = valueAccessor(),
            data = allBindingsAccessor().data,
            newAccessor = ($caller: any, $data: any, evt: MouseEvent) => {
                let newV = ko.toJS(data),
                    oldV = ko.toJS(obser);

                if (!_.isEqual(newV, oldV)) {
                    obser(newV);
                    if (!element.className) {
                        element.className = 'selected';
                    } else {
                        element.classList.add('selected');
                    }
                } else {
                    if (evt.shiftKey) {
                        obser(undefined);
                        if (element.className) {
                            element.classList.remove('selected');
                        }
                    }
                }
            };

        ko.bindingHandlers.click.init!(element, () => newAccessor, ko.utils.extendAllBindingsAccessor(allBindingsAccessor, { timeClick: -1 }), viewModel, bindingContext);
    }
    update = (element: HTMLElement, valueAccessor: () => KnockoutObservable<any>, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        ko.unwrap(valueAccessor());

        if (element.className) {
            element.classList.remove('selected');
        }
    }
}